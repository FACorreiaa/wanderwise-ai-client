import { createSignal, For, Show, createMemo } from "solid-js";
import { useSearchParams } from "@solidjs/router";
import { useStreamedRpc } from "@/lib/hooks/useStreamedRpc";
import { CardHeader, CardTitle } from "@/ui/card";
import { Badge } from "@/ui/badge";
import { Skeleton } from "@/ui/skeleton";
import { Hotel } from "@/types/chat";

export default function HotelsPage() {
  const [searchParams] = useSearchParams();
  const [message] = createSignal(searchParams.message || "Show me hotels");
  const [cityName] = createSignal(searchParams.cityName || "London");
  const [profileId] = createSignal(searchParams.profileId || "");

  const { store, connect } = useStreamedRpc(message, cityName, profileId);

  connect();

  const hotels = createMemo(() => {
    if (!store.data) return [];
    if (store.data.hotels_raw) {
      try {
        const parsed = JSON.parse(store.data.hotels_raw);
        return parsed.hotels || [];
      } catch (e) {
        console.error("Failed to parse hotels_raw:", e);
        return [];
      }
    }
    return store.data.accommodation_response?.hotels || [];
  });

  return (
    <div class="min-h-screen relative transition-colors">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 class="text-3xl font-bold mb-8">Hotels in {cityName()}</h1>
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
            <For each={hotels()}>{(hotel) => <HotelCard hotel={hotel} />}</For>
          </div>
        </Show>
      </div>
    </div>
  );
}

function HotelCard(props: { hotel: Hotel }) {
  return (
    <div class="glass-panel rounded-2xl p-4 hover:shadow-xl hover:scale-[1.02] transition-all duration-200 cursor-pointer flex flex-col">
      <CardHeader>
        <CardTitle class="text-xl">{props.hotel.name}</CardTitle>
        <div class="flex gap-2 flex-wrap">
          <Badge variant="secondary" class="w-fit">
            {props.hotel.category}
          </Badge>
          <Show when={props.hotel.price_range}>
            <Badge variant="outline" class="w-fit">
              {props.hotel.price_range}
            </Badge>
          </Show>
          <Badge variant="outline" class="w-fit">
            Rating: {props.hotel.rating}
          </Badge>
        </div>
      </CardHeader>
      <div class="flex-grow p-4">
        <p class="text-muted-foreground">{props.hotel.description}</p>
        <div class="mt-4 text-sm">
          <p>
            <strong>Address:</strong> {props.hotel.address}
          </p>
          <Show when={props.hotel.phone_number}>
            <p>
              <strong>Phone:</strong> {props.hotel.phone_number}
            </p>
          </Show>
          <Show when={props.hotel.website}>
            <p>
              <strong>Website:</strong>{" "}
              <a
                href={props.hotel.website}
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-500 hover:underline"
              >
                {props.hotel.website}
              </a>
            </p>
          </Show>
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
        <div class="flex gap-2 mt-2">
          <Skeleton class="h-5 w-1/4" />
          <Skeleton class="h-5 w-1/4" />
        </div>
      </CardHeader>
      <div class="p-4">
        <Skeleton class="h-4 w-full" />
        <Skeleton class="h-4 w-full mt-2" />
        <Skeleton class="h-4 w-2/3 mt-2" />
      </div>
    </div>
  );
}
