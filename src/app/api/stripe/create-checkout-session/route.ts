import { NextRequest, NextResponse } from 'next/server';
import { stripe, PRICING, calculateTotal } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { sendToN8nWebhook, InitiatedWebhookPayload } from '@/lib/n8nWebhook';
import { debugLog, debugLogResponse } from '@/lib/debugLogger';

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
function calculateDeliveryDate(deliverySpeed: 'standard' | 'express'): Date {
  const now = new Date();
  const deliveryDate = new Date(now);
  if (deliverySpeed === 'express') {
    deliveryDate.setDate(now.getDate() + 1);
  } else {
    deliveryDate.setDate(now.getDate() + 2);
  }
  return deliveryDate;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, email, delivery_speed, coupon_code } = body;

    console.log('Creating checkout session with:', { sessionId, email, delivery_speed, coupon_code });

    debugLog('CHECKOUT — incoming request', {
      sessionId,
      email,
      delivery_speed,
      coupon_code,
    });

    // Validate required fields
    if (!sessionId || !email || !delivery_speed) {
      console.error('Missing required fields:', { sessionId, email, delivery_speed });
      return NextResponse.json(
        { error: 'Missing required fields: sessionId, email, delivery_speed' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('Invalid email format:', email);
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Validate delivery speed and normalize to database values
    if (!['standard', 'rush'].includes(delivery_speed)) {
      return NextResponse.json(
        { error: 'Invalid delivery_speed. Must be "standard" or "rush"' },
        { status: 400 }
      );
    }

    // Map client values to database values
    const dbDeliverySpeed = delivery_speed === 'rush' ? 'express' : 'standard';

    // Calculate pricing
    const basePrice = PRICING.BASE_PRICE;
    const rushPrice = delivery_speed === 'rush' ? PRICING.RUSH_DELIVERY : 0;
    const totalPrice = calculateTotal(delivery_speed);

    // Server-side coupon validation (never trust frontend amount)
    let couponDiscount = 0;
    let validatedCouponCode: string | null = null;

    if (coupon_code && typeof coupon_code === 'string') {
      const { data: coupon, error: couponError } = await supabaseAdmin
        .from('coupons')
        .select('*')
        .ilike('code', coupon_code.trim())
        .single();

      if (!couponError && coupon && coupon.active) {
        const isExpired = coupon.expiry_date && new Date(coupon.expiry_date) < new Date();

        if (!isExpired) {
          if (coupon.discount_type === 'percentage') {
            couponDiscount = Math.round(totalPrice * (coupon.discount_value / 100));
          } else if (coupon.discount_type === 'fixed') {
            couponDiscount = Math.round(coupon.discount_value);
          }

          const minCharge = 100;
          if (couponDiscount >= totalPrice - minCharge) {
            couponDiscount = totalPrice - minCharge;
          }
          if (couponDiscount < 0) couponDiscount = 0;

          validatedCouponCode = coupon.code;
          console.log('[COUPON] Server validated:', {
            code: coupon.code,
            type: coupon.discount_type,
            value: coupon.discount_value,
            discount: couponDiscount,
            originalTotal: totalPrice,
            newTotal: totalPrice - couponDiscount,
          });
        } else {
          console.warn('[COUPON] Expired coupon used at checkout:', coupon_code);
        }
      } else {
        console.warn('[COUPON] Invalid coupon at checkout:', coupon_code);
      }
    }

    // ─── STEP 1: Retrieve intake data from session_data ───
    let intakePayload: any = {};
    let customerName = '';
    let customerPhone = '';

    const { data: sessionEntry, error: sessionFetchError } = await supabaseAdmin
      .from('session_data')
      .select('intake_data')
      .eq('session_id', sessionId)
      .single();

    if (sessionFetchError || !sessionEntry) {
      console.warn('[CHECKOUT] Session data not found for:', sessionId);
    } else {
      intakePayload = sessionEntry.intake_data;
      customerName = (intakePayload as any).fullName || '';
      customerPhone = (intakePayload as any).customer_phone_e164 ||
                      (intakePayload as any).customer_phone_display ||
                      (intakePayload as any).phoneNumber || '';
    }

    // Resolve "Other" values in arrays
    const rawMusicStyle: string[] = (intakePayload as any).musicStyle || [];
    const musicStyleCustom: string = (intakePayload as any).musicStyleCustom || '';
    const resolvedMusicStyle = rawMusicStyle.map((item: string) =>
      item === 'other' && musicStyleCustom.trim() ? musicStyleCustom.trim() : item
    ).filter((item: string) => item !== 'other');

    const rawEmotionalVibe: string[] = (intakePayload as any).emotionalVibe || [];
    const emotionalVibeCustom: string = (intakePayload as any).emotionalVibeCustom || '';
    const resolvedEmotionalVibe = rawEmotionalVibe.map((item: string) =>
      item === 'other' && emotionalVibeCustom.trim() ? emotionalVibeCustom.trim() : item
    ).filter((item: string) => item !== 'other');

    const rawGender: string = (intakePayload as any).gender || '';
    const genderCustom: string = (intakePayload as any).genderCustom || '';
    const resolvedGender = rawGender === 'other' && genderCustom.trim() ? genderCustom.trim() : rawGender;

    // ─── STEP 2: Insert pending order into Supabase ───
    const trackingId = generateTrackingId();
    const expectedDeliveryAt = calculateDeliveryDate(dbDeliverySpeed as 'standard' | 'express');

    const { data: order, error: insertError } = await supabaseAdmin
      .from('orders')
      .insert({
        tracking_id: trackingId,
        customer_name: customerName,
        customer_email: email,
        customer_phone: customerPhone,
        session_id: sessionId,
        amount_paid: totalPrice - couponDiscount,
        currency: PRICING.CURRENCY,
        delivery_speed: dbDeliverySpeed,
        expected_delivery_at: expectedDeliveryAt.toISOString(),
        order_status: 'pending',
        intake_payload: Object.keys(intakePayload).length > 0 ? intakePayload : { sessionId, recipientName: 'Unknown', coreMessage: 'Custom song request' },
        stripe_checkout_session_id: null,
        stripe_payment_intent_id: null,
        recipient_name: (intakePayload as any).recipientName || '',
        recipient_relationship: (intakePayload as any).recipientRelationship || '',
        song_perspective: (intakePayload as any).songPerspective || '',
        primary_language: (intakePayload as any).primaryLanguage || '',
        music_style: resolvedMusicStyle,
        emotional_vibe: resolvedEmotionalVibe,
        voice_preference: (intakePayload as any).voicePreference || '',
        faith_expression_level: (intakePayload as any).faithExpressionLevel || null,
        core_message: (intakePayload as any).coreMessage || '',
        gender: resolvedGender || null,
        gender_custom: rawGender === 'other' ? genderCustom : null,
        coupon_code: validatedCouponCode,
        coupon_discount: couponDiscount,
      })
      .select()
      .single();

    if (insertError || !order) {
      console.error('[CHECKOUT] Failed to insert pending order:', insertError);
      return NextResponse.json(
        { error: 'Failed to create order. Please try again.', details: insertError?.message },
        { status: 500 }
      );
    }

    console.log('[CHECKOUT] Pending order created:', { id: order.id, trackingId: order.tracking_id });

    // ─── STEP 3: Fire "order_initiated" webhook to n8n ───
    try {
      const initiatedPayload: InitiatedWebhookPayload = {
        event: 'order_initiated',
        order_id: order.id,
        tracking_id: trackingId,
        session_id: sessionId,
        status: 'pending',
        amount: totalPrice - couponDiscount,
        currency: PRICING.CURRENCY,
        expected_delivery_at: expectedDeliveryAt.toISOString(),
        coupon_code: validatedCouponCode || null,
        coupon_discount_dollars: couponDiscount ? (couponDiscount / 100).toFixed(2) : '0.00',
        customer: {
          name: customerName,
          email: email,
          phone: customerPhone,
        },
        delivery_speed: dbDeliverySpeed,
        intake: intakePayload,
      };

      console.log('📦 Webhook payload:', JSON.stringify(initiatedPayload, null, 2));
      console.log('[CHECKOUT] Sending order_initiated webhook for order_id:', order.id);
      await sendToN8nWebhook(initiatedPayload);
      console.log('[CHECKOUT] order_initiated webhook sent successfully for order_id:', order.id);
    } catch (webhookErr) {
      console.error('[CHECKOUT] order_initiated webhook FAILED (non-blocking):', webhookErr);
      // Do NOT block Stripe redirect — order is already created
    }

    // ─── STEP 4: Build line items and create Stripe checkout session ───
    const adjustedBasePrice = couponDiscount > 0 ? Math.max(basePrice - couponDiscount, 100) : basePrice;
    const remainingDiscount = couponDiscount > 0 ? Math.max(couponDiscount - (basePrice - adjustedBasePrice), 0) : 0;

    const lineItems: any[] = [
      {
        price_data: {
          currency: PRICING.CURRENCY,
          product_data: {
            name: validatedCouponCode
              ? `Custom Song – Valentine's Special (Coupon: ${validatedCouponCode})`
              : 'Custom Song – Valentine\'s Special',
            description: 'Personalized custom song created by professional musicians',
          },
          unit_amount: adjustedBasePrice,
        },
        quantity: 1,
      },
    ];

    if (delivery_speed === 'rush') {
      const adjustedRushPrice = remainingDiscount > 0 ? Math.max(rushPrice - remainingDiscount, 0) : rushPrice;
      if (adjustedRushPrice > 0) {
        lineItems.push({
          price_data: {
            currency: PRICING.CURRENCY,
            product_data: {
              name: 'Rush Delivery (within 24 hours)',
              description: 'Express delivery upgrade',
            },
            unit_amount: adjustedRushPrice,
          },
          quantity: 1,
        });
      }
    }

    const stripeSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      customer_email: email,
      metadata: {
        session_id: sessionId,
        order_id: order.id,
        tracking_id: trackingId,
        delivery_speed: dbDeliverySpeed,
        ...(validatedCouponCode && { coupon_code: validatedCouponCode, coupon_discount: couponDiscount.toString() }),
      },
      success_url: `${request.nextUrl.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/checkout?canceled=1`,
    });

    // ─── STEP 5: Update order with Stripe checkout session ID ───
    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({ stripe_checkout_session_id: stripeSession.id })
      .eq('id', order.id);

    if (updateError) {
      console.error('[CHECKOUT] Failed to update order with Stripe session ID:', updateError);
      // Non-fatal: order exists, Stripe session exists. Webhook can still match via metadata.
    }

    debugLog('CHECKOUT — Stripe session created', {
      stripeSessionId: stripeSession.id,
      orderId: order.id,
      trackingId,
      url: stripeSession.url ? '[URL present]' : '[NO URL]',
      lineItemCount: lineItems.length,
      totalAmount: totalPrice,
      couponDiscount,
      finalAmount: totalPrice - couponDiscount,
    });

    return NextResponse.json({ url: stripeSession.url });

  } catch (error) {
    console.error('Stripe checkout session creation error:', error);
    return NextResponse.json(
      {
        error: 'Failed to create checkout session',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
