import { createSignal, createMemo, Show, onMount, For } from "solid-js";
import { useSearchParams } from "@solidjs/router";
import { useChatRPC } from "~/lib/hooks/useChatRPC";
import { POIDetailedInfo } from "~/lib/api/types";
import MapComponent from "~/components/features/Map/Map";
import { SplitView } from "~/components/shared/SplitView";
import { CityInfoHeader } from "~/components/shared/CityInfoHeader";
import { ActionToolbar } from "~/components/shared/ActionToolbar";
import { ChatFab } from "~/components/shared/ChatFab";
import { Skeleton } from "~/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "~/ui/card";
import { Badge } from "~/ui/badge";
import { Share, Heart, Download } from "lucide-solid";

export default function ActivitiesPage() {
  const [searchParams] = useSearchParams();
  const [message] = createSignal(
    (searchParams.message as string) || "Show me activities"
  );
  const [cityName] = createSignal((searchParams.cityName as string) || "London");

  const { state, startStream } = useChatRPC();

  onMount(() => {
    if (!state.isConnected) {
      startStream(message(), cityName(), "activities");
    }
  });

  const cityData = createMemo(() => state.streamedData?.general_city_data);

  const activities = createMemo(() => {
    if (!state.streamedData) return [];
    const data = state.streamedData;
    const list = data.activities || data.points_of_interest || [];
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
    const data = JSON.stringify(state.streamedData, null, 2);
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

  const toolbarActions = [
    { icon: Download, label: "Save", onClick: handleDownload },
    { icon: Share, label: "Share", onClick: handleShare },
    { icon: Heart, label: "Favorite", onClick: handleFavorite },
  ];

  const MapContent = (
    <div class="h-full w-full bg-slate-100 dark:bg-slate-900 relative">
      <Show when={allPois().length > 0} fallback={
        <div class="h-full w-full flex items-center justify-center text-muted-foreground p-4 text-center">
          {state.isStreaming ? "Loading map data..." : "No items to display on map"}
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
        <ActionToolbar actions={toolbarActions} />
      </div>
    </div>
  );

  const ListContent = (
    <div class="h-full min-h-screen p-4 md:p-6 bg-slate-50/50 dark:bg-slate-950/50 backdrop-blur-sm">
      <div class="max-w-3xl mx-auto pb-20">
        <CityInfoHeader
          city={cityData()?.city}
          description={cityData()?.description}
          weather={cityData()?.weather}
          loading={state.isStreaming && !cityData()}
        />

        <Show when={state.error}>
          <div class="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-400">
            <p class="font-bold">Error loading activities</p>
            <p class="text-sm opacity-90">{state.error}</p>
          </div>
        </Show>

        <h2 class="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Activities in {cityName()}</h2>

        <Show when={state.isStreaming && !activities().length}>
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
        children={ListContent}
        map={MapContent}
        fab={<ChatFab onClick={() => console.log("Open chat")} />}
      />
    </>
  );
}