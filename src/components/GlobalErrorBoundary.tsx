// Global Error Boundary component for catching unhandled errors
import { ErrorBoundary as SolidErrorBoundary, Component, JSX, createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";

interface ErrorBoundaryProps {
  children: JSX.Element;
}

interface ErrorFallbackProps {
  error: Error;
  reset: () => void;
}

const ErrorFallback: Component<ErrorFallbackProps> = (props) => {
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = createSignal(false);

  const handleGoHome = () => {
    props.reset();
    navigate("/");
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div class="max-w-md w-full bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl text-center">
        {/* Error Icon */}
        <div class="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
          <svg class="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h1 class="text-2xl font-bold text-white mb-2">Something went wrong</h1>
        <p class="text-slate-300 mb-6">
          We encountered an unexpected error. Don't worry, your data is safe.
        </p>

        {/* Action Buttons */}
        <div class="flex flex-col gap-3 mb-6">
          <button
            onClick={handleRefresh}
            class="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-xl transition-colors"
          >
            Refresh Page
          </button>
          <button
            onClick={handleGoHome}
            class="w-full py-3 px-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-colors border border-white/20"
          >
            Go to Home
          </button>
        </div>

        {/* Error Details Toggle */}
        <button
          onClick={() => setShowDetails(!showDetails())}
          class="text-sm text-slate-400 hover:text-slate-300 underline underline-offset-2"
        >
          {showDetails() ? "Hide" : "Show"} technical details
        </button>

        {showDetails() && (
          <div class="mt-4 p-4 bg-black/30 rounded-lg text-left overflow-auto max-h-48">
            <p class="text-red-400 font-mono text-xs break-all">
              {props.error.name}: {props.error.message}
            </p>
            {props.error.stack && (
              <pre class="text-slate-500 font-mono text-xs mt-2 whitespace-pre-wrap break-all">
                {props.error.stack}
              </pre>
            )}
          </div>
        )}

        {/* Support Link */}
        <p class="mt-6 text-sm text-slate-500">
          If this keeps happening, please{" "}
          <a
            href="mailto:support@loci.app"
            class="text-emerald-400 hover:text-emerald-300 underline"
          >
            contact support
          </a>
        </p>
      </div>
    </div>
  );
};

/**
 * Global Error Boundary wrapper that catches unhandled errors
 * and displays a user-friendly error page.
 */
export const GlobalErrorBoundary: Component<ErrorBoundaryProps> = (props) => {
  return (
    <SolidErrorBoundary
      fallback={(error, reset) => {
        // Log error for debugging
        console.error("GlobalErrorBoundary caught error:", error);

        // Report to error tracking service (e.g., Sentry) here
        // if (typeof window !== 'undefined' && window.Sentry) {
        //   window.Sentry.captureException(error);
        // }

        return <ErrorFallback error={error} reset={reset} />;
      }}
    >
      {props.children}
    </SolidErrorBoundary>
  );
};

export default GlobalErrorBoundary;
