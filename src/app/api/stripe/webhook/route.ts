import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { sendOrderToN8n, validateN8nConfig } from '@/lib/n8nWebhook';
import Stripe from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!webhookSecret) {
  throw new Error('Missing required environment variable: STRIPE_WEBHOOK_SECRET');
}

// Generate tracking ID in format SG-XXXXXXXX
function generateTrackingId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'SG-';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Calculate expected delivery date
function calculateDeliveryDate(deliverySpeed: 'standard' | 'rush'): Date {
  const now = new Date();
  const deliveryDate = new Date(now);
  
  if (deliverySpeed === 'rush') {
    // Rush: +1 day
    deliveryDate.setDate(now.getDate() + 1);
  } else {
    // Standard: +2 days
    deliveryDate.setDate(now.getDate() + 2);
  }
  
  return deliveryDate;
}

export async function POST(request: NextRequest) {
  try {
    // Get raw body for signature verification
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      console.error('Missing Stripe signature');
      return NextResponse.json(
        { error: 'Missing Stripe signature' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      // @ts-ignore - TypeScript doesn't recognize that signature is guaranteed to be string after null check
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      console.log('Processing checkout.session.completed:', session.id);

      // Extract data from session
      const sessionId = session.id;
      const paymentIntentId = session.payment_intent as string;
      const customerEmail = session.customer_email;
      const amountTotal = session.amount_total; // in cents
      const currency = session.currency;
      const metadata = session.metadata || {};

      // Parse metadata
      const deliverySpeed = metadata.delivery_speed as 'standard' | 'rush';
      const checkoutId = metadata.checkout_id;
      
      let intakePayload = {};
      
      // Try to retrieve full intake data from temporary table
      if (checkoutId) {
        const { data: checkoutData, error: fetchError } = await supabaseAdmin
          .from('temp_checkout_data')
          .select('intake_payload, customer_email, delivery_speed')
          .eq('checkout_id', checkoutId)
          .single();
          
        if (fetchError) {
          console.error('Failed to fetch checkout data:', fetchError);
        } else if (checkoutData) {
          intakePayload = checkoutData.intake_payload;
          console.log('Retrieved full intake data from temporary storage');
          
          // Clean up temporary data after use
          await supabaseAdmin
            .from('temp_checkout_data')
            .delete()
            .eq('checkout_id', checkoutId);
        }
      }
      
      // Fallback: if no intake data found, create minimal payload
      if (!intakePayload || Object.keys(intakePayload).length === 0) {
        console.warn('No intake data found, using minimal payload');
        intakePayload = {
          recipientName: metadata.recipient_name || 'Unknown',
          coreMessage: metadata.core_message || 'Custom song request',
          intakeCompletedAt: new Date().toISOString(),
        };
      }

      // Validate required data
      if (!sessionId || !customerEmail || !amountTotal || !deliverySpeed) {
        console.error('Missing required session data:', {
          sessionId,
          customerEmail,
          amountTotal,
          deliverySpeed
        });
        return NextResponse.json(
          { error: 'Missing required session data' },
          { status: 400 }
        );
      }

      // Check for existing order (idempotency)
      const { data: existingOrder } = await supabaseAdmin
        .from('orders')
        .select('id')
        .eq('stripe_checkout_session_id', sessionId)
        .single();

      if (existingOrder) {
        console.log('Order already exists for session:', sessionId);
        return NextResponse.json({ received: true, existing: true });
      }

      // Generate tracking ID and delivery date
      const trackingId = generateTrackingId();
      const expectedDeliveryAt = calculateDeliveryDate(deliverySpeed);
      const paidAt = new Date();

      // Insert order into Supabase
      const { data: order, error: insertError } = await supabaseAdmin
        .from('orders')
        .insert({
          tracking_id: trackingId,
          paid_at: paidAt.toISOString(),
          customer_email: customerEmail,
          amount_paid: amountTotal,
          currency: currency,
          delivery_speed: deliverySpeed,
          expected_delivery_at: expectedDeliveryAt.toISOString(),
          order_status: 'Paid',
          intake_payload: intakePayload,
          stripe_checkout_session_id: sessionId,
          stripe_payment_intent_id: paymentIntentId,
        })
        .select()
        .single();

      if (insertError) {
        console.error('Failed to insert order:', {
          error: insertError,
          code: insertError.code,
          message: insertError.message,
          details: insertError.details,
          hint: insertError.hint,
          sessionId,
          customerEmail,
          trackingId
        });
        return NextResponse.json(
          { error: 'Failed to create order' },
          { status: 500 }
        );
      }

      console.log('Order created successfully:', {
        id: order.id,
        trackingId: order.tracking_id,
        customerEmail: order.customer_email,
        amount: order.amount_paid,
        deliverySpeed: order.delivery_speed
      });

      // Send order data to n8n webhook (don't fail if webhook fails)
      try {
        const n8nConfig = validateN8nConfig();
        if (n8nConfig.isConfigured) {
          console.log('Sending order to n8n webhook...');
          
          const webhookPayload = {
            tracking_id: order.tracking_id,
            created_at: order.created_at,
            paid_at: order.paid_at,
            order_status: order.order_status,
            expected_delivery_at: order.expected_delivery_at,
            delivery_speed: order.delivery_speed,
            amount_paid: order.amount_paid,
            currency: order.currency,
            customer_email: order.customer_email,
            stripe_checkout_session_id: order.stripe_checkout_session_id,
            stripe_payment_intent_id: order.stripe_payment_intent_id,
            intake_payload: order.intake_payload
          };

          const webhookSuccess = await sendOrderToN8n(webhookPayload);
          
          if (webhookSuccess) {
            console.log('Successfully sent order to n8n webhook');
          } else {
            console.warn('Failed to send order to n8n webhook, but order was saved');
          }
        } else {
          console.log('n8n webhook not configured, skipping');
        }
      } catch (webhookError) {
        console.error('Error sending to n8n webhook (order still saved):', webhookError);
      }

      return NextResponse.json({ 
        received: true, 
        orderId: order.id,
        trackingId: order.tracking_id
      });
    }

    // Handle other event types (log and ignore)
    console.log('Unhandled webhook event type:', event.type);
    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { 
        error: 'Webhook processing failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
