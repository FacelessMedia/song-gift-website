import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const envCheck = {
    STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: !!process.env.STRIPE_WEBHOOK_SECRET,
    SUPABASE_URL: !!process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    NODE_ENV: process.env.NODE_ENV,
  };

  return NextResponse.json({
    message: 'Environment variables check',
    variables: envCheck,
    timestamp: new Date().toISOString()
  });
}
