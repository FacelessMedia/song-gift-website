-- Migration: Add gender fields and make faith_expression_level nullable
-- Date: 2026-02-12
-- Description: 
--   1. Add gender column (text, nullable for backward compatibility)
--   2. Add gender_custom column (text, nullable)
--   3. Make faith_expression_level accept null values
--
-- INSTRUCTIONS:
--   1. Go to Supabase Dashboard → SQL Editor
--   2. Paste this entire script
--   3. Click "Run"
--   4. Verify columns exist in Table Editor → orders table

-- Step 1: Add gender column (nullable for backward compatibility with existing orders)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS gender text;

-- Step 2: Add gender_custom column (nullable, only populated when gender = 'other')
ALTER TABLE orders ADD COLUMN IF NOT EXISTS gender_custom text;

-- Step 3: Ensure faith_expression_level accepts null
-- (It should already be nullable as text, but this ensures it)
ALTER TABLE orders ALTER COLUMN faith_expression_level DROP NOT NULL;

-- Step 4: Add index on gender for potential filtering
CREATE INDEX IF NOT EXISTS idx_orders_gender ON orders (gender);

-- Verification query (run after migration to confirm)
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'orders' 
-- AND column_name IN ('gender', 'gender_custom', 'faith_expression_level');
