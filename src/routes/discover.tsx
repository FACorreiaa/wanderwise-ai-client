import { createSignal, For, Show, onCleanup, createEffect } from 'solid-js';
import { Title, Meta } from '@solidjs/meta';
import { Search, TrendingUp, Star, Sparkles, ChevronRight, Calendar, Clock, MapPin, Smartphone } from 'lucide-solid';
import { useDiscoverPageData, fetchRecentDiscoveries } from '~/lib/api/discover';
import type { TrendingDiscovery, POI, DomainType, ChatSession } from '~/lib/api/types';
import { useAuth } from '~/contexts/AuthContext';
import RegisterBanner from '~/components/ui/RegisterBanner';
import { sendUnifiedChatMessageStream } from '~/lib/api/llm';
import FavoriteButton from '~/components/shared/FavoriteButton';
import { Button } from '~/ui/button';

export default function DiscoverPage() {
    const { isAuthenticated } = useAuth();
    const localResultCache = new Map<string, POI[]>();
    const [searchQuery, setSearchQuery] = createSignal('');
    const [searchLocation, setSearchLocation] = createSignal('');
    const [searchResults, setSearchResults] = createSignal<POI[]>([]);
    const [isSearching, setIsSearching] = createSignal(false);
    const [searchError, setSearchError] = createSignal<string | null>(null);
    const [progressMessage, setProgressMessage] = createSignal<string | null>(null);
    const [streamDomain, setStreamDomain] = createSignal<DomainType>('general');
    const [localTrending, setLocalTrending] = createSignal<TrendingDiscovery[]>([]);
    const [recentSessions, setRecentSessions] = createSignal<ChatSession[]>([]);
    const [recentPage, setRecentPage] = createSignal(1);
    const [recentHasMore, setRecentHasMore] = createSignal(true);
    const [recentLoadingMore, setRecentLoadingMore] = createSignal(false);

    let abortController: AbortController | null = null;

    // Fetch discover page data (RPC)
    const discoverData = useDiscoverPageData();

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

    const normalizePoi = (poi: any): POI => ({
        id: poi.id || poi.llm_interaction_id || poi.name,
        name: poi.name || 'Unknown',
        category: poi.category || 'place',
        description: poi.description || poi.description_poi || poi.descriptionPoi || '',
        description_poi: poi.description_poi || poi.descriptionPoi,
        latitude: poi.latitude ?? 0,
        longitude: poi.longitude ?? 0,
        rating: poi.rating ?? 0,
        tags: poi.tags || [],
        address: poi.address || '',
        website: poi.website,
        phone_number: poi.phone_number || poi.phoneNumber,
        opening_hours: poi.opening_hours || poi.openingHours,
        price_level: poi.price_level || poi.priceLevel || '',
        price_range: poi.price_range || poi.priceRange,
        distance: poi.distance,
        city: poi.city || poi.city_name,
        city_id: poi.city_id || poi.cityId,
        llm_interaction_id: poi.llm_interaction_id,
        created_at: poi.created_at,
    });

    const byteDecoder = new TextDecoder();

    const parseStreamData = (data: any) => {
        if (!data) return null;

        const tryJson = (input: string) => {
            try {
                return JSON.parse(input);
            } catch {
                return input;
            }
        };

        // Numeric-key object that actually encodes bytes (e.g., {"0":123,...})
        if (typeof data === 'object' && !Array.isArray(data)) {
            const keys = Object.keys(data);
            const numericKeys = keys.length > 0 && keys.every((k) => /^\d+$/.test(k));
            if (numericKeys) {
                const bytes = new Uint8Array(keys.sort((a, b) => Number(a) - Number(b)).map((k) => (data as any)[k]));
                const decoded = byteDecoder.decode(bytes);
                const parsed = tryJson(decoded);
                return parsed;
            }
        }

        if (typeof data === 'string') {
            const trimmed = data.trim();
            // Detect base64-ish payloads (length multiple of 4 and only base64 chars)
            const base64Regex = /^[A-Za-z0-9+/=]+$/;
            if (base64Regex.test(trimmed)) {
                try {
                    const decoded = atob(trimmed);
                    return tryJson(decoded);
                } catch {
                    return tryJson(trimmed);
                }
            }

            // Try to pull JSON object embedded inside a string (e.g., ```json ... ``` or raw)
            const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return tryJson(jsonMatch[0]);
            }
            return tryJson(trimmed);
        }
        if (typeof data === 'object' && typeof (data as any).toJson === 'function') {
            return (data as any).toJson();
        }
        return data;
    };

    const extractPois = (payload: any): POI[] => {
        if (!payload) return [];

        // If payload is a JSON string, try parsing again
        if (typeof payload === 'string') {
            const parsed = parseStreamData(payload);
            return extractPois(parsed);
        }

        if (Array.isArray(payload)) {
            return payload.map(normalizePoi);
        }

        if (typeof payload === 'object') {
            const candidateArrays = [
                payload.hotels,
                payload.restaurants,
                payload.activities,
                (payload as any).general_pois || (payload as any).generalPois,
                payload.points_of_interest || payload.pointsOfInterest,
                payload.poi_detailed_info || payload.poiDetailedInfo,
                payload.items,
                payload.results,
                payload.accommodation_response?.hotels,
                payload.itinerary_response?.points_of_interest,
                payload.points_of_interest?.points_of_interest,
            ];

            for (const arr of candidateArrays) {
                if (Array.isArray(arr)) {
                    return arr.map(normalizePoi);
                }
            }
        }

        return [];
    };

    const handleSearch = async (e: Event) => {
        e.preventDefault();
        if (!searchQuery().trim()) return;
        const cacheKey = `${streamDomain()}:${searchQuery().trim().toLowerCase()}:${searchLocation().trim().toLowerCase()}`;

        if (localResultCache.has(cacheKey)) {
            setSearchResults(localResultCache.get(cacheKey) || []);
            setSearchError(null);
            setProgressMessage('Loaded from cache');
            setIsSearching(false);
            return;
        }

        if (abortController) {
            abortController.abort();
        }
        const controller = new AbortController();
        abortController = controller;

        setSearchError(null);
        setIsSearching(true);
        setProgressMessage('Starting discover stream...');
        setSearchResults([]);

        try {
            const response = await sendUnifiedChatMessageStream({
                profileId: '',
                cityName: searchLocation().trim() || undefined,
                message: searchQuery().trim(),
                contextType: 'general',
            });

            const reader = response.body?.getReader();
            if (!reader) {
                throw new Error('No response body from stream');
            }

            const decoder = new TextDecoder();
            let buffer = '';

            const processBuffer = () => {
                // Log raw buffer to debug streaming format issues
                console.info('[discover stream][buffer]', buffer);

                const lines = buffer.split(/\r?\n/);
                buffer = lines.pop() || '';

                for (const rawLine of lines) {
                    // eslint-disable-next-line no-control-regex
                    const cleanedLine = rawLine.replace(/\u0000/g, '').trim();
                    console.info('[discover stream][line]', cleanedLine);
                    if (!cleanedLine.startsWith('data:')) continue;
                    const payload = cleanedLine.slice(cleanedLine.indexOf(':') + 1).trimStart();
                    if (!payload) continue;
                    try {
                        // Surface every raw SSE line for debugging visibility
                        console.log('[discover stream raw line]', cleanedLine);
                        const event = JSON.parse(payload);
                        // Debug log for raw streaming content
                        console.log('[discover stream]', { raw: payload, event });
                        const parsedData = parseStreamData(event.data);
                        // Debug: surface raw stream content while we validate parsing
                        console.log('[discover stream]', { event, parsedData });

                        switch (event.type) {
                            case 'start':
                                setProgressMessage('Detecting what you need...');
                                if (parsedData?.domain) setStreamDomain(parsedData.domain as DomainType);
                                break;
                            case 'chunk':
                                setProgressMessage(typeof parsedData === 'string' ? parsedData : 'Thinking...');
                                {
                                    // Some streams send partial strings inside `chunk`; ignore until we have objects/arrays.
                                    const pois = extractPois(parsedData);
                                    if (pois.length > 0) {
                                        setSearchResults(pois);
                                        localResultCache.set(cacheKey, pois);
                                        setProgressMessage('Found places you might like');
                                    }
                                }
                                break;
                            case 'city_data':
                                setProgressMessage('Mapping the city context...');
                                break;
                            case 'general_pois':
                            case 'restaurants':
                            case 'hotels':
                            case 'activities': {
                                const list = extractPois(parsedData);
                                setSearchResults(list);
                                setProgressMessage('Found places you might like');
                                break;
                            }
                            case 'itinerary':
                                setProgressMessage('Drafting an itinerary...');
                                {
                                    const pois = extractPois(parsedData);
                                    if (pois.length > 0) {
                                        setSearchResults(pois);
                                    }
                                }
                                break;
                            case 'complete':
                                if (event.navigation?.routeType) {
                                    setStreamDomain(event.navigation.routeType as DomainType);
                                }
                                {
                                    const sessionId = event.navigation?.queryParams?.sessionId || crypto.randomUUID();
                                    const cityName = event.navigation?.queryParams?.cityName || searchLocation().trim() || searchQuery().trim() || 'Unknown City';
                                    const newSession: ChatSession = {
                                        id: sessionId,
                                        profile_id: '',
                                        created_at: new Date().toISOString(),
                                        updated_at: new Date().toISOString(),
                                        city_name: cityName,
                                        conversation_history: [],
                                    } as any;
                                    setRecentSessions((prev) => {
                                        const map = new Map(prev.map((s) => [s.id, s]));
                                        map.set(newSession.id, newSession);
                                        return Array.from(map.values()).sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
                                    });
                                    setRecentHasMore(true);
                                    setLocalTrending((prev) => {
                                        const base = prev.length > 0 ? [...prev] : [...(discoverData.data?.trending || [])];
                                        const idx = base.findIndex((t) => t.city_name.toLowerCase() === cityName.toLowerCase());
                                        if (idx >= 0) {
                                            base[idx] = { ...base[idx], search_count: (base[idx].search_count || 0) + 1 };
                                        } else {
                                            base.unshift({ city_name: cityName, search_count: 1, emoji: '🗺️', category: '', first_message: '' } as TrendingDiscovery);
                                        }
                                        return base;
                                    });
                                }
                                setIsSearching(false);
                                setProgressMessage(null);
                                break;
                            case 'error': {
                                const rawError = event.error || 'Something went wrong';
                                let friendlyError = rawError;

                                // Check for common backend errors (Quota, Rate Limit, etc.)
                                if (rawError.includes('Quota exceeded') || rawError.includes('RESOURCE_EXHAUSTED') || rawError.includes('429')) {
                                    friendlyError = 'Our AI travel guide is currently experiencing high verification traffic. Please try again in a few moments.';
                                }

                                setSearchError(friendlyError);
                                setIsSearching(false);
                                setProgressMessage(null);
                                break;
                            }
                            default:
                                break;
                        }
                    } catch (err) {
                        console.error('Failed to parse discover stream event', err, payload);
                    }
                }
            };

            while (!controller.signal.aborted) {
                const { value, done } = await reader.read();
                buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
                processBuffer();
                if (done) break;
            }
            // Flush any remaining buffered data
            processBuffer();
        } catch (err: any) {
            console.error('Discover search failed', err);
            if (err?.name !== 'AbortError') {
                const friendly =
                    err?.code === 'aborted' || err?.name === 'AbortError'
                        ? 'Search was canceled.'
                        : 'We lost connection while searching. Please try again.';
                setSearchError(friendly);
            }
            setSearchResults([]);
        } finally {
            setIsSearching(false);
            setProgressMessage(null);
            abortController = null;
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

    onCleanup(() => {
        if (abortController) {
            abortController.abort();
        }
    });

    const fallbackTrending: TrendingDiscovery[] = [
        { city_name: 'Lisbon', search_count: 128, emoji: '🌊' },
        { city_name: 'Barcelona', search_count: 102, emoji: '🌆' },
        { city_name: 'Tokyo', search_count: 96, emoji: '🍜' },
    ];

    const trendingList = () => {
        const base = discoverData.data?.trending || (discoverData.data as any)?.data?.trending || (discoverData.isError ? fallbackTrending : []);
        const local = localTrending();
        return local.length > 0 ? local : base;
    };
    const featuredList = () => discoverData.data?.featured || (discoverData.data as any)?.data?.featured || [];
    const recentList = () => discoverData.data?.recent_discoveries || (discoverData.data as any)?.data?.recent_discoveries || [];

    createEffect(() => {
        // Seed recents from initial page data
        const recents = recentList() || [];
        setRecentSessions(recents);
        setRecentPage(1);
        // Optimistic hasMore: if we filled a whole page, we can probably load more
        setRecentHasMore(recents.length >= 10);
        const trendingSeed = discoverData.data?.trending || (discoverData.data as any)?.data?.trending || [];
        setLocalTrending(trendingSeed);
    });

    const loadMoreRecents = async () => {
        if (recentLoadingMore() || !recentHasMore()) return;
        setRecentLoadingMore(true);
        const nextPage = recentPage() + 1;
        try {
            const { sessions, pagination } = await fetchRecentDiscoveries(nextPage, 10);
            if (sessions.length > 0) {
                const existing = new Map(recentSessions().map((s) => [s.id, s]));
                sessions.forEach((s) => existing.set(s.id, s));
                setRecentSessions(Array.from(existing.values()));
                setRecentPage(nextPage);
            }
            const hasMore = pagination?.has_more ?? sessions.length >= 10;
            setRecentHasMore(hasMore);
        } catch (err) {
            console.error('Failed to load more recent discoveries', err);
            setRecentHasMore(false);
        } finally {
            setRecentLoadingMore(false);
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'Just now';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Just now';
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

    console.log('search results', searchResults());

    return (
        <>
            <Title>Discover - Trending Cities & AI-Curated Travel Experiences | Loci</Title>
            <Meta name="description" content="Explore trending destinations, featured collections, and AI-curated travel experiences. Search for restaurants, hotels, activities, and attractions with intelligent recommendations." />
            <Meta name="keywords" content="travel discovery, trending cities, travel search, featured collections, AI recommendations, restaurants, hotels, activities, travel trends" />
            <Meta property="og:title" content="Discover - Trending Cities & Curated Experiences | Loci" />
            <Meta property="og:description" content="Explore trending destinations and AI-curated travel collections. Search for the perfect restaurants, hotels, and activities." />
            <Meta property="og:url" content="https://loci.app/discover" />
            <Meta name="twitter:title" content="Discover - Trending Travel Experiences | Loci" />
            <Meta name="twitter:description" content="Explore trending cities and AI-curated collections for restaurants, hotels, and activities." />
            <link rel="canonical" href="https://loci.app/discover" />

            <div class="min-h-screen relative transition-colors">
                {/* Header */}
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div class="loci-hero">
                        <div class="loci-hero__content p-6 sm:p-8 space-y-6">
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
                                                id="discover-search-input"
                                                type="text"
                                                placeholder="What are you looking for? (e.g., 'best ramen in Tokyo')"
                                                value={searchQuery()}
                                                onInput={(e) => setSearchQuery(e.currentTarget.value)}
                                                class="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-300/80 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/95 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-500 text-base transition-all"
                                            />
                                        </div>
                                        <div class="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Location (optional)"
                                                value={searchLocation()}
                                                onInput={(e) => setSearchLocation(e.currentTarget.value)}
                                                class="px-4 py-3 rounded-xl border-2 border-gray-300/80 dark:border-slate-800/70 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/95 dark:bg-slate-900/60 text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-500 w-40 md:w-48 backdrop-blur transition-all"
                                            />
                                            <Button
                                                type="submit"
                                                disabled={!searchQuery().trim()}
                                                class="gap-2"
                                            >
                                                <Search class="w-5 h-5" />
                                                Search
                                            </Button>
                                        </div>
                                    </div>
                                </form>
                                <Show when={progressMessage()}>
                                    <p class="mt-3 text-sm text-blue-900 dark:text-blue-200 font-medium">
                                        {progressMessage()}
                                    </p>
                                </Show>
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
                                    {progressMessage() || (isSearching() ? 'Searching...' : `${searchResults().length} places`)}
                                </p>
                            </div>
                            <Show when={searchResults().length > 0}>
                                <div class="text-xs text-blue-800 dark:text-blue-200 mb-3">
                                    Mode: {streamDomain()}
                                </div>
                            </Show>
                            <Show when={searchError()}>
                                <p class="text-sm text-red-600 dark:text-red-400 mb-3">{searchError()}</p>
                            </Show>
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <Show when={!isSearching()} fallback={
                                    <div class="md:col-span-2 lg:col-span-3 space-y-3">
                                        <For each={[1, 2, 3]}>
                                            {() => <div class="h-24 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />}
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
                                                <div class="glass-panel rounded-2xl p-4 hover:shadow-xl hover:scale-[1.02] transition-all duration-200 cursor-pointer">
                                                    <div class="flex items-start justify-between gap-3 mb-2">
                                                        <div class="flex-1">
                                                            <h3 class="text-base font-semibold text-gray-900 dark:text-white">{poi.name}</h3>
                                                            <p class="text-xs font-medium text-gray-600 dark:text-gray-400">{poi.category || 'Place'}</p>
                                                        </div>
                                                        <div class="flex items-center gap-2">
                                                            <FavoriteButton
                                                                item={{
                                                                    id: poi.id || poi.name,
                                                                    name: poi.name,
                                                                    contentType: 'poi',
                                                                    description: poi.description_poi || poi.description || '',
                                                                }}
                                                                size="sm"
                                                            />
                                                            <span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-100 to-cyan-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 border border-blue-200/50 dark:border-blue-800/50">
                                                                {poi.city || 'Unknown'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <p class="text-sm text-gray-700 dark:text-gray-400 line-clamp-2 mb-3 leading-relaxed">
                                                        {poi.description_poi || poi.description || 'No description provided.'}
                                                    </p>
                                                    <div class="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-500">
                                                        <div class="flex items-center gap-1">
                                                            <Star class="w-4 h-4 text-amber-500 dark:text-yellow-500 fill-current" />
                                                            <span class="font-medium">{poi.rating ?? '4.0'}</span>
                                                        </div>
                                                        <div class="flex items-center gap-1">
                                                            <MapPin class="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                            <span class="font-medium">{poi.city || 'N/A'}</span>
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
                                        class="glass-panel p-3 rounded-xl hover:shadow-lg hover:scale-105 hover:border-blue-400/60 dark:hover:border-blue-300 transition-all duration-200 group text-center"
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
                                    helper={<p class="text-xs font-medium text-gray-700 dark:text-gray-400">Stay in guest mode to search only.</p>}
                                />
                                <div class="rounded-2xl border border-gray-300/70 dark:border-white/10 bg-gradient-to-br from-blue-50/40 via-cyan-50/40 to-amber-50/30 dark:from-[#1e66f5]/10 dark:via-[#04a5e5]/10 dark:to-[#df8e1d]/10 p-5 sm:p-6 shadow-[0_20px_70px_rgba(4,165,229,0.25)]">
                                    <div class="flex items-start gap-3">
                                        <div class="p-3 rounded-xl bg-gradient-to-br from-blue-100/95 to-cyan-100/95 dark:bg-white/10 text-blue-700 dark:text-white border border-blue-200/70 dark:border-white/20 shadow-sm">
                                            <Smartphone class="w-5 h-5" />
                                        </div>
                                        <div class="space-y-2">
                                            <p class="text-xs uppercase tracking-[0.16em] font-medium text-blue-700/80 dark:text-slate-300">Native apps incoming</p>
                                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">iOS + Android with paid-only perks</h3>
                                            <p class="text-sm text-gray-800 dark:text-slate-200/85 leading-relaxed">
                                                Join the waitlist to unlock offline brains, background updates twice daily, and taste profiles synced across devices.
                                            </p>
                                            <div class="flex flex-wrap gap-2 text-xs">
                                                <For each={["Offline maps", "Push nearby picks", "Premium taste graph", "Download itineraries"]}>{(chip) => (
                                                    <span class="px-2.5 py-1.5 rounded-full bg-white/90 dark:bg-white/10 border border-blue-200/60 dark:border-white/20 text-gray-800 dark:text-white font-medium shadow-sm">{chip}</span>
                                                )}</For>
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
                                                        <div class="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl h-20" />
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
                                                            class="w-full flex items-center gap-3 p-4 glass-panel rounded-xl hover:border-blue-400/60 dark:hover:border-blue-300 hover:shadow-lg cursor-pointer transition-all duration-200 group"
                                                        >
                                                            <div class="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-100 to-cyan-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm font-bold shadow-sm">
                                                                {index() + 1}
                                                            </div>
                                                            <span class="text-2xl">{item.emoji}</span>
                                                            <div class="flex-1 text-left">
                                                                <p class="font-semibold text-gray-900 dark:text-white text-sm">{item.city_name}</p>
                                                                <p class="text-xs font-medium text-gray-600 dark:text-gray-400">{item.search_count} searches today</p>
                                                            </div>
                                                            <ChevronRight class="w-5 h-5 text-blue-600 dark:text-blue-500 group-hover:translate-x-1 transition-transform" />
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
                                                        <div class="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl h-24" />
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
                                                            class="flex items-center gap-3 p-4 glass-panel rounded-xl hover:border-amber-400/60 dark:hover:border-yellow-300 hover:shadow-lg cursor-pointer transition-all duration-200 group"
                                                        >
                                                            <span class="text-3xl">{item.emoji}</span>
                                                            <div class="flex-1 text-left">
                                                                <p class="font-semibold text-gray-900 dark:text-white text-sm">{item.title}</p>
                                                                <p class="text-xs font-medium text-gray-600 dark:text-gray-400">{item.item_count} items</p>
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
                                                        <div class="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl h-32" />
                                                    )}
                                                </For>
                                            </div>
                                        }
                                    >
                                        <Show
                                            when={recentSessions().length > 0}
                                            fallback={
                                                <div class="text-center py-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                                                    <div class="text-4xl mb-3">🔍</div>
                                                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">No recent discoveries yet</p>
                                                    <p class="text-xs text-gray-400 dark:text-gray-500">Start exploring to see your history</p>
                                                </div>
                                            }
                                        >
                                            <div class="space-y-3">
                                                <For each={recentSessions()}>
                                                    {(session) => (
                                                        <div class="glass-panel rounded-xl p-4 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer">
                                                            <div class="flex items-start gap-3 mb-3">
                                                                <span class="text-2xl">🗺️</span>
                                                                <div class="flex-1 min-w-0">
                                                                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-100 to-cyan-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/50 mb-2">
                                                                        Discovery
                                                                    </span>
                                                                    <h3 class="font-semibold text-gray-900 dark:text-white text-sm truncate">
                                                                        {session.city_name || 'Unknown City'}
                                                                    </h3>
                                                                </div>
                                                            </div>
                                                            <div class="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                                                                <Calendar class="w-3 h-3" />
                                                                <span>{formatDate(session.created_at)}</span>
                                                            </div>
                                                            <Show when={(session as any).conversation_history && (session as any).conversation_history.length > 0}>
                                                                <p class="text-xs text-gray-700 dark:text-gray-400 line-clamp-2 leading-relaxed">
                                                                    {(session as any).conversation_history[0]?.content || 'No description'}
                                                                </p>
                                                            </Show>
                                                        </div>
                                                    )}
                                                </For>
                                                <Show when={recentHasMore()}>
                                                    <button
                                                        class="w-full mt-2 text-sm font-semibold text-blue-700 dark:text-blue-200 px-3 py-2 rounded-lg border border-blue-200/60 dark:border-blue-800/60 bg-white dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition disabled:opacity-60"
                                                        onClick={loadMoreRecents}
                                                        disabled={recentLoadingMore()}
                                                    >
                                                        {recentLoadingMore() ? 'Loading more...' : 'Load more'}
                                                    </button>
                                                </Show>
                                            </div>
                                        </Show>
                                    </Show>
                                </div>
                            </div>
                        </div>
                    </Show>
                </div>
            </div>
        </>
    );
}
