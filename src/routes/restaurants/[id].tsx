import { createSignal, For, Show } from "solid-js";
import { useParams } from "@solidjs/router";
import {
  Star,
  MapPin,
  Clock,
  Phone,
  Mail,
  Globe,
  Heart,
  Share2,
  DollarSign,
  Users,
  Utensils,
  ArrowLeft,
} from "lucide-solid";
import { A } from "@solidjs/router";
import { useRestaurantDetails } from "~/lib/api/restaurants";

export default function RestaurantDetailPage() {
  const params = useParams();
  const [selectedTab, setSelectedTab] = createSignal("overview");
  const [isFavorite, setIsFavorite] = createSignal(false);
  // Use API hook to fetch restaurant details
  const restaurantQuery = useRestaurantDetails(params.id || "");

  const restaurant = () => restaurantQuery.data;

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "menu", label: "Menu" },
    { id: "hours", label: "Hours & Contact" },
    { id: "location", label: "Location" },
    { id: "reviews", label: "Reviews" },
  ];

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite());
  };

  const getPriceColor = (_price: string) => "text-primary bg-primary/10";

  const renderOverview = () => (
    <div class="space-y-6">
      {/* Description */}
      <div class="bg-card rounded-lg p-6 border border-border">
        <h3 class="text-lg font-semibold text-foreground mb-3">
          About this restaurant
        </h3>
        <p class="text-muted-foreground leading-relaxed">{restaurant()?.description}</p>
      </div>

      {/* Key Information */}
      <div class="bg-card rounded-lg p-6 border border-border">
        <h3 class="text-lg font-semibold text-foreground mb-4">Restaurant Details</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex items-center gap-3">
            <Utensils class="w-5 h-5 text-primary" />
            <div>
              <div class="font-medium text-foreground">Cuisine</div>
              <div class="text-sm text-muted-foreground">{restaurant()?.cuisine}</div>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <DollarSign class="w-5 h-5 text-primary" />
            <div>
              <div class="font-medium text-foreground">Average Price</div>
              <div class="text-sm text-muted-foreground">
                {restaurant()?.averagePrice}
              </div>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <Clock class="w-5 h-5 text-primary" />
            <div>
              <div class="font-medium text-foreground">Status</div>
              <div
                class={`text-sm font-medium ${restaurant()?.isOpen ? "text-accent" : "text-destructive"}`}
              >
                {restaurant()?.isOpen ? "Open Now" : "Closed"}
              </div>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <Users class="w-5 h-5 text-primary" />
            <div>
              <div class="font-medium text-foreground">Reservations</div>
              <div class="text-sm text-muted-foreground">
                {restaurant()?.reservationRequired ? "Recommended" : "Not Required"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Specialties */}
      <div class="bg-card rounded-lg p-6 border border-border">
        <h3 class="text-lg font-semibold text-foreground mb-4">Specialties</h3>
        <div class="flex flex-wrap gap-2">
          <For each={restaurant()?.specialties}>
            {(specialty) => (
              <span class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                {specialty}
              </span>
            )}
          </For>
        </div>
      </div>

      {/* Features */}
      <div class="bg-card rounded-lg p-6 border border-border">
        <h3 class="text-lg font-semibold text-foreground mb-4">
          Features & Amenities
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <For each={restaurant()?.features}>
            {(feature) => {
              const isObject = typeof feature !== "string";
              const featureName = isObject ? (feature as any).name : feature;
              const featureAvailable = isObject ? (feature as any).available : true;
              const IconComponent = isObject ? (feature as any).icon : null;

              return (
                <div
                  class={`flex items-center gap-3 p-3 rounded-lg ${
                    featureAvailable
                      ? "bg-accent/10 text-accent"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Show when={IconComponent}>
                    <IconComponent class="w-5 h-5" />
                  </Show>
                  <span class="font-medium">{featureName}</span>
                  <Show when={!featureAvailable}>
                    <span class="text-xs">(Not Available)</span>
                  </Show>
                </div>
              );
            }}
          </For>
        </div>
      </div>
    </div>
  );

  const renderMenu = () => (
    <div class="space-y-6">
      {/* Starters */}
      <div class="bg-card rounded-lg p-6 border border-border">
        <h3 class="text-lg font-semibold text-foreground mb-4">Starters</h3>
        <div class="space-y-4">
          <For each={restaurant()?.menu?.starters}>
            {(item) => (
              <div class="flex justify-between items-start pb-3 border-b border-border last:border-b-0">
                <div class="flex-1">
                  <h4 class="font-medium text-foreground">{item.name}</h4>
                  <p class="text-sm text-muted-foreground mt-1">{item.description}</p>
                </div>
                <span class="font-semibold text-primary ml-4">
                  {item.price}
                </span>
              </div>
            )}
          </For>
        </div>
      </div>

      {/* Main Courses */}
      <div class="bg-card rounded-lg p-6 border border-border">
        <h3 class="text-lg font-semibold text-foreground mb-4">Main Courses</h3>
        <div class="space-y-4">
          <For each={restaurant()?.menu?.mains}>
            {(item) => (
              <div class="flex justify-between items-start pb-3 border-b border-border last:border-b-0">
                <div class="flex-1">
                  <h4 class="font-medium text-foreground">{item.name}</h4>
                  <p class="text-sm text-muted-foreground mt-1">{item.description}</p>
                </div>
                <span class="font-semibold text-primary ml-4">
                  {item.price}
                </span>
              </div>
            )}
          </For>
        </div>
      </div>

      {/* Desserts */}
      <div class="bg-card rounded-lg p-6 border border-border">
        <h3 class="text-lg font-semibold text-foreground mb-4">Desserts</h3>
        <div class="space-y-4">
          <For each={restaurant()?.menu?.desserts}>
            {(item) => (
              <div class="flex justify-between items-start pb-3 border-b border-border last:border-b-0">
                <div class="flex-1">
                  <h4 class="font-medium text-foreground">{item.name}</h4>
                  <p class="text-sm text-muted-foreground mt-1">{item.description}</p>
                </div>
                <span class="font-semibold text-primary ml-4">
                  {item.price}
                </span>
              </div>
            )}
          </For>
        </div>
      </div>
    </div>
  );

  const renderHours = () => (
    <div class="space-y-6">
      {/* Opening Hours */}
      <div class="bg-card rounded-lg p-6 border border-border">
        <h3 class="text-lg font-semibold text-foreground mb-4">Opening Hours</h3>
        <div class="space-y-2">
          <For each={Object.entries(restaurant()?.hours || {})}>
            {([day, hours]) => (
              <div class="flex justify-between items-center py-2">
                <span class="font-medium text-foreground">{day}</span>
                <span
                  class={`text-sm ${hours === "Closed" ? "text-destructive" : "text-muted-foreground"}`}
                >
                  {hours}
                </span>
              </div>
            )}
          </For>
        </div>
      </div>

      {/* Contact Information */}
      <div class="bg-card rounded-lg p-6 border border-border">
        <h3 class="text-lg font-semibold text-foreground mb-4">
          Contact Information
        </h3>
        <div class="space-y-3">
          <div class="flex items-center gap-3">
            <Phone class="w-5 h-5 text-primary" />
            <span class="text-foreground">{restaurant()?.contact?.phone}</span>
          </div>
          <div class="flex items-center gap-3">
            <Mail class="w-5 h-5 text-primary" />
            <span class="text-foreground">{restaurant()?.contact?.email}</span>
          </div>
          <div class="flex items-center gap-3">
            <Globe class="w-5 h-5 text-primary" />
            <span class="text-foreground">{restaurant()?.contact?.website}</span>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div class="bg-card rounded-lg p-6 border border-border">
        <h3 class="text-lg font-semibold text-foreground mb-4">
          Additional Information
        </h3>
        <div class="space-y-2">
          <div class="flex justify-between">
            <span class="text-muted-foreground">Accepts Cards</span>
            <span class="font-medium text-foreground">
              {restaurant()?.acceptsCards ? "Yes" : "No"}
            </span>
          </div>
          <div class="flex justify-between">
            <span class="text-muted-foreground">Languages</span>
            <span class="font-medium text-foreground">
              {restaurant()?.languages?.join(", ")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLocation = () => (
    <div class="space-y-6">
      {/* Map placeholder */}
      <div class="bg-card rounded-lg p-6 border border-border">
        <h3 class="text-lg font-semibold text-foreground mb-4">Location</h3>
        <div class="aspect-video bg-muted/50 border border-border rounded-lg flex items-center justify-center mb-4">
          <MapPin class="w-12 h-12 text-muted-foreground" />
        </div>
        <p class="text-muted-foreground">{restaurant()?.address}</p>
      </div>
    </div>
  );

  const renderReviews = () => (
    <div class="bg-card rounded-lg p-6 border border-border">
      <h3 class="text-lg font-semibold text-foreground mb-4">Reviews</h3>
      <p class="text-muted-foreground">Reviews will be displayed here.</p>
    </div>
  );

  return (
    <div class="min-h-screen relative transition-colors">
      <Show when={restaurant()}>
        {/* Header */}
        <div class="bg-card border-b border-border">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Back button */}
            <div class="mb-4">
              <A
                href="/restaurants"
                class="flex items-center gap-2 text-primary hover:text-primary/80"
              >
                <ArrowLeft class="w-4 h-4" />
                Back to Restaurants
              </A>
            </div>

            <div class="flex flex-col lg:flex-row gap-6">
              {/* Restaurant Images */}
              <div class="lg:w-1/2">
                <div class="aspect-video bg-muted/50 border border-border rounded-lg flex items-center justify-center">
                  🍽️
                </div>
                <div class="grid grid-cols-3 gap-2 mt-2">
                  <For each={Array.from({ length: 3 })}>
                    {() => (
                      <div class="aspect-video bg-muted/50 border border-border rounded" />
                    )}
                  </For>
                </div>
              </div>

              {/* Restaurant Info */}
              <div class="lg:w-1/2">
                <div class="flex items-start justify-between mb-4">
                  <div>
                    <h1 class="text-3xl font-bold text-foreground">
                      {restaurant()?.name}
                    </h1>
                    <p class="text-muted-foreground mt-1">
                      {restaurant()?.cuisine} Cuisine
                    </p>
                  </div>
                  <div class="flex items-center gap-2">
                    <button
                      onClick={toggleFavorite}
                      class={`p-2 rounded-lg ${
                        isFavorite()
                          ? "bg-destructive/10 text-destructive"
                          : "bg-muted text-muted-foreground"
                      } hover:scale-110 transition-transform`}
                    >
                      <Heart class={`w-5 h-5 ${isFavorite() ? "fill-current" : ""}`} />
                    </button>
                    <button class="p-2 bg-muted text-muted-foreground rounded-lg hover:scale-110 transition-transform">
                      <Share2 class="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Rating and Price */}
                <div class="flex items-center gap-4 mb-4">
                  <div class="flex items-center gap-2">
                    <div class="flex items-center gap-1">
                      <Star class="w-5 h-5 text-accent fill-current" />
                      <span class="font-semibold text-foreground">
                        {restaurant()?.rating}
                      </span>
                    </div>
                    <span class="text-muted-foreground">
                      ({restaurant()?.reviewCount} reviews)
                    </span>
                  </div>
                  <span
                    class={`px-3 py-1 rounded-full text-sm font-medium ${getPriceColor(restaurant()?.priceRange || "")}`}
                  >
                    {restaurant()?.priceRange}
                  </span>
                  <Show when={restaurant()?.isOpen}>
                    <span class="px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-medium">
                      Open Now
                    </span>
                  </Show>
                </div>

                {/* Address */}
                <div class="flex items-center gap-2 mb-6">
                  <MapPin class="w-5 h-5 text-muted-foreground" />
                  <span class="text-muted-foreground">{restaurant()?.address}</span>
                </div>

                {/* Description */}
                <p class="text-muted-foreground mb-6">{restaurant()?.description}</p>

                {/* CTA Buttons */}
                <div class="flex gap-3">
                  <button class="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium">
                    Make Reservation
                  </button>
                  <button class="px-6 py-3 border border-border text-muted-foreground rounded-lg hover:bg-muted font-medium">
                    Call Restaurant
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div class="bg-card border-b border-border">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex space-x-8 overflow-x-auto">
              <For each={tabs}>
                {(tab) => (
                  <button
                    onClick={() => setSelectedTab(tab.id)}
                    class={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                      selectedTab() === tab.id
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab.label}
                  </button>
                )}
              </For>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Show when={selectedTab() === "overview"}>{renderOverview()}</Show>
          <Show when={selectedTab() === "menu"}>{renderMenu()}</Show>
          <Show when={selectedTab() === "hours"}>{renderHours()}</Show>
          <Show when={selectedTab() === "location"}>{renderLocation()}</Show>
          <Show when={selectedTab() === "reviews"}>{renderReviews()}</Show>
        </div>
      </Show>
    </div>
  );
}
