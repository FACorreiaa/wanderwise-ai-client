import { createMemo, Show, lazy } from "solid-js";
import { TOKYO_ITINERARY, TOKYO_CITY_DATA } from "~/data/preview-data";
import ItineraryResults from "~/components/results/ItineraryResults";
const MapComponent = lazy(() => import("~/components/features/Map/Map"));
import SplitView from "~/components/layout/SplitView";
import { CityInfoHeader } from "~/components/ui/CityInfoHeader";
import { ActionToolbar } from "~/components/ui/ActionToolbar";

export default function PreviewItineraryPage() {
  const itineraryData = createMemo(() => TOKYO_ITINERARY);
  const cityData = createMemo(() => TOKYO_CITY_DATA);
  const pointsOfInterest = createMemo(() => TOKYO_ITINERARY.points_of_interest || []);

  const allPois = createMemo(() => {
    return pointsOfInterest().map((poi) => ({
      ...poi,
      id: poi.name,
    }));
  });

  const handleDownload = () => {
    alert("This is a preview. Sign in to download real itineraries!");
  };

  const handleShare = () => {
    alert("This is a preview. Sign in to share!");
  };

  const handleBookmark = () => {
    alert("This is a preview. Sign in to save bookmarks!");
  };

  // Map Content
  const MapContent = (
    <div class="h-full w-full bg-slate-100 dark:bg-slate-900 relative">
      <Show when={allPois().length > 0}>
        <MapComponent
          center={[
            (allPois()[0]?.longitude as number) || 0,
            (allPois()[0]?.latitude as number) || 0,
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

  // List Content
  const ListContent = (
    <div class="h-full overflow-y-auto p-4 md:p-6 bg-slate-50/50 dark:bg-slate-950/50 backdrop-blur-sm">
      <div class="max-w-3xl mx-auto pb-20">
        <div class="mb-6">
          <div class="inline-block px-3 py-1 mb-4 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold border border-blue-200 dark:border-blue-800">
            Preview Mode
          </div>
          <CityInfoHeader cityData={cityData()} isLoading={false} />
        </div>

        <Show when={itineraryData()} keyed>
          {(itinerary) => (
            <div>
              <h3 class="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                <span class="text-2xl">🗺️</span> Your Itinerary
              </h3>
              <ItineraryResults
                itinerary={itinerary}
                showToggle={false}
                onFavoriteClick={() => {}}
                favorites={[]}
              />
            </div>
          )}
        </Show>
      </div>
    </div>
  );

  return <SplitView listContent={ListContent} mapContent={MapContent} initialMode="split" />;
}
