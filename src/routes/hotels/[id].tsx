import { createSignal, For, Show } from "solid-js";
import { useParams } from "@solidjs/router";
import { Star, MapPin, Phone, Mail, Globe, Heart, Share2, Calendar, ArrowLeft } from "lucide-solid";
import { A } from "@solidjs/router";
import { useHotelDetails } from "~/lib/api/hotels";

export default function HotelDetailPage() {
  const params = useParams();
  const [selectedTab, setSelectedTab] = createSignal("overview");
  const [isFavorite, setIsFavorite] = createSignal(false);

  // Use API hook to fetch hotel details
  const hotelQuery = useHotelDetails(params.id ?? "");

  const hotel = () => hotelQuery.data;

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "rooms", label: "Rooms" },
    { id: "amenities", label: "Amenities" },
    { id: "location", label: "Location" },
    { id: "reviews", label: "Reviews" },
  ];

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite());
  };

  const renderOverview = () => (
    <div class="space-y-6">
      {/* Description */}
      <div class="bg-card rounded-lg p-6 border border-border">
        <h3 class="text-lg font-semibold text-foreground mb-3">About this hotel</h3>
        <p class="text-muted-foreground leading-relaxed">{hotel()?.description}</p>
      </div>

      {/* Key Information */}
      <div class="bg-card rounded-lg p-6 border border-border">
        <h3 class="text-lg font-semibold text-foreground mb-4">Key Information</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex items-center gap-3">
            <Calendar class="w-5 h-5 text-primary" />
            <div>
              <div class="font-medium text-foreground">Check-in</div>
              <div class="text-sm text-muted-foreground">{hotel()?.checkIn}</div>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <Calendar class="w-5 h-5 text-primary" />
            <div>
              <div class="font-medium text-foreground">Check-out</div>
              <div class="text-sm text-muted-foreground">{hotel()?.checkOut}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Nearby Attractions */}
      <div class="bg-card rounded-lg p-6 border border-border">
        <h3 class="text-lg font-semibold text-foreground mb-4">Nearby Attractions</h3>
        <div class="space-y-3">
          <For each={hotel()?.nearbyAttractions}>
            {(attraction) => (
              <div class="flex items-center justify-between py-2 border-b border-border last:border-b-0">
                <div class="flex items-center gap-3">
                  <MapPin class="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div class="font-medium text-foreground">{attraction.name}</div>
                    <div class="text-sm text-muted-foreground">{attraction.type}</div>
                  </div>
                </div>
                <span class="text-sm text-primary font-medium">
                  {attraction.distance}
                </span>
              </div>
            )}
          </For>
        </div>
      </div>
    </div>
  );

  const renderRooms = () => (
    <div class="space-y-4">
      <For each={hotel()?.rooms}>
        {(room) => (
          <div class="bg-card rounded-lg p-6 border border-border">
            <div class="flex flex-col lg:flex-row gap-6">
              <div class="lg:w-1/3">
                <div class="aspect-video bg-muted/50 border border-border rounded-lg flex items-center justify-center">
                  🏨
                </div>
              </div>
              <div class="lg:w-2/3">
                <div class="flex items-start justify-between mb-3">
                  <div>
                    <h3 class="text-xl font-semibold text-foreground">{room.type}</h3>
                    <p class="text-muted-foreground mt-1">{room.description}</p>
                  </div>
                  <div class="text-right">
                    <div class="text-2xl font-bold text-primary">
                      {room.price}
                    </div>
                    <div class="text-sm text-muted-foreground">per night</div>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <span class="font-medium text-foreground">Size:</span>
                    <span class="text-muted-foreground ml-1">{room.size}</span>
                  </div>
                  <div>
                    <span class="font-medium text-foreground">Capacity:</span>
                    <span class="text-muted-foreground ml-1">{room.capacity}</span>
                  </div>
                </div>

                <div class="mb-4">
                  <h4 class="font-medium text-foreground mb-2">Room Amenities</h4>
                  <div class="flex flex-wrap gap-2">
                    <For each={room.amenities}>
                      {(amenity) => (
                        <span class="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                          {amenity}
                        </span>
                      )}
                    </For>
                  </div>
                </div>

                <button class="w-full lg:w-auto px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium">
                  Book Now
                </button>
              </div>
            </div>
          </div>
        )}
      </For>
    </div>
  );

  const renderAmenities = () => (
    <div class="bg-card rounded-lg p-6 border border-border">
      <h3 class="text-lg font-semibold text-foreground mb-4">Hotel Amenities</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <For each={hotel()?.amenities}>
          {(amenity) => (
            <div class="flex items-center gap-3 p-3 rounded-lg bg-accent/10 text-accent">
              <span class="font-medium">{amenity}</span>
            </div>
          )}
        </For>
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
        <p class="text-muted-foreground">{hotel()?.address}</p>
      </div>

      {/* Contact Information */}
      <div class="bg-card rounded-lg p-6 border border-border">
        <h3 class="text-lg font-semibold text-foreground mb-4">
          Contact Information
        </h3>
        <div class="space-y-3">
          <div class="flex items-center gap-3">
            <Phone class="w-5 h-5 text-primary" />
            <span class="text-foreground">{hotel()?.contact?.phone}</span>
          </div>
          <div class="flex items-center gap-3">
            <Mail class="w-5 h-5 text-primary" />
            <span class="text-foreground">{hotel()?.contact?.email}</span>
          </div>
          <div class="flex items-center gap-3">
            <Globe class="w-5 h-5 text-primary" />
            <span class="text-foreground">{hotel()?.contact?.website}</span>
          </div>
        </div>
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
      <Show when={hotel()}>
        {/* Header */}
        <div class="bg-card border-b border-border">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Back button */}
            <div class="mb-4">
              <A
                href="/hotels"
                class="flex items-center gap-2 text-primary hover:text-primary/80"
              >
                <ArrowLeft class="w-4 h-4" />
                Back to Hotels
              </A>
            </div>

            <div class="flex flex-col lg:flex-row gap-6">
              {/* Hotel Images */}
              <div class="lg:w-1/2">
                <div class="aspect-video bg-muted/50 border border-border rounded-lg flex items-center justify-center">
                  🏨
                </div>
                <div class="grid grid-cols-3 gap-2 mt-2">
                  <For each={Array.from({ length: 3 })}>
                    {() => (
                      <div class="aspect-video bg-muted/50 border border-border rounded" />
                    )}
                  </For>
                </div>
              </div>

              {/* Hotel Info */}
              <div class="lg:w-1/2">
                <div class="flex items-start justify-between mb-4">
                  <div>
                    <h1 class="text-3xl font-bold text-foreground">
                      {hotel()?.name}
                    </h1>
                    <p class="text-muted-foreground mt-1">
                      {(hotel() as any)?.category}
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
                        {hotel()?.rating}
                      </span>
                    </div>
                    <span class="text-muted-foreground">
                      ({hotel()?.reviewCount} reviews)
                    </span>
                  </div>
                  <div class="text-2xl font-bold text-primary">
                    {hotel()?.pricePerNight}
                  </div>
                </div>

                {/* Address */}
                <div class="flex items-center gap-2 mb-6">
                  <MapPin class="w-5 h-5 text-muted-foreground" />
                  <span class="text-muted-foreground">{hotel()?.address}</span>
                </div>

                {/* Quick Amenities */}
                <div class="mb-6">
                  <h3 class="font-semibold text-foreground mb-2">
                    Popular Amenities
                  </h3>
                  <div class="flex flex-wrap gap-2">
                    <For each={hotel()?.amenities?.slice(0, 4)}>
                      {(amenity) => (
                        <div class="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                          {amenity}
                        </div>
                      )}
                    </For>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div class="flex gap-3">
                  <button class="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium">
                    Book Now
                  </button>
                  <button class="px-6 py-3 border border-border text-muted-foreground rounded-lg hover:bg-muted font-medium">
                    Contact Hotel
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
          <Show when={selectedTab() === "rooms"}>{renderRooms()}</Show>
          <Show when={selectedTab() === "amenities"}>{renderAmenities()}</Show>
          <Show when={selectedTab() === "location"}>{renderLocation()}</Show>
          <Show when={selectedTab() === "reviews"}>{renderReviews()}</Show>
        </div>
      </Show>
    </div>
  );
}
