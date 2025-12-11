import { createSignal, For, Show } from 'solid-js';
import { Title, Meta } from '@solidjs/meta';
import { Search, MapPin, Star, Sparkles } from 'lucide-solid';
import { TOKYO_HOTELS, TOKYO_RESTAURANTS, TOKYO_ACTIVITIES, TOKYO_CITY_DATA } from '~/data/preview-data';
import FavoriteButton from '~/components/shared/FavoriteButton';

export default function PreviewDiscoverPage() {
    const [searchQuery, setSearchQuery] = createSignal('Best things to do in Tokyo');
    const [searchResults] = createSignal([
        ...TOKYO_ACTIVITIES,
        ...TOKYO_RESTAURANTS,
        ...TOKYO_HOTELS
    ]);

    const handleSearch = (e: Event) => {
        e.preventDefault();
        alert("This is a preview with Tokyo data. Sign in to search the world!");
    };

    return (
        <>
            <Title>Discover Preview - Loci</Title>
            <Meta name="robots" content="noindex" />

            <div class="min-h-screen relative transition-colors">
                {/* Header */}
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div class="loci-hero">
                        <div class="loci-hero__content p-6 sm:p-8 space-y-6">
                            <div class="inline-block px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800">
                                Live Preview
                            </div>
                            <div class="flex items-center gap-3">
                                <div class="relative">
                                    <div class="absolute -inset-1 bg-gradient-to-tr from-blue-500/60 via-cyan-500/60 to-purple-600/60 blur-md opacity-80" />
                                    <div class="relative w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white shadow-lg ring-2 ring-white/60">
                                        <Sparkles class="w-6 h-6" />
                                    </div>
                                </div>
                                <div>
                                    <h1 class="text-3xl sm:text-4xl font-bold tracking-tight">Discover</h1>
                                    <p class="text-white/80 text-sm mt-1">
                                        AI-curated routes, fresh drops, and local pulse in one place.
                                    </p>
                                </div>
                            </div>

                            {/* Search Bar */}
                            <div class="glass-panel rounded-2xl p-6 shadow-lg border">
                                <form onSubmit={handleSearch} class="relative">
                                    <div class="flex flex-col md:flex-row gap-4">
                                        <div class="flex-1 relative">
                                            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 w-5 h-5" />
                                            <input
                                                type="text"
                                                value={searchQuery()}
                                                onInput={(e) => setSearchQuery(e.currentTarget.value)}
                                                class="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-300/80 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/95 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-500 text-base transition-all"
                                            />
                                        </div>
                                        <div class="flex gap-2">
                                            <input
                                                type="text"
                                                value="Tokyo, Japan"
                                                readOnly
                                                class="px-4 py-3 rounded-xl border-2 border-gray-300/80 dark:border-slate-800/70 bg-white/95 dark:bg-slate-900/60 text-gray-900 dark:text-white w-40 md:w-48 backdrop-blur"
                                            />
                                            <button
                                                type="submit"
                                                class="px-6 py-3 text-white rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 dark:bg-[#0c7df2] dark:hover:bg-[#0a6ed6] transition-all font-semibold flex items-center justify-center border border-white/30 dark:border-slate-800/60"
                                            >
                                                <Search class="w-5 h-5 mr-2" />
                                                Search
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Search Results */}
                    <div class="mb-10">
                        <div class="flex items-center justify-between mb-3">
                            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Preview Results: Tokyo</h2>
                            <p class="text-sm text-gray-600 dark:text-gray-400">
                                {searchResults().length} places
                            </p>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <For each={searchResults()}>
                                {(poi) => (
                                    <div class="glass-panel rounded-2xl p-4 hover:shadow-xl hover:scale-[1.02] transition-all duration-200 cursor-pointer">
                                        <div class="flex items-start justify-between gap-3 mb-2">
                                            <div class="flex-1">
                                                <h3 class="text-base font-semibold text-gray-900 dark:text-white">{poi.name}</h3>
                                                <div class="flex items-center gap-2 mt-1">
                                                    <span class="text-xs font-medium px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                                                        {poi.category}
                                                    </span>
                                                    <span class="text-xs text-gray-500">{poi.price_level}</span>
                                                </div>
                                            </div>
                                            <div class="flex items-center gap-2">
                                                <FavoriteButton
                                                    item={{
                                                        id: poi.name,
                                                        name: poi.name,
                                                        contentType: 'poi',
                                                        description: poi.description,
                                                    }}
                                                    size="sm"
                                                    // Mock functionality
                                                    onClick={(e: Event) => { e.preventDefault(); alert("Sign in to save favorites!"); }}
                                                />
                                            </div>
                                        </div>
                                        <p class="text-sm text-gray-700 dark:text-gray-400 line-clamp-2 mb-3 leading-relaxed">
                                            {poi.description}
                                        </p>
                                        <div class="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-500">
                                            <div class="flex items-center gap-1">
                                                <Star class="w-4 h-4 text-amber-500 dark:text-yellow-500 fill-current" />
                                                <span class="font-medium">{poi.rating}</span>
                                            </div>
                                            <div class="flex items-center gap-1">
                                                <MapPin class="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                <span class="font-medium">{poi.address}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </For>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
