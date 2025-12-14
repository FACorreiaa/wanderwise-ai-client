import { createMemo, Show, lazy } from "solid-js";
import { TOKYO_HOTELS, TOKYO_CITY_DATA } from "~/data/preview-data";
import HotelResults from "~/components/results/HotelResults";
const MapComponent = lazy(() => import("~/components/features/Map/Map"));
import SplitView from "~/components/layout/SplitView";
import { CityInfoHeader } from "~/components/ui/CityInfoHeader";
import { ActionToolbar } from "~/components/ui/ActionToolbar";

export default function PreviewHotelsPage() {
    const cityData = createMemo(() => TOKYO_CITY_DATA);
    const hotels = createMemo(() => TOKYO_HOTELS.map(h => ({
        ...h,
        id: h.name, // Ensure ID for components
        check_in: "14:00",
        check_out: "11:00",
        amenities: ["Free WiFi", "Spa", "Restaurant"]
    })));

    const allPois = createMemo(() => {
        return hotels().map(h => ({
            ...h,
            id: h.name,
        }));
    });

    const handleDownload = () => alert("Sign in to download functionality!");
    const handleShare = () => alert("Sign in to share!");
    const handleBookmark = () => alert("Sign in to bookmark!");

    const MapContent = (
        <div class="h-full w-full bg-slate-100 dark:bg-slate-900 relative">
            <Show when={allPois().length > 0}>
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
                <div class="mb-6">
                    <div class="inline-block px-3 py-1 mb-4 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-200 dark:border-indigo-800">
                        Preview Mode
                    </div>
                    <CityInfoHeader cityData={cityData()} isLoading={false} />
                </div>

                <Show when={hotels().length > 0}>
                    <div class="mb-8">
                        <h3 class="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                            <span class="text-2xl">🏨</span> Hotels ({hotels().length})
                        </h3>
                        <HotelResults
                            hotels={hotels()}
                            onFavoriteClick={() => { alert("Sign in to save!") }}
                            favorites={[]}
                        />
                    </div>
                </Show>
            </div>
        </div>
    );

    return (
        <SplitView
            listContent={ListContent}
            mapContent={MapContent}
            initialMode="split"
        />
    );
}
