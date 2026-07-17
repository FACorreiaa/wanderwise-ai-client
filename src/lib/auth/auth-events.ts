// Lightweight pub/sub so non-component modules (e.g. the Connect transport
// interceptor) can signal that the session has expired without reaching for
// window.location. AuthProvider subscribes and performs a soft, SPA-friendly
// logout (clear tokens + router navigate) instead of a full page reload that
// wipes in-memory state.

const AUTH_EXPIRED_EVENT = "loci:auth-expired";

/**
 * Signal that the current session is no longer valid (refresh genuinely failed).
 * Safe to call from any module; no-op during SSR.
 */
export function notifyAuthExpired(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT));
}

/**
 * Subscribe to session-expired notifications. Returns an unsubscribe function.
 */
export function onAuthExpired(handler: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const listener = () => handler();
  window.addEventListener(AUTH_EXPIRED_EVENT, listener);
  return () => window.removeEventListener(AUTH_EXPIRED_EVENT, listener);
}
