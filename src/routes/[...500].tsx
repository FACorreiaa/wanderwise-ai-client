import { A } from "@solidjs/router";
import { AlertTriangle, Home, RotateCcw, Compass, RefreshCw } from 'lucide-solid';

export default function ServerError() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div class="min-h-screen flex items-center justify-center px-4 py-8">
      <div class="text-center max-w-md mx-auto glass-panel gradient-border rounded-2xl p-8 shadow-xl">
        {/* Animated Icon */}
        <div class="mb-8 relative">
          <div class="w-24 h-24 mx-auto bg-orange-500 rounded-full flex items-center justify-center animate-pulse shadow-[0_18px_38px_rgba(249,115,22,0.25)] ring-4 ring-white/60 dark:ring-slate-800">
            <AlertTriangle class="w-12 h-12 text-white" />
          </div>
          <div class="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
            <span class="text-white text-xs font-bold">!</span>
          </div>
        </div>

        {/* Error Message */}
        <h1 class="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          500
        </h1>
        <h2 class="text-xl sm:text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Server Error
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
          Our travel servers are experiencing some turbulence. Don't worry - our team is working to get everything back on track!
        </p>

        {/* Action Buttons */}
        <div class="space-y-3 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <button 
            onClick={handleRefresh}
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium shadow-[0_14px_32px_rgba(249,115,22,0.25)] border border-white/30 dark:border-slate-800/60"
          >
            <RefreshCw class="w-4 h-4" />
            Try Again
          </button>
          <A 
            href="/" 
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/70 dark:bg-slate-900/60 text-slate-900 dark:text-white rounded-lg hover:bg-white/90 dark:hover:bg-slate-800/80 transition-colors font-medium border border-white/40 dark:border-slate-800/70"
          >
            <Home class="w-4 h-4" />
            Back to Home
          </A>
        </div>

        {/* Quick Navigation */}
        <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
            While we fix things, try these features:
          </p>
          <div class="flex flex-wrap justify-center gap-3">
            <A 
              href="/hotels" 
              class="inline-flex items-center gap-1 px-3 py-2 text-xs bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              🏨 Hotels
            </A>
            <A 
              href="/restaurants" 
              class="inline-flex items-center gap-1 px-3 py-2 text-xs bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              🍽️ Restaurants
            </A>
            <A 
              href="/activities" 
              class="inline-flex items-center gap-1 px-3 py-2 text-xs bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              🎯 Activities
            </A>
          </div>
        </div>

        {/* Fun Travel Tip */}
        <div class="mt-8 p-4 glass-panel gradient-border rounded-lg text-left">
          <div class="flex items-center justify-center gap-2 mb-2">
            <Compass class="w-4 h-4 text-orange-600 dark:text-orange-400" />
            <span class="text-sm font-medium text-orange-900 dark:text-orange-100">Travel Tip</span>
          </div>
          <p class="text-xs text-slate-700 dark:text-slate-200">
            Even the best travel plans hit unexpected delays. Sometimes the best stories come from the unplanned moments!
          </p>
        </div>
      </div>
    </div>
  );
}
