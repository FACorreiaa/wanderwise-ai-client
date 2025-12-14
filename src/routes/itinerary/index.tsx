import { createSignal, createMemo, Show, onMount, lazy } from "solid-js";
import { useSearchParams } from "@solidjs/router";
import { useStreamedRpc } from "@/lib/hooks/useStreamedRpc";
import ItineraryResults from "@/components/results/ItineraryResults";
const MapComponent = lazy(() => import("@/components/features/Map/Map"));
import SplitView from "@/components/layout/SplitView";
import { CityInfoHeader } from "@/components/ui/CityInfoHeader";
import { ActionToolbar } from "@/components/ui/ActionToolbar";
import FloatingChat from "@/components/features/Chat/FloatingChat";
import { Skeleton } from "@/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/ui/card";

export default function ItineraryPage() {
  const [searchParams] = useSearchParams();
  const [message] = createSignal(
    (searchParams.message as string) || "Show me an itinerary"
  );
  const [cityName] = createSignal((searchParams.cityName as string) || "London");
  const [profileId] = createSignal((searchParams.profileId as string) || "");

  const { store, connect, setStore } = useStreamedRpc(message, cityName, profileId);

  // Local favorites state
  const [favorites, setFavorites] = createSignal<string[]>([]);

  // Helper to normalize stored data - flattens nested itinerary_response structure
  const normalizeStoredData = (data: any): any => {
    if (!data) return null;

    // Check if data is wrapped in itinerary_response that contains the actual payload
    // Server sometimes returns: { itinerary_response: { general_city_data, points_of_interest, itinerary_response, session_id } }
    if (data.itinerary_response &&
      (data.itinerary_response.general_city_data || data.itinerary_response.points_of_interest)) {
      const inner = data.itinerary_response;
      return {
        general_city_data: inner.general_city_data,
        points_of_interest: inner.points_of_interest,
        itinerary_response: inner.itinerary_response,
        session_id: inner.session_id || data.session_id,
        // Preserve any other top-level fields
        hotels: data.hotels || inner.hotels,
        restaurants: data.restaurants || inner.restaurants,
        activities: data.activities || inner.activities,
      };
    }

    return data;
  };

  // Connect on mount - but only if we don't already have data from navigation
  onMount(() => {
    const sessionIdFromUrl = searchParams.sessionId as string;
    const streaming = searchParams.streaming === 'true';
    const domain = searchParams.domain as string;

    console.log('🔍 Itinerary page mount - checking params:', { sessionIdFromUrl, streaming, domain });

    // If we have a sessionId in the URL, we came from navigation (chat page or deep link)
    // In this case, DON'T start a new connection - the FloatingChat will handle updates
    if (sessionIdFromUrl) {
      console.log('📍 SessionId found in URL, attempting to restore data...');

      // Try to restore data from session storage
      const completedSession = sessionStorage.getItem('completedStreamingSession');
      if (completedSession) {
        try {
          const parsed = JSON.parse(completedSession);
          const parsedData = parsed.data || parsed;
          if (parsedData && (parsed.sessionId === sessionIdFromUrl || parsedData.session_id === sessionIdFromUrl)) {
            console.log('✅ Found completed streaming session data, restoring...');
            const normalizedData = normalizeStoredData(parsedData);
            console.log('📦 Normalized data:', normalizedData);
            setStore('data', normalizedData);
            return;
          }
        } catch (e) {
          console.warn('Failed to parse completed streaming session:', e);
        }
      }

      // Check active streaming session
      const activeSession = sessionStorage.getItem('active_streaming_session');
      if (activeSession) {
        try {
          const parsed = JSON.parse(activeSession);
          if (parsed.sessionId === sessionIdFromUrl && parsed.data) {
            console.log('✅ Found active streaming session data, restoring...');
            const normalizedData = normalizeStoredData(parsed.data);
            console.log('📦 Normalized data:', normalizedData);
            setStore('data', normalizedData);
            return;
          }
        } catch (e) {
          console.warn('Failed to parse active streaming session:', e);
        }
      }

      // No data found but we have sessionId - data might still be streaming
      // DON'T start a new connection - FloatingChat will handle updates via useChatSession
      console.log('⏳ SessionId present but no cached data yet - waiting for streaming data via FloatingChat...');
      return;
    }

    // No sessionId in URL - this is a fresh page load, start new connection
    console.log('🆕 Fresh page load (no sessionId), starting new streaming connection...');
    connect();
  });

  const itineraryData = createMemo(() => store.data?.itinerary_response);
  const cityData = createMemo(() => store.data?.general_city_data);
  const pointsOfInterest = createMemo(() => store.data?.points_of_interest || []);

  // Aggregate all POIs for the map
  const allPois = createMemo(() => {
    const itineraryPois = itineraryData()?.points_of_interest || [];
    const generalPois = pointsOfInterest();

    const poiMap = new Map<string, any>();

    [...itineraryPois, ...generalPois].forEach((poi) => {
      if (poi && poi.name) {
        // Normalize coordinates and ensure ID exists
        const lat = typeof poi.latitude === 'string' ? parseFloat(poi.latitude) : poi.latitude;
        const lng = typeof poi.longitude === 'string' ? parseFloat(poi.longitude) : poi.longitude;

        poiMap.set(poi.name, {
          ...poi,
          id: poi.name, // Use name as ID since it's unique enough for display
          latitude: lat || 0,
          longitude: lng || 0
        });
      }
    });

    return Array.from(poiMap.values());
  });

  const handleDownload = () => {
    const data = JSON.stringify(store.data, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `itinerary-${cityName()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Itinerary for ${cityName()}`,
        text: `Check out this itinerary for ${cityName()}!`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      console.log("Share API not supported");
    }
  };

  const handleBookmark = () => {
    // Implement bookmark logic here - saves the full itinerary to user's lists
    console.log("Bookmarked current itinerary");
  };

  const handleItemFavorite = (poi: any) => {
    const name = poi.name;
    setFavorites(prev =>
      prev.includes(name)
        ? prev.filter(n => n !== name)
        : [...prev, name]
    );
    console.log(`Toggled favorite for: ${name}`);
  };

  // Map Content
  const MapContent = (
    <div class="h-full w-full bg-slate-100 dark:bg-slate-900 relative">
      <Show when={allPois().length > 0} fallback={
        <div class="h-full w-full flex items-center justify-center text-muted-foreground p-4 text-center">
          {store.isLoading ? "Loading map data..." : "No items to display on map"}
        </div>
      }>
        <MapComponent
          center={[
            (allPois()[0]?.longitude as number) || 0,
            (allPois()[0]?.latitude as number) || 0
          ]}
          pointsOfInterest={allPois()}
          zoom={12}
        />
      </Show>

      {/* Floating Action Toolbar on Map (Desktop only maybe? No, let's put it on top of map) */}
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
      <div class="max-w-3xl mx-auto pb-20"> {/* pb-20 for FAB space */}
        <CityInfoHeader cityData={cityData()} isLoading={store.isLoading && !cityData()} />

        <Show when={store.error}>
          <div class="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-400">
            <p class="font-bold">Unable to load itinerary</p>
            <p class="text-sm opacity-90">{store.error?.message}</p>
          </div>
        </Show>

        <Show when={store.isLoading && !store.data}>
          <ItinerarySkeleton />
        </Show>

        {/* Display Generic Points of Interest first if available */}
        <Show when={pointsOfInterest().length > 0}>
          <div class="mb-8">
            <h3 class="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
              <span class="text-2xl">📍</span> Points of Interest
            </h3>
            <ItineraryResults
              pois={pointsOfInterest()}
              showToggle={true}
              initialLimit={3}
              onFavoriteClick={handleItemFavorite}
              favorites={favorites()}
            />
          </div>
        </Show>

        {/* Display Custom Itinerary */}
        <Show when={itineraryData()} keyed>
          {(itinerary) => (
            <div>
              <h3 class="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                <span class="text-2xl">🗺️</span> Your Itinerary
              </h3>
              <ItineraryResults
                itinerary={itinerary}
                showToggle={false}
                onFavoriteClick={handleItemFavorite}
                favorites={favorites()}
              />
            </div>
          )}
        </Show>
      </div>
    </div>
  );

  return (
    <>
      <SplitView
        listContent={ListContent}
        mapContent={MapContent}
        initialMode="split"
      />
      <FloatingChat
        getStreamingData={() => store.data}
        setStreamingData={(fn) => setStore('data', fn)}
        initialSessionId={searchParams.sessionId as string}
      />
    </>
  );
}

function ItinerarySkeleton() {
  return (
    <div class="space-y-6">
      {/* City Header Skeleton */}
      <div class="rounded-2xl bg-gray-200 dark:bg-gray-800 h-64 animate-pulse" />

      {/* List Items Skeleton */}
      <div class="space-y-4">
        <Card class="bg-white/50 dark:bg-slate-900/50">
          <CardHeader>
            <Skeleton class="h-6 w-1/3 mb-2" />
            <Skeleton class="h-4 w-1/4" />
          </CardHeader>
          <CardContent>
            <Skeleton class="h-16 w-full" />
          </CardContent>
        </Card>
        <Card class="bg-white/50 dark:bg-slate-900/50">
          <CardHeader>
            <Skeleton class="h-6 w-1/3 mb-2" />
            <Skeleton class="h-4 w-1/4" />
          </CardHeader>
          <CardContent>
            <Skeleton class="h-16 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
