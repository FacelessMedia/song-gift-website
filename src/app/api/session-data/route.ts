import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

/**
 * API endpoint to receive session data from frontend before checkout.
 * Stores intake data in Supabase so the Stripe webhook (which may run
 * on a different serverless instance) can retrieve it reliably.
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, intakeData } = body;

    if (!sessionId || !intakeData) {
      return NextResponse.json(
        { error: 'Missing sessionId or intakeData' },
        { status: 400 }
      );
    }

    // Upsert session data into Supabase with 2-hour expiry
    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();

    const { error: upsertError } = await supabaseAdmin
      .from('session_data')
      .upsert(
        {
          session_id: sessionId,
          intake_data: intakeData,
          expires_at: expiresAt,
        },
        { onConflict: 'session_id' }
      );

    if (upsertError) {
      console.error('Failed to store session data in Supabase:', upsertError);
      return NextResponse.json(
        { error: 'Failed to store session data' },
        { status: 500 }
      );
    }

    // Opportunistic cleanup of expired rows (non-blocking, fire-and-forget)
    supabaseAdmin
      .from('session_data')
      .delete()
      .lt('expires_at', new Date().toISOString())
      .then(() => {});

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error storing session data:', error);
    return NextResponse.json(
      { error: 'Failed to store session data' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing sessionId parameter' },
        { status: 400 }
      );
    }

    const { data: sessionEntry, error: fetchError } = await supabaseAdmin
      .from('session_data')
      .select('intake_data, expires_at')
      .eq('session_id', sessionId)
      .single();

    if (fetchError || !sessionEntry) {
      console.warn('Session data not found for:', sessionId, fetchError?.message);
      return NextResponse.json(
        { error: 'Session data not found or expired' },
        { status: 404 }
      );
    }

    // Check if expired
    if (new Date(sessionEntry.expires_at) < new Date()) {
      // Clean up expired entry
      await supabaseAdmin
        .from('session_data')
        .delete()
        .eq('session_id', sessionId);

      return NextResponse.json(
        { error: 'Session data expired' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: sessionEntry.intake_data,
    });

  } catch (error) {
    console.error('Error retrieving session data:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve session data' },
      { status: 500 }
    );
  }
}
