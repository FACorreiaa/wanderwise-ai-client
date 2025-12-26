import { createSignal, createMemo, Show, onMount, For, lazy } from "solid-js";
import { MapPin, Navigation, Loader2, AlertCircle, ChevronDown } from "lucide-solid";
import { useChatRPC } from "~/lib/hooks/useChatRPC";
import { POIDetailedInfo } from "~/lib/api/types";
const MapComponent = lazy(() => import("~/components/features/Map/Map"));
import SplitView from "@/components/layout/SplitView";
import { ActionToolbar } from "@/components/ui/ActionToolbar";
import FloatingChat from "~/components/features/Chat/FloatingChat";
import { Skeleton } from "~/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "~/ui/card";
import { Badge } from "~/ui/badge";
import FavoriteButton from "~/components/shared/FavoriteButton";
import { Button } from "~/ui/button";
import { useSelection, type SelectionItem } from "~/lib/hooks/useSelection";
import { SelectionToolbar } from "~/components/ui/SelectionToolbar";
import { exportPOIsToPDF } from "~/lib/utils/pdf-export";

// Distance options in kilometers
const DISTANCE_OPTIONS = [
  { value: 5, label: "5 km" },
  { value: 10, label: "10 km" },
  { value: 25, label: "25 km" },
  { value: 50, label: "50 km" },
];

interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export default function NearmePage() {
  const { state, startStream } = useChatRPC();

  const [userLocation, setUserLocation] = createSignal<UserLocation | null>(null);
  const [locationError, setLocationError] = createSignal<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = createSignal(false);
  const [selectedDistance, setSelectedDistance] = createSignal(10); // Default 10km
  const [showDistanceDropdown, setShowDistanceDropdown] = createSignal(false);

  // Selection state for POIs
  const selection = useSelection<SelectionItem>();

  // Get user's location using Geolocation API
  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    setIsLoadingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        setIsLoadingLocation(false);
        // Automatically start search after getting location
        searchNearby(position.coords.latitude, position.coords.longitude, selectedDistance());
      },
      (error) => {
        setIsLoadingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("Location permission denied. Please enable location access.");
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError("Location information unavailable.");
            break;
          case error.TIMEOUT:
            setLocationError("Location request timed out.");
            break;
          default:
            setLocationError("An unknown error occurred getting your location.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  // Search for nearby POIs
  const searchNearby = (lat: number, lon: number, distanceKm: number) => {
    const message = `Find places near me within ${distanceKm} kilometers. My location is at latitude ${lat.toFixed(6)} and longitude ${lon.toFixed(6)}. Show me restaurants, attractions, hotels, and activities nearby.`;

    startStream(message, "nearme", { latitude: lat, longitude: lon });
  };

  // Re-search with new distance
  const handleDistanceChange = (distance: number) => {
    setSelectedDistance(distance);
    setShowDistanceDropdown(false);
    const location = userLocation();
    if (location) {
      searchNearby(location.latitude, location.longitude, distance);
    }
  };

  // Request location on mount
  onMount(() => {
    requestLocation();
  });

  // Extract data from streamedData (same pattern as hotels/restaurants pages)
  const effectiveData = createMemo(() => state.streamedData);

  // Get all POIs from streamed data
  const allPois = createMemo((): POIDetailedInfo[] => {
    const data = effectiveData();
    if (!data) return [];

    const pois: POIDetailedInfo[] = [];

    // General POIs
    const generalPois = data.points_of_interest || data.general_pois || [];
    if (Array.isArray(generalPois)) {
      pois.push(
        ...generalPois.map((p: any) => ({
          ...p,
          category: p.category || "poi",
        })),
      );
    }

    // Restaurants
    const restaurants = data.restaurants || data.dining_response?.restaurants || [];
    if (Array.isArray(restaurants)) {
      pois.push(
        ...restaurants.map((r: any) => ({
          ...r,
          category: "restaurant",
        })),
      );
    }

    // Hotels
    const hotels = data.hotels || data.accommodation_response?.hotels || [];
    if (Array.isArray(hotels)) {
      pois.push(
        ...hotels.map((h: any) => ({
          ...h,
          category: "hotel",
        })),
      );
    }

    // Activities
    const activities = data.activities || data.activities_response?.activities || [];
    if (Array.isArray(activities)) {
      pois.push(
        ...activities.map((a: any) => ({
          ...a,
          category: "activity",
        })),
      );
    }

    return pois;
  });

  // Handlers
  const handleDownload = () => {
    const data = JSON.stringify({ pois: allPois(), location: userLocation() }, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nearme-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Places Near Me",
          text: `Found ${allPois().length} places nearby!`,
          url: window.location.href,
        })
        .catch(console.error);
    }
  };

  const handleBookmark = () => {
    console.log("Bookmark nearby results");
  };

  // Skeleton component
  const NearbyLoadingSkeleton = () => (
    <div class="space-y-4">
      <For each={[1, 2, 3, 4]}>
        {() => (
          <Card class="bg-white/80 dark:bg-gray-800/80">
            <CardHeader>
              <Skeleton class="h-6 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton class="h-4 w-full mb-2" />
              <Skeleton class="h-4 w-2/3" />
            </CardContent>
          </Card>
        )}
      </For>
    </div>
  );

  // Map Content
  const MapContent = (
    <div class="relative h-full w-full">
      <Show
        when={allPois().length > 0}
        fallback={
          <div class="h-full w-full flex items-center justify-center text-muted-foreground p-4 text-center">
            {isLoadingLocation() || state.isStreaming
              ? "Getting your location and finding nearby places..."
              : "Grant location access to find places near you"}
          </div>
        }
      >
        <MapComponent
          center={[userLocation()?.longitude || 0, userLocation()?.latitude || 0]}
          pointsOfInterest={allPois()}
          zoom={13}
        />
      </Show>

      {/* Floating Action Toolbar on Map */}
      <div class="absolute top-4 left-4 z-10">
        <ActionToolbar
          onDownload={handleDownload}
          onShare={handleShare}
          onBookmark={handleBookmark}
        />
      </div>
    </div>
  );

  // List Content
  const ListContent = (
    <div class="h-full overflow-y-auto p-4 md:p-6 bg-slate-50/50 dark:bg-slate-950/50 backdrop-blur-sm">
      <div class="max-w-3xl mx-auto pb-20">
        {/* Location Header */}
        <div class="mb-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-lg">
              <Navigation class="w-6 h-6" />
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Near Me</h1>
              <Show when={userLocation()}>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {userLocation()?.latitude.toFixed(4)}, {userLocation()?.longitude.toFixed(4)}
                </p>
              </Show>
            </div>
          </div>

          {/* Distance Selector */}
          <div class="flex items-center gap-4 mb-4">
            <span class="text-sm text-gray-600 dark:text-gray-400">Search radius:</span>
            <div class="relative">
              <button
                onClick={() => setShowDistanceDropdown(!showDistanceDropdown())}
                class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
              >
                <MapPin class="w-4 h-4 text-blue-500" />
                <span class="font-medium">{selectedDistance()} km</span>
                <ChevronDown class="w-4 h-4 text-gray-400" />
              </button>
              <Show when={showDistanceDropdown()}>
                <div class="absolute top-full left-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-xl z-20">
                  <For each={DISTANCE_OPTIONS}>
                    {(option) => (
                      <button
                        onClick={() => handleDistanceChange(option.value)}
                        class={`w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg ${
                          selectedDistance() === option.value
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {option.label}
                      </button>
                    )}
                  </For>
                </div>
              </Show>
            </div>
            <Show when={!userLocation() && !isLoadingLocation()}>
              <Button onClick={requestLocation} class="gap-2">
                <Navigation class="w-4 h-4" />
                Get My Location
              </Button>
            </Show>
          </div>
        </div>

        {/* Location Error */}
        <Show when={locationError()}>
          <div class="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-900/50 dark:text-amber-400 flex items-start gap-3">
            <AlertCircle class="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p class="font-medium">Location Access Required</p>
              <p class="text-sm opacity-90">{locationError()}</p>
              <button onClick={requestLocation} class="mt-2 text-sm underline hover:no-underline">
                Try again
              </button>
            </div>
          </div>
        </Show>

        {/* Loading State */}
        <Show when={isLoadingLocation()}>
          <div class="mb-6 p-6 rounded-xl bg-blue-50 border border-blue-200 dark:bg-blue-900/20 dark:border-blue-900/50 flex items-center gap-4">
            <Loader2 class="w-6 h-6 animate-spin text-blue-500" />
            <div>
              <p class="font-medium text-blue-700 dark:text-blue-400">Getting your location...</p>
              <p class="text-sm text-blue-600 dark:text-blue-300 opacity-80">
                This may take a few seconds
              </p>
            </div>
          </div>
        </Show>

        {/* Streaming State */}
        <Show when={state.isStreaming && !allPois().length}>
          <NearbyLoadingSkeleton />
        </Show>

        {/* Error State */}
        <Show when={state.error}>
          <div class="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-400">
            <p class="font-bold">Unable to find nearby places</p>
            <p class="text-sm opacity-90">{state.error}</p>
          </div>
        </Show>

        {/* Results */}
        <Show when={allPois().length > 0}>
          <div class="mb-8">
            <h3 class="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
              <span class="text-2xl">📍</span> Nearby Places ({allPois().length})
            </h3>
            <div class="space-y-4">
              <For each={allPois()}>
                {(item) => {
                  const itemForSelection: SelectionItem = {
                    id: item.name,
                    name: item.name,
                    category: item.category,
                    description: item.description_poi || item.description,
                    address: item.address,
                    latitude: item.latitude,
                    longitude: item.longitude,
                    rating: item.rating,
                  };
                  return (
                    <Card
                      class={`hover:shadow-md transition-all cursor-pointer bg-white/80 dark:bg-gray-800/80 backdrop-blur ${selection.isSelected(item.name) ? "ring-2 ring-blue-500" : ""}`}
                    >
                      <CardHeader>
                        <div class="flex justify-between items-start">
                          <div class="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={selection.isSelected(item.name)}
                              onChange={() => selection.toggleSelection(itemForSelection)}
                              class="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 flex-shrink-0"
                            />
                            <CardTitle class="text-lg">{item.name}</CardTitle>
                          </div>
                          <div class="flex items-center gap-2">
                            <FavoriteButton
                              item={{
                                id: item.name,
                                name: item.name,
                                contentType: "poi",
                                description: item.description_poi || item.description || "",
                              }}
                              size="sm"
                            />
                            <Badge variant="secondary">{item.category}</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p class="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-2">
                          {item.description_poi || item.description}
                        </p>
                        <div class="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                          <Show when={item.distance}>
                            <span class="flex items-center gap-1">
                              <MapPin class="w-3 h-3" />
                              {typeof item.distance === "number"
                                ? `${(item.distance / 1000).toFixed(1)} km`
                                : item.distance}
                            </span>
                          </Show>
                          <Show when={item.address}>
                            <span class="truncate">{item.address}</span>
                          </Show>
                        </div>
                      </CardContent>
                    </Card>
                  );
                }}
              </For>
            </div>
          </div>
        </Show>

        {/* Empty State */}
        <Show
          when={
            !isLoadingLocation() && !state.isStreaming && userLocation() && allPois().length === 0
          }
        >
          <div class="text-center py-12 text-gray-500 dark:text-gray-400">
            <MapPin class="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p class="text-lg font-medium">No places found nearby</p>
            <p class="text-sm">Try expanding your search radius</p>
          </div>
        </Show>
      </div>
    </div>
  );

  return (
    <>
      <SplitView mapContent={MapContent} listContent={ListContent} />
      <FloatingChat />

      {/* Selection Toolbar */}
      <SelectionToolbar
        count={selection.count()}
        onExport={() => exportPOIsToPDF(selection.getSelectedItems())}
        onClear={() => selection.clearSelection()}
        onSelectAll={() => {
          const items = allPois().map((item) => ({
            id: item.name,
            name: item.name,
            category: item.category,
            description: item.description_poi || item.description,
            address: item.address,
            latitude: item.latitude,
            longitude: item.longitude,
            rating: item.rating,
          }));
          selection.selectAll(items);
        }}
      />
    </>
  );
}
