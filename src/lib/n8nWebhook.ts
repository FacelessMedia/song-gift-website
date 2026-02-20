import crypto from 'crypto';

const n8nWebhookUrl = process.env.N8N_ORDER_WEBHOOK_URL;
const signingSecret = process.env.N8N_WEBHOOK_SIGNING_SECRET;

export interface OrderWebhookPayload {
  status: 'paid';
  order: {
    tracking_id: string;
    created_at: string;
    paid_at: string;
    order_status: string;
    delivery_type: string;
    delivery_eta: string;
    payment_timestamp: string;
    amount_paid: number;
    currency: string;
    session_id: string;
    stripe_checkout_session_id: string;
    stripe_payment_intent_id: string;
    coupon_code: string | null;
    coupon_discount: number;
  };
  customer: {
    name: string;
    email: string;
    phone: string;
    gender: string | null;
    gender_custom: string | null;
  };
  song_details?: {
    recipient_name: string;
    recipient_relationship: string;
    song_perspective: string;
    primary_language: string;
    music_style: string[];
    emotional_vibe: string[];
    voice_preference: string;
    faith_expression_level: string | null;
    core_message: string;
  };
  intake: any;
}

export interface InitiatedWebhookPayload {
  status: 'initiated';
  session_id: string;
  tracking_id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  delivery_speed: string;
  intake: any;
}

// Generate HMAC signature for webhook security
function generateSignature(payload: string, secret: string): string {
  return crypto
    .createHmac('sha256', secret)
    .update(payload, 'utf8')
    .digest('hex');
}

// Generic function to send any payload to n8n webhook
export async function sendToN8nWebhook(data: OrderWebhookPayload | InitiatedWebhookPayload): Promise<boolean> {
  if (!n8nWebhookUrl) {
    console.warn('N8N_ORDER_WEBHOOK_URL not configured, skipping webhook');
    return false;
  }

  try {
    const payload = JSON.stringify(data);
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'SongGift-Webhook/1.0',
    };

    // Add HMAC signature if signing secret is configured
    if (signingSecret) {
      const signature = generateSignature(payload, signingSecret);
      headers['X-SongGift-Signature'] = `sha256=${signature}`;
    }

    console.log(`[n8n webhook] Sending status=${data.status}:`, {
      url: n8nWebhookUrl,
      status: data.status,
      hasSignature: !!signingSecret
    });

    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers,
      body: payload,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const responseText = await response.text();
    console.log(`[n8n webhook] Response for status=${data.status}:`, {
      status: response.status,
      response: responseText.substring(0, 200)
    });

    return true;

  } catch (error) {
    console.error(`[n8n webhook] Failed to send status=${data.status}:`, {
      error: error instanceof Error ? error.message : 'Unknown error',
      webhookUrl: n8nWebhookUrl
    });
    return false;
  }
}

// Send order data to n8n webhook (backward-compatible wrapper)
export async function sendOrderToN8n(orderData: OrderWebhookPayload): Promise<boolean> {
  return sendToN8nWebhook(orderData);
}

// Validate webhook configuration
export function validateN8nConfig(): { isConfigured: boolean; hasSigningSecret: boolean } {
  return {
    isConfigured: !!n8nWebhookUrl,
    hasSigningSecret: !!signingSecret
  };
}
