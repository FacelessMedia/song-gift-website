import { NextResponse } from 'next/server';

// Simple test to check if environment variables are loaded
export async function GET() {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    return NextResponse.json({
      success: true,
      hasSupabaseUrl: !!supabaseUrl,
      hasServiceRoleKey: !!supabaseServiceRoleKey,
      supabaseUrlPrefix: supabaseUrl ? supabaseUrl.substring(0, 20) + '...' : 'missing',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Environment check failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
