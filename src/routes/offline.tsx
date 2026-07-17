import { Component } from "solid-js";
import { Button } from "@/ui/button";
import { Wifi, RefreshCw } from "lucide-solid";

const OfflinePage: Component = () => {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div class="min-h-screen flex items-center justify-center px-4 bg-background">
      <div class="text-center max-w-md mx-auto px-6 glass-panel gradient-border rounded-2xl py-8 shadow-xl">
        <div class="w-20 h-20 mx-auto mb-6 bg-primary rounded-full flex items-center justify-center shadow-lg ring-4 ring-border">
          <Wifi class="w-10 h-10 text-primary-foreground" />
        </div>

        <h1 class="text-2xl font-bold text-foreground mb-4">You're Offline</h1>

        <p class="text-muted-foreground mb-8 leading-relaxed">
          It looks like you've lost your internet connection. Don't worry - you can still browse
          your saved places and itineraries while offline.
        </p>

        <div class="space-y-4">
          <Button onClick={handleRetry} class="w-full py-3 font-semibold flex items-center justify-center gap-2">
            <RefreshCw class="w-5 h-5" />
            Try Again
          </Button>

          <div class="text-sm text-muted-foreground">
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