import { createSignal, createEffect, For, Show, onMount } from 'solid-js';
import { Heart, MapPin, Clock, Star, Filter, Search, Grid, List, Share2, Download, Edit3, Trash2, Plus, SortAsc, SortDesc, Tag, Eye } from 'lucide-solid';
import { useFavorites, useRemoveFromFavoritesMutation } from '@/lib/api/pois';

export default function FavoritesPage() {
    const [viewMode, setViewMode] = createSignal('grid'); // 'grid', 'list'
    const [searchQuery, setSearchQuery] = createSignal('');
    const [selectedCategory, setSelectedCategory] = createSignal('all');
    const [sortBy, setSortBy] = createSignal('dateAdded'); // 'dateAdded', 'name', 'rating', 'category'
    const [sortOrder, setSortOrder] = createSignal('desc'); // 'asc', 'desc'
    const [selectedPOIs, setSelectedPOIs] = createSignal([]);
    const [showBulkActions, setShowBulkActions] = createSignal(false);

    // API hooks
    const favoritesQuery = useFavorites();
    const removeFavoriteMutation = useRemoveFromFavoritesMutation();

    // Get favorites from API or fallback to empty array
    const favorites = () => favoritesQuery.data || [];

    const categories = [
        { id: 'all', label: 'All Categories', count: favorites().length },
        { id: 'architecture', label: 'Architecture', count: 3 },
        { id: 'museums', label: 'Museums', count: 1 },
        { id: 'nature', label: 'Nature & Parks', count: 1 },
        { id: 'landmarks', label: 'Landmarks', count: 2 }
    ];

    const sortOptions = [
        { id: 'dateAdded', label: 'Date Added' },
        { id: 'name', label: 'Name' },
        { id: 'rating', label: 'Rating' },
        { id: 'category', label: 'Category' }
    ];

    // Filter and sort favorites
    const filteredFavorites = () => {
        let filtered = favorites();

        // Search filter
        if (searchQuery()) {
            const query = searchQuery().toLowerCase();
            filtered = filtered.filter(fav =>
                fav.name.toLowerCase().includes(query) ||
                fav.description.toLowerCase().includes(query) ||
                fav.category.toLowerCase().includes(query) ||
                fav.city.toLowerCase().includes(query) ||
                fav.tags.some(tag => tag.toLowerCase().includes(query))
            );
        }

        // Category filter
        if (selectedCategory() !== 'all') {
            filtered = filtered.filter(fav =>
                fav.tags.some(tag => tag.toLowerCase().includes(selectedCategory()))
            );
        }

        // Sort
        filtered.sort((a, b) => {
            let aVal, bVal;
            switch (sortBy()) {
                case 'name':
                    aVal = a.name.toLowerCase();
                    bVal = b.name.toLowerCase();
                    break;
                case 'rating':
                    aVal = a.rating;
                    bVal = b.rating;
                    break;
                case 'category':
                    aVal = a.category.toLowerCase();
                    bVal = b.category.toLowerCase();
                    break;
                case 'dateAdded':
                default:
                    aVal = new Date(a.dateAdded);
                    bVal = new Date(b.dateAdded);
                    break;
            }

            if (sortOrder() === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });

        return filtered;
    };

    const togglePOISelection = (poiId) => {
        setSelectedPOIs(prev =>
            prev.includes(poiId)
                ? prev.filter(id => id !== poiId)
                : [...prev, poiId]
        );
    };

    const selectAllPOIs = () => {
        setSelectedPOIs(filteredFavorites().map(fav => fav.id));
    };

    const clearSelection = () => {
        setSelectedPOIs([]);
    };

    const getBudgetColor = (budget) => {
        const colorMap = {
            'Free': 'text-green-600 bg-green-50',
            '€': 'text-blue-600 bg-blue-50',
            '€€': 'text-orange-600 bg-orange-50',
            '€€€': 'text-red-600 bg-red-50'
        };
        return colorMap[budget] || 'text-gray-600 bg-gray-50';
    };

    const removeFavorite = async (favoriteId) => {
        try {
            await removeFavoriteMutation.mutateAsync(favoriteId);
        } catch (error) {
            console.error('Failed to remove favorite:', error);
        }
    };

    const toggleFavoriteVisibility = (favoriteId) => {
        setFavorites(prev => prev.map(fav =>
            fav.id === favoriteId ? { ...fav, isPublic: !fav.isPublic } : fav
        ));
    };

    const renderGridCard = (favorite) => (
        <div class="cb-card group hover:shadow-lg transition-all duration-300 overflow-hidden">
            {/* Image */}
            <div class="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden">
                <div class="absolute inset-0 flex items-center justify-center text-4xl">
                    🏛️
                </div>
                
                {/* Selection checkbox */}
                <div class="absolute top-3 left-3">
                    <input
                        type="checkbox"
                        checked={selectedPOIs().includes(favorite.id)}
                        onChange={() => togglePOISelection(favorite.id)}
                        class="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                </div>

                {/* Action buttons */}
                <div class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div class="flex gap-1">
                        <button
                            onClick={() => toggleFavoriteVisibility(favorite.id)}
                            class={`p-1.5 rounded-lg ${favorite.isPublic ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'} hover:opacity-80`}
                            title={favorite.isPublic ? 'Public' : 'Private'}
                        >
                            <Eye class="w-3 h-3" />
                        </button>
                        <button class="p-1.5 bg-white/90 text-gray-700 rounded-lg hover:bg-white">
                            <Share2 class="w-3 h-3" />
                        </button>
                        <button
                            onClick={() => removeFavorite(favorite.id)}
                            class="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                            <Trash2 class="w-3 h-3" />
                        </button>
                    </div>
                </div>

                {/* Rating badge */}
                <div class="absolute bottom-3 left-3">
                    <div class="flex items-center gap-1 bg-white/90 rounded-full px-2 py-1 text-xs font-medium">
                        <Star class="w-3 h-3 text-yellow-500 fill-current" />
                        <span>{favorite.rating}</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div class="p-4">
                <div class="flex items-start justify-between mb-2">
                    <div class="flex-1 min-w-0">
                        <h3 class="font-semibold text-gray-900 text-sm mb-1 truncate">{favorite.name}</h3>
                        <p class="text-xs text-gray-500 mb-2">{favorite.category}</p>
                    </div>
                </div>

                <p class="text-xs text-gray-600 mb-3 line-clamp-2">{favorite.description}</p>

                {/* Details */}
                <div class="flex items-center gap-3 text-xs text-gray-500 mb-3">
                    <div class="flex items-center gap-1">
                        <MapPin class="w-3 h-3" />
                        <span>{favorite.city}</span>
                    </div>
                    <div class="flex items-center gap-1">
                        <Clock class="w-3 h-3" />
                        <span>{favorite.timeToSpend}</span>
                    </div>
                </div>

                {/* Tags and budget */}
                <div class="flex items-center justify-between">
                    <div class="flex flex-wrap gap-1">
                        {favorite.tags.slice(0, 2).map(tag => (
                            <span class="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                                {tag}
                            </span>
                        ))}
                        {favorite.tags.length > 2 && (
                            <span class="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                                +{favorite.tags.length - 2}
                            </span>
                        )}
                    </div>
                    <span class={`px-2 py-0.5 rounded-full text-xs font-medium ${getBudgetColor(favorite.budget)}`}>
                        {favorite.budget}
                    </span>
                </div>

                {/* Notes preview */}
                <Show when={favorite.notes}>
                    <div class="mt-3 pt-3 border-t border-gray-100">
                        <p class="text-xs text-gray-600 italic line-clamp-1">"{favorite.notes}"</p>
                    </div>
                </Show>
            </div>
        </div>
    );

    const renderListItem = (favorite) => (
        <div class="cb-card hover:shadow-md transition-all duration-200">
            <div class="p-4">
                <div class="flex items-start gap-4">
                    {/* Selection checkbox */}
                    <input
                        type="checkbox"
                        checked={selectedPOIs().includes(favorite.id)}
                        onChange={() => togglePOISelection(favorite.id)}
                        class="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />

                    {/* Image placeholder */}
                    <div class="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                        🏛️
                    </div>

                    {/* Content */}
                    <div class="flex-1 min-w-0">
                        <div class="flex items-start justify-between mb-2">
                            <div>
                                <h3 class="font-semibold text-gray-900 text-base">{favorite.name}</h3>
                                <p class="text-sm text-gray-500">{favorite.category} • {favorite.city}, {favorite.country}</p>
                            </div>
                            <div class="flex items-center gap-1 text-sm">
                                <Star class="w-4 h-4 text-yellow-500 fill-current" />
                                <span class="text-gray-600">{favorite.rating}</span>
                            </div>
                        </div>

                        <p class="text-sm text-gray-600 mb-3">{favorite.description}</p>

                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-4 text-sm text-gray-500">
                                <div class="flex items-center gap-1">
                                    <Clock class="w-4 h-4" />
                                    <span>{favorite.timeToSpend}</span>
                                </div>
                                <span class={`px-2 py-1 rounded-full text-xs font-medium ${getBudgetColor(favorite.budget)}`}>
                                    {favorite.budget}
                                </span>
                                <span class="text-xs">Added {new Date(favorite.dateAdded).toLocaleDateString()}</span>
                            </div>

                            {/* Action buttons */}
                            <div class="flex items-center gap-2">
                                <button
                                    onClick={() => toggleFavoriteVisibility(favorite.id)}
                                    class={`p-2 rounded-lg ${favorite.isPublic ? 'text-green-600 hover:bg-green-50' : 'text-gray-600 hover:bg-gray-50'}`}
                                    title={favorite.isPublic ? 'Public' : 'Private'}
                                >
                                    <Eye class="w-4 h-4" />
                                </button>
                                <button class="p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                                    <Share2 class="w-4 h-4" />
                                </button>
                                <button class="p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                                    <Edit3 class="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => removeFavorite(favorite.id)}
                                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                >
                                    <Trash2 class="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Tags */}
                        <div class="flex flex-wrap gap-1 mt-3">
                            <For each={favorite.tags}>
                                {(tag) => (
                                    <span class="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                                        {tag}
                                    </span>
                                )}
                            </For>
                        </div>

                        {/* Notes */}
                        <Show when={favorite.notes}>
                            <div class="mt-3 pt-3 border-t border-gray-100">
                                <p class="text-sm text-gray-600 italic">"{favorite.notes}"</p>
                            </div>
                        </Show>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div class="min-h-screen bg-gray-50">
            {/* Header */}
            <div class="bg-white border-b border-gray-200">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 class="text-2xl font-bold text-gray-900">My Favorites</h1>
                            <p class="text-gray-600 mt-1">{favorites().length} places you've saved</p>
                        </div>
                        <div class="flex items-center gap-3">
                            <button class="cb-button cb-button-secondary px-4 py-2 flex items-center gap-2">
                                <Download class="w-4 h-4" />
                                Export
                            </button>
                            <button class="cb-button cb-button-primary px-4 py-2 flex items-center gap-2">
                                <Plus class="w-4 h-4" />
                                Add Place
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Controls */}
            <div class="bg-white border-b border-gray-200">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div class="flex flex-col lg:flex-row lg:items-center gap-4">
                        {/* Search */}
                        <div class="relative flex-1 max-w-md">
                            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search favorites..."
                                value={searchQuery()}
                                onInput={(e) => setSearchQuery(e.target.value)}
                                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Category filter */}
                        <select
                            value={selectedCategory()}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <For each={categories}>
                                {(category) => (
                                    <option value={category.id}>{category.label} ({category.count})</option>
                                )}
                            </For>
                        </select>

                        {/* Sort */}
                        <div class="flex items-center gap-2">
                            <select
                                value={sortBy()}
                                onChange={(e) => setSortBy(e.target.value)}
                                class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <For each={sortOptions}>
                                    {(option) => <option value={option.id}>{option.label}</option>}
                                </For>
                            </select>
                            <button
                                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                                class="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                {sortOrder() === 'asc' ? <SortAsc class="w-4 h-4" /> : <SortDesc class="w-4 h-4" />}
                            </button>
                        </div>

                        {/* View mode */}
                        <div class="flex items-center border border-gray-300 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                class={`p-2 rounded ${viewMode() === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <Grid class="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                class={`p-2 rounded ${viewMode() === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <List class="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Bulk actions */}
                    <Show when={selectedPOIs().length > 0}>
                        <div class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-blue-800">
                                    {selectedPOIs().length} item{selectedPOIs().length > 1 ? 's' : ''} selected
                                </span>
                                <div class="flex items-center gap-2">
                                    <button class="text-sm text-blue-600 hover:text-blue-700">
                                        Add to List
                                    </button>
                                    <button class="text-sm text-blue-600 hover:text-blue-700">
                                        Export Selected
                                    </button>
                                    <button class="text-sm text-red-600 hover:text-red-700">
                                        Remove Selected
                                    </button>
                                    <button
                                        onClick={clearSelection}
                                        class="text-sm text-gray-600 hover:text-gray-700"
                                    >
                                        Clear Selection
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Show>
                </div>
            </div>

            {/* Content */}
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <Show
                    when={filteredFavorites().length > 0}
                    fallback={
                        <div class="text-center py-12">
                            <Heart class="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <h3 class="text-lg font-semibold text-gray-900 mb-2">No favorites found</h3>
                            <p class="text-gray-600 mb-4">
                                {searchQuery() || selectedCategory() !== 'all'
                                    ? 'Try adjusting your search or filters'
                                    : 'Start exploring and save places you love!'
                                }
                            </p>
                            <button class="cb-button cb-button-primary px-6 py-2">
                                Discover Places
                            </button>
                        </div>
                    }
                >
                    <div class={viewMode() === 'grid' 
                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
                        : "space-y-4"
                    }>
                        <For each={filteredFavorites()}>
                            {(favorite) => viewMode() === 'grid' ? renderGridCard(favorite) : renderListItem(favorite)}
                        </For>
                    </div>
                </Show>
            </div>
        </div>
    );
}