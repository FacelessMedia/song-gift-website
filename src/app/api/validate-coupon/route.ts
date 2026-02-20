import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

// ─── In-memory rate limiter ───
const RATE_LIMIT_MAX = 5;          // max attempts
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const attemptsByIp = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = attemptsByIp.get(ip) || [];

  // Keep only timestamps within the window
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (recent.length >= RATE_LIMIT_MAX) {
    attemptsByIp.set(ip, recent);
    return true;
  }

  recent.push(now);
  attemptsByIp.set(ip, recent);
  return false;
}

// Periodic cleanup to prevent memory leak (runs at most once per minute)
let lastCleanup = Date.now();
function cleanupStaleEntries() {
  const now = Date.now();
  if (now - lastCleanup < 60_000) return;
  lastCleanup = now;

  for (const [ip, timestamps] of attemptsByIp) {
    const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
    if (recent.length === 0) {
      attemptsByIp.delete(ip);
    } else {
      attemptsByIp.set(ip, recent);
    }
  }
}

export async function POST(request: NextRequest) {
  // Rate limit check
  cleanupStaleEntries();
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

  if (isRateLimited(ip)) {
    console.warn('[COUPON] Rate limited:', ip);
    return NextResponse.json(
      { valid: false, error: 'Too many attempts. Please try again in a few minutes.' },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { code, original_amount } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { valid: false, error: 'Coupon code is required' },
        { status: 400 }
      );
    }

    if (!original_amount || typeof original_amount !== 'number' || original_amount <= 0) {
      return NextResponse.json(
        { valid: false, error: 'Valid original amount is required' },
        { status: 400 }
      );
    }

    // Look up coupon (case-insensitive)
    const { data: coupon, error: fetchError } = await supabaseAdmin
      .from('coupons')
      .select('*')
      .ilike('code', code.trim())
      .single();

    if (fetchError || !coupon) {
      return NextResponse.json({ valid: false, error: 'Invalid coupon code' });
    }

    // Check if active
    if (!coupon.active) {
      return NextResponse.json({ valid: false, error: 'This coupon is no longer active' });
    }

    // Check expiry
    if (coupon.expiry_date && new Date(coupon.expiry_date) < new Date()) {
      return NextResponse.json({ valid: false, error: 'This coupon has expired' });
    }

    // Calculate discount
    let discount_amount = 0;

    if (coupon.discount_type === 'percentage') {
      // discount_value is a percentage (e.g. 10 = 10%)
      discount_amount = Math.round(original_amount * (coupon.discount_value / 100));
    } else if (coupon.discount_type === 'fixed') {
      // discount_value is in cents (e.g. 2000 = $20.00)
      discount_amount = Math.round(coupon.discount_value);
    }

    // Ensure discount doesn't exceed original amount (minimum $1 charge)
    const minCharge = 100; // $1.00 in cents — Stripe minimum
    if (discount_amount >= original_amount - minCharge) {
      discount_amount = original_amount - minCharge;
    }

    // Ensure non-negative
    if (discount_amount < 0) discount_amount = 0;

    const new_amount = original_amount - discount_amount;

    console.log('[COUPON] Validated:', {
      code: coupon.code,
      type: coupon.discount_type,
      value: coupon.discount_value,
      original_amount,
      discount_amount,
      new_amount,
    });

    return NextResponse.json({
      valid: true,
      coupon_code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      discount_amount,
      new_amount,
    });
  } catch (error) {
    console.error('[COUPON] Validation error:', error);
    return NextResponse.json(
      { valid: false, error: 'Failed to validate coupon' },
      { status: 500 }
    );
  }
}
