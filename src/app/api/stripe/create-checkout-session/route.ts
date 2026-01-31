import { NextRequest, NextResponse } from 'next/server';
import { stripe, PRICING, calculateTotal } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, email, delivery_speed } = body;

    console.log('Creating checkout session with:', { sessionId, email, delivery_speed });

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

    // Create Stripe checkout session with only sessionId in metadata
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      customer_email: email,
      metadata: {
        session_id: sessionId, // Only store session ID - webhook will retrieve full data
        delivery_speed: dbDeliverySpeed,
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
