import { createSignal, For, Show, createMemo } from "solid-js";
import { useParams, useNavigate } from "@solidjs/router";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Star,
  MessageCircle,
  Calendar,
  TrendingUp,
  Building,
  Coffee,
  Eye,
  Share2,
  Bookmark,
  Download,
} from "lucide-solid";
import { useCityDetails } from "~/lib/api/recents";
import type {
  RecentInteraction,
  POIDetailedInfo,
  HotelDetailedInfo,
  RestaurantDetailedInfo,
} from "~/lib/api/types";

export default function CityDetailsPage() {
  const params = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = createSignal("overview"); // 'overview', 'interactions', 'places', 'favorites', 'itineraries'

  const cityDetailsQuery = useCityDetails(decodeURIComponent(params.city || ""));

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

  // Aggregate all POIs, hotels, and restaurants from interactions
  const allPlaces = createMemo(() => {
    if (!cityDetailsQuery.data?.interactions)
      return {
        pois: [] as POIDetailedInfo[],
        hotels: [] as HotelDetailedInfo[],
        restaurants: [] as RestaurantDetailedInfo[],
      };

    const pois: POIDetailedInfo[] = [];
    const hotels: HotelDetailedInfo[] = [];
    const restaurants: RestaurantDetailedInfo[] = [];

    cityDetailsQuery.data?.interactions?.forEach((interaction) => {
      pois.push(...(interaction.pois || []));
      hotels.push(...(interaction.hotels || []));
      restaurants.push(...(interaction.restaurants || []));
    });

    // Remove duplicates based on name
    const uniquePOIs = pois.filter(
      (poi, index, self) => index === self.findIndex((p) => p.name === poi.name),
    );
    const uniqueHotels = hotels.filter(
      (hotel, index, self) => index === self.findIndex((h) => h.name === hotel.name),
    );
    const uniqueRestaurants = restaurants.filter(
      (restaurant, index, self) => index === self.findIndex((r) => r.name === restaurant.name),
    );

    return {
      pois: uniquePOIs,
      hotels: uniqueHotels,
      restaurants: uniqueRestaurants,
    };
  });

  const getCategoryIcon = (category: string) => {
    const iconMap: Record<string, string> = {
      restaurant: "🍽️",
      hotel: "🏨",
      museum: "🏛️",
      park: "🌳",
      landmark: "🗽",
      historical: "🏛️",
      entertainment: "🎭",
      cultural: "🎨",
      beach: "🏖️",
      accommodation: "🏨",
    };
    return iconMap[category.toLowerCase()] || "📍";
  };

  const getCategoryColor = (_category: string) => "text-primary bg-primary/10";

  const getPriceColor = (_price: string) => "text-primary bg-primary/10";

  const renderPlaceCard = (place: POIDetailedInfo | HotelDetailedInfo | RestaurantDetailedInfo) => (
    <div class="bg-card rounded-lg shadow-sm border border-border p-4 hover:shadow-md transition-all duration-200">
      <div class="flex gap-3">
        {/* Icon */}
        <div class="w-12 h-12 bg-muted/50 border border-border rounded-lg flex items-center justify-center text-xl flex-shrink-0">
          {getCategoryIcon(place.category)}
        </div>

        {/* Content */}
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between mb-2">
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-foreground text-base mb-1">
                {place.name}
              </h3>
              <div class="flex flex-wrap items-center gap-2 mb-1">
                <span
                  class={`px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(place.category)}`}
                >
                  {place.category}
                </span>
                <Show when={place.price_level}>
                  <span
                    class={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriceColor(place.price_level || "")}`}
                  >
                    {place.price_level}
                  </span>
                </Show>
              </div>
            </div>
            <div class="flex items-center gap-1 text-sm">
              <Star class="w-4 h-4 text-accent fill-current" />
              <span class="text-muted-foreground">{place.rating}</span>
            </div>
          </div>

          <p class="text-sm text-muted-foreground mb-2 line-clamp-2">
            {place.description}
          </p>

          <div class="flex items-center gap-4 text-xs text-muted-foreground">
            <Show when={place.address}>
              <div class="flex items-center gap-1">
                <MapPin class="w-3 h-3" />
                <span class="truncate">{place.address}</span>
              </div>
            </Show>
          </div>

          {/* Tags */}
          <Show when={place.tags && place.tags.length > 0}>
            <div class="flex flex-wrap gap-1 mt-2">
              <For each={place.tags || []}>
                {(tag) => (
                  <span class="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs">
                    {tag}
                  </span>
                )}
              </For>
              {(place.tags?.length || 0) > 3 && (
                <span class="px-2 py-0.5 bg-muted text-muted-foreground rounded-full text-xs">
                  +{(place.tags?.length || 0) - 3}
                </span>
              )}
            </div>
          </Show>
        </div>
      </div>
    </div>
  );

  const renderInteractionCard = (interaction: RecentInteraction) => (
    <div class="bg-card rounded-lg shadow-sm border border-border p-4 hover:shadow-md transition-all duration-200">
      <div class="flex items-start gap-3">
        <div class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
          <MessageCircle class="w-5 h-5 text-primary" />
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between mb-2">
            <div class="flex-1 min-w-0">
              <h3 class="font-medium text-foreground text-sm mb-1">
                Chat Interaction
              </h3>
              <div class="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock class="w-3 h-3" />
                <span>{formatDate(interaction.created_at)}</span>
                <span>•</span>
                <span>{interaction.model_used}</span>
                <Show when={interaction.latency_ms}>
                  <span>•</span>
                  <span>{interaction.latency_ms}ms</span>
                </Show>
              </div>
            </div>
          </div>

          <div class="space-y-3">
            <div>
              <p class="text-xs font-medium text-muted-foreground mb-1">
                Your Question:
              </p>
              <p class="text-sm text-foreground bg-muted rounded-lg p-2">
                {interaction.prompt}
              </p>
            </div>

            <Show when={interaction.response_text}>
              <div>
                <p class="text-xs font-medium text-muted-foreground mb-1">
                  AI Response:
                </p>
                <p class="text-sm text-muted-foreground line-clamp-3">
                  {interaction.response_text}
                </p>
              </div>
            </Show>

            {/* Results Summary */}
            <div class="flex items-center gap-4 pt-2 border-t border-border">
              <Show when={interaction.pois && interaction.pois.length > 0}>
                <div class="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin class="w-3 h-3" />
                  <span>{interaction.pois.length} places</span>
                </div>
              </Show>
              <Show when={interaction.hotels && interaction.hotels.length > 0}>
                <div class="flex items-center gap-1 text-xs text-muted-foreground">
                  <Building class="w-3 h-3" />
                  <span>{interaction.hotels.length} hotels</span>
                </div>
              </Show>
              <Show when={interaction.restaurants && interaction.restaurants.length > 0}>
                <div class="flex items-center gap-1 text-xs text-muted-foreground">
                  <Coffee class="w-3 h-3" />
                  <span>{interaction.restaurants.length} restaurants</span>
                </div>
              </Show>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div class="min-h-screen bg-background relative transition-colors">
      {/* Header */}
      <div class="bg-card border-b border-border">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div class="flex items-center gap-4">
            <button
              onClick={() => navigate("/recents")}
              class="p-2 hover:bg-muted rounded-lg transition-colors"
              title="Back to recent activity"
            >
              <ArrowLeft class="w-5 h-5 text-muted-foreground" />
            </button>

            <div class="flex-1 min-w-0">
              <h1 class="text-xl sm:text-2xl font-bold text-foreground truncate">
                {decodeURIComponent(params.city || "")}
              </h1>
              <Show when={cityDetailsQuery.data}>
                <p class="text-sm text-muted-foreground mt-1">
                  {cityDetailsQuery.data?.interactions?.length || 0} interaction
                  {(cityDetailsQuery.data?.interactions?.length || 0) !== 1 ? "s" : ""} •
                  {cityDetailsQuery.data?.poi_count || 0} places discovered
                </p>
              </Show>
            </div>

            <div class="flex items-center gap-2">
              <button class="p-2 hover:bg-muted rounded-lg transition-colors">
                <Share2 class="w-5 h-5 text-muted-foreground" />
              </button>
              <button class="p-2 hover:bg-muted rounded-lg transition-colors">
                <Bookmark class="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div class="bg-card border-b border-border">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab("overview")}
              class={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab() === "overview"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("interactions")}
              class={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab() === "interactions"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Interactions ({cityDetailsQuery.data?.interactions.length || 0})
            </button>
            <button
              onClick={() => setActiveTab("places")}
              class={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab() === "places"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Places (
              {allPlaces().pois.length + allPlaces().hotels.length + allPlaces().restaurants.length}
              )
            </button>
            <button
              onClick={() => setActiveTab("favorites")}
              class={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab() === "favorites"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Favorites ({cityDetailsQuery.data?.favorite_pois?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab("itineraries")}
              class={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab() === "itineraries"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Saved Itineraries ({cityDetailsQuery.data?.saved_itineraries?.length || 0})
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Show when={cityDetailsQuery.isLoading}>
          <div class="flex items-center justify-center py-12">
            <div class="flex items-center gap-3">
              <div class="w-6 h-6 border-3 border-primary border-t-transparent rounded-full animate-spin" />
              <span class="text-muted-foreground">Loading city details...</span>
            </div>
          </div>
        </Show>

        <Show when={cityDetailsQuery.isError}>
          <div class="text-center py-12">
            <div class="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp class="w-6 h-6 text-destructive" />
            </div>
            <h3 class="text-lg font-semibold text-foreground mb-2">
              Unable to load city details
            </h3>
            <p class="text-muted-foreground mb-4">Please try again later</p>
            <button
              onClick={() => cityDetailsQuery.refetch()}
              class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        </Show>

        <Show when={cityDetailsQuery.isSuccess && cityDetailsQuery.data}>
          {/* Overview Tab */}
          <Show when={activeTab() === "overview"}>
            <div class="space-y-6">
              {/* Stats Cards */}
              <div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <div class="bg-card rounded-lg shadow-sm border border-border p-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <MessageCircle class="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p class="text-2xl font-bold text-foreground">
                        {cityDetailsQuery.data?.interactions?.length || 0}
                      </p>
                      <p class="text-sm text-muted-foreground">Interactions</p>
                    </div>
                  </div>
                </div>

                <div class="bg-card rounded-lg shadow-sm border border-border p-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                      <MapPin class="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p class="text-2xl font-bold text-foreground">
                        {allPlaces().pois.length}
                      </p>
                      <p class="text-sm text-muted-foreground">Attractions</p>
                    </div>
                  </div>
                </div>

                <div class="bg-card rounded-lg shadow-sm border border-border p-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Coffee class="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p class="text-2xl font-bold text-foreground">
                        {allPlaces().restaurants.length}
                      </p>
                      <p class="text-sm text-muted-foreground">Restaurants</p>
                    </div>
                  </div>
                </div>

                <div class="bg-card rounded-lg shadow-sm border border-border p-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Building class="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p class="text-2xl font-bold text-foreground">
                        {allPlaces().hotels.length}
                      </p>
                      <p class="text-sm text-muted-foreground">Hotels</p>
                    </div>
                  </div>
                </div>

                <div class="bg-card rounded-lg shadow-sm border border-border p-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Star class="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p class="text-2xl font-bold text-foreground">
                        {cityDetailsQuery.data?.total_favorites || 0}
                      </p>
                      <p class="text-sm text-muted-foreground">Favorites</p>
                    </div>
                  </div>
                </div>

                <div class="bg-card rounded-lg shadow-sm border border-border p-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Bookmark class="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p class="text-2xl font-bold text-foreground">
                        {cityDetailsQuery.data?.total_itineraries || 0}
                      </p>
                      <p class="text-sm text-muted-foreground">Saved</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity Timeline */}
              <div class="bg-card rounded-lg shadow-sm border border-border p-6">
                <h2 class="text-lg font-semibold text-foreground mb-4">
                  Recent Activity
                </h2>
                <div class="space-y-4">
                  <For each={cityDetailsQuery.data?.interactions?.slice(0, 3) || []}>
                    {(interaction) => (
                      <div class="flex items-start gap-3">
                        <div class="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <div class="flex-1 min-w-0">
                          <p class="text-sm text-foreground font-medium">
                            {interaction.prompt.slice(0, 80)}
                            {interaction.prompt.length > 80 ? "..." : ""}
                          </p>
                          <p class="text-xs text-muted-foreground mt-1">
                            {formatDate(interaction.created_at)}
                          </p>
                        </div>
                      </div>
                    )}
                  </For>
                  <Show when={(cityDetailsQuery.data?.interactions?.length || 0) > 3}>
                    <button
                      onClick={() => setActiveTab("interactions")}
                      class="text-sm text-primary hover:text-primary/80 font-medium"
                    >
                      View all {cityDetailsQuery.data?.interactions?.length || 0} interactions →
                    </button>
                  </Show>
                </div>
              </div>
            </div>
          </Show>

          {/* Interactions Tab */}
          <Show when={activeTab() === "interactions"}>
            <div class="space-y-4">
              <For each={cityDetailsQuery.data?.interactions || []}>
                {(interaction) => renderInteractionCard(interaction)}
              </For>
            </div>
          </Show>

          {/* Places Tab */}
          <Show when={activeTab() === "places"}>
            <div class="space-y-6">
              <Show when={allPlaces().pois.length > 0}>
                <div>
                  <h2 class="text-lg font-semibold text-foreground mb-4">
                    Attractions & Activities
                  </h2>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <For each={allPlaces().pois}>{(poi) => renderPlaceCard(poi)}</For>
                  </div>
                </div>
              </Show>

              <Show when={allPlaces().restaurants.length > 0}>
                <div>
                  <h2 class="text-lg font-semibold text-foreground mb-4">
                    Restaurants
                  </h2>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <For each={allPlaces().restaurants}>
                      {(restaurant) => renderPlaceCard(restaurant)}
                    </For>
                  </div>
                </div>
              </Show>

              <Show when={allPlaces().hotels.length > 0}>
                <div>
                  <h2 class="text-lg font-semibold text-foreground mb-4">Hotels</h2>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <For each={allPlaces().hotels}>{(hotel) => renderPlaceCard(hotel)}</For>
                  </div>
                </div>
              </Show>

              <Show
                when={
                  allPlaces().pois.length === 0 &&
                  allPlaces().restaurants.length === 0 &&
                  allPlaces().hotels.length === 0
                }
              >
                <div class="text-center py-12">
                  <MapPin class="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 class="text-lg font-semibold text-foreground mb-2">
                    No places found
                  </h3>
                  <p class="text-muted-foreground">
                    No places were discovered in your interactions for this city.
                  </p>
                </div>
              </Show>
            </div>
          </Show>

          {/* Favorites Tab */}
          <Show when={activeTab() === "favorites"}>
            <div class="space-y-6">
              <Show
                when={
                  cityDetailsQuery.data?.favorite_pois &&
                  cityDetailsQuery.data.favorite_pois.length > 0
                }
              >
                <div>
                  <h2 class="text-lg font-semibold text-foreground mb-4">
                    Your Favorites in {decodeURIComponent(params.city || "")}
                  </h2>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <For each={cityDetailsQuery.data?.favorite_pois || []}>
                      {(poi) => renderPlaceCard(poi)}
                    </For>
                  </div>
                </div>
              </Show>

              <Show
                when={
                  !cityDetailsQuery.data?.favorite_pois ||
                  cityDetailsQuery.data.favorite_pois.length === 0
                }
              >
                <div class="text-center py-12">
                  <Star class="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 class="text-lg font-semibold text-foreground mb-2">
                    No favorites yet
                  </h3>
                  <p class="text-muted-foreground">
                    Places you mark as favorites will appear here.
                  </p>
                </div>
              </Show>
            </div>
          </Show>

          {/* Saved Itineraries Tab */}
          <Show when={activeTab() === "itineraries"}>
            <div class="space-y-6">
              <Show
                when={
                  cityDetailsQuery.data?.saved_itineraries &&
                  cityDetailsQuery.data.saved_itineraries.length > 0
                }
              >
                <div>
                  <h2 class="text-lg font-semibold text-foreground mb-4">
                    Saved Itineraries for {decodeURIComponent(params.city || "")}
                  </h2>
                  <div class="space-y-4">
                    <For each={cityDetailsQuery.data?.saved_itineraries || []}>
                      {(itinerary) => (
                        <div class="bg-card rounded-lg shadow-sm border border-border p-6 hover:shadow-md transition-all duration-200">
                          <div class="flex items-start justify-between mb-4">
                            <div class="flex-1 min-w-0">
                              <h3 class="font-semibold text-foreground text-lg mb-2">
                                {itinerary.title}
                              </h3>
                              <Show when={itinerary.description}>
                                <p class="text-muted-foreground mb-3">
                                  {itinerary.description}
                                </p>
                              </Show>

                              <div class="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                <div class="flex items-center gap-1">
                                  <Calendar class="w-4 h-4" />
                                  <span>Saved {formatDate(itinerary.created_at)}</span>
                                </div>
                                <Show when={itinerary.estimated_duration_days}>
                                  <div class="flex items-center gap-1">
                                    <Clock class="w-4 h-4" />
                                    <span>{itinerary.estimated_duration_days} days</span>
                                  </div>
                                </Show>
                                <Show when={itinerary.is_public}>
                                  <span class="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                                    Public
                                  </span>
                                </Show>
                              </div>
                            </div>

                            <div class="flex items-center gap-2 ml-4">
                              <button class="p-2 hover:bg-muted rounded-lg transition-colors">
                                <Eye class="w-4 h-4 text-muted-foreground" />
                              </button>
                              <button class="p-2 hover:bg-muted rounded-lg transition-colors">
                                <Share2 class="w-4 h-4 text-muted-foreground" />
                              </button>
                              <button class="p-2 hover:bg-muted rounded-lg transition-colors">
                                <Download class="w-4 h-4 text-muted-foreground" />
                              </button>
                            </div>
                          </div>

                          <Show when={itinerary.tags && itinerary.tags.length > 0}>
                            <div class="flex flex-wrap gap-2">
                              <For each={itinerary.tags}>
                                {(tag) => (
                                  <span class="px-2 py-1 bg-muted text-muted-foreground rounded-full text-xs">
                                    {tag}
                                  </span>
                                )}
                              </For>
                            </div>
                          </Show>
                        </div>
                      )}
                    </For>
                  </div>
                </div>
              </Show>

              <Show
                when={
                  !cityDetailsQuery.data?.saved_itineraries ||
                  cityDetailsQuery.data.saved_itineraries.length === 0
                }
              >
                <div class="text-center py-12">
                  <Bookmark class="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 class="text-lg font-semibold text-foreground mb-2">
                    No saved itineraries
                  </h3>
                  <p class="text-muted-foreground">
                    Itineraries you save will appear here for easy access.
                  </p>
                </div>
              </Show>
            </div>
          </Show>
        </Show>
      </div>
    </div>
  );
}
