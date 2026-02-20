import { NextRequest, NextResponse } from 'next/server';
import { sendToN8nWebhook, InitiatedWebhookPayload } from '@/lib/n8nWebhook';

/**
 * API route called by the checkout page BEFORE redirecting to Stripe.
 * Sends an "initiated" webhook to n8n with customer + intake data.
 * This is fire-and-forget — failures do NOT block checkout.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, intakeData, tracking_id } = body;

    if (!sessionId || !intakeData) {
      return NextResponse.json({ success: false, error: 'Missing data' }, { status: 400 });
    }

    const payload: InitiatedWebhookPayload = {
      event: 'order_initiated',
      order_id: body.order_id || 'unknown',
      tracking_id: tracking_id || 'unknown',
      status: 'pending',
      amount: body.amount || 0,
      currency: body.currency || 'usd',
      customer: {
        name: intakeData.fullName || '',
        email: intakeData.email || '',
        phone: intakeData.customer_phone_e164 || intakeData.phoneNumber || '',
      },
      delivery_speed: intakeData.expressDelivery ? 'express' : 'standard',
      intake: intakeData,
    };

    console.log('[INITIATED WEBHOOK] Sending to n8n:', {
      sessionId,
      trackingId: payload.tracking_id,
      customerEmail: payload.customer.email,
      deliverySpeed: payload.delivery_speed,
    });

    await sendToN8nWebhook(payload);

    console.log('[INITIATED WEBHOOK] Sent successfully');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[INITIATED WEBHOOK] Error:', error);
    // Always return 200 — this must never block checkout
    return NextResponse.json({ success: false, error: 'Webhook failed' });
  }
}
