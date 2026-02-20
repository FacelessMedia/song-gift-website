-- Migration: Refactor order_status to clean lifecycle + drop unused table
-- Date: 2026-02-20
-- Description:
--   1. Drop temp_checkout_data table (unused, replaced by session_data)
--   2. Migrate order_status values to lowercase
--   3. Replace CHECK constraint with new lifecycle values
--   4. Update default from 'New' to 'pending'
--
-- New status lifecycle: pending → paid → processing → qa → delivered
--                                  ↘ failed
--
-- INSTRUCTIONS:
--   1. Go to Supabase Dashboard → SQL Editor
--   2. Paste this entire script
--   3. Click "Run"
--   4. Verify with: SELECT DISTINCT order_status FROM orders;

-- ============================================================
-- STEP 1: Drop unused temp_checkout_data table
-- ============================================================
DROP TABLE IF EXISTS temp_checkout_data;

-- ============================================================
-- STEP 2: Drop old CHECK constraint FIRST (before migrating values)
-- ============================================================
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_order_status_check;

-- ============================================================
-- STEP 3: Migrate existing order_status values to lowercase
-- ============================================================
UPDATE orders SET order_status = 'pending'    WHERE order_status = 'New';
UPDATE orders SET order_status = 'paid'       WHERE order_status = 'Paid';
UPDATE orders SET order_status = 'processing' WHERE order_status = 'Processing';
UPDATE orders SET order_status = 'qa'         WHERE order_status = 'QA';
UPDATE orders SET order_status = 'delivered'  WHERE order_status = 'Delivered';

-- ============================================================
-- STEP 4: Add new CHECK constraint with lowercase lifecycle values
-- ============================================================
ALTER TABLE orders ADD CONSTRAINT orders_order_status_check
  CHECK (order_status IN ('pending', 'paid', 'processing', 'qa', 'delivered', 'failed'));

-- ============================================================
-- STEP 5: Update default value
-- ============================================================
ALTER TABLE orders ALTER COLUMN order_status SET DEFAULT 'pending';

-- ============================================================
-- STEP 6: Update comments
-- ============================================================
COMMENT ON COLUMN orders.order_status IS 'Order lifecycle: pending → paid → processing → qa → delivered (or failed)';

-- ============================================================
-- Verification queries (run after migration)
-- ============================================================
-- SELECT DISTINCT order_status, COUNT(*) FROM orders GROUP BY order_status;
-- SELECT table_name FROM information_schema.tables WHERE table_name = 'temp_checkout_data';
