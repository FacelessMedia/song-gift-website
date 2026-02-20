import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client with admin privileges
// This client uses the SERVICE ROLE key and bypasses RLS
// ⚠️ NEVER use this in client components - server-side only!

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error(
    'Missing required environment variables: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY'
  );
}

// Create admin client with service role key
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Type definitions for our orders table
export interface Order {
  id: string;
  created_at: string;
  paid_at: string | null;
  tracking_id: string;
  customer_email: string | null;
  amount_paid: number | null;
  currency: string;
  delivery_speed: 'standard' | 'express';
  expected_delivery_at: string | null;
  order_status: 'pending' | 'paid' | 'processing' | 'qa' | 'delivered' | 'failed';
  intake_payload: any; // JSON object with all intake form data
  stripe_checkout_session_id: string | null;
  stripe_payment_intent_id: string | null;
}

// Helper function to generate tracking ID
export function generateTrackingId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SG-${timestamp}${random}`;
}

// Helper function to calculate expected delivery date
export function calculateDeliveryDate(deliverySpeed: 'standard' | 'express'): Date {
  const now = new Date();
  const deliveryDate = new Date(now);
  
  if (deliverySpeed === 'express') {
    // Express: 12-24 hours (add 1 day)
    deliveryDate.setDate(now.getDate() + 1);
  } else {
    // Standard: 24-48 hours (add 2 days)
    deliveryDate.setDate(now.getDate() + 2);
  }
  
  return deliveryDate;
}
