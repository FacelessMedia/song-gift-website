import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { sendOrderToN8n, validateN8nConfig } from '@/lib/n8nWebhook';
import { debugLog, debugLogPayload, debugLogResponse } from '@/lib/debugLogger';
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
function calculateDeliveryDate(deliverySpeed: 'standard' | 'express'): Date {
  const now = new Date();
  const deliveryDate = new Date(now);
  
  if (deliverySpeed === 'express') {
    // Express: +1 day
    deliveryDate.setDate(now.getDate() + 1);
  } else {
    // Standard: +2 days
    deliveryDate.setDate(now.getDate() + 2);
  }
  
  return deliveryDate;
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

      // Extract data from session
      const sessionId = session.id;
      const paymentIntentId = session.payment_intent as string;
      const customerEmail = session.customer_email;
      const amountTotal = session.amount_total; // in cents
      const currency = session.currency;
      const metadata = session.metadata || {};

      // Parse metadata - now contains session_id instead of checkout_id
      const frontendSessionId = metadata.session_id;
      const deliverySpeed = metadata.delivery_speed as 'standard' | 'express';
      const couponCode = metadata.coupon_code || null;
      const couponDiscount = metadata.coupon_discount ? parseInt(metadata.coupon_discount, 10) : 0;
      
      let intakePayload = {};
      
      // Retrieve intake data using session ID from server storage
      let customerName = '';
      let extractedCustomerEmail = '';
      let customerPhone = '';
      
      if (frontendSessionId) {
        try {
          // Query Supabase directly for session data (no HTTP self-call)
          const { data: sessionEntry, error: sessionFetchError } = await supabaseAdmin
            .from('session_data')
            .select('intake_data, expires_at')
            .eq('session_id', frontendSessionId)
            .single();

          if (sessionFetchError || !sessionEntry) {
            console.warn('Session data not found in Supabase for:', frontendSessionId, sessionFetchError?.message);
          } else if (new Date(sessionEntry.expires_at) < new Date()) {
            console.warn('Session data expired for:', frontendSessionId);
          } else {
            intakePayload = sessionEntry.intake_data;
              
            // Extract customer contact info from intake data
            customerName = (intakePayload as any).fullName || '';
            extractedCustomerEmail = (intakePayload as any).email || '';
              
            // Prefer E.164 format for phone, fallback to display format, then basic phoneNumber
            customerPhone = (intakePayload as any).customer_phone_e164 || 
                           (intakePayload as any).customer_phone_display || 
                           (intakePayload as any).phoneNumber || '';
              
            console.log('Retrieved full intake data for session:', frontendSessionId);
            console.log('Customer contact info:', { customerName, extractedCustomerEmail, customerPhone });
              
            debugLog('WEBHOOK — intake data retrieved', {
              frontendSessionId,
              customerName,
              customerEmail: extractedCustomerEmail,
              customerPhone,
              intakeKeys: Object.keys(intakePayload),
            });
          }
        } catch (fetchError) {
          console.error('Error fetching session data from Supabase:', fetchError);
        }
      }
      
      // Fallback: if no intake data found, create minimal payload
      if (!intakePayload || Object.keys(intakePayload).length === 0) {
        console.warn('No intake data found, using minimal payload for session:', frontendSessionId);
        intakePayload = {
          sessionId: frontendSessionId,
          recipientName: 'Unknown',
          coreMessage: 'Custom song request',
          intakeCompletedAt: new Date().toISOString(),
        };
      }

      // Use extracted email or fallback to Stripe session email
      const finalCustomerEmail = extractedCustomerEmail || customerEmail || '';
      
      // Validate required data — return 200 even on failure to prevent Stripe retries
      if (!sessionId || !finalCustomerEmail || !amountTotal || !deliverySpeed) {
        console.error('[STRIPE WEBHOOK] Missing required session data:', {
          sessionId,
          finalCustomerEmail,
          amountTotal,
          deliverySpeed
        });
        // Return 200 to Stripe so it doesn't retry — log the error for debugging
        return NextResponse.json({ received: true, error: 'Missing required session data' });
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

      // Resolve "Other" values in arrays — replace literal "other" with custom text
      const rawMusicStyle: string[] = (intakePayload as any).musicStyle || [];
      const musicStyleCustom: string = (intakePayload as any).musicStyleCustom || '';
      const resolvedMusicStyle = rawMusicStyle.map((item: string) => 
        item === 'other' && musicStyleCustom.trim() ? musicStyleCustom.trim() : item
      ).filter((item: string) => item !== 'other'); // Remove unresolved "other"

      const rawEmotionalVibe: string[] = (intakePayload as any).emotionalVibe || [];
      const emotionalVibeCustom: string = (intakePayload as any).emotionalVibeCustom || '';
      const resolvedEmotionalVibe = rawEmotionalVibe.map((item: string) => 
        item === 'other' && emotionalVibeCustom.trim() ? emotionalVibeCustom.trim() : item
      ).filter((item: string) => item !== 'other'); // Remove unresolved "other"

      // Resolve gender — use custom text if "other"
      const rawGender: string = (intakePayload as any).gender || '';
      const genderCustom: string = (intakePayload as any).genderCustom || '';
      const resolvedGender = rawGender === 'other' && genderCustom.trim() ? genderCustom.trim() : rawGender;

      // Insert order into Supabase with customer contact fields and key intake fields
      const { data: order, error: insertError } = await supabaseAdmin
        .from('orders')
        .insert({
          tracking_id: trackingId,
          paid_at: paidAt.toISOString(),
          customer_name: customerName,
          customer_email: finalCustomerEmail,
          customer_phone: customerPhone,
          session_id: frontendSessionId,
          amount_paid: amountTotal,
          currency: currency,
          delivery_speed: deliverySpeed,
          expected_delivery_at: expectedDeliveryAt.toISOString(),
          order_status: 'Paid',
          intake_payload: intakePayload,
          stripe_checkout_session_id: sessionId,
          stripe_payment_intent_id: paymentIntentId,
          // Extract key intake fields for easier querying
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
          coupon_code: couponCode,
          coupon_discount: couponDiscount,
        })
        .select()
        .single();

      if (insertError) {
        console.error('[STRIPE WEBHOOK] Failed to insert order:', {
          error: insertError,
          code: insertError.code,
          message: insertError.message,
          details: insertError.details,
          hint: insertError.hint,
          sessionId,
          customerEmail,
          trackingId
        });
        // Return 200 to Stripe so it doesn't retry — log the error for debugging
        return NextResponse.json({ received: true, error: 'Failed to create order', details: insertError.message });
      }

      console.log('Order created successfully:', {
        id: order.id,
        trackingId: order.tracking_id,
        customerEmail: order.customer_email,
        amount: order.amount_paid,
        deliverySpeed: order.delivery_speed
      });

      debugLog('WEBHOOK — order created in Supabase', {
        orderId: order.id,
        trackingId: order.tracking_id,
        customerName: order.customer_name,
        customerEmail: order.customer_email,
        customerPhone: order.customer_phone,
        gender: order.gender,
        genderCustom: order.gender_custom,
        sessionId: order.session_id,
        amountPaid: order.amount_paid,
        deliverySpeed: order.delivery_speed,
        recipientName: order.recipient_name,
        recipientRelationship: order.recipient_relationship,
        musicStyle: order.music_style,
        emotionalVibe: order.emotional_vibe,
        voicePreference: order.voice_preference,
        faithExpressionLevel: order.faith_expression_level,
        coreMessage: order.core_message,
        paidAt: order.paid_at,
      });

      // Send order data to n8n webhook (don't fail if webhook fails)
      try {
        const n8nConfig = validateN8nConfig();
        if (n8nConfig.isConfigured) {
          console.log('Sending order to n8n webhook...');
          
          const webhookPayload = {
            status: 'paid' as const,
            // Order information
            order: {
              tracking_id: order.tracking_id,
              created_at: order.created_at,
              paid_at: order.paid_at,
              order_status: order.order_status,
              delivery_type: order.delivery_speed,
              delivery_eta: order.expected_delivery_at,
              payment_timestamp: order.paid_at,
              amount_paid: order.amount_paid,
              currency: order.currency,
              session_id: order.session_id,
              stripe_checkout_session_id: order.stripe_checkout_session_id,
              stripe_payment_intent_id: order.stripe_payment_intent_id,
              coupon_code: couponCode,
              coupon_discount: couponDiscount,
            },
            // Customer contact information
            customer: {
              name: order.customer_name,
              email: order.customer_email,
              phone: order.customer_phone,
              gender: order.gender || null,
              gender_custom: order.gender_custom || null
            },
            // Resolved intake fields (Other values replaced with actual text)
            song_details: {
              recipient_name: order.recipient_name,
              recipient_relationship: order.recipient_relationship,
              song_perspective: order.song_perspective,
              primary_language: order.primary_language,
              music_style: order.music_style,
              emotional_vibe: order.emotional_vibe,
              voice_preference: order.voice_preference,
              faith_expression_level: order.faith_expression_level || null,
              core_message: order.core_message
            },
            // Complete raw intake form data
            intake: order.intake_payload || {}
          };

          debugLogPayload('WEBHOOK — n8n order payload', webhookPayload);

          const webhookSuccess = await sendOrderToN8n(webhookPayload);
          
          if (webhookSuccess) {
            console.log('Successfully sent order to n8n webhook');
            debugLog('WEBHOOK — n8n order webhook sent successfully');
          } else {
            console.warn('Failed to send order to n8n webhook, but order was saved');
            debugLog('WEBHOOK — n8n order webhook FAILED (order still saved)');
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
    console.error('[STRIPE WEBHOOK] Unhandled processing error:', error);
    // Return 200 to Stripe so it doesn't retry — prevents duplicate processing on retries
    return NextResponse.json({ 
      received: true, 
      error: 'Webhook processing failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
