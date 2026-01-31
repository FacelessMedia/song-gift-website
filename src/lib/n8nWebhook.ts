import crypto from 'crypto';

const n8nWebhookUrl = process.env.N8N_ORDER_WEBHOOK_URL;
const signingSecret = process.env.N8N_WEBHOOK_SIGNING_SECRET;

export interface OrderWebhookPayload {
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
  };
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  intake: any;
}

// Generate HMAC signature for webhook security
function generateSignature(payload: string, secret: string): string {
  return crypto
    .createHmac('sha256', secret)
    .update(payload, 'utf8')
    .digest('hex');
}

// Send order data to n8n webhook
export async function sendOrderToN8n(orderData: OrderWebhookPayload): Promise<boolean> {
  if (!n8nWebhookUrl) {
    console.warn('N8N_ORDER_WEBHOOK_URL not configured, skipping webhook');
    return false;
  }

  try {
    const payload = JSON.stringify(orderData);
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'SongGift-Webhook/1.0',
    };

    // Add HMAC signature if signing secret is configured
    if (signingSecret) {
      const signature = generateSignature(payload, signingSecret);
      headers['X-SongGift-Signature'] = `sha256=${signature}`;
    }

    console.log('Sending order to n8n webhook:', {
      url: n8nWebhookUrl,
      trackingId: orderData.order.tracking_id,
      customerEmail: orderData.customer.email,
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
    console.log('n8n webhook response:', {
      status: response.status,
      response: responseText.substring(0, 200) // Log first 200 chars
    });

    return true;

  } catch (error) {
    console.error('Failed to send order to n8n webhook:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      trackingId: orderData.order.tracking_id,
      webhookUrl: n8nWebhookUrl
    });
    return false;
  }
}

// Validate webhook configuration
export function validateN8nConfig(): { isConfigured: boolean; hasSigningSecret: boolean } {
  return {
    isConfigured: !!n8nWebhookUrl,
    hasSigningSecret: !!signingSecret
  };
}
