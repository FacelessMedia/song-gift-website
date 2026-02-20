import crypto from 'crypto';

const signingSecret = process.env.N8N_WEBHOOK_SIGNING_SECRET;

export interface OrderWebhookPayload {
  event: 'order_paid';
  order_id: string;
  tracking_id: string;
  status: 'paid';
  stripe_checkout_session_id: string;
  stripe_payment_intent_id: string;
  amount_paid: number;
  currency: string;
  order: {
    created_at: string;
    paid_at: string;
    order_status: string;
    delivery_type: string;
    delivery_eta: string;
    session_id: string;
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
  event: 'order_initiated';
  order_id: string;
  tracking_id: string;
  status: 'pending';
  amount: number;
  currency: string;
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

// Send payload to n8n webhook — throws on failure, never swallows errors
export async function sendToN8nWebhook(data: OrderWebhookPayload | InitiatedWebhookPayload): Promise<void> {
  const n8nWebhookUrl = process.env.N8N_ORDER_WEBHOOK_URL;

  if (!n8nWebhookUrl) {
    throw new Error('N8N_ORDER_WEBHOOK_URL is not configured — cannot send webhook');
  }

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

  console.log(`📤 Sending n8n webhook: ${data.event} order_id=${data.order_id}`, {
    url: n8nWebhookUrl,
    event: data.event,
    order_id: data.order_id,
    tracking_id: data.tracking_id,
    hasSignature: !!signingSecret,
  });

  const response = await fetch(n8nWebhookUrl, {
    method: 'POST',
    headers,
    body: payload,
  });

  console.log(`📥 n8n response status: ${response.status} for ${data.event} order_id=${data.order_id}`);

  if (!response.ok) {
    const responseText = await response.text().catch(() => 'unable to read body');
    throw new Error(`n8n webhook failed: HTTP ${response.status} ${response.statusText} — ${responseText.substring(0, 200)}`);
  }

  const responseText = await response.text();
  console.log(`✅ n8n webhook success: ${data.event} order_id=${data.order_id}`, {
    responseStatus: response.status,
    responseBody: responseText.substring(0, 200),
  });
}
