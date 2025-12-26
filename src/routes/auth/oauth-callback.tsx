import { Component, onMount } from "solid-js";

/**
 * OAuth callback page that handles redirects from OAuth providers.
 * This page receives the authorization code and passes it back to the parent window.
 */
const OAuthCallback: Component = () => {
  onMount(() => {
    // Get OAuth response from URL
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");
    const error = params.get("error");
    const errorDescription = params.get("error_description");

    // Send message to parent window (opener)
    if (window.opener) {
      window.opener.postMessage(
        {
          type: "oauth-callback",
          code,
          state,
          error: error || errorDescription,
        },
        window.location.origin,
      );
    } else {
      // If no opener (user navigated directly), redirect to login
      window.location.href = "/auth/signin";
    }
  });

  return (
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4" />
        <p class="text-lg text-white">Processing authentication...</p>
        <p class="text-sm text-slate-400 mt-2">This window will close automatically.</p>
      </div>
    </div>
  );
};

export default OAuthCallback;
