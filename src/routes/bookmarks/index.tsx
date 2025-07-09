import { createSignal, createEffect, For, Show, onMount } from "solid-js";
import {
  Bookmark,
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
  Calendar,
  DollarSign,
  Globe,
  ChevronLeft,
  ChevronRight,
} from "lucide-solid";
import { useBookmarkedItineraries, useRemoveItineraryMutation, useSaveItineraryMutation } from "~/lib/api/itineraries";
import { Paginator } from "~/components/Paginator";
import { A } from '@solidjs/router';

export default function BookmarksPage() {
  const [viewMode, setViewMode] = createSignal("grid"); // 'grid', 'list'
  const [searchQuery, setSearchQuery] = createSignal("");
  const [sortBy, setSortBy] = createSignal("created_at"); // 'title', 'created_at', 'duration'
  const [sortOrder, setSortOrder] = createSignal("desc"); // 'asc', 'desc'
  const [selectedItineraries, setSelectedItineraries] = createSignal([]);
  const [currentPage, setCurrentPage] = createSignal(1);
  const itemsPerPage = 12;

  // API hooks
  const bookmarksQuery = useBookmarkedItineraries(currentPage(), itemsPerPage);
  const removeItineraryMutation = useRemoveItineraryMutation();
  const saveItineraryMutation = useSaveItineraryMutation();


  // Get bookmarks from API or fallback to empty array
  const bookmarks = () => bookmarksQuery.data?.itineraries || [];
  const totalRecords = () => bookmarksQuery.data?.total_records || 0;
  const totalPages = () => Math.ceil(totalRecords() / itemsPerPage);

  const sortOptions = [
    { id: "title", label: "Title" },
    { id: "created_at", label: "Date Added" },
    { id: "estimated_duration_days", label: "Duration" },
  ];

  // Filter and sort bookmarks
  const filteredBookmarks = () => {
    let filtered = bookmarks();

    // Search filter
    if (searchQuery()) {
      const query = searchQuery().toLowerCase();
      filtered = filtered.filter(
        (bookmark) =>
          bookmark.title?.toLowerCase().includes(query) ||
          bookmark.description?.toLowerCase().includes(query) ||
          bookmark.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal, bVal;
      switch (sortBy()) {
        case "title":
          aVal = a.title?.toLowerCase() || "";
          bVal = b.title?.toLowerCase() || "";
          break;
        case "created_at":
          aVal = new Date(a.created_at).getTime();
          bVal = new Date(b.created_at).getTime();
          break;
        case "estimated_duration_days":
          aVal = a.estimated_duration_days || 0;
          bVal = b.estimated_duration_days || 0;
          break;
        default:
          aVal = new Date(a.created_at).getTime();
          bVal = new Date(b.created_at).getTime();
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

  const toggleItinerarySelection = (itineraryId) => {
    setSelectedItineraries((prev) =>
      prev.includes(itineraryId)
        ? prev.filter((id) => id !== itineraryId)
        : [...prev, itineraryId],
    );
  };

  const selectAllItineraries = () => {
    setSelectedItineraries(filteredBookmarks().map((bookmark) => bookmark.id));
  };

  const clearSelection = () => {
    setSelectedItineraries([]);
  };

  const getCostLevelText = (level) => {
    const levels = {
      1: "Budget",
      2: "Moderate",
      3: "Expensive",
      4: "Luxury"
    };
    return levels[level] || "Unknown";
  };

  const getCostLevelColor = (level) => {
    const colors = {
      1: "text-green-600 bg-green-50",
      2: "text-blue-600 bg-blue-50",
      3: "text-orange-600 bg-orange-50",
      4: "text-purple-600 bg-purple-50"
    };
    return colors[level] || "text-gray-600 bg-gray-50";
  };

  const removeBookmark = async (itineraryId) => {
    try {
      await removeItineraryMutation.mutateAsync(itineraryId);
    } catch (error) {
      console.error("Failed to remove bookmark:", error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const createTestBookmark = async () => {
    try {
      await saveItineraryMutation.mutateAsync({
        title: "Test Bookmark",
        description: "This is a test bookmark to verify the feature works",
        primary_city_name: "Test City",
        tags: ["test", "bookmark"],
        is_public: false
      });
      console.log("Test bookmark created successfully");
    } catch (error) {
      console.error("Failed to create test bookmark:", error);
    }
  };

  const getBookmarkDetailUrl = (bookmark) => {
    return `/bookmarks/${bookmark.id}`;
  };

  const renderGridCard = (bookmark) => (
    <div class="cb-card group hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Header with gradient - Clickable */}
      <A href={getBookmarkDetailUrl(bookmark)} class="relative h-32 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden block cursor-pointer">
        <div class="absolute inset-0 bg-black/20"></div>
        
        {/* Selection checkbox */}
        <div class="absolute top-3 left-3 z-10">
          <input
            type="checkbox"
            checked={selectedItineraries().includes(bookmark.id)}
            onChange={() => toggleItinerarySelection(bookmark.id)}
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
                removeBookmark(bookmark.id);
              }}
              class="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              <Trash2 class="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Title overlay */}
        <div class="absolute bottom-3 left-3 right-3 z-10">
          <h3 class="font-semibold text-white text-sm line-clamp-2">
            {bookmark.title}
          </h3>
        </div>
      </A>

      {/* Content - Clickable */}
      <A href={getBookmarkDetailUrl(bookmark)} class="block p-4 hover:bg-gray-50 transition-colors">
        <div class="mb-3">
          <p class="text-xs text-gray-500 mb-2">
            Added {formatDate(bookmark.created_at)}
          </p>
          <Show when={bookmark.description}>
            <p class="text-sm text-gray-600 line-clamp-3">
              {bookmark.description}
            </p>
          </Show>
        </div>

        {/* Tags */}
        <Show when={bookmark.tags && bookmark.tags.length > 0}>
          <div class="flex flex-wrap gap-1 mb-3">
            <For each={bookmark.tags.slice(0, 3)}>
              {(tag) => (
                <span class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  {tag}
                </span>
              )}
            </For>
            <Show when={bookmark.tags.length > 3}>
              <span class="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                +{bookmark.tags.length - 3}
              </span>
            </Show>
          </div>
        </Show>

        {/* Metadata */}
        <div class="space-y-2 text-sm">
          <Show when={bookmark.estimated_duration_days}>
            <div class="flex items-center gap-2 text-gray-500">
              <Calendar class="w-4 h-4" />
              <span>{bookmark.estimated_duration_days} day{bookmark.estimated_duration_days > 1 ? 's' : ''}</span>
            </div>
          </Show>
          <Show when={bookmark.estimated_cost_level}>
            <div class="flex items-center gap-2">
              <DollarSign class="w-4 h-4 text-gray-500" />
              <span class={`px-2 py-1 rounded text-xs ${getCostLevelColor(bookmark.estimated_cost_level)}`}>
                {getCostLevelText(bookmark.estimated_cost_level)}
              </span>
            </div>
          </Show>
          <Show when={bookmark.is_public}>
            <div class="flex items-center gap-2 text-gray-500">
              <Globe class="w-4 h-4" />
              <span class="text-xs">Public</span>
            </div>
          </Show>
        </div>
      </A>
    </div>
  );

  const renderListItem = (bookmark) => (
    <div class="cb-card hover:shadow-md transition-all duration-200">
      <div class="p-4 sm:p-6">
        <div class="flex items-start gap-4">
          {/* Selection checkbox */}
          <input
            type="checkbox"
            checked={selectedItineraries().includes(bookmark.id)}
            onChange={() => toggleItinerarySelection(bookmark.id)}
            class="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Icon - Clickable */}
          <A href={getBookmarkDetailUrl(bookmark)} class="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-2xl flex-shrink-0 hover:shadow-md transition-shadow">
            <Bookmark />
          </A>

          {/* Content */}
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1 min-w-0">
                <A href={getBookmarkDetailUrl(bookmark)} class="block hover:text-blue-600 transition-colors">
                  <h3 class="font-semibold text-gray-900 text-lg mb-1">
                    {bookmark.title}
                  </h3>
                </A>
                <p class="text-sm text-gray-500 mb-2">
                  Added {formatDate(bookmark.created_at)}
                </p>
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
                    removeBookmark(bookmark.id);
                  }}
                  class="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>

            <Show when={bookmark.description}>
              <p class="text-sm text-gray-600 mb-4 leading-relaxed">
                {bookmark.description}
              </p>
            </Show>

            {/* Tags */}
            <Show when={bookmark.tags && bookmark.tags.length > 0}>
              <div class="flex flex-wrap gap-1 mb-4">
                <For each={bookmark.tags}>
                  {(tag) => (
                    <span class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      {tag}
                    </span>
                  )}
                </For>
              </div>
            </Show>

            {/* Metadata grid */}
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-gray-500">
              <Show when={bookmark.estimated_duration_days}>
                <div class="flex items-center gap-2">
                  <Calendar class="w-4 h-4" />
                  <span>{bookmark.estimated_duration_days} day{bookmark.estimated_duration_days > 1 ? 's' : ''}</span>
                </div>
              </Show>
              
              <Show when={bookmark.estimated_cost_level}>
                <div class="flex items-center gap-2">
                  <DollarSign class="w-4 h-4" />
                  <span class={`px-2 py-1 rounded text-xs ${getCostLevelColor(bookmark.estimated_cost_level)}`}>
                    {getCostLevelText(bookmark.estimated_cost_level)}
                  </span>
                </div>
              </Show>
              
              <Show when={bookmark.is_public}>
                <div class="flex items-center gap-2">
                  <Globe class="w-4 h-4" />
                  <span>Public</span>
                </div>
              </Show>
            </div>
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
              <h1 class="text-2xl font-bold text-gray-900">My Bookmarks</h1>
              <p class="text-gray-600 mt-1">
                {totalRecords()} saved itinerar{totalRecords() === 1 ? 'y' : 'ies'}
              </p>
            </div>
            <div class="flex items-center gap-3">
              <button 
                onClick={createTestBookmark}
                class="cb-button cb-button-primary px-4 py-2 flex items-center gap-2"
                disabled={saveItineraryMutation.isLoading}
              >
                <Plus class="w-4 h-4" />
                {saveItineraryMutation.isLoading ? "Creating..." : "Test Bookmark"}
              </button>
              <button class="cb-button cb-button-secondary px-4 py-2 flex items-center gap-2">
                <Download class="w-4 h-4" />
                Export
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
                placeholder="Search bookmarks..."
                value={searchQuery()}
                onInput={(e) => setSearchQuery(e.target.value)}
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

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
          <Show when={selectedItineraries().length > 0}>
            <div class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div class="flex items-center justify-between">
                <span class="text-sm text-blue-800">
                  {selectedItineraries().length} item
                  {selectedItineraries().length > 1 ? "s" : ""} selected
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
          when={!bookmarksQuery.isLoading}
          fallback={
            <div class="text-center py-12">
              <div class="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p class="text-gray-600">Loading bookmarks...</p>
            </div>
          }
        >
          <Show
            when={filteredBookmarks().length > 0}
            fallback={
              <div class="text-center py-12">
                <Bookmark class="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 class="text-lg font-semibold text-gray-900 mb-2">
                  No bookmarks found
                </h3>
                <p class="text-gray-600 mb-4">
                  {searchQuery()
                    ? "Try adjusting your search"
                    : "Start saving itineraries to see them here!"}
                </p>
                <button class="cb-button cb-button-primary px-6 py-2">
                  Explore Itineraries
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
              <For each={filteredBookmarks()}>
                {(bookmark) =>
                  viewMode() === "grid"
                    ? renderGridCard(bookmark)
                    : renderListItem(bookmark)
                }
              </For>
            </div>

            {/* Pagination */}
            <Show when={totalPages() > 1}>
              <div class="mt-8 flex justify-center">
                <Paginator
                  currentPage={currentPage()}
                  totalPages={totalPages()}
                  onPageChange={setCurrentPage}
                />
              </div>
            </Show>
          </Show>
        </Show>
      </div>
    </div>
  );
}