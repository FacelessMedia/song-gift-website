import { NextRequest, NextResponse } from 'next/server';
import { stripe, PRICING, calculateTotal } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, delivery_speed, intake_payload } = body;

    // Validate required fields
    if (!email || !delivery_speed || !intake_payload) {
      return NextResponse.json(
        { error: 'Missing required fields: email, delivery_speed, intake_payload' },
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

    // Build line items
    const lineItems: any[] = [
      {
        price_data: {
          currency: PRICING.CURRENCY,
          product_data: {
            name: 'Custom Song – Valentine\'s Special',
            description: 'Personalized custom song created by professional musicians',
          },
          unit_amount: basePrice,
        },
        quantity: 1,
      },
    ];

    // Add rush delivery if selected
    if (delivery_speed === 'rush') {
      lineItems.push({
        price_data: {
          currency: PRICING.CURRENCY,
          product_data: {
            name: 'Rush Delivery (within 24 hours)',
            description: 'Express delivery upgrade',
          },
          unit_amount: rushPrice,
        },
        quantity: 1,
      });
    }

    // Generate a unique ID for this checkout session
    const checkoutId = `checkout_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    // Store intake data temporarily in Supabase with the checkout ID
    const { error: storeError } = await supabaseAdmin
      .from('temp_checkout_data')
      .insert({
        checkout_id: checkoutId,
        intake_payload: intake_payload,
        customer_email: email,
        delivery_speed: dbDeliverySpeed,
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      });

    if (storeError) {
      console.error('Failed to store checkout data:', {
        error: storeError,
        code: storeError.code,
        message: storeError.message,
        details: storeError.details,
        hint: storeError.hint
      });
      // Continue anyway - we'll use minimal metadata
    }

    // Create Stripe checkout session with minimal metadata
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      customer_email: email,
      metadata: {
        delivery_speed,
        checkout_id: checkoutId, // Reference to full data
      },
      success_url: `${request.nextUrl.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/checkout?canceled=1`,
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
