import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { sendToN8nWebhook, OrderWebhookPayload } from '@/lib/n8nWebhook';
import { debugLog, debugLogPayload, debugLogResponse } from '@/lib/debugLogger';
import Stripe from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!webhookSecret) {
  throw new Error('Missing required environment variable: STRIPE_WEBHOOK_SECRET');
}

export async function POST(request: NextRequest) {
  console.log('[STRIPE WEBHOOK] Received POST request');
  
  try {
    // Get raw body for signature verification
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');
    
    console.log('[STRIPE WEBHOOK] Body length:', body.length, '| Has signature:', !!signature);

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

      debugLog('WEBHOOK — checkout.session.completed', {
        stripeSessionId: session.id,
        customerEmail: session.customer_email || '',
        amountTotal: session.amount_total,
        currency: session.currency,
        metadata: session.metadata || {},
      });

      // Extract data from Stripe session
      const stripeSessionId = session.id;
      const paymentIntentId = session.payment_intent as string;
      const amountTotal = session.amount_total; // in cents
      const metadata = session.metadata || {};

      const frontendSessionId = metadata.session_id;
      const orderId = metadata.order_id;
      const trackingId = metadata.tracking_id;
      const couponCode = metadata.coupon_code || null;
      const couponDiscount = metadata.coupon_discount ? parseInt(metadata.coupon_discount, 10) : 0;

      // ─── Find the existing pending order ───
      // Primary: look up by order_id from metadata (most reliable)
      // Fallback: look up by stripe_checkout_session_id or session_id
      let existingOrder: any = null;

      if (orderId) {
        const { data } = await supabaseAdmin
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();
        existingOrder = data;
      }

      if (!existingOrder && stripeSessionId) {
        const { data } = await supabaseAdmin
          .from('orders')
          .select('*')
          .eq('stripe_checkout_session_id', stripeSessionId)
          .single();
        existingOrder = data;
      }

      if (!existingOrder && frontendSessionId) {
        const { data } = await supabaseAdmin
          .from('orders')
          .select('*')
          .eq('session_id', frontendSessionId)
          .eq('order_status', 'pending')
          .single();
        existingOrder = data;
      }

      if (!existingOrder) {
        console.error('[STRIPE WEBHOOK] No pending order found for:', { orderId, stripeSessionId, frontendSessionId });
        return NextResponse.json(
          { error: 'No pending order found', orderId, stripeSessionId, frontendSessionId },
          { status: 500 }
        );
      }

      // Idempotency: if already paid, skip
      if (existingOrder.order_status === 'paid') {
        console.log('[STRIPE WEBHOOK] Order already paid:', existingOrder.id);
        return NextResponse.json({ received: true, existing: true });
      }

      // ─── Update order to 'paid' ───
      const paidAt = new Date().toISOString();

      const { data: order, error: updateError } = await supabaseAdmin
        .from('orders')
        .update({
          order_status: 'paid',
          paid_at: paidAt,
          amount_paid: amountTotal,
          stripe_checkout_session_id: stripeSessionId,
          stripe_payment_intent_id: paymentIntentId,
          coupon_code: couponCode || existingOrder.coupon_code,
          coupon_discount: couponDiscount || existingOrder.coupon_discount,
        })
        .eq('id', existingOrder.id)
        .select()
        .single();

      if (updateError || !order) {
        console.error('[STRIPE WEBHOOK] Failed to update order to paid:', {
          error: updateError,
          orderId: existingOrder.id,
        });
        return NextResponse.json(
          { error: 'Failed to update order to paid', orderId: existingOrder.id, details: updateError?.message },
          { status: 500 }
        );
      }

      console.log('[STRIPE WEBHOOK] Order updated to paid:', {
        id: order.id,
        trackingId: order.tracking_id,
        customerEmail: order.customer_email,
        amount: order.amount_paid,
        deliverySpeed: order.delivery_speed,
      });

      debugLog('WEBHOOK — order updated to paid', {
        orderId: order.id,
        trackingId: order.tracking_id,
        customerName: order.customer_name,
        customerEmail: order.customer_email,
        paidAt: order.paid_at,
      });

      // ─── Send "order_paid" webhook to n8n ───
      try {
        console.log('💰 Sending order_paid webhook for order_id:', order.id);

        const webhookPayload: OrderWebhookPayload = {
          event: 'order_paid',
          order_id: order.id,
          tracking_id: order.tracking_id,
          status: 'paid',
          stripe_checkout_session_id: order.stripe_checkout_session_id,
          stripe_payment_intent_id: order.stripe_payment_intent_id,
          amount_paid: order.amount_paid,
          currency: order.currency,
          expected_delivery_at: order.expected_delivery_at,
          coupon_code: order.coupon_code || null,
          coupon_discount_dollars: order.coupon_discount ? (order.coupon_discount / 100).toFixed(2) : '0.00',
          order: {
            created_at: order.created_at,
            paid_at: order.paid_at,
            order_status: order.order_status,
            delivery_type: order.delivery_speed,
            delivery_eta: order.expected_delivery_at,
            session_id: order.session_id,
            coupon_code: order.coupon_code,
            coupon_discount: order.coupon_discount,
          },
          customer: {
            name: order.customer_name,
            email: order.customer_email,
            phone: order.customer_phone,
            gender: order.gender || null,
            gender_custom: order.gender_custom || null,
          },
          song_details: {
            recipient_name: order.recipient_name,
            recipient_relationship: order.recipient_relationship,
            song_perspective: order.song_perspective,
            primary_language: order.primary_language,
            music_style: order.music_style,
            emotional_vibe: order.emotional_vibe,
            voice_preference: order.voice_preference,
            faith_expression_level: order.faith_expression_level || null,
            core_message: order.core_message,
          },
          intake: order.intake_payload || {},
        };

        console.log('📦 Webhook payload:', JSON.stringify(webhookPayload, null, 2));
        debugLogPayload('WEBHOOK — n8n order_paid payload', webhookPayload);

        await sendToN8nWebhook(webhookPayload);
        console.log('💰 order_paid webhook sent successfully for order_id:', order.id);
      } catch (webhookError) {
        console.error('[STRIPE WEBHOOK] order_paid webhook FAILED (order still saved):', webhookError);
        // Do NOT fail the Stripe response — order is already updated to paid
      }

      return NextResponse.json({ 
        received: true, 
        orderId: order.id,
        trackingId: order.tracking_id,
      });
    }

    // Handle other event types (log and ignore)
    console.log('Unhandled webhook event type:', event.type);
    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('[STRIPE WEBHOOK] Unhandled processing error:', error);
    // Return 500 so Stripe retries — idempotency check above prevents duplicate processing
    return NextResponse.json(
      { error: 'Webhook processing failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
