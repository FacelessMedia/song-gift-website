-- Migration: Create session_data table for persistent session storage
-- This replaces the in-memory Map that was losing data between serverless invocations
-- Run this in Supabase Dashboard → SQL Editor

-- Create the session_data table
CREATE TABLE IF NOT EXISTS session_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL UNIQUE,
  intake_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

-- Index for fast lookups by session_id
CREATE INDEX IF NOT EXISTS idx_session_data_session_id ON session_data (session_id);

-- Index for cleanup of expired entries
CREATE INDEX IF NOT EXISTS idx_session_data_expires_at ON session_data (expires_at);

-- RLS: Disable RLS since this table is only accessed by the service role key
ALTER TABLE session_data DISABLE ROW LEVEL SECURITY;

-- Auto-cleanup: Delete expired rows (optional — can also be done in application code)
-- You can set up a Supabase cron job or pg_cron extension to run:
-- DELETE FROM session_data WHERE expires_at < NOW();
