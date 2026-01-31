'use client';

// Session storage keys
const SESSION_ID_KEY = 'songGift_sessionId';
const INTAKE_DATA_KEY = 'songGift_intakeData';
const NAVIGATION_STATE_KEY = 'songGift_navigationState';

/**
 * Generate a unique session ID for this browser tab
 * Format: sess_<timestamp>_<random>
 */
function generateSessionId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `sess_${timestamp}_${random}`;
}

/**
 * Get or create session ID for current tab
 * Uses sessionStorage to ensure tab isolation
 */
export function getSessionId(): string {
  if (typeof window === 'undefined') {
    // Server-side rendering - return empty string
    return '';
  }

  try {
    let sessionId = sessionStorage.getItem(SESSION_ID_KEY);
    
    if (!sessionId) {
      sessionId = generateSessionId();
      sessionStorage.setItem(SESSION_ID_KEY, sessionId);
    }
    
    return sessionId;
  } catch (error) {
    console.error('Error managing session ID:', error);
    // Fallback to memory-only session ID
    return generateSessionId();
  }
}

/**
 * Store data in sessionStorage with session scoping
 */
export function setSessionData(key: string, data: any): void {
  if (typeof window === 'undefined') return;

  try {
    const sessionId = getSessionId();
    const sessionKey = `${key}_${sessionId}`;
    sessionStorage.setItem(sessionKey, JSON.stringify(data));
  } catch (error) {
    console.error('Error storing session data:', error);
  }
}

/**
 * Retrieve data from sessionStorage with session scoping
 */
export function getSessionData<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;

  try {
    const sessionId = getSessionId();
    const sessionKey = `${key}_${sessionId}`;
    const stored = sessionStorage.getItem(sessionKey);
    
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error retrieving session data:', error);
  }
  
  return defaultValue;
}

/**
 * Clear all session data for current tab
 * Called after successful payment or when user wants fresh start
 */
export function clearSessionData(): void {
  if (typeof window === 'undefined') return;

  try {
    const sessionId = getSessionId();
    
    // Remove all session-scoped data
    const keysToRemove = [
      `${INTAKE_DATA_KEY}_${sessionId}`,
      `${NAVIGATION_STATE_KEY}_${sessionId}`,
      SESSION_ID_KEY
    ];
    
    keysToRemove.forEach(key => {
      sessionStorage.removeItem(key);
    });
    
    console.log('Session data cleared for session:', sessionId);
  } catch (error) {
    console.error('Error clearing session data:', error);
  }
}

/**
 * Get intake data storage key
 */
export function getIntakeDataKey(): string {
  return INTAKE_DATA_KEY;
}

/**
 * Get navigation state storage key
 */
export function getNavigationStateKey(): string {
  return NAVIGATION_STATE_KEY;
}

/**
 * Check if sessionStorage is available
 */
export function isSessionStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const testKey = '__sessionStorageTest__';
    sessionStorage.setItem(testKey, 'test');
    sessionStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}
