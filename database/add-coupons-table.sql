-- Migration: Create coupons table for discount code system
-- Run this in Supabase Dashboard → SQL Editor

CREATE TABLE IF NOT EXISTS coupons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC NOT NULL CHECK (discount_value > 0),
  active BOOLEAN NOT NULL DEFAULT true,
  expiry_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookups by code (case-insensitive)
CREATE UNIQUE INDEX IF NOT EXISTS idx_coupons_code_upper ON coupons (UPPER(code));

-- RLS: Disable since only accessed by service role key
ALTER TABLE coupons DISABLE ROW LEVEL SECURITY;

-- Example: Insert a test coupon (10% off, no expiry)
-- INSERT INTO coupons (code, discount_type, discount_value) VALUES ('WELCOME10', 'percentage', 10);

-- Example: Insert a fixed $20 off coupon expiring March 2026
-- INSERT INTO coupons (code, discount_type, discount_value, expiry_date) VALUES ('SAVE20', 'fixed', 2000, '2026-03-31T23:59:59Z');
-- Note: fixed discount_value is in CENTS (2000 = $20.00)
