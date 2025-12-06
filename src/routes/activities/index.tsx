import { createSignal, For, Show } from "solid-js";
import { useSearchParams } from "@solidjs/router";
import { useStreamedRpc } from "@/lib/hooks/useStreamedRpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Badge } from "@/ui/badge";
import { Skeleton } from "@/ui/skeleton";
import { POIDetailedInfo } from "@/types/chat";

export default function ActivitiesPage() {
  const [searchParams] = useSearchParams();
  const [message] = createSignal(searchParams.message || "Show me activities");
  const [cityName] = createSignal(searchParams.cityName || "London");
  const [profileId] = createSignal(searchParams.profileId || "");

  const { store, connect } = useStreamedRpc(message, cityName, profileId);

  connect();

  return (
    <main class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">Activities in {cityName()}</h1>
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
        {(itinerary) => (
          <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <For each={itinerary.points_of_interest}>
              {(poi) => <PoiCard poi={poi} />}
            </For>
          </div>
        )}
      </Show>
    </main>
  );
}

function PoiCard(props: { poi: POIDetailedInfo }) {
  return (
    <Card class="flex flex-col">
      <CardHeader>
        <CardTitle class="text-xl">{props.poi.name}</CardTitle>
        <Badge variant="secondary" class="w-fit">
          {props.poi.category}
        </Badge>
      </CardHeader>
      <CardContent class="flex-grow">
        <p class="text-muted-foreground">{props.poi.description_poi}</p>
        <div class="mt-4 text-sm">
          <p>
            <strong>Address:</strong> {props.poi.address}
          </p>
          <p>
            <strong>Opening Hours:</strong> {props.poi.opening_hours}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function PoiCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton class="h-6 w-3/4" />
        <Skeleton class="h-5 w-1/4" />
      </CardHeader>
      <CardContent>
        <Skeleton class="h-4 w-full" />
        <Skeleton class="h-4 w-full mt-2" />
        <Skeleton class="h-4 w-2/3 mt-2" />
      </CardContent>
    </Card>
  );
}