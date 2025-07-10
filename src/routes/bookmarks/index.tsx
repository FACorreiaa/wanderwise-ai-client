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
import {
  useRemoveItineraryMutation,
  useSaveItineraryMutation,
  useBookmarkedItineraries,
} from "~/lib/api/itineraries";
import { useQuery } from "@tanstack/solid-query";
import Paginator from "~/components/Paginator";
import { A } from "@solidjs/router";

export default function BookmarksPage() {
  console.log("BookmarksPage component rendering");

  const [viewMode, setViewMode] = createSignal("grid"); // 'grid', 'list'
  const [searchQuery, setSearchQuery] = createSignal("");
  const [sortBy, setSortBy] = createSignal("created_at"); // 'title', 'created_at', 'duration'
  const [sortOrder, setSortOrder] = createSignal("desc"); // 'asc', 'desc'
  const [selectedItineraries, setSelectedItineraries] = createSignal([]);
  const [currentPage, setCurrentPage] = createSignal(1);
  const [itemsPerPage, setItemsPerPage] = createSignal(10);

  // API hooks  
  const bookmarksQuery = useBookmarkedItineraries(currentPage, itemsPerPage);
  const removeItineraryMutation = useRemoveItineraryMutation();
  const saveItineraryMutation = useSaveItineraryMutation();

  // Get bookmarks from API or fallback to empty array
  const bookmarks = () => {
    console.log("Bookmarks query data:", bookmarksQuery.data);
    console.log("Bookmarks query isLoading:", bookmarksQuery.isLoading);
    console.log("Bookmarks query error:", bookmarksQuery.error);
    return bookmarksQuery.data?.itineraries || [];
  };
  const totalRecords = () => bookmarksQuery.data?.total_records || 0;
  const totalPages = () => Math.ceil((bookmarksQuery.data?.total_records || 0) / (bookmarksQuery.data?.page_size || 10));

  const sortOptions = [
    { id: "title", label: "Title" },
    { id: "created_at", label: "Date Added" },
    { id: "estimated_duration_days", label: "Duration" },
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Reset selection when changing pages
    //setSelectedPOIs([]);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
          bookmark.tags?.some((tag) => tag.toLowerCase().includes(query)),
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
      4: "Luxury",
    };
    return levels[level] || "Unknown";
  };

  const getCostLevelColor = (level) => {
    const colors = {
      1: "text-green-600 bg-green-50",
      2: "text-blue-600 bg-blue-50",
      3: "text-orange-600 bg-orange-50",
      4: "text-purple-600 bg-purple-50",
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
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const createTestBookmark = async () => {
    try {
      const bookmarkData = {
        title: "Test Bookmark",
        description: "This is a test bookmark to verify the feature works",
        primary_city_name: "Test City",
        tags: ["test", "bookmark"],
        is_public: false,
      };
      console.log("Creating test bookmark with data:", bookmarkData);
      await saveItineraryMutation.mutateAsync(bookmarkData);
      console.log("Test bookmark created successfully");
      // Refresh the bookmarks query after creating
      bookmarksQuery.refetch();
    } catch (error) {
      console.error("Failed to create test bookmark:", error);
      console.error("Error details:", error);
    }
  };

  const getBookmarkDetailUrl = (bookmark) => {
    return `/bookmarks/${bookmark.id}`;
  };

  const renderGridCard = (bookmark) => (
    <div class="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 group">
      {/* Header with improved visual hierarchy */}
      <div class="relative">
        <A
          href={getBookmarkDetailUrl(bookmark)}
          class="relative h-40 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 overflow-hidden block cursor-pointer"
        >
          <div class="absolute inset-0 bg-black/20"></div>
          
          {/* Selection checkbox - Mobile optimized */}
          <div class="absolute top-2 left-2 z-10">
            <input
              type="checkbox"
              checked={selectedItineraries().includes(bookmark.id)}
              onChange={() => toggleItinerarySelection(bookmark.id)}
              class="w-5 h-5 text-blue-600 rounded border-2 border-white/50 focus:ring-blue-500 focus:ring-2"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Action buttons - Mobile friendly */}
          <div class="absolute top-2 right-2 flex gap-1 z-10">
            <button
              class="p-2 bg-white/90 backdrop-blur-sm text-gray-700 rounded-lg hover:bg-white transition-colors"
              onClick={(e) => e.stopPropagation()}
              title="Share bookmark"
            >
              <Share2 class="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeBookmark(bookmark.id);
              }}
              class="p-2 bg-red-500/90 backdrop-blur-sm text-white rounded-lg hover:bg-red-600 transition-colors"
              disabled={removeItineraryMutation.isPending}
              title="Remove bookmark"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>

          {/* Enhanced title overlay */}
          <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4">
            <h3 class="font-bold text-white text-base leading-tight line-clamp-2 mb-1">
              {bookmark.title}
            </h3>
            <p class="text-white/90 text-sm">
              Added {formatDate(bookmark.created_at)}
            </p>
          </div>
        </A>
      </div>

      {/* Enhanced content section */}
      <div class="p-4 space-y-4">
        {/* Description */}
        <Show when={bookmark.description}>
          <p class="text-gray-700 text-sm leading-relaxed line-clamp-3">
            {bookmark.description}
          </p>
        </Show>

        {/* Enhanced metadata grid */}
        <div class="grid grid-cols-2 gap-3 text-sm">
          <Show when={bookmark.estimated_duration_days}>
            <div class="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
              <Calendar class="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span class="text-blue-800 font-medium">
                {bookmark.estimated_duration_days} day{bookmark.estimated_duration_days > 1 ? "s" : ""}
              </span>
            </div>
          </Show>
          
          <Show when={bookmark.estimated_cost_level}>
            <div class={`flex items-center gap-2 p-2 rounded-lg ${getCostLevelColor(bookmark.estimated_cost_level)}`}>
              <DollarSign class="w-4 h-4 flex-shrink-0" />
              <span class="font-medium">
                {getCostLevelText(bookmark.estimated_cost_level)}
              </span>
            </div>
          </Show>
        </div>

        {/* Tags with improved styling */}
        <Show when={bookmark.tags && bookmark.tags.length > 0}>
          <div class="flex flex-wrap gap-1.5">
            <For each={bookmark.tags.slice(0, 4)}>
              {(tag) => (
                <span class="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium hover:bg-gray-200 transition-colors">
                  {tag}
                </span>
              )}
            </For>
            <Show when={bookmark.tags.length > 4}>
              <span class="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                +{bookmark.tags.length - 4} more
              </span>
            </Show>
          </div>
        </Show>

        {/* Action footer */}
        <div class="flex items-center justify-between pt-2 border-t border-gray-100">
          <Show when={bookmark.is_public}>
            <div class="flex items-center gap-1.5 text-green-600">
              <Globe class="w-4 h-4" />
              <span class="text-xs font-medium">Public</span>
            </div>
          </Show>
          
          <A
            href={getBookmarkDetailUrl(bookmark)}
            class="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            View Details
          </A>
        </div>
      </div>
    </div>
  );

  const renderListItem = (bookmark) => (
    <div class="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden">
      <div class="p-4 sm:p-6">
        <div class="flex gap-4">
          {/* Mobile-optimized selection and icon */}
          <div class="flex flex-col items-center gap-3 flex-shrink-0">
            <input
              type="checkbox"
              checked={selectedItineraries().includes(bookmark.id)}
              onChange={() => toggleItinerarySelection(bookmark.id)}
              class="w-5 h-5 text-blue-600 rounded border-2 border-gray-300 focus:ring-blue-500 focus:ring-2"
              onClick={(e) => e.stopPropagation()}
            />
            
            <A
              href={getBookmarkDetailUrl(bookmark)}
              class="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white hover:shadow-lg transition-all duration-300 group"
            >
              <Bookmark class="w-6 h-6 sm:w-8 sm:h-8 group-hover:scale-110 transition-transform" />
            </A>
          </div>

          {/* Enhanced content section */}
          <div class="flex-1 min-w-0">
            {/* Header with mobile-responsive layout */}
            <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-3">
              <div class="flex-1 min-w-0">
                <A
                  href={getBookmarkDetailUrl(bookmark)}
                  class="block hover:text-blue-600 transition-colors group"
                >
                  <h3 class="font-bold text-gray-900 text-lg sm:text-xl mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {bookmark.title}
                  </h3>
                </A>
                <p class="text-sm text-gray-500 mb-2 flex items-center gap-2">
                  <Calendar class="w-4 h-4" />
                  Added {formatDate(bookmark.created_at)}
                </p>
              </div>

              {/* Action buttons - Mobile optimized */}
              <div class="flex items-center gap-2 self-start">
                <button
                  class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={(e) => e.stopPropagation()}
                  title="Share bookmark"
                >
                  <Share2 class="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeBookmark(bookmark.id);
                  }}
                  class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  disabled={removeItineraryMutation.isPending}
                  title="Remove bookmark"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
                <A
                  href={getBookmarkDetailUrl(bookmark)}
                  class="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors font-medium hidden sm:block"
                >
                  View Details
                </A>
              </div>
            </div>

            {/* Description */}
            <Show when={bookmark.description}>
              <p class="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-3">
                {bookmark.description}
              </p>
            </Show>

            {/* Enhanced metadata grid - Mobile responsive */}
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
              <Show when={bookmark.estimated_duration_days}>
                <div class="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <Calendar class="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span class="text-blue-800 font-medium text-sm">
                    {bookmark.estimated_duration_days} day{bookmark.estimated_duration_days > 1 ? "s" : ""}
                  </span>
                </div>
              </Show>

              <Show when={bookmark.estimated_cost_level}>
                <div class={`flex items-center gap-2 p-3 rounded-lg ${getCostLevelColor(bookmark.estimated_cost_level)}`}>
                  <DollarSign class="w-4 h-4 flex-shrink-0" />
                  <span class="font-medium text-sm">
                    {getCostLevelText(bookmark.estimated_cost_level)}
                  </span>
                </div>
              </Show>

              <Show when={bookmark.is_public}>
                <div class="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                  <Globe class="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span class="text-green-800 font-medium text-sm">Public</span>
                </div>
              </Show>
            </div>

            {/* Tags with improved mobile layout */}
            <Show when={bookmark.tags && bookmark.tags.length > 0}>
              <div class="flex flex-wrap gap-1.5 mb-4">
                <For each={bookmark.tags.slice(0, 6)}>
                  {(tag) => (
                    <span class="px-2.5 py-1.5 bg-gray-100 text-gray-700 text-xs rounded-full font-medium hover:bg-gray-200 transition-colors">
                      {tag}
                    </span>
                  )}
                </For>
                <Show when={bookmark.tags.length > 6}>
                  <span class="px-2.5 py-1.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                    +{bookmark.tags.length - 6} more
                  </span>
                </Show>
              </div>
            </Show>

            {/* Mobile view details button */}
            <div class="sm:hidden">
              <A
                href={getBookmarkDetailUrl(bookmark)}
                class="block w-full px-4 py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                View Details
              </A>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Enhanced Header */}
      <div class="bg-white shadow-sm border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div class="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
            <div class="space-y-2">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Bookmark class="w-5 h-5 text-white" />
                </div>
                <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">My Bookmarks</h1>
              </div>
              <p class="text-gray-600 flex items-center gap-2">
                <Star class="w-4 h-4 text-yellow-500" />
                <span>
                  {totalRecords()} saved itinerar{totalRecords() === 1 ? "y" : "ies"}
                  {totalRecords() > 0 && (
                    <span class="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {totalPages()} page{totalPages() > 1 ? "s" : ""}
                    </span>
                  )}
                </span>
              </p>
            </div>
            
            {/* Action buttons - Mobile optimized */}
            <div class="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={createTestBookmark}
                class="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={saveItineraryMutation.isLoading}
              >
                <Plus class="w-4 h-4" />
                <span class="hidden sm:inline">
                  {saveItineraryMutation.isLoading ? "Creating..." : "Test Bookmark"}
                </span>
                <span class="sm:hidden">
                  {saveItineraryMutation.isLoading ? "Creating..." : "Add Test"}
                </span>
              </button>
              <button class="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium">
                <Download class="w-4 h-4" />
                <span class="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Filters and Controls */}
      <div class="bg-white shadow-sm border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div class="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search - Mobile first */}
            <div class="relative flex-1 max-w-lg">
              <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search your bookmarks..."
                value={searchQuery()}
                onInput={(e) => setSearchQuery(e.target.value)}
                class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Controls group */}
            <div class="flex flex-col sm:flex-row gap-3 lg:gap-2">
              {/* Sort controls */}
              <div class="flex items-center gap-2">
                <label class="text-sm font-medium text-gray-700 hidden sm:block">Sort:</label>
                <select
                  value={sortBy()}
                  onChange={(e) => setSortBy(e.target.value)}
                  class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
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
                  class="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  title={`Sort ${sortOrder() === "asc" ? "descending" : "ascending"}`}
                >
                  {sortOrder() === "asc" ? (
                    <SortAsc class="w-4 h-4" />
                  ) : (
                    <SortDesc class="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* View mode toggle */}
              <div class="flex items-center gap-2">
                <label class="text-sm font-medium text-gray-700 hidden sm:block">View:</label>
                <div class="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    class={`p-2 rounded-md transition-colors ${
                      viewMode() === "grid" 
                        ? "bg-white text-blue-600 shadow-sm" 
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                    title="Grid view"
                  >
                    <Grid class="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    class={`p-2 rounded-md transition-colors ${
                      viewMode() === "list" 
                        ? "bg-white text-blue-600 shadow-sm" 
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                    title="List view"
                  >
                    <List class="w-4 h-4" />
                  </button>
                </div>
              </div>
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
          when={!bookmarksQuery.isLoading && !bookmarksQuery.error}
          fallback={
            <Show
              when={bookmarksQuery.error}
              fallback={
                <div class="text-center py-12">
                  <div class="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p class="text-gray-600">Loading bookmarks...</p>
                </div>
              }
            >
              <div class="text-center py-12">
                <div class="text-red-600 mb-4">❌ Error loading bookmarks</div>
                <p class="text-gray-600 mb-4">
                  {bookmarksQuery.error?.message || "Failed to load bookmarks"}
                </p>
                <button
                  onClick={() => bookmarksQuery.refetch()}
                  class="cb-button cb-button-primary"
                >
                  Try Again
                </button>
              </div>
            </Show>
          }
        >
          <Show
            when={filteredBookmarks().length > 0}
            fallback={
              <div class="flex flex-col items-center justify-center py-16 px-4">
                <div class="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6">
                  <Bookmark class="w-10 h-10 text-white" />
                </div>
                <h3 class="text-xl font-bold text-gray-900 mb-3 text-center">
                  {searchQuery() ? "No matching bookmarks" : "No bookmarks yet"}
                </h3>
                <p class="text-gray-600 mb-6 text-center max-w-md">
                  {searchQuery()
                    ? "Try adjusting your search terms or clear the search to see all bookmarks"
                    : "Start your travel planning journey by exploring itineraries and saving your favorites!"}
                </p>
                <div class="flex flex-col sm:flex-row gap-3">
                  <Show when={searchQuery()}>
                    <button 
                      onClick={() => setSearchQuery("")}
                      class="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Clear Search
                    </button>
                  </Show>
                  <button class="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    Explore Itineraries
                  </button>
                </div>
              </div>
            }
          >
            <div
              class={
                viewMode() === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6"
                  : "space-y-4 sm:space-y-6"
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

            {/* Enhanced Pagination */}
            <Show when={totalPages() > 1}>
              <div class="mt-8 sm:mt-12 flex flex-col items-center gap-4">
                <div class="text-sm text-gray-600 text-center">
                  Showing page {currentPage()} of {totalPages()} 
                  <span class="hidden sm:inline">
                    ({totalRecords()} total bookmark{totalRecords() !== 1 ? "s" : ""})
                  </span>
                </div>
                <Paginator
                  currentPage={currentPage()}
                  totalPages={totalPages()}
                  totalItems={totalRecords()}
                  itemsPerPage={itemsPerPage()}
                  onPageChange={handlePageChange}
                  className="rounded-xl border border-gray-200 shadow-sm bg-white"
                />
              </div>
            </Show>
          </Show>
        </Show>
      </div>
    </div>
  );
}
