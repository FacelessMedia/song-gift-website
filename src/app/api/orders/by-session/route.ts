import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { session_id } = body;

    // Validate required field
    if (!session_id) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    console.log('Looking up order with session ID:', session_id);

    // Query Supabase orders table by stripe_checkout_session_id
    // Only return orders that have been paid (not still pending)
    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select('tracking_id, order_status, expected_delivery_at, created_at, customer_email, amount_paid, currency, delivery_speed, intake_payload')
      .eq('stripe_checkout_session_id', session_id)
      .neq('order_status', 'pending')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned - order not found (webhook may not have processed yet)
        console.log('Order not found for session ID:', session_id);
        return NextResponse.json(
          { 
            error: 'Order not found',
            message: 'Order is still being processed. Please wait a moment.',
            code: 'ORDER_NOT_READY'
          },
          { status: 404 }
        );
      }

      // Other database error
      console.error('Database error while looking up order by session:', error);
      return NextResponse.json(
        { error: 'Unable to look up order. Please try again later.' },
        { status: 500 }
      );
    }

    console.log('Order found for session:', {
      tracking_id: order.tracking_id,
      order_status: order.order_status,
      session_id
    });

    // Return order information (include intake_payload for success page personalization)
    return NextResponse.json({
      tracking_id: order.tracking_id,
      order_status: order.order_status,
      expected_delivery_at: order.expected_delivery_at,
      created_at: order.created_at,
      customer_email: order.customer_email,
      amount_paid: order.amount_paid,
      currency: order.currency,
      delivery_speed: order.delivery_speed,
      intake_payload: order.intake_payload,
    });

  } catch (error) {
    console.error('Order lookup by session API error:', error);
    return NextResponse.json(
      { 
        error: 'Server error',
        message: 'Something went wrong. Please try again later.'
      },
      { status: 500 }
    );
  }
}
