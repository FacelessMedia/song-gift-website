import { NextRequest, NextResponse } from 'next/server';
import { stripe, PRICING, calculateTotal } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { debugLog, debugLogResponse } from '@/lib/debugLogger';

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
        // Check expiry
        const isExpired = coupon.expiry_date && new Date(coupon.expiry_date) < new Date();

        if (!isExpired) {
          if (coupon.discount_type === 'percentage') {
            couponDiscount = Math.round(totalPrice * (coupon.discount_value / 100));
          } else if (coupon.discount_type === 'fixed') {
            couponDiscount = Math.round(coupon.discount_value);
          }

          // Ensure minimum $1 charge
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

    // Build line items — apply coupon discount to the base price
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

    // Add rush delivery if selected (reduce by remaining discount if coupon exceeded base price)
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

    // Create Stripe checkout session with only sessionId in metadata
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      customer_email: email,
      metadata: {
        session_id: sessionId, // Only store session ID - webhook will retrieve full data
        delivery_speed: dbDeliverySpeed,
        ...(validatedCouponCode && { coupon_code: validatedCouponCode, coupon_discount: couponDiscount.toString() }),
      },
      success_url: `${request.nextUrl.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/checkout?canceled=1`,
    });

    debugLog('CHECKOUT — Stripe session created', {
      stripeSessionId: session.id,
      url: session.url ? '[URL present]' : '[NO URL]',
      metadata: { session_id: sessionId, delivery_speed: dbDeliverySpeed, coupon_code: validatedCouponCode },
      lineItemCount: lineItems.length,
      totalAmount: totalPrice,
      couponDiscount,
      finalAmount: totalPrice - couponDiscount,
    });

    return NextResponse.json({ url: session.url });

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
