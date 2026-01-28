import { NextRequest, NextResponse } from 'next/server';
import { stripe, PRICING, calculateTotal } from '@/lib/stripe';

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

    // Validate delivery speed
    if (delivery_speed !== 'standard' && delivery_speed !== 'rush') {
      return NextResponse.json(
        { error: 'Invalid delivery_speed. Must be "standard" or "rush"' },
        { status: 400 }
      );
    }

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
            name: 'Rush Delivery (12-24 hours)',
            description: 'Express delivery upgrade',
          },
          unit_amount: rushPrice,
        },
        quantity: 1,
      });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      customer_email: email,
      metadata: {
        delivery_speed,
        intake_payload: JSON.stringify(intake_payload),
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
