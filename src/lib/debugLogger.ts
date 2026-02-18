/**
 * Debug Logger — toggleable via DEBUG_LOGGING env var.
 * 
 * Set DEBUG_LOGGING=true in .env.local to enable verbose payload logging.
 * When disabled (default), no debug output is produced.
 * 
 * NEVER logs sensitive data (card numbers, full keys, passwords).
 */

const isEnabled = process.env.DEBUG_LOGGING === 'true';

function sanitize(obj: Record<string, any>): Record<string, any> {
  const sensitiveKeys = [
    'card', 'cvc', 'cvv', 'password', 'secret', 'token',
    'stripe_secret', 'api_key', 'service_role_key',
  ];

  const result: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    const lowerKey = key.toLowerCase();
    const isSensitive = sensitiveKeys.some(sk => lowerKey.includes(sk));

    if (isSensitive && typeof value === 'string') {
      result[key] = value.length > 8
        ? `${value.slice(0, 4)}...${value.slice(-4)}`
        : '[REDACTED]';
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      result[key] = sanitize(value);
    } else {
      result[key] = value;
    }
  }

  return result;
}

export function debugLog(label: string, data?: Record<string, any> | string) {
  if (!isEnabled) return;

  const timestamp = new Date().toISOString();
  const prefix = `[DEBUG ${timestamp}] ${label}`;

  if (!data) {
    console.log(prefix);
    return;
  }

  if (typeof data === 'string') {
    console.log(prefix, data);
    return;
  }

  console.log(prefix, JSON.stringify(sanitize(data), null, 2));
}

export function debugLogPayload(route: string, payload: Record<string, any>) {
  if (!isEnabled) return;
  debugLog(`${route} — PAYLOAD`, payload);
}

export function debugLogResponse(route: string, status: number, body?: Record<string, any>) {
  if (!isEnabled) return;
  debugLog(`${route} — RESPONSE [${status}]`, body);
}
