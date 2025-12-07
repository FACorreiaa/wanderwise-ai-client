import { createSignal, createMemo, Show } from "solid-js";
import { useSearchParams } from "@solidjs/router";
import { useStreamedRpc } from "@/lib/hooks/useStreamedRpc";
import { POIDetailedInfo } from "@/types/chat";
import MapComponent from "@/components/features/Map/Map";
import SplitView from "@/components/layout/SplitView";
import { CityInfoHeader } from "@/components/ui/CityInfoHeader";
import { ActionToolbar } from "@/components/ui/ActionToolbar";
import { ChatFab } from "@/components/ui/ChatFab";
import { Skeleton } from "@/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/ui/card";
import { Badge } from "@/ui/badge";

export default function ActivitiesPage() {
  const [searchParams] = useSearchParams();
  const [message] = createSignal(
    (searchParams.message as string) || "Show me activities"
  );
  const [cityName] = createSignal((searchParams.cityName as string) || "London");
  const [profileId] = createSignal((searchParams.profileId as string) || "");

  const { store, connect } = useStreamedRpc(message, cityName, profileId);

  connect();

  const cityData = createMemo(() => store.data?.general_city_data);

  const activities = createMemo(() => {
    // Activities often come in points_of_interest directly or nested
    if (!store.data) return [];
    const list = store.data.points_of_interest || [];
    // If it's an object with points_of_interest property
    if (!Array.isArray(list) && (list as any).points_of_interest) {
      return (list as any).points_of_interest as POIDetailedInfo[];
    }
    return Array.isArray(list) ? list : [];
  });

  const allPois = createMemo(() => {
    return activities().map(a => ({
      ...a,
      id: a.name,
      latitude: typeof a.latitude === 'string' ? parseFloat(a.latitude) : a.latitude,
      longitude: typeof a.longitude === 'string' ? parseFloat(a.longitude) : a.longitude,
    })) as POIDetailedInfo[];
  });

  const handleDownload = () => {
    const data = JSON.stringify(store.data, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `activities-${cityName()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Activities in ${cityName()}`,
        url: window.location.href,
      }).catch(console.error);
    }
  };

  const handleFavorite = () => {
    console.log("Favorite activities");
  };

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
      <div class="absolute top-4 left-4 z-10">
        <ActionToolbar
          onDownload={handleDownload}
          onShare={handleShare}
          onFavorite={handleFavorite}
        />
      </div>
    </div>
  );

  const ListContent = (
    <div class="h-full overflow-y-auto p-4 md:p-6 bg-slate-50/50 dark:bg-slate-950/50 backdrop-blur-sm">
      <div class="max-w-3xl mx-auto pb-20">
        <Show when={cityData()}>
          <CityInfoHeader cityData={cityData()} isLoading={store.isLoading} />
        </Show>

        <Show when={store.error}>
          <div class="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-400">
            <p class="font-bold">Error loading activities</p>
            <p class="text-sm opacity-90">{store.error?.message}</p>
          </div>
        </Show>

        <h2 class="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Activities in {cityName()}</h2>

        <Show when={store.isLoading && !store.data}>
          <div class="grid gap-6 md:grid-cols-2">
            <Skeleton class="h-64 w-full rounded-xl" />
            <Skeleton class="h-64 w-full rounded-xl" />
          </div>
        </Show>

        <Show when={activities().length > 0}>
          <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
            <For each={activities()}>
              {(item) => (
                <Card class="hover:shadow-md transition-all cursor-pointer bg-white/80 dark:bg-gray-800/80 backdrop-blur">
                  <CardHeader>
                    <div class="flex justify-between items-start">
                      <CardTitle class="text-lg">{item.name}</CardTitle>
                      <Badge variant="secondary">{item.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p class="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-2">
                      {item.description_poi}
                    </p>
                    <div class="text-xs text-gray-500">
                      <p>{item.address}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </For>
          </div>
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
      <ChatFab onClick={() => console.log("Open chat")} />
    </>
  );
}