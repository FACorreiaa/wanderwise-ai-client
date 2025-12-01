import { createSignal, For, Show } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { Search, TrendingUp, Star, Sparkles, ChevronRight, Calendar, Clock, MapPin, Smartphone } from 'lucide-solid';
import { useDiscoverPageData } from '~/lib/api/discover';
import type { TrendingDiscovery, FeaturedCollection, POI } from '~/lib/api/types';
import { apiRequest } from '~/lib/api/shared';
import { useAuth } from '~/contexts/AuthContext';
import RegisterBanner from '~/components/ui/RegisterBanner';

export default function DiscoverPage() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [searchQuery, setSearchQuery] = createSignal('');
    const [searchLocation, setSearchLocation] = createSignal('');
    const [selectedCategory, setSelectedCategory] = createSignal<string | null>(null);
    const [searchResults, setSearchResults] = createSignal<POI[]>([]);
    const [isSearching, setIsSearching] = createSignal(false);
    const [searchError, setSearchError] = createSignal<string | null>(null);

    // Fetch discover page data
    const discoverData = useDiscoverPageData(5);

    // Category data matching go-templui
    const categories = [
        { name: 'Restaurants', emoji: '🍽️', category: 'restaurant' },
        { name: 'Hotels', emoji: '🏨', category: 'hotel' },
        { name: 'Activities', emoji: '🎯', category: 'activity' },
        { name: 'Attractions', emoji: '🏛️', category: 'attraction' },
        { name: 'Nightlife', emoji: '🌃', category: 'nightlife' },
        { name: 'Shopping', emoji: '🛍️', category: 'shopping' },
        { name: 'Museums', emoji: '🎨', category: 'museum' },
        { name: 'Parks', emoji: '🌳', category: 'park' },
        { name: 'Beaches', emoji: '🏖️', category: 'beach' },
        { name: 'Adventure', emoji: '⛰️', category: 'adventure' },
        { name: 'Cultural', emoji: '🎭', category: 'cultural' },
        { name: 'Markets', emoji: '🏪', category: 'market' }
    ];

    const handleSearch = async (e: Event) => {
        e.preventDefault();
        if (!searchQuery().trim()) return;

        setSearchError(null);
        setIsSearching(true);
        try {
            const params = new URLSearchParams({ q: searchQuery().trim() });
            if (searchLocation().trim()) params.append('city', searchLocation().trim());
            const results = await apiRequest<{ pois?: POI[] } | POI[]>(`/pois/search?${params.toString()}`);
            const pois = Array.isArray(results) ? results : results.pois || [];
            setSearchResults(pois);
        } catch (err: any) {
            console.error('Discover search failed', err);
            setSearchError(err?.message || 'Failed to search');
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const handleCategoryClick = (category: string, name: string) => {
        setSearchQuery(name);
        // Focus on search input after category selection
        const searchInput = document.getElementById('discover-search-input');
        if (searchInput) {
            searchInput.focus();
        }
    };

    const handleTrendingClick = (trending: TrendingDiscovery) => {
        setSearchLocation(trending.city_name);
        const searchInput = document.getElementById('discover-search-input');
        if (searchInput) {
            searchInput.focus();
        }
    };

    const fallbackTrending: TrendingDiscovery[] = [
        { city_name: 'Lisbon', search_count: 128, emoji: '🌊' },
        { city_name: 'Barcelona', search_count: 102, emoji: '🌆' },
        { city_name: 'Tokyo', search_count: 96, emoji: '🍜' },
    ];

    const trendingList = () => discoverData.data?.trending || (discoverData.data as any)?.data?.trending || (discoverData.isError ? fallbackTrending : []);
    const featuredList = () => discoverData.data?.featured || (discoverData.data as any)?.data?.featured || [];
    const recentList = () => discoverData.data?.recent_discoveries || (discoverData.data as any)?.data?.recent_discoveries || [];

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now.getTime() - date.getTime();
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours} hours ago`;
        if (diffInDays === 1) return 'Yesterday';
        if (diffInDays < 7) return `${diffInDays} days ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div class="min-h-screen relative transition-colors">
            {/* Header */}
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div class="loci-hero">
                    <div class="loci-hero__content p-6 sm:p-8 space-y-6">
                        <div class="flex items-center gap-3">
                            <div class="relative">
                                <div class="absolute -inset-1 bg-gradient-to-tr from-blue-500/60 via-cyan-500/60 to-purple-600/60 blur-md opacity-80"></div>
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
                        <div class="loci-card rounded-2xl p-6 shadow-sm border-0">
                            <form onSubmit={handleSearch} class="relative">
                                <div class="flex flex-col md:flex-row gap-4">
                                    <div class="flex-1 relative">
                                        <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            id="discover-search-input"
                                            type="text"
                                            placeholder="What are you looking for? (e.g., 'best ramen in Tokyo')"
                                            value={searchQuery()}
                                            onInput={(e) => setSearchQuery(e.currentTarget.value)}
                                            class="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-base"
                                        />
                                    </div>
                                    <div class="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Location (optional)"
                                        value={searchLocation()}
                                        onInput={(e) => setSearchLocation(e.currentTarget.value)}
                                        class="px-4 py-3 rounded-xl border border-white/60 dark:border-slate-800/70 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/60 dark:bg-slate-900/60 text-gray-900 dark:text-white w-40 md:w-48 backdrop-blur"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!searchQuery().trim()}
                                        class="px-6 py-3 text-white rounded-xl bg-[#0c7df2] hover:bg-[#0a6ed6] transition-all font-semibold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_14px_32px_rgba(12,125,242,0.22)] border border-white/30 dark:border-slate-800/60"
                                    >
                                        <Search class="w-5 h-5 mr-2" />
                                        Search
                                    </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <Show when={discoverData.isError}>
                            <p class="text-sm text-white/80">
                                Couldn’t reach the discover service, showing sample data. {(discoverData.error as any)?.message || 'offline'}
                            </p>
                        </Show>
                    </div>
                </div>
            </div>

            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search Results */}
                <Show when={searchResults().length > 0 || isSearching() || searchError()}>
                    <div class="mb-10">
                        <div class="flex items-center justify-between mb-3">
                            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Search Results</h2>
                            <p class="text-sm text-gray-600 dark:text-gray-400">
                                {isSearching() ? 'Searching...' : `${searchResults().length} places`}
                            </p>
                        </div>
                        <Show when={searchError()}>
                            <p class="text-sm text-red-600 dark:text-red-400 mb-3">{searchError()}</p>
                        </Show>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <Show when={!isSearching()} fallback={
                                <div class="md:col-span-2 lg:col-span-3 space-y-3">
                                    <For each={[1,2,3]}>
                                        {() => <div class="h-24 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse"></div>}
                                    </For>
                                </div>
                            }>
                                <Show when={searchResults().length > 0} fallback={
                                    <div class="md:col-span-2 lg:col-span-3 text-center py-6 text-gray-500 dark:text-gray-400">
                                        No results yet. Try another query.
                                    </div>
                                }>
                                    <For each={searchResults()}>
                                        {(poi) => (
                                            <div class="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all">
                                                <div class="flex items-start justify-between gap-3 mb-2">
                                                    <div>
                                                        <h3 class="text-base font-semibold text-gray-900 dark:text-white">{poi.name}</h3>
                                                        <p class="text-xs text-gray-500 dark:text-gray-400">{poi.category || 'Place'}</p>
                                                    </div>
                                                    <span class="px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200">
                                                        {poi.city || 'Unknown'}
                                                    </span>
                                                </div>
                                                <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                                                    {poi.description_poi || poi.description || 'No description provided.'}
                                                </p>
                                                <div class="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                                                    <div class="flex items-center gap-1">
                                                        <Star class="w-4 h-4 text-yellow-500" />
                                                        <span>{poi.rating ?? '4.0'}</span>
                                                    </div>
                                                    <div class="flex items-center gap-1">
                                                        <MapPin class="w-4 h-4" />
                                                        <span>{poi.city || 'N/A'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </For>
                                </Show>
                            </Show>
                        </div>
                    </div>
                </Show>

                {/* Quick Categories */}
                <div class="mb-10">
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Quick Categories</h2>
                        <p class="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Tap to auto-fill</p>
                    </div>
                    <div class="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-12 gap-3">
                        <For each={categories}>
                            {(cat) => (
                                <button
                                    onClick={() => handleCategoryClick(cat.category, cat.name)}
                                    class="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all group text-center"
                                >
                                    <span class="block text-2xl mb-1 group-hover:scale-110 transition-transform">{cat.emoji}</span>
                                    <span class="block text-xs font-semibold text-gray-900 dark:text-white">{cat.name}</span>
                                </button>
                            )}
                        </For>
                    </div>
                </div>

                {/* Main Content Grid */}
                <Show
                    when={isAuthenticated()}
                    fallback={
                        <div class="space-y-6 my-8">
                            <RegisterBanner
                                title="Sign in to see trending searches and your recent discoveries"
                                description="Search is open to everyone. Trending, recent history, and personalized highlights unlock once you register."
                                helper={<p class="text-xs text-gray-600">Stay in guest mode to search only.</p>}
                            />
                            <div class="rounded-2xl border border-[hsl(223,16%,83%)]/70 dark:border-white/10 bg-gradient-to-br from-[#1e66f5]/10 via-[#04a5e5]/10 to-[#df8e1d]/10 p-5 sm:p-6 shadow-[0_20px_70px_rgba(4,165,229,0.18)]">
                                <div class="flex items-start gap-3">
                                    <div class="p-3 rounded-xl bg-white/70 dark:bg-white/10 text-[#1e66f5] dark:text-white border border-white/60 dark:border-white/20">
                                        <Smartphone class="w-5 h-5" />
                                    </div>
                                    <div class="space-y-2">
                                        <p class="text-xs uppercase tracking-[0.16em] text-[hsl(233,10%,47%)] dark:text-slate-300">Native apps incoming</p>
                                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">iOS + Android with paid-only perks</h3>
                                        <p class="text-sm text-gray-700 dark:text-slate-200/85">
                                            Join the waitlist to unlock offline brains, background updates twice daily, and taste profiles synced across devices.
                                        </p>
                                        <div class="flex flex-wrap gap-2 text-xs">
                                            {["Offline maps", "Push nearby picks", "Premium taste graph", "Download itineraries"].map((chip) => (
                                                <span class="px-2 py-1 rounded-full bg-white/70 dark:bg-white/10 border border-white/40 dark:border-white/20 text-gray-800 dark:text-white">{chip}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                >
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Trending & Featured - Takes 2 columns */}
                        <div class="lg:col-span-2 space-y-8">
                            {/* Trending Now */}
                            <div>
                                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <TrendingUp class="w-5 h-5 text-blue-500" />
                                    Trending Now
                                </h2>
                                <Show
                                    when={!discoverData.isLoading}
                                    fallback={
                                        <div class="space-y-3">
                                            <For each={[1, 2, 3]}>
                                                {() => (
                                                    <div class="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl h-20"></div>
                                                )}
                                            </For>
                                        </div>
                                    }
                                >
                                    <div class="space-y-3">
                                        <Show
                                            when={trendingList().length > 0}
                                            fallback={
                                                <p class="text-sm text-gray-500 dark:text-gray-400 py-4 text-center">
                                                    No trending discoveries yet today
                                                </p>
                                            }
                                        >
                                            <For each={trendingList()}>
                                                {(item, index) => (
                                                    <button
                                                        onClick={() => handleTrendingClick(item)}
                                                        class="w-full flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md cursor-pointer transition-all group"
                                                    >
                                                        <div class="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full text-sm font-bold">
                                                            {index() + 1}
                                                        </div>
                                                        <span class="text-2xl">{item.emoji}</span>
                                                        <div class="flex-1 text-left">
                                                            <p class="font-semibold text-gray-900 dark:text-white text-sm">{item.city_name}</p>
                                                            <p class="text-xs text-gray-500 dark:text-gray-400">{item.search_count} searches today</p>
                                                        </div>
                                                        <ChevronRight class="w-5 h-5 text-blue-500 group-hover:translate-x-1 transition-transform" />
                                                    </button>
                                                )}
                                            </For>
                                        </Show>
                                    </div>
                                </Show>
                            </div>

                            {/* Featured Collections */}
                            <div>
                                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <Star class="w-5 h-5 text-yellow-500 fill-current" />
                                    Featured Collections
                                </h2>
                                <Show
                                    when={!discoverData.isLoading}
                                    fallback={
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <For each={[1, 2, 3, 4]}>
                                                {() => (
                                                    <div class="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl h-24"></div>
                                                )}
                                            </For>
                                        </div>
                                    }
                                >
                                    <Show
                                        when={featuredList().length > 0}
                                        fallback={
                                            <p class="text-sm text-gray-500 dark:text-gray-400 py-4 text-center">
                                                No featured collections available
                                            </p>
                                        }
                                    >
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <For each={featuredList()}>
                                                {(item) => (
                                                    <button
                                                        onClick={() => handleCategoryClick(item.category, item.title)}
                                                        class="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-yellow-300 dark:hover:border-yellow-600 hover:shadow-md cursor-pointer transition-all group"
                                                    >
                                                        <span class="text-3xl">{item.emoji}</span>
                                                        <div class="flex-1 text-left">
                                                            <p class="font-semibold text-gray-900 dark:text-white text-sm">{item.title}</p>
                                                            <p class="text-xs text-gray-500 dark:text-gray-400">{item.item_count} items</p>
                                                        </div>
                                                    </button>
                                                )}
                                            </For>
                                        </div>
                                    </Show>
                                </Show>
                            </div>
                        </div>

                        {/* Recent Discoveries - Sidebar */}
                        <div class="lg:col-span-1">
                            <div class="sticky top-4">
                                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <Clock class="w-5 h-5 text-gray-500" />
                                    Recent Discoveries
                                </h2>
                                <Show
                                    when={!discoverData.isLoading}
                                    fallback={
                                        <div class="space-y-3">
                                            <For each={[1, 2, 3]}>
                                                {() => (
                                                    <div class="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl h-32"></div>
                                                )}
                                            </For>
                                        </div>
                                    }
                                >
                                    <Show
                                        when={recentList().length > 0}
                                        fallback={
                                            <div class="text-center py-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                                                <div class="text-4xl mb-3">🔍</div>
                                                <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">No recent discoveries yet</p>
                                                <p class="text-xs text-gray-400 dark:text-gray-500">Start exploring to see your history</p>
                                            </div>
                                        }
                                    >
                                        <div class="space-y-3">
                                            <For each={recentList()}>
                                                {(session) => (
                                                    <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all cursor-pointer">
                                                        <div class="flex items-start gap-3 mb-3">
                                                            <span class="text-2xl">🗺️</span>
                                                            <div class="flex-1 min-w-0">
                                                                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 mb-2">
                                                                    Discovery
                                                                </span>
                                                                <h3 class="font-semibold text-gray-900 dark:text-white text-sm truncate">
                                                                    {session.city_name || 'Unknown City'}
                                                                </h3>
                                                            </div>
                                                        </div>
                                                        <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
                                                            <Calendar class="w-3 h-3" />
                                                            <span>{formatDate(session.created_at)}</span>
                                                        </div>
                                                        <Show when={(session as any).conversation_history && (session as any).conversation_history.length > 0}>
                                                            <p class="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                                                                {(session as any).conversation_history[0]?.content || 'No description'}
                                                            </p>
                                                        </Show>
                                                    </div>
                                                )}
                                            </For>
                                        </div>
                                    </Show>
                                </Show>
                            </div>
                        </div>
                    </div>
                </Show>
            </div>
        </div>
    );
}
