import { createSignal, createMemo, Show, onMount, For } from "solid-js";
import { useSearchParams } from "@solidjs/router";
import { useChatRPC } from "~/lib/hooks/useChatRPC";
import { POIDetailedInfo } from "~/lib/api/types";
import MapComponent from "~/components/features/Map/Map";
import SplitView from "@/components/layout/SplitView";
import { CityInfoHeader } from "@/components/ui/CityInfoHeader";
import { ActionToolbar } from "@/components/ui/ActionToolbar";
import FloatingChat from "~/components/features/Chat/FloatingChat";
import { Skeleton } from "~/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "~/ui/card";
import { Badge } from "~/ui/badge";
import FavoriteButton from "~/components/shared/FavoriteButton";

export default function ActivitiesPage() {
  const [searchParams] = useSearchParams();
  const [message] = createSignal(
    (searchParams.message as string) || "Show me activities"
  );
  const [cityName] = createSignal((searchParams.cityName as string) || "London");

  const { state, startStream } = useChatRPC();

  const [restoredData, setRestoredData] = createSignal<any>(null);

  // Local favorites state
  const [favorites, setFavorites] = createSignal<string[]>([]);

  const normalizeStoredData = (data: any): any => {
    if (!data) return null;
    const normalized: any = { ...data };

    if (Array.isArray(data.activities)) {
      normalized.activities = data.activities;
    } else if (data.activities_response?.activities) {
      normalized.activities = data.activities_response.activities;
      if (data.activities_response.general_city_data) {
        normalized.general_city_data = data.activities_response.general_city_data;
      }
    }

    return normalized;
  };

  onMount(() => {
    const sessionIdFromUrl = searchParams.sessionId as string;

    if (sessionIdFromUrl) {
      const completedSession = sessionStorage.getItem('completedStreamingSession');
      if (completedSession) {
        try {
          const parsed = JSON.parse(completedSession);
          const parsedData = parsed.data || parsed;

          if (parsedData && (parsed.sessionId === sessionIdFromUrl || parsedData.session_id === sessionIdFromUrl)) {
            const normalizedData = normalizeStoredData(parsedData);
            setRestoredData(normalizedData);
            return;
          }
        } catch (e) {
          console.warn('Failed to parse completed streaming session:', e);
        }
      }
      return;
    }

    if (!state.isConnected) {
      startStream(message(), cityName());
    }
  });

  const effectiveData = createMemo(() => restoredData() || state.streamedData);
  const cityData = createMemo(() => effectiveData()?.general_city_data);

  const activities = createMemo(() => {
    const data = effectiveData();
    if (!data) return [];
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
    const data = JSON.stringify(effectiveData(), null, 2);
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
        text: `Check out these activities in ${cityName()}!`,
        url: window.location.href,
      }).catch(console.error);
    }
  };

  const handleBookmark = () => {
    console.log("Bookmark activities list");
  };

  const handleItemFavorite = (name: string) => {
    setFavorites(prev =>
      prev.includes(name)
        ? prev.filter(n => n !== name)
        : [...prev, name]
    );
    console.log(`Toggled favorite for: ${name}`);
  };

  const isFavorite = (name: string) => favorites().includes(name);

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
        <ActionToolbar
          onDownload={handleDownload}
          onShare={handleShare}
          onBookmark={handleBookmark}
        />
      </div>
    </div>
  );

  const ListContent = (
    <div class="h-full overflow-y-auto p-4 md:p-6 bg-slate-50/50 dark:bg-slate-950/50 backdrop-blur-sm">
      <div class="max-w-3xl mx-auto pb-20">
        <CityInfoHeader cityData={cityData()} isLoading={state.isStreaming && !cityData()} />

        <Show when={state.error}>
          <div class="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-400">
            <p class="font-bold">Unable to load activities</p>
            <p class="text-sm opacity-90">{state.error}</p>
          </div>
        </Show>

        <Show when={state.isStreaming && !activities().length}>
          <ActivitiesSkeleton />
        </Show>

        <Show when={activities().length > 0}>
          <div class="mb-8">
            <h3 class="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
              <span class="text-2xl">🎯</span> Activities ({activities().length})
            </h3>
            <div class="space-y-4">
              <For each={activities()}>
                {(item) => (
                  <Card class="hover:shadow-md transition-all cursor-pointer bg-white/80 dark:bg-gray-800/80 backdrop-blur">
                    <CardHeader>
                      <div class="flex justify-between items-start">
                        <CardTitle class="text-lg">{item.name}</CardTitle>
                        <div class="flex items-center gap-2">
                          <FavoriteButton
                            item={{
                              id: item.name,
                              name: item.name,
                              contentType: 'poi',
                              description: item.description_poi || item.description || '',
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
                      <div class="text-xs text-gray-500">
                        <p>{item.address}</p>
                      </div>
                    </CardContent>
                  </Card>
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
      <SplitView
        listContent={ListContent}
        mapContent={MapContent}
        initialMode="split"
      />
      <FloatingChat
        getStreamingData={() => effectiveData()}
        setStreamingData={(fn) => {
          const currentData = effectiveData();
          const newData = typeof fn === 'function' ? fn(currentData) : fn;
          setRestoredData(newData);
        }}
        initialSessionId={searchParams.sessionId as string}
      />
    </>
  );
}

function ActivitiesSkeleton() {
  return (
    <div class="space-y-6">
      <div class="rounded-2xl bg-gray-200 dark:bg-gray-800 h-64 animate-pulse" />
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