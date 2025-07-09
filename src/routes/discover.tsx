import { createSignal, For, Show, createEffect, onMount } from "solid-js";
import { useLocation } from "@solidjs/router";
import {
  Search,
  Filter,
  MapPin,
  Star,
  Clock,
  DollarSign,
  Wifi,
  Camera,
  Grid,
  SortAsc,
  SortDesc,
  X,
  Compass,
  Map,
  Share2,
  Eye,
} from "lucide-solid";
import {
  useNearbyPOIs,
  useNearbyRestaurants,
  useNearbyActivities,
  useNearbyHotels,
  useNearbyAttractions,
  useFavorites,
  useAddToFavoritesMutation,
  useRemoveFromFavoritesMutation,
} from "~/lib/api/pois";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  TabsIndicator,
} from "@/ui/tabs";
import type { ActivitiesResponse, POIDetailedInfo } from "~/lib/api/types";
import { useUserLocation } from "@/contexts/LocationContext";
import MapComponent from "~/components/features/Map/Map";
import { TypingAnimation } from "~/components/TypingAnimation";

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = createSignal("");
  const [sortBy, setSortBy] = createSignal("popularity"); // 'popularity', 'rating', 'distance', 'price'
  const [sortOrder, setSortOrder] = createSignal("desc");
  const [viewMode, setViewMode] = createSignal("map-cards"); // 'map-cards', 'cards', 'map'
  const [showFilters, setShowFilters] = createSignal(false);
  const [streamingData, setStreamingData] =
    createSignal<ActivitiesResponse | null>(null);
  const [fromChat, setFromChat] = createSignal(false);
  const [showOnlyFavorites, setShowOnlyFavorites] = createSignal(false);
  const [activeTab, setActiveTab] = createSignal("general");
  const {
    userLocation,
    requestLocation,
    isLoadingLocation,
    error: locationError,
  } = useUserLocation();
  const [searchRadius, setSearchRadius] = createSignal(10000);
  const location = useLocation();

  // API hooks
  const favoritesQuery = useFavorites();
  const addToFavoritesMutation = useAddToFavoritesMutation();
  const removeFromFavoritesMutation = useRemoveFromFavoritesMutation();

  // Get coordinates based on user location (discover is always location-based)
  const getSearchCoordinates = () => {
    const coords = {
      lat: userLocation()?.latitude || 38.7223,
      lon: userLocation()?.longitude || -9.1393,
    };
    console.log("📍 Using user/default coordinates:", coords);
    return coords;
  };

  const radiusOptions = [
    { value: 1000, label: "1 km" },
    { value: 5000, label: "5 km" },
    { value: 10000, label: "10 km" },
    { value: 25000, label: "25 km" },
    { value: 50000, label: "50 km" },
    { value: 75000, label: "75 km" },
    { value: 100000, label: "100 km" },
  ];

  // Initialize with streaming data on mount
  onMount(() => {
    console.log("=== DISCOVER PAGE MOUNT ===");
    console.log("Location state:", location.state);

    // Check for streaming data from route state
    if (location.state?.streamingData) {
      console.log("Found activities streaming data in route state");
      const data = location.state.streamingData as ActivitiesResponse;
      setStreamingData(data);
      setFromChat(true);
      console.log("Received streaming data:", data);
    } else {
      console.log("No streaming data in route state, checking session storage");
      // Try to get data from session storage
      const storedSession = sessionStorage.getItem("completedStreamingSession");
      console.log("Session storage content:", storedSession);

      if (storedSession) {
        try {
          const session = JSON.parse(storedSession);
          console.log("Parsed session:", session);

          if (session.data && session.data.activities) {
            console.log("Setting streaming data from session storage");
            setStreamingData(session.data as ActivitiesResponse);
            setFromChat(true);
            console.log(
              "Loaded streaming data from session storage:",
              session.data,
            );
          } else {
            console.log("No activities data found in session");
          }
        } catch (error) {
          console.error("Error parsing stored session:", error);
        }
      } else {
        console.log("No stored session found");
      }
    }
  });

  // Get POIs from appropriate source based on active tab
  const poisQuery = useNearbyPOIs(
    () => userLocation()?.latitude,
    () => userLocation()?.longitude,
    () => searchRadius(),
  );

  const restaurantsQuery = useNearbyRestaurants(
    () => userLocation()?.latitude,
    () => userLocation()?.longitude,
    () => searchRadius(),
  );

  const activitiesQuery = useNearbyActivities(
    () => userLocation()?.latitude,
    () => userLocation()?.longitude,
    () => searchRadius(),
  );

  const hotelsQuery = useNearbyHotels(
    () => userLocation()?.latitude,
    () => userLocation()?.longitude,
    () => searchRadius(),
  );

  const attractionsQuery = useNearbyAttractions(
    () => userLocation()?.latitude,
    () => userLocation()?.longitude,
    () => searchRadius(),
  );

  // Debug user location
  createEffect(() => {
    console.log("👤 User location changed:", userLocation());
    console.log("👤 Latitude:", userLocation()?.latitude);
    console.log("👤 Longitude:", userLocation()?.longitude);
  });

  // Convert streaming POI data to display format
  const convertPOIToDisplayFormat = (poi: POIDetailedInfo) => {
    return {
      id: poi.id,
      name: poi.name,
      category: poi.category,
      description: poi.description,
      latitude: poi.latitude,
      longitude: poi.longitude,
      address: poi.address || "Address not available",
      price: poi.price_level || "Free",
      rating: poi.rating || 4.0,
      reviewCount: 0, // Not available in streaming data
      tags: poi.tags || [],
      amenities: poi.amenities || [],
      distance: "0.5 km", // Default value
      city: poi.city,
      country: "Portugal", // Default
      timeToSpend: poi.time_to_spend || "1-2 hours",
      budget: poi.budget || poi.price_level || "Free",
      priority: poi.priority || 1,
      featured: false, // Default
      openNow: true, // Default
    };
  };

  // Check if POI is in favorites
  const isFavorite = (poiId: string) => {
    const favs = favoritesQuery.data || [];
    const isInFavorites = favs.some((poi) => poi.id === poiId);
    console.log(`🔍 isFavorite(${poiId}):`, isInFavorites, "Favs:", favs);
    return isInFavorites;
  };

  const sortOptions = [
    { id: "popularity", label: "Popularity" },
    { id: "rating", label: "Rating" },
    { id: "distance", label: "Distance" },
    { id: "price", label: "Price" },
  ];

  // Get display location
  const displayLocation = () => {
    const streaming = streamingData();
    if (streaming && streaming.activities && streaming.activities.length > 0) {
      return streaming.activities[0].city || "Places";
    }

    const tabTitles = {
      general: "Nearby Places",
      restaurants: "Restaurants",
      activities: "Activities",
      hotels: "Hotels",
      attractions: "Attractions",
    };

    return tabTitles[activeTab()] || "Nearby Places";
  };

  // Get current query based on active tab
  const getCurrentQuery = () => {
    switch (activeTab()) {
      case "restaurants":
        return restaurantsQuery;
      case "activities":
        return activitiesQuery;
      case "hotels":
        return hotelsQuery;
      case "attractions":
        return attractionsQuery;
      default:
        return poisQuery;
    }
  };

  // Filter and sort POIs
  const filteredPois = () => {
    const currentQuery = getCurrentQuery();
    const data = currentQuery.data(); // Call the function to get the reactive value

    // If data is undefined or not an array, return an empty array
    if (!data || !Array.isArray(data)) {
      console.log("filteredPois - returning empty array, data is:", data);
      return [];
    }
    let filtered = data;

    // Search filter
    if (searchQuery()) {
      const query = searchQuery().toLowerCase();
      filtered = filtered.filter(
        (poi) =>
          poi.name.toLowerCase().includes(query) ||
          poi.description.toLowerCase().includes(query) ||
          (poi.tags || []).some((tag) => tag.toLowerCase().includes(query)),
      );
    }

    // Filter favorites
    if (showOnlyFavorites()) {
      filtered = filtered.filter((poi) => isFavorite(poi.id));
    }

    // Note: Category, Price, and Rating filters are now handled server-side in the API
    // Only search query is handled client-side for real-time filtering

    // Sort
    filtered.sort((a, b) => {
      let aVal, bVal;
      switch (sortBy()) {
        case "rating":
          aVal = a.rating;
          bVal = b.rating;
          break;
        case "distance":
          aVal = parseFloat(a.distance);
          bVal = parseFloat(b.distance);
          break;
        case "price":
          const priceValues = { Free: 0, "€": 1, "€€": 2, "€€€": 3 };
          aVal = priceValues[a.price] || 0;
          bVal = priceValues[b.price] || 0;
          break;
        case "popularity":
        default:
          aVal = a.reviewCount;
          bVal = b.reviewCount;
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

  const toggleFavorite = (poiId: string, poi?: POIDetailedInfo) => {
    if (isFavorite(poiId)) {
      removeFromFavoritesMutation.mutate({ poiId, poiData: poi });
    } else {
      if (!poi) return; // Ensure poi is provided for adding
      addToFavoritesMutation.mutate({ poiId, poiData: poi });
    }
  };

  // Handle POI item click for details view
  const handleItemClick = (poi: any, type: string) => {
    console.log("Viewing details for:", poi.name);
    // Navigate to POI details page or open modal
    // navigate(`/poi/${poi.id}`);
  };

  // Handle sharing a POI
  const handleShare = (poi: any) => {
    if (navigator.share) {
      navigator
        .share({
          title: poi.name,
          text: `Check out ${poi.name} - ${poi.description}`,
          url: window.location.href + `?poi=${poi.id}`,
        })
        .catch((err) => console.log("Error sharing:", err));
    } else {
      // Fallback to clipboard
      const shareText = `Check out ${poi.name}: ${poi.description}`;
      navigator.clipboard
        .writeText(shareText)
        .then(() => {
          // Show notification
          console.log("Copied to clipboard!");
        })
        .catch((err) => console.log("Failed to copy:", err));
    }
  };

  const getPriceColor = (price: string) => {
    const colorMap = {
      Free: "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900",
      "€": "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900",
      "€€": "text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-900",
      "€€€": "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900",
      "€€€€":
        "text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-900",
    };
    return (
      colorMap[price] ||
      "text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-800"
    );
  };

  const getPopularityInfo = (priority: number) => {
    if (priority >= 9) {
      return {
        label: "Trending",
        color: "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900",
        icon: "🔥",
      };
    } else if (priority >= 7) {
      return {
        label: "Popular",
        color:
          "text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-900",
        icon: "⭐",
      };
    } else if (priority >= 5) {
      return {
        label: "Liked",
        color: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900",
        icon: "👍",
      };
    } else if (priority >= 3) {
      return {
        label: "Rising",
        color:
          "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900",
        icon: "📈",
      };
    }
    return null; // Don't show anything for low popularity
  };

  const getCategoryColor = (category: string) => {
    const categoryColorMap = {
      restaurant: "text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900",
      museum:
        "text-purple-700 bg-purple-100 dark:text-purple-300 dark:bg-purple-900",
      park: "text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900",
      landmark: "text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900",
      historical:
        "text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-900",
      entertainment:
        "text-pink-700 bg-pink-100 dark:text-pink-300 dark:bg-pink-900",
      cultural:
        "text-indigo-700 bg-indigo-100 dark:text-indigo-300 dark:bg-indigo-900",
      beach: "text-cyan-700 bg-cyan-100 dark:text-cyan-300 dark:bg-cyan-900",
    };
    return (
      categoryColorMap[category.toLowerCase()] ||
      "text-gray-700 bg-gray-100 dark:text-gray-300 dark:bg-gray-700"
    );
  };

  const renderGridCard = (poi) => (
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all duration-200 group">
      {/* Image */}
      <div class="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900">
        <div class="absolute inset-0 flex items-center justify-center text-4xl">
          🏛️
        </div>

        {/* Badges */}
        <div class="absolute top-3 left-3 flex flex-col gap-1">
          <Show when={poi.featured}>
            <span class="px-2 py-1 bg-yellow-500 text-white rounded-full text-xs font-medium">
              Featured
            </span>
          </Show>
          <Show when={poi.openNow}>
            <span class="px-2 py-1 bg-green-500 text-white rounded-full text-xs font-medium">
              Open Now
            </span>
          </Show>
        </div>

        {/* Action buttons */}
        <div class="absolute top-3 right-3 opacity-100 transition-opacity">
          <div class="flex flex-col gap-1">
            <button
              onClick={() => toggleFavorite(poi.id, poi)}
              disabled={
                addToFavoritesMutation.isPending ||
                removeFromFavoritesMutation.isPending
              }
              data-poi-id={poi.id}
              class={`p-2 rounded-lg ${isFavorite(poi.id) ? "text-yellow-600" : "text-gray-400"} ...`}
              title={
                isFavorite(poi.id)
                  ? "Remove from favorites"
                  : "Add to favorites"
              }
            >
              <Show
                when={
                  !(
                    addToFavoritesMutation.isPending ||
                    removeFromFavoritesMutation.isPending
                  )
                }
                fallback={
                  <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                }
              >
                <Star
                  class={`w-4 h-4 ${isFavorite(poi.id) ? "fill-current" : ""}`}
                />
              </Show>
            </button>
            <button
              onClick={() => handleShare(poi)}
              class="p-2 bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-300 rounded-lg shadow-sm hover:scale-110 transition-transform"
            >
              <Share2 class="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Rating badge */}
        <div class="absolute bottom-3 left-3">
          <div class="flex items-center gap-1 bg-white/90 dark:bg-gray-800/90 rounded-full px-2 py-1 text-sm font-medium">
            <Star class="w-3 h-3 text-yellow-500 fill-current" />
            <span class="text-gray-900 dark:text-white">{poi.rating}</span>
            <span class="text-gray-600 dark:text-gray-400">
              ({poi.reviewCount})
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div class="p-4">
        <div class="flex items-start justify-between mb-2">
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-gray-900 dark:text-white text-base mb-1 truncate">
              {poi.name}
            </h3>
            <div class="flex flex-wrap items-center gap-2 mb-1">
              <span
                class={`px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(poi.category)}`}
              >
                {poi.category}
              </span>
              <Show when={poi.priority && getPopularityInfo(poi.priority)}>
                {(() => {
                  const popularityInfo = getPopularityInfo(poi.priority);
                  return popularityInfo ? (
                    <span
                      class={`px-2 py-0.5 rounded-full text-xs font-medium ${popularityInfo.color}`}
                    >
                      <span class="mr-1">{popularityInfo.icon}</span>
                      {popularityInfo.label}
                    </span>
                  ) : null;
                })()}
              </Show>
              <Show when={poi.timeToSpend || poi.time_to_spend}>
                <span class="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs">
                  {poi.timeToSpend || poi.time_to_spend}
                </span>
              </Show>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400">{poi.city}</p>
          </div>
          <span
            class={`px-2 py-1 rounded-full text-xs font-medium ${getPriceColor(poi.price)}`}
          >
            {poi.price}
          </span>
        </div>

        <p class="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {poi.description}
        </p>

        {/* Details */}
        <div class="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-500 mb-3">
          <div class="flex items-center gap-1">
            <MapPin class="w-3 h-3" />
            <span>{poi.distance}</span>
          </div>
          <Show when={poi.amenities && poi.amenities.length > 0}>
            <div class="flex items-center gap-1">
              <Clock class="w-3 h-3" />
              <span>{poi.amenities[0]}</span>
            </div>
          </Show>
        </div>

        {/* Tags */}
        <div class="flex flex-wrap gap-1 mb-3">
          {(poi.tags || []).slice(0, 3).map((tag) => (
            <span class="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs">
              {tag}
            </span>
          ))}
          {(poi.tags || []).length > 3 && (
            <span class="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-xs">
              +{(poi.tags || []).length - 3}
            </span>
          )}
        </div>

        {/* Footer */}
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-sm">
            <Show when={poi.amenities && poi.amenities.includes("Wifi")}>
              <Wifi class="w-4 h-4 text-gray-400" />
            </Show>
            <Show when={poi.amenities && poi.amenities.includes("Parking")}>
              <MapPin class="w-4 h-4 text-gray-400" />
            </Show>
          </div>
          <button
            onClick={() => handleItemClick(poi, "poi")}
            class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm"
          >
            View Details →
          </button>
        </div>
      </div>
    </div>
  );

  createEffect(() => {
    console.log("Search radius changed to:", searchRadius());
  });

  createEffect(() => {
    console.log("=== Active tab changed ===");
    console.log("activeTab():", activeTab());
    console.log("getCurrentQuery().data():", getCurrentQuery().data());
    console.log("filteredPois():", filteredPois());
  });

  createEffect(() => {
    console.log("=== poisQuery.data changed ===");
    console.log("poisQuery.data:", poisQuery.data());
    console.log("filteredPois():", filteredPois());
  });

  const renderListItem = (poi) => (
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all duration-200">
      <div class="flex gap-4">
        {/* Image */}
        <div class="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg flex items-center justify-center flex-shrink-0">
          🏛️
        </div>

        {/* Content */}
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between mb-2">
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-gray-900 dark:text-white text-lg">
                {poi.name}
              </h3>
              <div class="flex flex-wrap items-center gap-2 mb-1">
                <span
                  class={`px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(poi.category)}`}
                >
                  {poi.category}
                </span>
                <Show when={poi.priority && getPopularityInfo(poi.priority)}>
                  {(() => {
                    const popularityInfo = getPopularityInfo(poi.priority);
                    return popularityInfo ? (
                      <span
                        class={`px-2 py-0.5 rounded-full text-xs font-medium ${popularityInfo.color}`}
                      >
                        <span class="mr-1">{popularityInfo.icon}</span>
                        {popularityInfo.label}
                      </span>
                    ) : null;
                  })()}
                </Show>
                <Show when={poi.timeToSpend || poi.time_to_spend}>
                  <span class="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs">
                    {poi.timeToSpend || poi.time_to_spend}
                  </span>
                </Show>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {poi.city}, {poi.country}
              </p>
            </div>
            <div class="flex items-center gap-2">
              <div class="flex items-center gap-1">
                <Star class="w-4 h-4 text-yellow-500 fill-current" />
                <span class="text-sm font-medium text-gray-900 dark:text-white">
                  {poi.rating}
                </span>
                <span class="text-sm text-gray-600 dark:text-gray-400">
                  ({poi.reviewCount})
                </span>
              </div>
              <span
                class={`px-2 py-1 rounded-full text-xs font-medium ${getPriceColor(poi.price)}`}
              >
                {poi.price}
              </span>
            </div>
          </div>

          <p class="text-gray-600 dark:text-gray-400 mb-3">{poi.description}</p>

          <div class="flex items-center justify-between">
            <div class="flex flex-wrap gap-1">
              {(poi.tags || []).slice(0, 4).map((tag) => (
                <span class="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs">
                  {tag}
                </span>
              ))}
            </div>

            <div class="flex items-center gap-2">
              <button
                onClick={() => toggleFavorite(poi.id, poi)}
                disabled={
                  addToFavoritesMutation.isPending ||
                  removeFromFavoritesMutation.isPending
                }
                data-poi-id={poi.id}
                class={`p-2 rounded-lg ${isFavorite(poi.id) ? "text-yellow-600 dark:text-yellow-400" : "text-gray-400"} hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed`}
                title={
                  isFavorite(poi.id)
                    ? "Remove from favorites"
                    : "Add to favorites"
                }
              >
                <Show
                  when={
                    !(
                      addToFavoritesMutation.isPending ||
                      removeFromFavoritesMutation.isPending
                    )
                  }
                  fallback={
                    <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  }
                >
                  <Star
                    class={`w-4 h-4 ${isFavorite(poi.id) ? "fill-current" : ""}`}
                  />
                </Show>
              </button>
              <button
                onClick={() => handleShare(poi)}
                class="p-2 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Share this place"
              >
                <Share2 class="w-4 h-4" />
              </button>
              <button
                onClick={() => handleItemClick(poi, "poi")}
                class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm"
              >
                <Eye class="w-4 h-4 inline mr-1" />
                Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Chat Success Banner */}
      <Show when={fromChat()}>
        <div class="bg-gradient-to-r from-green-50 to-blue-50 border-b border-green-200 px-4 py-3 sm:px-6">
          <div class="max-w-7xl mx-auto">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Compass class="w-4 h-4 text-white" />
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-green-900">
                  ✨{" "}
                  <TypingAnimation text="Your activity recommendations are ready!" />
                </p>
                <p class="text-xs text-green-700">
                  Generated from your chat: "
                  {location.state?.originalMessage || "Activity search"}"
                </p>
              </div>
              <button
                onClick={() => setFromChat(false)}
                class="p-1 text-green-600 hover:text-green-700"
              >
                <X class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </Show>

      {/* Header */}
      <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                Discover {displayLocation()}
              </h1>
              <Show when={!userLocation()}>
                <div class="flex items-center gap-3 mt-1">
                  <Show when={isLoadingLocation()}>
                    <p class="text-blue-600 dark:text-blue-400 text-sm">
                      📍 Getting your location...
                    </p>
                  </Show>
                  <Show when={!isLoadingLocation() && !locationError()}>
                    <p class="text-amber-600 dark:text-amber-400 text-sm">
                      📍 Enable location to discover nearby places
                    </p>
                    <button
                      onClick={requestLocation}
                      class="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md transition-colors"
                    >
                      Enable Location
                    </button>
                  </Show>
                  <Show when={locationError()}>
                    <p class="text-red-600 dark:text-red-400 text-sm">
                      📍 Location access denied. Please enable location in your
                      browser.
                    </p>
                  </Show>
                </div>
              </Show>
              <Show when={userLocation() && getCurrentQuery().isLoading()}>
                <p class="text-blue-600 dark:text-blue-400 text-sm">
                  Loading nearby places...
                </p>
              </Show>
              <Show when={getCurrentQuery().isError()}>
                <div class="mt-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <p class="text-red-600 dark:text-red-400 text-sm font-medium">
                    Backend Error:{" "}
                    {getCurrentQuery().error()?.message ||
                      "Failed to load data"}
                  </p>
                  <p class="text-red-500 dark:text-red-400 text-xs mt-1">
                    This appears to be a server-side issue. Please try again
                    later.
                  </p>
                  <button
                    onClick={() => getCurrentQuery().refetch()}
                    class="mt-2 px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              </Show>
              <Show
                when={getCurrentQuery().isSuccess() && getCurrentQuery().data()}
              >
                <div class="flex items-center gap-4 mt-1">
                  <p class="text-gray-600 dark:text-gray-400">
                    {getCurrentQuery()?.data()?.length} amazing places to visit
                  </p>
                </div>
              </Show>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Tabs value={activeTab()} onChange={setActiveTab} class="w-full">
            <TabsList class="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-none lg:inline-flex lg:h-10 lg:items-center lg:justify-center lg:rounded-md lg:bg-gray-100 lg:p-1 lg:text-gray-500 dark:lg:bg-gray-800 dark:lg:text-gray-400">
              <TabsTrigger
                value="general"
                class="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-gray-100"
              >
                <div class="flex items-center gap-2">
                  <Compass class="w-4 h-4" />
                  <span class="hidden sm:inline">General</span>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="restaurants"
                class="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-gray-100"
              >
                <div class="flex items-center gap-2">
                  <DollarSign class="w-4 h-4" />
                  <span class="hidden sm:inline">Restaurants</span>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="activities"
                class="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-gray-100"
              >
                <div class="flex items-center gap-2">
                  <Camera class="w-4 h-4" />
                  <span class="hidden sm:inline">Activities</span>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="hotels"
                class="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-gray-100"
              >
                <div class="flex items-center gap-2">
                  <MapPin class="w-4 h-4" />
                  <span class="hidden sm:inline">Hotels</span>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="attractions"
                class="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-gray-100"
              >
                <div class="flex items-center gap-2">
                  <Star class="w-4 h-4" />
                  <span class="hidden sm:inline">Attractions</span>
                </div>
              </TabsTrigger>
              <TabsIndicator />
            </TabsList>

            {/* Search and Controls - Moved under tabs */}
            <div class="mt-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div class="flex flex-col gap-4">
                {/* Top row: Search */}
                <div class="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Search */}
                  <div class="flex-1 relative">
                    <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search places..."
                      value={searchQuery()}
                      onInput={(e) => setSearchQuery(e.target.value)}
                      class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* View Mode Toggle */}
                  <div class="flex items-center gap-2">
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                      View:
                    </label>
                    <div class="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg p-1 bg-white dark:bg-gray-700">
                      <button
                        onClick={() => setViewMode("map-cards")}
                        class={`p-2 rounded transition-colors ${viewMode() === "map-cards" ? "bg-blue-600 text-white" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600"}`}
                        title="Split view: Map + Cards"
                      >
                        <div class="flex items-center gap-1">
                          <Map class="w-4 h-4" />
                          <Grid class="w-3 h-3" />
                        </div>
                      </button>
                      <button
                        onClick={() => setViewMode("cards")}
                        class={`p-2 rounded transition-colors ${viewMode() === "cards" ? "bg-blue-600 text-white" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600"}`}
                        title="Cards only"
                      >
                        <Grid class="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewMode("map")}
                        class={`p-2 rounded transition-colors ${viewMode() === "map" ? "bg-blue-600 text-white" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600"}`}
                        title="Map only"
                      >
                        <Map class="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Mobile Filters Toggle */}
                  <button
                    onClick={() => setShowFilters(!showFilters())}
                    class="sm:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Filter class="w-4 h-4" />
                    <span>Filters</span>
                  </button>
                </div>

                {/* Controls - Always visible on desktop, collapsible on mobile */}
                <div class={`${showFilters() ? "block" : "hidden"} sm:block`}>
                  <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    {/* Left side: Primary controls */}
                    <div class="flex flex-wrap items-center gap-4">
                      {/* Radius Selection */}
                      <div class="flex items-center gap-2">
                        <label
                          for="radius-select"
                          class="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap"
                        >
                          Radius:
                        </label>
                        <select
                          id="radius-select"
                          value={searchRadius()}
                          onChange={(e) =>
                            setSearchRadius(Number(e.target.value))
                          }
                          class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <For each={radiusOptions}>
                            {(option) => (
                              <option value={option.value}>
                                {option.label}
                              </option>
                            )}
                          </For>
                        </select>
                      </div>

                      {/* Sort Controls */}
                      <div class="flex items-center gap-2">
                        <label
                          for="sort-select"
                          class="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap"
                        >
                          Sort:
                        </label>
                        <select
                          id="sort-select"
                          value={sortBy()}
                          onChange={(e) => setSortBy(e.target.value)}
                          class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <For each={sortOptions}>
                            {(option) => (
                              <option value={option.id}>{option.label}</option>
                            )}
                          </For>
                        </select>
                      </div>

                      {/* Sort Order */}
                      <button
                        onClick={() =>
                          setSortOrder(sortOrder() === "asc" ? "desc" : "asc")
                        }
                        class="flex items-center gap-1 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                        title={`Sort ${sortOrder() === "asc" ? "Descending" : "Ascending"}`}
                      >
                        {sortOrder() === "asc" ? (
                          <SortAsc class="w-4 h-4" />
                        ) : (
                          <SortDesc class="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* Right side: Secondary controls */}
                    <div class="flex items-center gap-3">
                      {/* Favorites Toggle */}
                      <label class="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={showOnlyFavorites()}
                          onChange={(e) =>
                            setShowOnlyFavorites(e.target.checked)
                          }
                          class="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span class="text-sm text-gray-700 dark:text-gray-300">
                          Favorites only
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <TabsContent value="general" class="mt-4">
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <p class="text-gray-600 dark:text-gray-400">
                    {filteredPois().length} place
                    {filteredPois().length !== 1 ? "s" : ""} found
                  </p>
                </div>
                <div class="discover-content">
                  <Show
                    when={filteredPois().length > 0}
                    fallback={
                      <div class="text-center py-12">
                        <Search class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          No places found
                        </h3>
                        <p class="text-gray-600 dark:text-gray-400">
                          Try adjusting your search criteria or filters
                        </p>
                      </div>
                    }
                  >
                    {/* Map + Cards View */}
                    <Show when={viewMode() === "map-cards"}>
                      <div class="flex flex-col gap-6">
                        {/* Map Section */}
                        <div class="w-full h-[400px] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                          <MapComponent
                            center={[
                              getSearchCoordinates().lon,
                              getSearchCoordinates().lat,
                            ]}
                            zoom={12}
                            pointsOfInterest={filteredPois()}
                          />
                        </div>
                        {/* Cards Section */}
                        <div class="w-full">
                          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            <For each={filteredPois()}>
                              {(poi) => renderGridCard(poi)}
                            </For>
                          </div>
                        </div>
                      </div>
                    </Show>
                    {/* Cards Only View */}
                    <Show when={viewMode() === "cards"}>
                      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <For each={filteredPois()}>
                          {(poi) => renderGridCard(poi)}
                        </For>
                      </div>
                    </Show>
                    {/* Map Only View */}
                    <Show when={viewMode() === "map"}>
                      <div class="h-[700px] w-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                        <MapComponent
                          center={[
                            getSearchCoordinates().lon,
                            getSearchCoordinates().lat,
                          ]}
                          zoom={12}
                          pointsOfInterest={filteredPois()}
                        />
                      </div>
                    </Show>
                  </Show>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="restaurants" class="mt-4">
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <p class="text-gray-600 dark:text-gray-400">
                    {restaurantsQuery?.data()?.length || 0} restaurant
                    {(restaurantsQuery?.data()?.length || 0) !== 1
                      ? "s"
                      : ""}{" "}
                    found
                  </p>
                </div>
                <Show
                  when={
                    restaurantsQuery?.data() &&
                    restaurantsQuery.data().length > 0
                  }
                  fallback={
                    <div class="text-center py-12">
                      <Show
                        when={restaurantsQuery?.isLoading()}
                        fallback={
                          <div>
                            <DollarSign class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              No restaurants found
                            </h3>
                            <p class="text-gray-600 dark:text-gray-400">
                              Try adjusting your search criteria or location
                            </p>
                            <Show when={restaurantsQuery?.isError()}>
                              <div class="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                                <p class="text-red-600 dark:text-red-400 text-sm font-medium">
                                  Backend Error:{" "}
                                  {restaurantsQuery.error()?.message ||
                                    "Failed to load restaurants"}
                                </p>
                                <p class="text-red-500 dark:text-red-400 text-xs mt-1">
                                  This appears to be a server-side issue. Please
                                  try again later or contact support.
                                </p>
                                <button
                                  onClick={() => restaurantsQuery.refetch()}
                                  class="mt-2 px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition-colors"
                                >
                                  Retry
                                </button>
                              </div>
                            </Show>
                          </div>
                        }
                      >
                        <div>
                          <DollarSign class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4 animate-pulse" />
                          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Loading restaurants...
                          </h3>
                        </div>
                      </Show>
                    </div>
                  }
                >
                  {/* Map + Cards View */}
                  <Show when={viewMode() === "map-cards"}>
                    <div class="flex flex-col gap-6">
                      {/* Map Section */}
                      <div class="w-full h-[400px] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                        <MapComponent
                          center={[
                            getSearchCoordinates().lon,
                            getSearchCoordinates().lat,
                          ]}
                          zoom={12}
                          pointsOfInterest={restaurantsQuery.data() || []}
                        />
                      </div>
                      {/* Cards Section */}
                      <div class="w-full">
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          <For each={restaurantsQuery.data()}>
                            {(poi) => renderGridCard(poi)}
                          </For>
                        </div>
                      </div>
                    </div>
                  </Show>
                  {/* Cards Only View */}
                  <Show when={viewMode() === "cards"}>
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      <For each={restaurantsQuery.data()}>
                        {(poi) => renderGridCard(poi)}
                      </For>
                    </div>
                  </Show>
                  {/* Map Only View */}
                  <Show when={viewMode() === "map"}>
                    <div class="h-[700px] w-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                      <MapComponent
                        center={[
                          getSearchCoordinates().lon,
                          getSearchCoordinates().lat,
                        ]}
                        zoom={12}
                        pointsOfInterest={restaurantsQuery.data() || []}
                      />
                    </div>
                  </Show>
                </Show>
              </div>
            </TabsContent>

            <TabsContent value="activities" class="mt-4">
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <p class="text-gray-600 dark:text-gray-400">
                    {activitiesQuery?.data()?.length || 0} activit
                    {(activitiesQuery?.data()?.length || 0) !== 1
                      ? "ies"
                      : "y"}{" "}
                    found
                  </p>
                </div>
                <Show
                  when={
                    activitiesQuery?.data() && activitiesQuery.data().length > 0
                  }
                  fallback={
                    <div class="text-center py-12">
                      <Show
                        when={activitiesQuery?.isLoading()}
                        fallback={
                          <div>
                            <Camera class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              No activities found
                            </h3>
                            <p class="text-gray-600 dark:text-gray-400">
                              Try adjusting your search criteria or location
                            </p>
                            <Show when={activitiesQuery?.isError()}>
                              <div class="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                                <p class="text-red-600 dark:text-red-400 text-sm font-medium">
                                  Backend Error:{" "}
                                  {activitiesQuery.error()?.message ||
                                    "Failed to load activities"}
                                </p>
                                <p class="text-red-500 dark:text-red-400 text-xs mt-1">
                                  This appears to be a server-side issue. Please
                                  try again later or contact support.
                                </p>
                                <button
                                  onClick={() => activitiesQuery.refetch()}
                                  class="mt-2 px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition-colors"
                                >
                                  Retry
                                </button>
                              </div>
                            </Show>
                          </div>
                        }
                      >
                        <div>
                          <Camera class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4 animate-pulse" />
                          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Loading activities...
                          </h3>
                        </div>
                      </Show>
                    </div>
                  }
                >
                  {/* Map + Cards View */}
                  <Show when={viewMode() === "map-cards"}>
                    <div class="flex flex-col gap-6">
                      {/* Map Section */}
                      <div class="w-full h-[400px] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                        <MapComponent
                          center={[
                            getSearchCoordinates().lon,
                            getSearchCoordinates().lat,
                          ]}
                          zoom={12}
                          pointsOfInterest={activitiesQuery.data() || []}
                        />
                      </div>
                      {/* Cards Section */}
                      <div class="w-full">
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          <For each={activitiesQuery.data()}>
                            {(poi) => renderGridCard(poi)}
                          </For>
                        </div>
                      </div>
                    </div>
                  </Show>
                  {/* Cards Only View */}
                  <Show when={viewMode() === "cards"}>
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      <For each={activitiesQuery.data()}>
                        {(poi) => renderGridCard(poi)}
                      </For>
                    </div>
                  </Show>
                  {/* Map Only View */}
                  <Show when={viewMode() === "map"}>
                    <div class="h-[700px] w-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                      <MapComponent
                        center={[
                          getSearchCoordinates().lon,
                          getSearchCoordinates().lat,
                        ]}
                        zoom={12}
                        pointsOfInterest={activitiesQuery.data() || []}
                      />
                    </div>
                  </Show>
                </Show>
              </div>
            </TabsContent>

            <TabsContent value="hotels" class="mt-4">
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <p class="text-gray-600 dark:text-gray-400">
                    {hotelsQuery?.data()?.length || 0} hotel
                    {(hotelsQuery?.data()?.length || 0) !== 1 ? "s" : ""} found
                  </p>
                </div>
                <Show
                  when={hotelsQuery?.data() && hotelsQuery.data().length > 0}
                  fallback={
                    <div class="text-center py-12">
                      <Show
                        when={hotelsQuery?.isLoading()}
                        fallback={
                          <div>
                            <MapPin class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              No hotels found
                            </h3>
                            <p class="text-gray-600 dark:text-gray-400">
                              Try adjusting your search criteria or location
                            </p>
                            <Show when={hotelsQuery?.isError()}>
                              <div class="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                                <p class="text-red-600 dark:text-red-400 text-sm font-medium">
                                  Backend Error:{" "}
                                  {hotelsQuery.error()?.message ||
                                    "Failed to load hotels"}
                                </p>
                                <p class="text-red-500 dark:text-red-400 text-xs mt-1">
                                  This appears to be a server-side issue. Please
                                  try again later or contact support.
                                </p>
                                <button
                                  onClick={() => hotelsQuery.refetch()}
                                  class="mt-2 px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition-colors"
                                >
                                  Retry
                                </button>
                              </div>
                            </Show>
                          </div>
                        }
                      >
                        <div>
                          <MapPin class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4 animate-pulse" />
                          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Loading hotels...
                          </h3>
                        </div>
                      </Show>
                    </div>
                  }
                >
                  {/* Map + Cards View */}
                  <Show when={viewMode() === "map-cards"}>
                    <div class="flex flex-col gap-6">
                      {/* Map Section */}
                      <div class="w-full h-[400px] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                        <MapComponent
                          center={[
                            getSearchCoordinates().lon,
                            getSearchCoordinates().lat,
                          ]}
                          zoom={12}
                          pointsOfInterest={hotelsQuery.data() || []}
                        />
                      </div>
                      {/* Cards Section */}
                      <div class="w-full">
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          <For each={hotelsQuery.data()}>
                            {(poi) => renderGridCard(poi)}
                          </For>
                        </div>
                      </div>
                    </div>
                  </Show>
                  {/* Cards Only View */}
                  <Show when={viewMode() === "cards"}>
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      <For each={hotelsQuery.data()}>
                        {(poi) => renderGridCard(poi)}
                      </For>
                    </div>
                  </Show>
                  {/* Map Only View */}
                  <Show when={viewMode() === "map"}>
                    <div class="h-[700px] w-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                      <MapComponent
                        center={[
                          getSearchCoordinates().lon,
                          getSearchCoordinates().lat,
                        ]}
                        zoom={12}
                        pointsOfInterest={hotelsQuery.data() || []}
                      />
                    </div>
                  </Show>
                </Show>
              </div>
            </TabsContent>

            <TabsContent value="attractions" class="mt-4">
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <p class="text-gray-600 dark:text-gray-400">
                    {attractionsQuery?.data()?.length || 0} attraction
                    {(attractionsQuery?.data()?.length || 0) !== 1
                      ? "s"
                      : ""}{" "}
                    found
                  </p>
                </div>
                <Show
                  when={
                    attractionsQuery?.data() &&
                    attractionsQuery.data().length > 0
                  }
                  fallback={
                    <div class="text-center py-12">
                      <Show
                        when={attractionsQuery?.isLoading()}
                        fallback={
                          <div>
                            <Star class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              No attractions found
                            </h3>
                            <p class="text-gray-600 dark:text-gray-400">
                              Try adjusting your search criteria or location
                            </p>
                            <Show when={attractionsQuery?.isError()}>
                              <div class="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                                <p class="text-red-600 dark:text-red-400 text-sm font-medium">
                                  Backend Error:{" "}
                                  {attractionsQuery.error()?.message ||
                                    "Failed to load attractions"}
                                </p>
                                <p class="text-red-500 dark:text-red-400 text-xs mt-1">
                                  This appears to be a server-side issue. Please
                                  try again later or contact support.
                                </p>
                                <button
                                  onClick={() => attractionsQuery.refetch()}
                                  class="mt-2 px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition-colors"
                                >
                                  Retry
                                </button>
                              </div>
                            </Show>
                          </div>
                        }
                      >
                        <div>
                          <Star class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4 animate-pulse" />
                          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Loading attractions...
                          </h3>
                        </div>
                      </Show>
                    </div>
                  }
                >
                  {/* Map + Cards View */}
                  <Show when={viewMode() === "map-cards"}>
                    <div class="flex flex-col gap-6">
                      {/* Map Section */}
                      <div class="w-full h-[400px] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                        <MapComponent
                          center={[
                            getSearchCoordinates().lon,
                            getSearchCoordinates().lat,
                          ]}
                          zoom={12}
                          pointsOfInterest={attractionsQuery.data() || []}
                        />
                      </div>
                      {/* Cards Section */}
                      <div class="w-full">
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          <For each={attractionsQuery.data()}>
                            {(poi) => renderGridCard(poi)}
                          </For>
                        </div>
                      </div>
                    </div>
                  </Show>
                  {/* Cards Only View */}
                  <Show when={viewMode() === "cards"}>
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      <For each={attractionsQuery.data()}>
                        {(poi) => renderGridCard(poi)}
                      </For>
                    </div>
                  </Show>
                  {/* Map Only View */}
                  <Show when={viewMode() === "map"}>
                    <div class="h-[700px] w-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                      <MapComponent
                        center={[
                          getSearchCoordinates().lon,
                          getSearchCoordinates().lat,
                        ]}
                        zoom={12}
                        pointsOfInterest={attractionsQuery.data() || []}
                      />
                    </div>
                  </Show>
                </Show>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
