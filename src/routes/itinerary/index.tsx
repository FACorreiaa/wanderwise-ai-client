import { createSignal, For, Show, createMemo } from "solid-js";
import { useSearchParams } from "@solidjs/router";
import { useStreamedRpc } from "@/lib/hooks/useStreamedRpc";
import { Badge } from "@/ui/badge";
import { Skeleton } from "@/ui/skeleton";
import { POIDetailedInfo } from "@/types/chat";
import { MapPin, Clock } from "lucide-solid";

export default function ItineraryPage() {
  const [searchParams] = useSearchParams();
  const [message] = createSignal(
    searchParams.message || "Show me an itinerary",
  );
  const [cityName] = createSignal(searchParams.cityName || "London");
  const [profileId] = createSignal(searchParams.profileId || "");

  const { store, connect } = useStreamedRpc(message, cityName, profileId);

  connect();

  const itineraryData = createMemo(() => store.data?.itinerary_response);
  const cityData = createMemo(() => store.data?.general_city_data);

  const allPois = createMemo(() => {
    const itineraryPois = itineraryData()?.points_of_interest || [];
    const generalPois =
      store.data?.points_of_interest?.points_of_interest || [];
    const poiMap = new Map<string, POIDetailedInfo>();

    [...itineraryPois, ...generalPois].forEach((poi) => {
      if (poi && poi.name) {
        poiMap.set(poi.name, poi);
      }
    });

    return Array.from(poiMap.values());
  });

  return (
    <div class="min-h-screen relative transition-colors">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Show when={store.isLoading && !store.data}>
          <ItinerarySkeleton />
        </Show>

        <Show when={store.error}>
          <div class="text-red-500 p-4 border border-red-500 rounded-md">
            <p class="font-bold">An error occurred:</p>
            <pre>{store.error?.message}</pre>
            <p class="mt-2">Please try again.</p>
          </div>
        </Show>

        <Show when={store.data} keyed>
          <div class="space-y-8">
            <Show when={cityData()} keyed>
              {(city) => (
                <div class="glass-panel rounded-2xl p-6 shadow-lg border">
                  <h1 class="text-3xl sm:text-4xl font-bold tracking-tight">
                    {city.city}, {city.country}
                  </h1>
                  <p class="text-white/80 text-sm mt-1">{city.description}</p>
                  <div class="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p class="font-semibold">Population</p>
                      <p>{city.population}</p>
                    </div>
                    <div>
                      <p class="font-semibold">Area</p>
                      <p>{city.area}</p>
                    </div>
                    <div>
                      <p class="font-semibold">Language</p>
                      <p>{city.language}</p>
                    </div>
                    <div>
                      <p class="font-semibold">Weather</p>
                      <p>{city.weather}</p>
                    </div>
                  </div>
                </div>
              )}
            </Show>

            <Show when={itineraryData()} keyed>
              {(itinerary) => (
                <div class="glass-panel rounded-2xl p-6 shadow-lg border">
                  <h2 class="text-2xl font-bold mb-2">
                    {itinerary.itinerary_name || "Custom Itinerary"}
                  </h2>
                  <p class="text-lg text-muted-foreground mb-4">
                    {itinerary.overall_description}
                  </p>
                </div>
              )}
            </Show>

            <Show when={allPois().length > 0}>
              <div>
                <h2 class="text-2xl font-bold mb-4">Points of Interest</h2>
                <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <For each={allPois()}>{(poi) => <PoiCard poi={poi} />}</For>
                </div>
              </div>
            </Show>
          </div>
        </Show>
      </div>
    </div>
  );
}

function PoiCard(props: { poi: POIDetailedInfo }) {
  return (
    <div class="glass-panel rounded-2xl p-4 hover:shadow-xl hover:scale-[1.02] transition-all duration-200 cursor-pointer">
      <div class="flex items-start justify-between gap-3 mb-2">
        <div>
          <h3 class="text-base font-semibold text-gray-900 dark:text-white">
            {props.poi.name}
          </h3>
          <p class="text-xs font-medium text-gray-600 dark:text-gray-400">
            {props.poi.category}
          </p>
        </div>
        <Badge variant="secondary" class="w-fit">
          {props.poi.distance?.toFixed(1)} km
        </Badge>
      </div>
      <p class="text-sm text-gray-700 dark:text-gray-400 line-clamp-2 mb-3 leading-relaxed">
        {props.poi.description_poi}
      </p>
      <div class="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-500">
        <div class="flex items-center gap-1">
          <MapPin class="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span class="font-medium">{props.poi.address}</span>
        </div>
        <div class="flex items-center gap-1">
          <Clock class="w-4 h-4 text-gray-500" />
          <span class="font-medium">{props.poi.opening_hours}</span>
        </div>
      </div>
    </div>
  );
}

function ItinerarySkeleton() {
  return (
    <div class="space-y-8">
      <div class="glass-panel rounded-2xl p-6 shadow-lg border">
        <Skeleton class="h-8 w-3/4 mb-2" />
        <Skeleton class="h-4 w-full" />
        <Skeleton class="h-4 w-full mt-2" />
        <Skeleton class="h-4 w-2/3 mt-2" />
      </div>
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <For each={Array(6)}>{() => <PoiCardSkeleton />}</For>
      </div>
    </div>
  );
}

function PoiCardSkeleton() {
  return (
    <div class="glass-panel rounded-2xl p-4">
      <Skeleton class="h-6 w-3/4 mb-2" />
      <Skeleton class="h-5 w-1/4 mb-4" />
      <Skeleton class="h-4 w-full" />
      <Skeleton class="h-4 w-full mt-2" />
      <Skeleton class="h-4 w-2/3 mt-2" />
    </div>
  );
}
