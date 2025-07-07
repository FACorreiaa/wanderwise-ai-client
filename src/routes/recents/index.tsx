import { createSignal, For, Show, createEffect, onMount } from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import {
  Search,
  MapPin,
  Clock,
  Star,
  Filter,
  Grid,
  List,
  Calendar,
  TrendingUp,
  Sparkles,
  ChevronRight,
  Eye,
  Share2,
  Trash2,
  RotateCcw,
  SortAsc,
  SortDesc,
  Bookmark,
} from "lucide-solid";
import { useRecentInteractions } from "~/lib/api/recents";
import type {
  CityInteractions,
  POIDetailedInfo,
  HotelDetailedInfo,
  RestaurantDetailedInfo,
} from "~/lib/api/types";
import Paginator from "~/components/Paginator";

export default function RecentsPage() {
  const [viewMode, setViewMode] = createSignal("grid"); // 'grid', 'list'

  // Pagination state
  const [currentPage, setCurrentPage] = createSignal(1);
  const [itemsPerPage, setItemsPerPage] = createSignal(10);

  const navigate = useNavigate();
  const recentsQuery = useRecentInteractions(currentPage, itemsPerPage);

  // Statistics for current page only (since we're using server-side pagination)
  const getCurrentPageInteractions = () => {
    return (
      recentsQuery.data?.cities?.reduce(
        (total, city) => total + city.interactions.length,
        0,
      ) || 0
    );
  };

  const getCurrentPagePOIs = () => {
    return (
      recentsQuery.data?.cities?.reduce(
        (total, city) => total + city.poi_count,
        0,
      ) || 0
    );
  };

  const getCurrentPageFavorites = () => {
    return (
      recentsQuery.data?.cities?.reduce(
        (total, city) => total + (city.total_favorites || 0),
        0,
      ) || 0
    );
  };

  const getCurrentPageItineraries = () => {
    return (
      recentsQuery.data?.cities?.reduce(
        (total, city) => total + (city.total_itineraries || 0),
        0,
      ) || 0
    );
  };

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Reset search when changing pages to avoid confusion
    //if (searchQuery()) {
    //setSearchQuery('');
    //}
  };

  const getTotalPages = () => {
    if (!recentsQuery.data?.total) return 0;
    return Math.ceil(recentsQuery.data.total / itemsPerPage());
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${Math.floor(diffInHours)} hours ago`;
    if (diffInHours < 48) return "Yesterday";
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} days ago`;

    return date.toLocaleDateString();
  };

  createEffect(() => {
    console.log("Page:", currentPage());
    console.log(
      "Cities:",
      recentsQuery.data?.cities.map((c) => ({
        city: c.city_name,
        session: c.session_id,
      })),
    );
  });

  const getActivityLevel = (interactionCount: number) => {
    if (interactionCount >= 10)
      return {
        level: "high",
        color:
          "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900",
        icon: "🔥",
      };
    if (interactionCount >= 5)
      return {
        level: "medium",
        color:
          "text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-900",
        icon: "⭐",
      };
    return {
      level: "low",
      color: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900",
      icon: "📍",
    };
  };

  const handleCityClick = (cityName: string) => {
    navigate(`/recents/${encodeURIComponent(cityName)}`);
  };

  const renderGridCard = (city: CityInteractions) => {
    const activityInfo = getActivityLevel(city.interactions.length);

    return (
      <div
        onClick={() => handleCityClick(city.city_name)}
        class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer group"
      >
        {/* Header Image */}
        <div class="relative h-32 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900">
          <div class="absolute inset-0 flex items-center justify-center text-3xl">
            🏙️
          </div>

          {/* Activity Badge */}
          <div class="absolute top-3 left-3">
            <span
              class={`px-2 py-1 rounded-full text-xs font-medium ${activityInfo.color}`}
            >
              <span class="mr-1">{activityInfo.icon}</span>
              {activityInfo.level === "high"
                ? "Very Active"
                : activityInfo.level === "medium"
                  ? "Active"
                  : "Visited"}
            </span>
          </div>

          {/* Navigation Arrow */}
          <div class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <div class="p-1.5 bg-white/90 dark:bg-gray-800/90 rounded-lg">
              <ChevronRight class="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div class="p-4">
          <div class="flex items-start justify-between mb-2">
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-gray-900 dark:text-white text-lg mb-1 truncate">
                {city.city_name}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {city.interactions.length} interaction
                {city.interactions.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div class="space-y-2 mb-3">
            <div class="flex items-center justify-between text-sm">
              <div class="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <MapPin class="w-3 h-3" />
                <span>{city.poi_count} places</span>
              </div>
              <div class="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <Clock class="w-3 h-3" />
                <span>{formatDate(city.last_activity)}</span>
              </div>
            </div>

            <Show
              when={
                (city.total_favorites || 0) > 0 ||
                (city.total_itineraries || 0) > 0
              }
            >
              <div class="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-500">
                <Show when={(city.total_favorites || 0) > 0}>
                  <div class="flex items-center gap-1">
                    <Star class="w-3 h-3 text-yellow-500" />
                    <span>{city.total_favorites} favorites</span>
                  </div>
                </Show>
                <Show when={(city.total_itineraries || 0) > 0}>
                  <div class="flex items-center gap-1">
                    <Bookmark class="w-3 h-3 text-blue-500" />
                    <span>{city.total_itineraries} saved</span>
                  </div>
                </Show>
              </div>
            </Show>
          </div>

          {/* Preview of recent activity */}
          <Show when={city.interactions.length > 0}>
            <div class="pt-3 border-t border-gray-100 dark:border-gray-700">
              <p class="text-xs text-gray-500 dark:text-gray-500 line-clamp-2">
                Latest: {city.interactions[0]?.prompt || "Recent activity"}
              </p>
            </div>
          </Show>
        </div>
      </div>
    );
  };

  const renderListItem = (city: CityInteractions) => {
    const activityInfo = getActivityLevel(city.interactions.length);

    return (
      <div
        onClick={() => handleCityClick(city.city_name)}
        class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all duration-200 cursor-pointer group"
      >
        <div class="flex items-center gap-4">
          {/* City Icon */}
          <div class="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
            🏙️
          </div>

          {/* Content */}
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between mb-1">
              <div class="flex-1 min-w-0">
                <h3 class="font-semibold text-gray-900 dark:text-white text-base">
                  {city.city_name}
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {city.interactions.length} interaction
                  {city.interactions.length !== 1 ? "s" : ""} • {city.poi_count}{" "}
                  places
                  {(city.total_favorites || 0) > 0 &&
                    ` • ${city.total_favorites} favorites`}
                  {(city.total_itineraries || 0) > 0 &&
                    ` • ${city.total_itineraries} saved`}
                </p>
              </div>
              <div class="flex items-center gap-2">
                <span
                  class={`px-2 py-1 rounded-full text-xs font-medium ${activityInfo.color}`}
                >
                  <span class="mr-1">{activityInfo.icon}</span>
                  {activityInfo.level === "high"
                    ? "Very Active"
                    : activityInfo.level === "medium"
                      ? "Active"
                      : "Visited"}
                </span>
                <ChevronRight class="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
              </div>
            </div>

            <div class="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
              <div class="flex items-center gap-1">
                <Clock class="w-3 h-3" />
                <span>{formatDate(city.last_activity)}</span>
              </div>
              <Show when={city.interactions.length > 0}>
                <span class="truncate max-w-xs">
                  Latest: {city.interactions[0]?.prompt || "Recent activity"}
                </span>
              </Show>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <RotateCcw class="w-6 h-6 text-blue-600 dark:text-blue-400" />
                Recent Activity
              </h1>
              <Show
                when={!recentsQuery.isLoading && recentsQuery.data}
                fallback={
                  <p class="text-gray-600 dark:text-gray-400 mt-1">
                    Loading your recent activity...
                  </p>
                }
              >
                <div class="flex items-center gap-4 mt-1">
                  <p class="text-gray-600 dark:text-gray-400">
                    {recentsQuery.data?.total || 0} cities explored total
                  </p>
                  <Show when={getCurrentPageInteractions() > 0}>
                    <div class="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400">
                      <Sparkles class="w-4 h-4" />
                      <span>
                        {getCurrentPageInteractions()} interactions (current
                        page)
                      </span>
                    </div>
                  </Show>
                  <Show when={getCurrentPageFavorites() > 0}>
                    <div class="flex items-center gap-1 text-sm text-yellow-600 dark:text-yellow-400">
                      <Star class="w-4 h-4" />
                      <span>
                        {getCurrentPageFavorites()} favorites (current page)
                      </span>
                    </div>
                  </Show>
                  <Show when={getCurrentPageItineraries() > 0}>
                    <div class="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                      <Bookmark class="w-4 h-4" />
                      <span>
                        {getCurrentPageItineraries()} saved (current page)
                      </span>
                    </div>
                  </Show>
                </div>
              </Show>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters - Temporarily disabled for server-side pagination */}
      {/* TODO: Implement server-side search, filtering, and sorting */}
      <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div class="flex justify-between items-center">
            {/* Keep view mode toggle */}
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                View:
              </label>
              <div class="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg p-1 bg-white dark:bg-gray-700">
                <button
                  onClick={() => setViewMode("grid")}
                  class={`p-2 rounded transition-colors ${viewMode() === "grid" ? "bg-blue-600 text-white" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600"}`}
                  title="Grid view"
                >
                  <Grid class="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  class={`p-2 rounded transition-colors ${viewMode() === "list" ? "bg-blue-600 text-white" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600"}`}
                  title="List view"
                >
                  <List class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Show when={recentsQuery.isLoading}>
          <div class="flex items-center justify-center py-12">
            <div class="flex items-center gap-3">
              <div class="w-6 h-6 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span class="text-gray-600 dark:text-gray-400">
                Loading your recent activity...
              </span>
            </div>
          </div>
        </Show>

        <Show when={recentsQuery.isError}>
          <div class="text-center py-12">
            <div class="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp class="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Unable to load recent activity
            </h3>
            <p class="text-gray-600 dark:text-gray-400 mb-4">
              Please try again later
            </p>
            <button
              onClick={() => recentsQuery.refetch()}
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </Show>

        <Show when={recentsQuery.isSuccess}>
          <Show
            when={(recentsQuery.data?.cities?.length || 0) > 0}
            fallback={
              <div class="text-center py-12">
                <RotateCcw class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No recent activity
                </h3>
                <p class="text-gray-600 dark:text-gray-400 mb-4">
                  Start exploring cities to see your activity here!
                </p>
                <A
                  href="/discover"
                  class="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Sparkles class="w-4 h-4" />
                  Start Exploring
                </A>
              </div>
            }
          >
            <div class="flex items-center justify-between mb-6">
              <p class="text-gray-600 dark:text-gray-400">
                {recentsQuery.data?.cities?.length || 0} cit
                {(recentsQuery.data?.cities?.length || 0) !== 1
                  ? "ies"
                  : "y"}{" "}
                on this page
                <Show when={recentsQuery.data?.total}>
                  <span class="ml-1 text-sm">
                    ({recentsQuery.data?.total} total)
                  </span>
                </Show>
              </p>
            </div>

            <div
              class={
                viewMode() === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }
            >
              <For each={recentsQuery.data?.cities || []}>
                {(city) =>
                  viewMode() === "grid"
                    ? renderGridCard(city)
                    : renderListItem(city)
                }
              </For>
            </div>

            {/* Pagination Component */}
            <Show when={getTotalPages() > 1}>
              <div class="mt-8">
                <Paginator
                  currentPage={currentPage()}
                  totalPages={getTotalPages()}
                  totalItems={recentsQuery.data?.total || 0}
                  itemsPerPage={itemsPerPage()}
                  onPageChange={handlePageChange}
                  className="rounded-lg border border-gray-200 dark:border-gray-700"
                />
              </div>
            </Show>
          </Show>
        </Show>
      </div>
    </div>
  );
}
