import { createSignal, For, Show, createMemo } from "solid-js";
import { useSearchParams } from "@solidjs/router";
import { useStreamedRpc } from "@/lib/hooks/useStreamedRpc";
import { CardHeader, CardTitle } from "@/ui/card";
import { Badge } from "@/ui/badge";
import { Skeleton } from "@/ui/skeleton";
import { POIDetailedInfo } from "@/types/chat";

export default function RestaurantsPage() {
  const [searchParams] = useSearchParams();
  const [message] = createSignal(searchParams.message || "Show me restaurants");
  const [cityName] = createSignal(searchParams.cityName || "London");
  const [profileId] = createSignal(searchParams.profileId || "");

  const { store, connect } = useStreamedRpc(message, cityName, profileId);

  connect();

  const restaurants = createMemo(() => {
    if (!store.data) return [];
    return (
      store.data.dining_response?.restaurants ||
      store.data.points_of_interest ||
      []
    );
  });

  return (
    <div class="min-h-screen relative transition-colors">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 class="text-3xl font-bold mb-8">Restaurants in {cityName()}</h1>
        <Show when={store.isLoading && !store.data}>
          <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <For each={Array(6)}>{() => <PoiCardSkeleton />}</For>
          </div>
        </Show>

        <Show when={store.error}>
          <div class="text-red-500 p-4 border border-red-500 rounded-md">
            <p class="font-bold">An error occurred:</p>
            <pre>{store.error?.message}</pre>
            <p class="mt-2">Please try again.</p>
          </div>
        </Show>

        <Show when={store.data} keyed>
          <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <For each={restaurants()}>{(poi) => <PoiCard poi={poi} />}</For>
          </div>
        </Show>
      </div>
    </div>
  );
}

function PoiCard(props: { poi: POIDetailedInfo }) {
  return (
    <div class="glass-panel rounded-2xl p-4 hover:shadow-xl hover:scale-[1.02] transition-all duration-200 cursor-pointer flex flex-col">
      <CardHeader>
        <CardTitle class="text-xl">{props.poi.name}</CardTitle>
        <Badge variant="secondary" class="w-fit">
          {props.poi.category}
        </Badge>
      </CardHeader>
      <div class="flex-grow p-4">
        <p class="text-muted-foreground">
          {props.poi.description || props.poi.description_poi}
        </p>
        <div class="mt-4 text-sm">
          <p>
            <strong>Address:</strong> {props.poi.address}
          </p>
          <p>
            <strong>Opening Hours:</strong> {props.poi.opening_hours}
          </p>
        </div>
      </div>
    </div>
  );
}

function PoiCardSkeleton() {
  return (
    <div class="glass-panel rounded-2xl p-4">
      <CardHeader>
        <Skeleton class="h-6 w-3/4" />
        <Skeleton class="h-5 w-1/4" />
      </CardHeader>
      <div class="p-4">
        <Skeleton class="h-4 w-full" />
        <Skeleton class="h-4 w-full mt-2" />
        <Skeleton class="h-4 w-2/3 mt-2" />
      </div>
    </div>
  );
}
