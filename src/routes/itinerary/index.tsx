import { createSignal, createMemo, Show, For, onMount, lazy } from "solid-js";
import { useSearchParams } from "@solidjs/router";
import { useStreamedRpc } from "@/lib/hooks/useStreamedRpc";
import ItineraryStreamView from "@/components/itinerary/ItineraryStreamView";
import StopCard from "@/components/itinerary/StopCard";
import TripKit from "@/components/itinerary/TripKit";
import EditTripCTA from "@/components/trip/EditTripCTA";
import SectionHeader from "@/components/ui/SectionHeader";
import {
  stopsFromCityResponse,
  type ItineraryStop,
  type StreamPhase,
} from "@/lib/itinerary/createItineraryStream";
const MapComponent = lazy(() => import("@/components/features/Map/Map"));
const DetailedItemModal = lazy(() => import("@/components/DetailedItemModal"));
import type { POI } from "@/components/features/Map/Map";

// Stops per itinerary day — the live backend has no day field, so we bucket the
// priority-ordered stops to colour the map by day and group the list.
const STOPS_PER_DAY = 4;
const toNum = (v: unknown): number =>
  typeof v === "string" ? parseFloat(v) : typeof v === "number" ? v : 0;
import SplitView from "@/components/layout/SplitView";
import { CityInfoHeader } from "@/components/ui/CityInfoHeader";
import { ActionToolbar } from "@/components/ui/ActionToolbar";
import FloatingChat from "@/components/features/Chat/FloatingChat";
import { useSaveItineraryMutation } from "@/lib/api/itineraries";
import { useUserSubscription } from "@/lib/api/billing";
import { isProPlan } from "@/lib/subscription";
import type { TripStop } from "@/lib/trip-kit";
import { useAuth } from "@/contexts/AuthContext";

export default function ItineraryPage() {
  const [searchParams] = useSearchParams();
  const [message] = createSignal((searchParams.message as string) || "Show me an itinerary");
  const [cityName] = createSignal((searchParams.cityName as string) || "London");
  const [profileId] = createSignal((searchParams.profileId as string) || "");
  const { isAuthenticated } = useAuth();

  const { store, connect, setStore } = useStreamedRpc(message, cityName, profileId);

  // Mutation hook for bookmarking
  const saveItineraryMutation = useSaveItineraryMutation();
  const subscriptionQuery = useUserSubscription(() => isAuthenticated());
  const isPro = createMemo(() => isProPlan(subscriptionQuery.data?.plan));

  // Helper to normalize stored data - flattens nested itinerary_response structure
  const normalizeStoredData = (data: any): any => {
    if (!data) return null;

    // Check if data is wrapped in itinerary_response that contains the actual payload
    // Server sometimes returns: { itinerary_response: { general_city_data, points_of_interest, itinerary_response, session_id } }
    if (
      data.itinerary_response &&
      (data.itinerary_response.general_city_data || data.itinerary_response.points_of_interest)
    ) {
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
    const streaming = searchParams.streaming === "true";
    const domain = searchParams.domain as string;

    console.log("🔍 Itinerary page mount - checking params:", {
      sessionIdFromUrl,
      streaming,
      domain,
    });

    // If we have a sessionId in the URL, we came from navigation (chat page or deep link)
    // In this case, DON'T start a new connection - the FloatingChat will handle updates
    if (sessionIdFromUrl) {
      console.log("📍 SessionId found in URL, attempting to restore data...");

      // Try to restore data from session storage
      const completedSession = sessionStorage.getItem("completedStreamingSession");
      if (completedSession) {
        try {
          const parsed = JSON.parse(completedSession);
          const parsedData = parsed.data || parsed;
          if (
            parsedData &&
            (parsed.sessionId === sessionIdFromUrl || parsedData.session_id === sessionIdFromUrl)
          ) {
            console.log("✅ Found completed streaming session data, restoring...");
            const normalizedData = normalizeStoredData(parsedData);
            console.log("📦 Normalized data:", normalizedData);
            setStore("data", normalizedData);
            return;
          }
        } catch (e) {
          console.warn("Failed to parse completed streaming session:", e);
        }
      }

      // Check active streaming session
      const activeSession = sessionStorage.getItem("active_streaming_session");
      if (activeSession) {
        try {
          const parsed = JSON.parse(activeSession);
          if (parsed.sessionId === sessionIdFromUrl && parsed.data) {
            console.log("✅ Found active streaming session data, restoring...");
            const normalizedData = normalizeStoredData(parsed.data);
            console.log("📦 Normalized data:", normalizedData);
            setStore("data", normalizedData);
            return;
          }
        } catch (e) {
          console.warn("Failed to parse active streaming session:", e);
        }
      }

      // No data found but we have sessionId - data might still be streaming
      // DON'T start a new connection - FloatingChat will handle updates via useChatSession
      console.log(
        "⏳ SessionId present but no cached data yet - waiting for streaming data via FloatingChat...",
      );
      return;
    }

    // No sessionId in URL - this is a fresh page load, start new connection
    console.log("🆕 Fresh page load (no sessionId), starting new streaming connection...");
    connect();
  });

  const itineraryData = createMemo(() => store.data?.itinerary_response);
  const cityData = createMemo(() => store.data?.general_city_data);
  const pointsOfInterest = createMemo(() => store.data?.points_of_interest || []);

  // --- Editorial streaming model -------------------------------------
  // Derives the skeleton → enrichment shape from whatever the backend
  // has delivered so far. Works today with single-shot AiCityResponse;
  // swap in createItineraryStream().consumeSSE when the Go backend ships
  // true phased events — the view below does not change.
  const itineraryModel = createMemo(() => stopsFromCityResponse(store.data));

  const streamPhase = createMemo<StreamPhase>(() => {
    if (store.error) return "error";
    const m = itineraryModel();
    if (!store.data || m.stops.length === 0) return "skeleton";
    if (store.isLoading) return "enriching";
    return m.enrichedCount >= m.stops.length ? "done" : "enriching";
  });

  // General POIs that aren't part of the itinerary, as static cards.
  const extraStops = createMemo<ItineraryStop[]>(() => {
    if (!store.data) return [];
    const itinNames = new Set(itineraryModel().stops.map((s) => s.name));
    return stopsFromCityResponse({
      ...(store.data as any),
      itinerary_response: undefined,
    } as any).stops.filter((s) => !itinNames.has(s.name));
  });

  // Aggregate all POIs for the map
  const allPois = createMemo(() => {
    const itineraryPois = itineraryData()?.points_of_interest || [];
    const generalPois = pointsOfInterest();

    const poiMap = new Map<string, any>();

    [...itineraryPois, ...generalPois].forEach((poi) => {
      if (poi && poi.name) {
        // Normalize coordinates and ensure ID exists
        const lat = typeof poi.latitude === "string" ? parseFloat(poi.latitude) : poi.latitude;
        const lng = typeof poi.longitude === "string" ? parseFloat(poi.longitude) : poi.longitude;

        poiMap.set(poi.name, {
          ...poi,
          id: poi.name, // Use name as ID since it's unique enough for display
          latitude: lat || 0,
          longitude: lng || 0,
        });
      }
    });

    return Array.from(poiMap.values());
  });

  // Fast name -> full POI lookup (full POIs carry address/description/etc.).
  const allByName = createMemo(() => {
    const m = new Map<string, any>();
    allPois().forEach((p) => m.set(p.name, p));
    return m;
  });

  // Map POIs in itinerary order, with day bucket + sequence number attached.
  // Itinerary stops first (numbered + day-coloured), then any extra POIs.
  const mapPois = createMemo<POI[]>(() => {
    const byName = allByName();
    const out: POI[] = [];
    const seen = new Set<string>();

    itineraryModel().stops.forEach((s, i) => {
      const geo = byName.get(s.name);
      if (!geo) return;
      seen.add(s.name);
      out.push({
        id: s.name,
        name: s.name,
        category: s.category || geo.category || "",
        latitude: geo.latitude,
        longitude: geo.longitude,
        day: Math.floor(i / STOPS_PER_DAY),
        seq: i + 1,
        rating: s.rating ?? geo.rating,
        timeToSpend: s.timeToSpend,
        budget: s.budget,
        priority: s.priority,
      });
    });

    extraStops().forEach((s) => {
      const geo = byName.get(s.name);
      if (!geo || seen.has(s.name)) return;
      seen.add(s.name);
      out.push({
        id: s.name,
        name: s.name,
        category: s.category || geo.category || "",
        latitude: geo.latitude,
        longitude: geo.longitude,
        seq: out.length + 1,
        rating: s.rating ?? geo.rating,
        timeToSpend: s.timeToSpend,
        budget: s.budget,
      });
    });

    return out;
  });

  // Trip Kit stops: itinerary order + geo/address from full POI map.
  const tripKitStops = createMemo<TripStop[]>(() => {
    const byName = allByName();
    return itineraryModel().stops.map((s, i) => {
      const geo = byName.get(s.name);
      return {
        name: s.name,
        latitude: geo ? toNum(geo.latitude) : undefined,
        longitude: geo ? toNum(geo.longitude) : undefined,
        address: geo?.address,
        category: s.category || geo?.category,
        blurb: s.blurb,
        timeToSpend: s.timeToSpend,
        day: Math.floor(i / STOPS_PER_DAY),
      };
    });
  });

  // Shared selection between list and map (keyed by POI name).
  const [selectedId, setSelectedId] = createSignal<string | undefined>(undefined);

  // Detail modal state.
  const [detailItem, setDetailItem] = createSignal<any | null>(null);
  const [detailOpen, setDetailOpen] = createSignal(false);

  const openDetail = (poi: POI) => {
    const full = allByName().get(poi.name) || poi;
    setDetailItem({
      type: "poi",
      name: full.name,
      latitude: toNum(full.latitude),
      longitude: toNum(full.longitude),
      category: full.category,
      description_poi: full.description_poi || full.description,
      address: full.address,
      website: full.website,
      opening_hours: full.opening_hours,
      rating: full.rating,
      budget: full.budget,
      timeToSpend: full.time_to_spend || full.timeToSpend,
      priority: full.priority,
    });
    setDetailOpen(true);
  };

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
      navigator
        .share({
          title: `Itinerary for ${cityName()}`,
          text: `Check out this itinerary for ${cityName()}!`,
          url: window.location.href,
        })
        .catch(console.error);
    } else {
      console.log("Share API not supported");
    }
  };

  const handleBookmark = async () => {
    const city = cityData();
    const sessionId = (searchParams.sessionId as string) || store.data?.session_id;
    // const itinerary = itineraryData();

    if (!city?.city) {
      console.warn("Cannot bookmark: No city data available");
      alert("Unable to bookmark: No city data available yet.");
      return;
    }

    const bookmarkData = {
      session_id: sessionId,
      primary_city_name: city.city,
      title: `${city.city} Itinerary`,
      description: city.description || `Itinerary for ${city.city}`,
      tags: [],
      is_public: false,
    };

    try {
      await saveItineraryMutation.mutateAsync(bookmarkData);
      alert(`Itinerary for ${city.city} has been bookmarked!`);
      console.log("✅ Itinerary bookmarked successfully");
    } catch (error) {
      console.error("❌ Failed to bookmark itinerary:", error);
      alert("Failed to bookmark the itinerary. Please try again.");
    }
  };

  // Map Content
  const MapContent = (
    <div class="h-full w-full bg-muted relative">
      <Show
        when={mapPois().length > 0}
        fallback={
          <div class="h-full w-full flex items-center justify-center text-muted-foreground p-4 text-center">
            {store.isLoading ? "Loading map data..." : "No items to display on map"}
          </div>
        }
      >
        <MapComponent
          center={[toNum(mapPois()[0]?.longitude), toNum(mapPois()[0]?.latitude)]}
          pointsOfInterest={mapPois()}
          zoom={12}
          selectedId={selectedId()}
          onSelect={(poi) => setSelectedId(poi.name)}
          onActivate={(poi) => openDetail(poi)}
          fullBleed
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

  // List Content — editorial streaming itinerary
  const ListContent = (
    <div class="h-full overflow-y-auto px-4 py-6 md:px-8 bg-background">
      <div class="max-w-3xl mx-auto pb-24">
        <CityInfoHeader cityData={cityData()} isLoading={store.isLoading && !cityData()} />

        <ItineraryStreamView
          phase={streamPhase()}
          title={itineraryModel().title}
          summary={itineraryModel().summary}
          stops={itineraryModel().stops}
          enrichedCount={itineraryModel().enrichedCount}
          error={store.error?.message}
          stopsPerDay={STOPS_PER_DAY}
          selectedKey={selectedId()}
          onStopClick={(stop) => setSelectedId(stop.name)}
        />

        <TripKit
          title={itineraryModel().title}
          cityName={cityName()}
          summary={itineraryModel().summary}
          stops={tripKitStops()}
          isPro={isPro()}
          visible={
            streamPhase() === "done" || (itineraryModel().stops.length > 0 && !store.isLoading)
          }
          stopsPerDay={STOPS_PER_DAY}
        />

        <Show when={store.tripId || (searchParams.tripId as string | undefined)}>
          <div class="mt-4">
            <EditTripCTA
              tripId={(store.tripId || (searchParams.tripId as string)) ?? null}
              cityName={cityName()}
            />
          </div>
        </Show>

        <Show when={extraStops().length > 0}>
          <div class="mt-10">
            <SectionHeader
              kicker="Also nearby"
              title="More to explore"
              subtitle="Optional stops around your route"
            />
            <div class="space-y-3">
              <For each={extraStops()}>
                {(stop, i) => (
                  <StopCard
                    stop={stop}
                    index={i()}
                    selected={selectedId() === stop.name}
                    onClick={(s) => setSelectedId(s.name)}
                  />
                )}
              </For>
            </div>
          </div>
        </Show>
      </div>
    </div>
  );

  return (
    <>
      <SplitView listContent={ListContent} mapContent={MapContent} initialMode="map" />
      <Show when={detailOpen()}>
        <DetailedItemModal
          item={detailItem()}
          isOpen={detailOpen()}
          onClose={() => setDetailOpen(false)}
        />
      </Show>
      <FloatingChat
        getStreamingData={() => store.data}
        setStreamingData={(fn) => setStore("data", fn)}
        initialSessionId={searchParams.sessionId as string}
      />
    </>
  );
}
