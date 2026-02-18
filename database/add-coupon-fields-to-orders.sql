-- Migration: Add coupon fields to orders table
-- Run this in Supabase Dashboard → SQL Editor

ALTER TABLE orders ADD COLUMN IF NOT EXISTS coupon_code TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS coupon_discount INTEGER DEFAULT 0;

-- Index for querying orders by coupon
CREATE INDEX IF NOT EXISTS idx_orders_coupon_code ON orders (coupon_code) WHERE coupon_code IS NOT NULL;
