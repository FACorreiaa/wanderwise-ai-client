/**
 * Streaming State Manager
 *
 * Manages streaming data across page navigation by storing partial results
 * in sessionStorage and providing reactive access to streaming state.
 */

export interface StreamingSession {
  sessionId: string;
  domain: string;
  city?: string;
  isComplete: boolean;
  data: any;
  startedAt: number;
  completedAt?: number;
}

const STREAMING_SESSION_KEY = 'active_streaming_session';
const SESSION_TIMEOUT = 5 * 60 * 1000; // 5 minutes

/**
 * Store partial streaming data that can survive navigation
 */
export function setStreamingSession(session: Partial<StreamingSession>) {
  const existing = getStreamingSession();
  const updated = {
    ...existing,
    ...session,
    startedAt: existing?.startedAt || Date.now(),
  };
  sessionStorage.setItem(STREAMING_SESSION_KEY, JSON.stringify(updated));
  console.log('📦 Stored streaming session:', updated);
}

/**
 * Get current streaming session (even if incomplete)
 */
export function getStreamingSession(): StreamingSession | null {
  try {
    const stored = sessionStorage.getItem(STREAMING_SESSION_KEY);
    if (!stored) return null;

    const session = JSON.parse(stored) as StreamingSession;

    // Check if session is expired
    const age = Date.now() - session.startedAt;
    if (age > SESSION_TIMEOUT) {
      console.warn('⏰ Streaming session expired, clearing...');
      clearStreamingSession();
      return null;
    }

    return session;
  } catch (error) {
    console.error('Error reading streaming session:', error);
    return null;
  }
}

/**
 * Clear streaming session
 */
export function clearStreamingSession() {
  sessionStorage.removeItem(STREAMING_SESSION_KEY);
  console.log('🧹 Cleared streaming session');
}

/**
 * Mark streaming as complete
 */
export function markStreamingComplete() {
  const session = getStreamingSession();
  if (session) {
    setStreamingSession({
      ...session,
      isComplete: true,
      completedAt: Date.now(),
    });
  }
}

/**
 * Check if we have an active streaming session
 */
export function hasActiveStreamingSession(): boolean {
  const session = getStreamingSession();
  return session !== null && !session.isComplete;
}

/**
 * Update streaming data incrementally
 */
export function updateStreamingData(partialData: any) {
  const session = getStreamingSession();
  if (!session) {
    console.warn('No active streaming session to update');
    return;
  }

  // Check if this is an incremental update (adding to itinerary) vs a full update
  const isIncrementalUpdate =
    partialData.itinerary_response &&
    !partialData.general_city_data;

  const mergedData = {
    ...session.data,
    ...partialData,
    // Only update general points_of_interest for FULL updates, not incremental
    points_of_interest: !isIncrementalUpdate && partialData.points_of_interest
      ? partialData.points_of_interest
      : session.data?.points_of_interest,
    // Always update itinerary_response
    itinerary_response: {
      ...session.data?.itinerary_response,
      ...partialData.itinerary_response,
    },
  };

  setStreamingSession({
    ...session,
    data: mergedData,
  });
}
