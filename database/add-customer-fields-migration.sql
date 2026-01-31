-- Migration: Add Customer Contact Fields and Key Intake Fields to Orders Table
-- Date: 2026-01-31
-- Purpose: Add customer contact fields and extract key intake fields for easier querying

-- Add customer contact fields (only if they don't exist)
DO $$ 
BEGIN
    -- Add customer_name if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'orders' AND column_name = 'customer_name') THEN
        ALTER TABLE orders ADD COLUMN customer_name TEXT;
    END IF;
    
    -- Add customer_phone if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'orders' AND column_name = 'customer_phone') THEN
        ALTER TABLE orders ADD COLUMN customer_phone TEXT;
    END IF;
    
    -- Add session_id if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'orders' AND column_name = 'session_id') THEN
        ALTER TABLE orders ADD COLUMN session_id TEXT;
    END IF;
END $$;

-- Add key intake fields for easier querying and reporting (only if they don't exist)
DO $$ 
BEGIN
    -- Add recipient_name if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'orders' AND column_name = 'recipient_name') THEN
        ALTER TABLE orders ADD COLUMN recipient_name TEXT;
    END IF;
    
    -- Add recipient_relationship if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'orders' AND column_name = 'recipient_relationship') THEN
        ALTER TABLE orders ADD COLUMN recipient_relationship TEXT;
    END IF;
    
    -- Add song_perspective if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'orders' AND column_name = 'song_perspective') THEN
        ALTER TABLE orders ADD COLUMN song_perspective TEXT;
    END IF;
    
    -- Add primary_language if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'orders' AND column_name = 'primary_language') THEN
        ALTER TABLE orders ADD COLUMN primary_language TEXT;
    END IF;
    
    -- Add music_style if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'orders' AND column_name = 'music_style') THEN
        ALTER TABLE orders ADD COLUMN music_style TEXT[];
    END IF;
    
    -- Add emotional_vibe if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'orders' AND column_name = 'emotional_vibe') THEN
        ALTER TABLE orders ADD COLUMN emotional_vibe TEXT[];
    END IF;
    
    -- Add voice_preference if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'orders' AND column_name = 'voice_preference') THEN
        ALTER TABLE orders ADD COLUMN voice_preference TEXT;
    END IF;
    
    -- Add faith_expression_level if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'orders' AND column_name = 'faith_expression_level') THEN
        ALTER TABLE orders ADD COLUMN faith_expression_level TEXT;
    END IF;
    
    -- Add core_message if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'orders' AND column_name = 'core_message') THEN
        ALTER TABLE orders ADD COLUMN core_message TEXT;
    END IF;
END $$;

-- Add indexes for performance (only if they don't exist)
DO $$ 
BEGIN
    -- Create indexes only if they don't exist
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_orders_customer_name') THEN
        CREATE INDEX idx_orders_customer_name ON orders(customer_name);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_orders_session_id') THEN
        CREATE INDEX idx_orders_session_id ON orders(session_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_orders_recipient_name') THEN
        CREATE INDEX idx_orders_recipient_name ON orders(recipient_name);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_orders_recipient_relationship') THEN
        CREATE INDEX idx_orders_recipient_relationship ON orders(recipient_relationship);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_orders_primary_language') THEN
        CREATE INDEX idx_orders_primary_language ON orders(primary_language);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_orders_voice_preference') THEN
        CREATE INDEX idx_orders_voice_preference ON orders(voice_preference);
    END IF;
    
    -- Add GIN indexes for array fields
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_orders_music_style') THEN
        CREATE INDEX idx_orders_music_style ON orders USING GIN(music_style);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_orders_emotional_vibe') THEN
        CREATE INDEX idx_orders_emotional_vibe ON orders USING GIN(emotional_vibe);
    END IF;
END $$;

-- Add helpful comments
COMMENT ON COLUMN orders.customer_name IS 'Customer full name from Step 6 contact form';
COMMENT ON COLUMN orders.customer_phone IS 'Customer phone number from Step 6 contact form';
COMMENT ON COLUMN orders.session_id IS 'Frontend session ID for tracking user journey';
COMMENT ON COLUMN orders.recipient_name IS 'Name of song recipient from Step 1';
COMMENT ON COLUMN orders.recipient_relationship IS 'Relationship to recipient (wife, husband, etc.)';
COMMENT ON COLUMN orders.song_perspective IS 'Song perspective (first-person, third-person, etc.)';
COMMENT ON COLUMN orders.primary_language IS 'Primary language for the song';
COMMENT ON COLUMN orders.music_style IS 'Array of selected music styles (acoustic, pop, etc.)';
COMMENT ON COLUMN orders.emotional_vibe IS 'Array of selected emotional vibes (romantic, heartfelt, etc.)';
COMMENT ON COLUMN orders.voice_preference IS 'Preferred voice type (male, female, etc.)';
COMMENT ON COLUMN orders.faith_expression_level IS 'Level of faith expression in song';
COMMENT ON COLUMN orders.core_message IS 'Main message the customer wants to convey';

-- Note: We're not making these NOT NULL initially to avoid breaking existing records
-- New records will have these fields populated by the webhook
