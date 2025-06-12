import { Component } from "solid-js";
import { Button } from "@/ui/button";
import { Wifi, RefreshCw } from "lucide-solid";

const OfflinePage: Component = () => {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 via-purple-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div class="text-center max-w-md mx-auto px-6">
        <div class="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <Wifi class="w-10 h-10 text-white" />
        </div>
        
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          You're Offline
        </h1>
        
        <p class="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
          It looks like you've lost your internet connection. Don't worry - you can still browse your saved places and itineraries while offline.
        </p>
        
        <div class="space-y-4">
          <Button 
            onClick={handleRetry}
            class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw class="w-5 h-5" />
            Try Again
          </Button>
          
          <div class="text-sm text-gray-500 dark:text-gray-400">
            <p>You can still access:</p>
            <ul class="mt-2 space-y-1">
              <li>• Your saved favorites</li>
              <li>• Downloaded itineraries</li>
              <li>• Cached places and reviews</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfflinePage;