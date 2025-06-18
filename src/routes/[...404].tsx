import { A } from "@solidjs/router";
import { MapPin, Home, Search, Compass, ArrowLeft } from 'lucide-solid';

export default function NotFound() {
  return (
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-8">
      <div class="text-center max-w-md mx-auto">
        {/* Animated Icon */}
        <div class="mb-8 relative">
          <div class="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
            <MapPin class="w-12 h-12 text-white" />
          </div>
          <div class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            <span class="text-white text-xs font-bold">!</span>
          </div>
        </div>

        {/* Error Message */}
        <h1 class="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          404
        </h1>
        <h2 class="text-xl sm:text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Destination Not Found
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
          Looks like this location doesn't exist on our travel map. Let's get you back on track to discover amazing places!
        </p>

        {/* Action Buttons */}
        <div class="space-y-3 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <A 
            href="/" 
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Home class="w-4 h-4" />
            Back to Home
          </A>
          <A 
            href="/chat" 
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium"
          >
            <Search class="w-4 h-4" />
            Start Planning
          </A>
        </div>

        {/* Quick Navigation */}
        <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Or explore these popular destinations:
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
        <div class="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div class="flex items-center justify-center gap-2 mb-2">
            <Compass class="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span class="text-sm font-medium text-blue-900 dark:text-blue-100">Travel Tip</span>
          </div>
          <p class="text-xs text-blue-800 dark:text-blue-200">
            Lost pages are like hidden destinations - sometimes the best adventures happen when you're off the beaten path!
          </p>
        </div>
      </div>
    </div>
  );
}
