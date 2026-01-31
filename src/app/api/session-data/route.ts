import { NextRequest, NextResponse } from 'next/server';

/**
 * API endpoint to receive session data from frontend before checkout
 * This allows the webhook to access the full intake data later
 */

// In-memory storage for session data (temporary solution)
// In production, you'd use Redis or a proper cache
const sessionDataStore = new Map<string, any>();

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

    // Store session data with expiration (1 hour)
    const sessionEntry = {
      data: intakeData,
      timestamp: Date.now(),
      expiresAt: Date.now() + (60 * 60 * 1000) // 1 hour
    };

    sessionDataStore.set(sessionId, sessionEntry);

    // Clean up expired entries
    for (const [key, entry] of sessionDataStore.entries()) {
      if (entry.expiresAt < Date.now()) {
        sessionDataStore.delete(key);
      }
    }

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

    const sessionEntry = sessionDataStore.get(sessionId);

    if (!sessionEntry) {
      return NextResponse.json(
        { error: 'Session data not found or expired' },
        { status: 404 }
      );
    }

    // Check if expired
    if (sessionEntry.expiresAt < Date.now()) {
      sessionDataStore.delete(sessionId);
      return NextResponse.json(
        { error: 'Session data expired' },
        { status: 404 }
      );
    }

    // Remove from store after retrieval (one-time use)
    sessionDataStore.delete(sessionId);

    return NextResponse.json({ 
      success: true, 
      data: sessionEntry.data 
    });

  } catch (error) {
    console.error('Error retrieving session data:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve session data' },
      { status: 500 }
    );
  }
}
