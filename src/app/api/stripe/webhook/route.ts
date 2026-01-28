import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
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
      let intakePayload;
      try {
        intakePayload = JSON.parse(metadata.intake_payload || '{}');
      } catch (err) {
        console.error('Failed to parse intake_payload:', err);
        intakePayload = {};
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
        console.error('Failed to insert order:', insertError);
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
