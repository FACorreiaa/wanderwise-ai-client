import { A } from "@solidjs/router";
import { Component, createSignal, onMount } from "solid-js";
import { ServerCrash, RefreshCw, Home, Wifi, AlertTriangle, Compass } from 'lucide-solid';
import { Button } from "~/ui/button";

const ServerDownPage: Component = () => {
  const [isRetrying, setIsRetrying] = createSignal(false);
  const [lastAttempt, setLastAttempt] = createSignal<Date | null>(null);

  const handleRetry = async () => {
    setIsRetrying(true);
    setLastAttempt(new Date());

    try {
      // Test connection to the server
      const response = await fetch('/api/v1/health', {
        method: 'GET',
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });

      if (response.ok) {
        // Server is back up, reload the page
        window.location.reload();
      } else {
        throw new Error('Server still unavailable');
      }
    } catch (error) {
      console.log('Server still down:', error);
      // Keep the retry button enabled for another attempt
    } finally {
      setIsRetrying(false);
    }
  };

  // Auto-retry every 30 seconds
  onMount(() => {
    const interval = setInterval(() => {
      if (!isRetrying()) {
        handleRetry();
      }
    }, 30000);

    return () => clearInterval(interval);
  });

  return (
    <div class="min-h-screen flex items-center justify-center px-4 py-8">
      <div class="text-center max-w-lg mx-auto glass-panel gradient-border rounded-2xl p-8 shadow-xl">
        {/* Animated Icon */}
        <div class="mb-8 relative">
          <div class="w-24 h-24 mx-auto bg-orange-500 rounded-full flex items-center justify-center animate-pulse shadow-[0_18px_38px_rgba(249,115,22,0.25)] ring-4 ring-white/60 dark:ring-slate-800">
            <ServerCrash class="w-12 h-12 text-white" />
          </div>
          <div class="absolute -top-1 -right-1 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center animate-bounce shadow-lg">
            <AlertTriangle class="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Error Message */}
        <h1 class="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Server Unavailable
        </h1>
        <h2 class="text-xl sm:text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Connection Refused
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
          We can't reach our travel servers right now. This could be due to server maintenance,
          network issues, or the server being temporarily down.
        </p>

        {/* Status Information */}
        <div class="mb-8 p-4 glass-panel gradient-border rounded-lg text-left border-0">
          <div class="flex items-center justify-center gap-2 mb-3">
            <Wifi class="w-5 h-5 text-red-500" />
            <span class="font-medium text-gray-900 dark:text-white">Connection Status</span>
          </div>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">Server:</span>
              <span class="text-red-600 dark:text-red-400 font-medium">Unreachable</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">Last Check:</span>
              <span class="text-gray-900 dark:text-white">
                {lastAttempt() ? lastAttempt()!.toLocaleTimeString() : 'Never'}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">Auto-retry:</span>
              <span class="text-green-600 dark:text-green-400">Every 30s</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div class="space-y-3 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center mb-8">
          <Button
            onClick={handleRetry}
            disabled={isRetrying()}
            class="w-full sm:w-auto gap-2"
          >
            <RefreshCw class={`w-4 h-4 ${isRetrying() ? 'animate-spin' : ''}`} />
            {isRetrying() ? 'Checking...' : 'Try Again'}
          </Button>
          <Button
            variant="outline"
            as={A}
            href="/"
            class="w-full sm:w-auto gap-2"
          >
            <Home class="w-4 h-4" />
            Back to Home
          </Button>
        </div>

        {/* Offline Features */}
        <div class="mb-8 p-4 glass-panel gradient-border rounded-lg text-left">
          <h3 class="font-semibold text-slate-900 dark:text-white mb-3">
            What you can do while we're down:
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div class="flex items-center gap-2 text-slate-700 dark:text-slate-200">
              <span class="w-2 h-2 bg-blue-500 rounded-full" />
              Browse cached content
            </div>
            <div class="flex items-center gap-2 text-slate-700 dark:text-slate-200">
              <span class="w-2 h-2 bg-blue-500 rounded-full" />
              View saved favorites
            </div>
            <div class="flex items-center gap-2 text-slate-700 dark:text-slate-200">
              <span class="w-2 h-2 bg-blue-500 rounded-full" />
              Read downloaded itineraries
            </div>
            <div class="flex items-center gap-2 text-slate-700 dark:text-slate-200">
              <span class="w-2 h-2 bg-blue-500 rounded-full" />
              Plan future trips
            </div>
          </div>
        </div>

        {/* Quick Navigation */}
        <div class="pt-6 border-t border-gray-200 dark:border-gray-700">
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Try these offline-friendly features:
          </p>
          <div class="flex flex-wrap justify-center gap-3">
            <A
              href="/favorites"
              class="inline-flex items-center gap-1 px-3 py-2 text-xs bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              ❤️ Favorites
            </A>
            <A
              href="/lists"
              class="inline-flex items-center gap-1 px-3 py-2 text-xs bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              📝 Lists
            </A>
            <A
              href="/profile"
              class="inline-flex items-center gap-1 px-3 py-2 text-xs bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              👤 Profile
            </A>
          </div>
        </div>

        {/* Travel Tip */}
        <div class="mt-8 p-4 glass-panel gradient-border rounded-lg text-left">
          <div class="flex items-center justify-center gap-2 mb-2">
            <Compass class="w-4 h-4 text-orange-600 dark:text-orange-400" />
            <span class="text-sm font-medium text-orange-900 dark:text-orange-100">Travel Tip</span>
          </div>
          <p class="text-xs text-slate-700 dark:text-slate-200">
            Server downtime is like weather delays - they happen! Use this time to review your saved places
            or plan your next adventure. We'll be back online soon! ✈️
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServerDownPage;
