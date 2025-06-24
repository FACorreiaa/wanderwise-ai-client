import { Component, createSignal, JSX, Show } from "solid-js";
import { A } from "@solidjs/router";
import { AlertTriangle, RefreshCw, Home, ServerCrash } from 'lucide-solid';
import { APIError } from '../lib/api/shared';

interface ErrorBoundaryProps {
  children: JSX.Element;
  fallback?: (error: Error, reset: () => void) => JSX.Element;
}

interface ErrorInfo {
  error: Error;
  timestamp: Date;
  retryCount: number;
}

export const ErrorBoundary: Component<ErrorBoundaryProps> = (props) => {
  const [errorInfo, setErrorInfo] = createSignal<ErrorInfo | null>(null);

  const handleError = (error: Error) => {
    console.error('🚨 ErrorBoundary caught error:', error);
    setErrorInfo({
      error,
      timestamp: new Date(),
      retryCount: errorInfo()?.retryCount ?? 0
    });
  };

  const reset = () => {
    setErrorInfo(null);
  };

  const retry = () => {
    const current = errorInfo();
    if (current) {
      setErrorInfo({
        ...current,
        retryCount: current.retryCount + 1
      });
    }
    reset();
    // Optionally refresh the page for a clean state
    window.location.reload();
  };

  // Custom error boundary using SolidJS patterns
  const ErrorDisplay: Component = () => {
    const error = errorInfo()?.error;
    
    if (!error) return <>{props.children}</>;

    // Use custom fallback if provided
    if (props.fallback) {
      return <>{props.fallback(error, reset)}</>;
    }

    // Check if it's a connection error
    const isConnectionError = error instanceof APIError && error.code === 'CONNECTION_REFUSED';
    const isNetworkError = error instanceof APIError && error.code === 'NETWORK_ERROR';

    return (
      <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-8">
        <div class="text-center max-w-md mx-auto">
          {/* Dynamic Icon based on error type */}
          <div class="mb-8 relative">
            <div class={`w-24 h-24 mx-auto rounded-full flex items-center justify-center animate-pulse ${
              isConnectionError ? 'bg-gradient-to-br from-red-500 to-orange-600' : 
              isNetworkError ? 'bg-gradient-to-br from-yellow-500 to-orange-500' :
              'bg-gradient-to-br from-red-500 to-pink-600'
            }`}>
              <Show
                when={isConnectionError}
                fallback={
                  <Show
                    when={isNetworkError}
                    fallback={<AlertTriangle class="w-12 h-12 text-white" />}
                  >
                    <ServerCrash class="w-12 h-12 text-white" />
                  </Show>
                }
              >
                <ServerCrash class="w-12 h-12 text-white" />
              </Show>
            </div>
          </div>

          {/* Error Message */}
          <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {isConnectionError ? 'Server Unavailable' : 
             isNetworkError ? 'Network Error' : 
             'Something went wrong'}
          </h1>
          
          <p class="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
            {isConnectionError ? 
              'We can\'t reach our servers right now. They might be down for maintenance or experiencing issues.' :
             isNetworkError ?
              'There seems to be a problem with your network connection. Please check your internet connection and try again.' :
              'An unexpected error occurred. Our team has been notified and is working on a fix.'}
          </p>

          {/* Error Details (in development) */}
          <Show when={import.meta.env.DEV}>
            <details class="mb-6 text-left">
              <summary class="cursor-pointer text-sm text-gray-500 dark:text-gray-400 mb-2">
                Error Details (dev only)
              </summary>
              <div class="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs font-mono text-gray-700 dark:text-gray-300 overflow-auto max-h-32">
                <div class="mb-2">
                  <strong>Message:</strong> {error.message}
                </div>
                <div class="mb-2">
                  <strong>Type:</strong> {error.constructor.name}
                </div>
                <Show when={error instanceof APIError}>
                  <div class="mb-2">
                    <strong>Status:</strong> {(error as APIError).status}
                  </div>
                  <div class="mb-2">
                    <strong>Code:</strong> {(error as APIError).code}
                  </div>
                </Show>
                <div>
                  <strong>Retry Count:</strong> {errorInfo()?.retryCount ?? 0}
                </div>
              </div>
            </details>
          </Show>

          {/* Action Buttons */}
          <div class="space-y-3 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center mb-8">
            <button 
              onClick={retry}
              class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <RefreshCw class="w-4 h-4" />
              Try Again
            </button>
            <A 
              href="/" 
              class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              <Home class="w-4 h-4" />
              Back to Home
            </A>
          </div>

          {/* Helpful Links for specific errors */}
          <Show when={isConnectionError}>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              <p class="mb-2">While our servers are down, you can still:</p>
              <div class="flex flex-wrap justify-center gap-2">
                <A href="/favorites" class="text-blue-600 hover:text-blue-700">View Favorites</A>
                <span>•</span>
                <A href="/lists" class="text-blue-600 hover:text-blue-700">Browse Lists</A>
                <span>•</span>
                <A href="/profile" class="text-blue-600 hover:text-blue-700">Edit Profile</A>
              </div>
            </div>
          </Show>
        </div>
      </div>
    );
  };

  // Handle errors in child components
  return (
    <Show when={!errorInfo()} fallback={<ErrorDisplay />}>
      <div onError={handleError}>
        {props.children}
      </div>
    </Show>
  );
};

export default ErrorBoundary;