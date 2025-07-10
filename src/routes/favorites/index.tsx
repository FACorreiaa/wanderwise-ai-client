import { createSignal, createEffect, For, Show, onMount } from "solid-js";
import {
  Heart,
  MapPin,
  Clock,
  Star,
  Filter,
  Search,
  Grid,
  List,
  Share2,
  Download,
  Edit3,
  Trash2,
  Plus,
  SortAsc,
  SortDesc,
  Tag,
  Eye,
} from "lucide-solid";
import { useFavorites, useRemoveFromFavoritesMutation } from "~/lib/api/pois";
import { A } from "@solidjs/router";
import Paginator from "~/components/Paginator";

export default function FavoritesPage() {
  const [viewMode, setViewMode] = createSignal("grid"); // 'grid', 'list'
  const [searchQuery, setSearchQuery] = createSignal("");
  const [selectedCategory, setSelectedCategory] = createSignal("all");
  const [sortBy, setSortBy] = createSignal("name"); // 'name', 'category', 'distance'
  const [sortOrder, setSortOrder] = createSignal("asc"); // 'asc', 'desc'
  const [selectedPOIs, setSelectedPOIs] = createSignal([]);
  const [itemsPerPage, setItemsPerPage] = createSignal(10);

  // Pagination state
  const [currentPage, setCurrentPage] = createSignal(1);

  // API hooks - Reactive query that refetches when page changes
  const favoritesQuery = () => useFavorites(currentPage(), itemsPerPage());
  const removeFavoriteMutation = useRemoveFromFavoritesMutation();

  // Get favorites from API or fallback to empty array
  const favorites = () => favoritesQuery().data?.data || [];
  const pagination = () => favoritesQuery().data?.pagination;
  // Dynamic categories based on actual data
  const categories = () => {
    const allCategories = favorites()
      .map((fav) => fav.category)
      .filter(Boolean);
    const uniqueCategories = [...new Set(allCategories)];
    const categoryCounts = uniqueCategories.map((cat) => ({
      id: cat.toLowerCase(),
      label: cat,
      count: favorites().filter((fav) => fav.category === cat).length,
    }));

    return [
      { id: "all", label: "All Categories", count: pagination()?.total || 0 },
      ...categoryCounts,
    ];
  };

  const sortOptions = [
    { id: "name", label: "Name" },
    { id: "category", label: "Category" },
    { id: "distance", label: "Distance" },
  ];

  // Filter and sort favorites
  const filteredFavorites = () => {
    let filtered = favorites();

    // Search filter
    if (searchQuery()) {
      const query = searchQuery().toLowerCase();
      filtered = filtered.filter(
        (fav) =>
          fav.name?.toLowerCase().includes(query) ||
          fav.description_poi?.toLowerCase().includes(query) ||
          fav.category?.toLowerCase().includes(query) ||
          fav.address?.toLowerCase().includes(query),
      );
    }

    // Category filter
    if (selectedCategory() !== "all") {
      filtered = filtered.filter(
        (fav) => fav.category?.toLowerCase() === selectedCategory(),
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal, bVal;
      switch (sortBy()) {
        case "name":
          aVal = a.name?.toLowerCase() || "";
          bVal = b.name?.toLowerCase() || "";
          break;
        case "category":
          aVal = a.category?.toLowerCase() || "";
          bVal = b.category?.toLowerCase() || "";
          break;
        case "distance":
          aVal = a.distance || 0;
          bVal = b.distance || 0;
          break;
        default:
          aVal = a.name?.toLowerCase() || "";
          bVal = b.name?.toLowerCase() || "";
          break;
      }

      if (sortOrder() === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  };

  const togglePOISelection = (poiId) => {
    setSelectedPOIs((prev) =>
      prev.includes(poiId)
        ? prev.filter((id) => id !== poiId)
        : [...prev, poiId],
    );
  };

  const selectAllPOIs = () => {
    setSelectedPOIs(filteredFavorites().map((fav) => fav.id));
  };

  // Pagination handler
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Reset selection when changing pages
    setSelectedPOIs([]);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearSelection = () => {
    setSelectedPOIs([]);
  };

  const getCategoryColor = (category) => {
    const colorMap = {
      Restaurant: "text-orange-600 bg-orange-50",
      Park: "text-green-600 bg-green-50",
      Beach: "text-blue-600 bg-blue-50",
      Landmark: "text-purple-600 bg-purple-50",
      "Religious Site": "text-indigo-600 bg-indigo-50",
      Museum: "text-amber-600 bg-amber-50",
      Shopping: "text-pink-600 bg-pink-50",
    };
    return colorMap[category] || "text-gray-600 bg-gray-50";
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Restaurant":
        return "🍽️";
      case "Park":
        return "🌳";
      case "Beach":
        return "🏖️";
      case "Landmark":
        return "🏛️";
      case "Religious Site":
        return "⛪";
      case "Museum":
        return "🏛️";
      case "Shopping":
        return "🛍️";
      default:
        return "📍";
    }
  };

  const removeFavorite = async (favoriteId) => {
    try {
      await removeFavoriteMutation.mutateAsync({
        poiId: favoriteId,
        isLlmPoi: true, // Based on your data structure, these appear to be LLM POIs
      });
    } catch (error) {
      console.error("Failed to remove favorite:", error);
    }
  };

  const formatDistance = (distance) => {
    if (!distance || distance === 0) return "";
    if (distance < 1000) return `${Math.round(distance)}m`;
    return `${(distance / 1000).toFixed(1)}km`;
  };

  const getDetailUrl = (favorite) => {
    const category = favorite.category?.toLowerCase() || "";
    if (
      category.includes("restaurant") ||
      category.includes("food") ||
      category.includes("cafe")
    ) {
      return `/restaurants/${favorite.id}`;
    } else if (
      category.includes("hotel") ||
      category.includes("accommodation")
    ) {
      return `/hotels/${favorite.id}`;
    } else {
      // For other POI types, we'll use a generic POI detail page
      return `/pois/${favorite.id}`;
    }
  };

  const renderGridCard = (favorite) => (
    <div class="cb-card group hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Image */}
      <div class="relative h-40 bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden">
        <A
          href={getDetailUrl(favorite)}
          class="absolute inset-0 flex items-center justify-center text-6xl cursor-pointer"
        >
          {getCategoryIcon(favorite.category)}
        </A>

        {/* Selection checkbox */}
        <div class="absolute top-3 left-3 z-10">
          <input
            type="checkbox"
            checked={selectedPOIs().includes(favorite.id)}
            onChange={() => togglePOISelection(favorite.id)}
            class="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        {/* Action buttons */}
        <div class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <div class="flex gap-1">
            <button
              class="p-1.5 bg-white/90 text-gray-700 rounded-lg hover:bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <Share2 class="w-3 h-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeFavorite(favorite.id);
              }}
              class="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              <Trash2 class="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Category badge */}
        <div class="absolute bottom-3 left-3 z-10">
          <span
            class={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(favorite.category)}`}
          >
            {favorite.category}
          </span>
        </div>
      </div>

      {/* Content - Clickable */}
      <A
        href={getDetailUrl(favorite)}
        class="block p-4 hover:bg-gray-50 transition-colors"
      >
        <div class="mb-3">
          <h3 class="font-semibold text-gray-900 text-base mb-1 line-clamp-2">
            {favorite.name}
          </h3>
          <Show when={formatDistance(favorite.distance)}>
            <p class="text-sm text-gray-500">
              {formatDistance(favorite.distance)} away
            </p>
          </Show>
        </div>

        <p class="text-sm text-gray-600 mb-4 line-clamp-3">
          {favorite.description_poi || favorite.description}
        </p>

        {/* Location details */}
        <div class="space-y-2 text-sm text-gray-500 mb-4">
          <Show when={favorite.address}>
            <div class="flex items-start gap-2">
              <MapPin class="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span class="line-clamp-2">{favorite.address}</span>
            </div>
          </Show>
          <Show when={favorite.phone_number}>
            <div class="flex items-center gap-2">
              <span class="w-4 h-4 text-center">📞</span>
              <span>{favorite.phone_number}</span>
            </div>
          </Show>
          <Show when={favorite.website}>
            <div class="flex items-center gap-2">
              <span class="w-4 h-4 text-center">🌐</span>
              <a
                href={favorite.website}
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-600 hover:text-blue-800 truncate"
                onClick={(e) => e.stopPropagation()}
              >
                Visit Website
              </a>
            </div>
          </Show>
        </div>

        {/* Coordinates */}
        <div class="text-xs text-gray-400 pt-2 border-t border-gray-100">
          {favorite.latitude?.toFixed(4)}, {favorite.longitude?.toFixed(4)}
        </div>
      </A>
    </div>
  );

  const renderListItem = (favorite) => (
    <div class="cb-card hover:shadow-md transition-all duration-200">
      <div class="p-4 sm:p-6">
        <div class="flex items-start gap-4">
          {/* Selection checkbox */}
          <input
            type="checkbox"
            checked={selectedPOIs().includes(favorite.id)}
            onChange={() => togglePOISelection(favorite.id)}
            class="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Category icon - Clickable */}
          <A
            href={getDetailUrl(favorite)}
            class="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center text-3xl flex-shrink-0 hover:shadow-md transition-shadow"
          >
            {getCategoryIcon(favorite.category)}
          </A>

          {/* Content */}
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1 min-w-0">
                <A
                  href={getDetailUrl(favorite)}
                  class="block hover:text-blue-600 transition-colors"
                >
                  <h3 class="font-semibold text-gray-900 text-lg mb-1">
                    {favorite.name}
                  </h3>
                </A>
                <div class="flex items-center gap-2 mb-2">
                  <span
                    class={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(favorite.category)}`}
                  >
                    {favorite.category}
                  </span>
                  <Show when={formatDistance(favorite.distance)}>
                    <span class="text-sm text-gray-500">
                      {formatDistance(favorite.distance)} away
                    </span>
                  </Show>
                </div>
              </div>

              {/* Action buttons */}
              <div class="flex items-center gap-1 ml-4">
                <button
                  class="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Share2 class="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFavorite(favorite.id);
                  }}
                  class="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>

            <p class="text-sm text-gray-600 mb-4 leading-relaxed">
              {favorite.description_poi || favorite.description}
            </p>

            {/* Location and contact details */}
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-500">
              <Show when={favorite.address}>
                <div class="flex items-start gap-2">
                  <MapPin class="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span class="line-clamp-2">{favorite.address}</span>
                </div>
              </Show>

              <Show when={favorite.phone_number}>
                <div class="flex items-center gap-2">
                  <span class="w-4 h-4 text-center">📞</span>
                  <a
                    href={`tel:${favorite.phone_number}`}
                    class="hover:text-blue-600"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {favorite.phone_number}
                  </a>
                </div>
              </Show>

              <Show when={favorite.website}>
                <div class="flex items-center gap-2">
                  <span class="w-4 h-4 text-center">🌐</span>
                  <a
                    href={favorite.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-blue-600 hover:text-blue-800 truncate"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Visit Website
                  </a>
                </div>
              </Show>

              <div class="flex items-center gap-2">
                <span class="w-4 h-4 text-center">📍</span>
                <span class="text-xs text-gray-400">
                  {favorite.latitude?.toFixed(4)},{" "}
                  {favorite.longitude?.toFixed(4)}
                </span>
              </div>
            </div>

            {/* Opening hours if available */}
            <Show when={favorite.opening_hours}>
              <div class="mt-3 pt-3 border-t border-gray-100">
                <div class="flex items-start gap-2 text-sm text-gray-500">
                  <Clock class="w-4 h-4 mt-0.5" />
                  <div>
                    <p class="font-medium text-gray-700 mb-1">Opening Hours</p>
                    <p>{favorite.opening_hours}</p>
                  </div>
                </div>
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
              <p class="text-gray-600 mt-1">
                {pagination()?.total || 0} places you've saved
              </p>
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
              <For each={categories()}>
                {(category) => (
                  <option value={category.id}>
                    {category.label} ({category.count})
                  </option>
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
                  {(option) => (
                    <option value={option.id}>{option.label}</option>
                  )}
                </For>
              </select>
              <button
                onClick={() =>
                  setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
                }
                class="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {sortOrder() === "asc" ? (
                  <SortAsc class="w-4 h-4" />
                ) : (
                  <SortDesc class="w-4 h-4" />
                )}
              </button>
            </div>

            {/* View mode */}
            <div class="flex items-center border border-gray-300 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                class={`p-2 rounded ${viewMode() === "grid" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-50"}`}
              >
                <Grid class="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                class={`p-2 rounded ${viewMode() === "list" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-50"}`}
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
                  {selectedPOIs().length} item
                  {selectedPOIs().length > 1 ? "s" : ""} selected
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
              <h3 class="text-lg font-semibold text-gray-900 mb-2">
                No favorites found
              </h3>
              <p class="text-gray-600 mb-4">
                {searchQuery() || selectedCategory() !== "all"
                  ? "Try adjusting your search or filters"
                  : "Start exploring and save places you love!"}
              </p>
              <button class="cb-button cb-button-primary px-6 py-2">
                Discover Places
              </button>
            </div>
          }
        >
          <div
            class={
              viewMode() === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
                : "space-y-4"
            }
          >
            <For each={filteredFavorites()}>
              {(favorite) =>
                viewMode() === "grid"
                  ? renderGridCard(favorite)
                  : renderListItem(favorite)
              }
            </For>
          </div>

          {/* Pagination Component */}
          <Show when={pagination() && pagination()!.total_pages > 1}>
            <div class="mt-8">
              <Paginator
                currentPage={currentPage()}
                totalPages={pagination()!.total_pages}
                totalItems={pagination()!.total}
                itemsPerPage={itemsPerPage()}
                onPageChange={handlePageChange}
                className="rounded-lg border border-gray-200"
              />
            </div>
          </Show>
        </Show>
      </div>
    </div>
  );
}
