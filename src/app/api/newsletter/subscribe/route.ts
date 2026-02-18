import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { debugLog, debugLogPayload } from '@/lib/debugLogger';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Email validation function
function validateEmail(email: string): string {
  const trimmed = email.trim();
  if (!trimmed) return 'Email address is required';
  
  // RFC-style practical email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) return 'Please enter a valid email address';
  return '';
}

// Send newsletter subscription to webhook
async function sendToWebhook(subscriptionData: {
  email: string;
  session_id: string | null;
  page_path: string;
  user_agent: string;
  subscribed_at: string;
}) {
  const webhookUrl = process.env.N8N_NEWSLETTER_WEBHOOK_URL;
  
  if (!webhookUrl) {
    console.warn('N8N_NEWSLETTER_WEBHOOK_URL not configured - skipping webhook');
    return;
  }
  
  const payload = {
    event: 'newsletter_subscribed',
    email: subscriptionData.email,
    source: 'songgift.app',
    session_id: subscriptionData.session_id,
    page_path: subscriptionData.page_path,
    user_agent: subscriptionData.user_agent,
    subscribed_at: subscriptionData.subscribed_at
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error('Failed to send newsletter webhook:', response.status, await response.text());
    } else {
      console.log('Newsletter webhook sent successfully:', payload);
    }
  } catch (error) {
    console.error('Error sending newsletter webhook:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, page_path, user_agent } = body;

    // Validate email
    const emailError = validateEmail(email);
    if (emailError) {
      return NextResponse.json(
        { error: emailError },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();
    // Get session ID from request headers or body if provided
    const sessionId = request.headers.get('x-session-id') || body.session_id || null;
    const createdAt = new Date().toISOString();

    debugLog('NEWSLETTER — subscribe request', {
      email: trimmedEmail,
      sessionId,
      pagePath: page_path || '/',
      timestamp: createdAt,
    });

    // Insert into Supabase
    const { data: subscription, error: insertError } = await supabaseAdmin
      .from('newsletter_subscribers')
      .insert({
        email: trimmedEmail,
        source: 'songgift.app',
        session_id: sessionId,
        page_path: page_path || '/',
        user_agent: user_agent || '',
        created_at: createdAt
      })
      .select()
      .single();

    if (insertError) {
      // Handle duplicate email (unique constraint violation)
      if (insertError.code === '23505') {
        console.log('Duplicate newsletter subscription attempt:', trimmedEmail);
        
        // Still send to webhook for tracking (treat as success)
        await sendToWebhook({
          email: trimmedEmail,
          session_id: sessionId,
          page_path: page_path || '/',
          user_agent: user_agent || '',
          subscribed_at: createdAt
        });

        return NextResponse.json({
          success: true,
          message: 'You\'re already subscribed! Thank you.'
        });
      }

      console.error('Failed to insert newsletter subscription:', insertError);
      return NextResponse.json(
        { error: 'Failed to subscribe. Please try again.' },
        { status: 500 }
      );
    }

    console.log('Newsletter subscription created:', subscription.id);

    debugLog('NEWSLETTER — subscription saved to Supabase', {
      subscriptionId: subscription.id,
      email: subscription.email,
      sessionId: subscription.session_id,
      pagePath: subscription.page_path,
    });

    // Send to webhook
    await sendToWebhook({
      email: subscription.email,
      session_id: subscription.session_id,
      page_path: subscription.page_path || '/',
      user_agent: subscription.user_agent || '',
      subscribed_at: subscription.created_at
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter!'
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}
