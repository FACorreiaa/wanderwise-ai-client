import { createSignal, createMemo, Show } from "solid-js";
import { useSearchParams } from "@solidjs/router";
import { useStreamedRpc } from "@/lib/hooks/useStreamedRpc";
import { POIDetailedInfo } from "@/types/chat";
import HotelResults from "@/components/results/HotelResults";
import MapComponent from "@/components/features/Map/Map";
import SplitView from "@/components/layout/SplitView";
import { CityInfoHeader } from "@/components/ui/CityInfoHeader";
import { ActionToolbar } from "@/components/ui/ActionToolbar";
import { ChatFab } from "@/components/ui/ChatFab";
import { Skeleton } from "@/ui/skeleton";

export default function HotelsPage() {
  const [searchParams] = useSearchParams();
  const [message] = createSignal(
    (searchParams.message as string) || "Show me hotels"
  );
  const [cityName] = createSignal((searchParams.cityName as string) || "London");
  const [profileId] = createSignal((searchParams.profileId as string) || "");

  const { store, connect } = useStreamedRpc(message, cityName, profileId);

  connect();

  const cityData = createMemo(() => store.data?.general_city_data);

  const hotels = createMemo(() => {
    if (!store.data) return [];
    const accResp = store.data.accommodation_response;
    const list = accResp?.hotels || store.data.points_of_interest || [];
    return Array.isArray(list) ? list : [];
  });

  const allPois = createMemo(() => {
    return hotels().map(h => ({
      ...h,
      id: h.name,
      latitude: typeof h.latitude === 'string' ? parseFloat(h.latitude) : h.latitude,
      longitude: typeof h.longitude === 'string' ? parseFloat(h.longitude) : h.longitude,
    })) as unknown as POIDetailedInfo[];
  });

  const handleDownload = () => {
    const data = JSON.stringify(store.data, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hotels-${cityName()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Hotels in ${cityName()}`,
        url: window.location.href,
      }).catch(console.error);
    }
  };

  const handleFavorite = () => {
    console.log("Favorite hotels");
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
            <p class="font-bold">Error loading hotels</p>
            <p class="text-sm opacity-90">{store.error?.message}</p>
          </div>
        </Show>

        <h2 class="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Hotels in {cityName()}</h2>

        <Show when={store.isLoading && !store.data}>
          <div class="grid gap-6 md:grid-cols-2">
            <Skeleton class="h-64 w-full rounded-xl" />
            <Skeleton class="h-64 w-full rounded-xl" />
          </div>
        </Show>

        <Show when={hotels().length > 0} keyed>
          <HotelResults
            hotels={hotels()}
          />
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
