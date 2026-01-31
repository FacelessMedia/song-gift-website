'use client';

import { useEffect } from 'react';
import { getSessionId } from '@/utils/sessionManager';

/**
 * SessionInitializer component
 * Ensures session ID is created on first app load
 * This component should be included in the root layout
 */
export function SessionInitializer() {
  useEffect(() => {
    // Initialize session ID on app load
    // This will create a new session ID if one doesn't exist
    // or reuse existing one if it does
    getSessionId();
  }, []);

  // This component renders nothing - it's just for initialization
  return null;
}
