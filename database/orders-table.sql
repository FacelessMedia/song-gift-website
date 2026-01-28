-- SongGift Orders Table
-- This table stores order records ONLY after successful payment
-- Created: 2026-01-27

-- Create the orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    paid_at TIMESTAMPTZ,
    tracking_id TEXT UNIQUE NOT NULL,
    customer_email TEXT,
    amount_paid INTEGER, -- Amount in cents (e.g., 7900 = $79.00)
    currency TEXT DEFAULT 'usd',
    delivery_speed TEXT CHECK (delivery_speed IN ('standard', 'express')),
    expected_delivery_at TIMESTAMPTZ,
    order_status TEXT DEFAULT 'New' CHECK (order_status IN ('New', 'Paid', 'Processing', 'QA', 'Delivered')),
    intake_payload JSONB NOT NULL, -- Complete 5-step intake form data
    stripe_checkout_session_id TEXT,
    stripe_payment_intent_id TEXT
);

-- Create indexes for performance
CREATE UNIQUE INDEX idx_orders_tracking_id ON orders(tracking_id);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_order_status ON orders(order_status);
CREATE INDEX idx_orders_stripe_checkout_session ON orders(stripe_checkout_session_id);
CREATE INDEX idx_orders_stripe_payment_intent ON orders(stripe_payment_intent_id);
CREATE INDEX idx_orders_customer_email ON orders(customer_email);

-- Enable Row Level Security (RLS)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- No public policies - all access must use service role key
-- This ensures only server-side code can read/write orders

-- Add helpful comments
COMMENT ON TABLE orders IS 'SongGift customer orders - created only after successful payment';
COMMENT ON COLUMN orders.tracking_id IS 'Unique tracking ID format: SG-XXXXXXXX';
COMMENT ON COLUMN orders.amount_paid IS 'Payment amount in cents (USD)';
COMMENT ON COLUMN orders.intake_payload IS 'Complete intake form data as JSON';
COMMENT ON COLUMN orders.delivery_speed IS 'standard (24-48h) or express (12-24h)';
