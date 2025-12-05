# Optimistic Navigation & Progressive Loading Guide

## Overview
This guide explains how to implement a smooth UX where users navigate immediately and see content progressively load, rather than waiting for all data before navigation.

## Strategy: The 3-Phase Loading Pattern

### Phase 1: Instant Navigation (0-100ms)
✅ **Already implemented** in `useChatSession.ts` line 275-286
- User searches for "Restaurants in Dallas"
- Navigate immediately to `/restaurants?sessionId=xxx&cityName=Dallas&streaming=true`
- Page loads with skeleton UI

### Phase 2: Progressive Content Streaming (100ms-20s)
- Show useful content immediately while data streams
- Update UI incrementally as each restaurant arrives
- Initialize map with city center, add markers progressively

### Phase 3: Stream Complete
- Remove skeletons
- Enable all interactions
- Show "All results loaded" indicator

---

## Implementation Guide

### 1. Update Restaurant Page Component

**File**: `src/routes/restaurants/index.tsx`

Add streaming state detection and skeleton UI:

```typescript
import { SkeletonRestaurantGrid } from '~/components/ui/SkeletonRestaurantCard';

export default function RestaurantsPage() {
  const [urlSearchParams] = useSearchParams();
  const chatSession = useChatSession({ /* config */ });

  // Detect if we're in streaming mode
  const isStreaming = () => urlSearchParams.streaming === 'true';
  const hasData = () => streamingData()?.restaurants && streamingData().restaurants.length > 0;
  const isLoading = () => isStreaming() && !chatSession.isComplete();

  return (
    <div class="restaurants-page">
      {/* Map initializes immediately with city from URL */}
      <MapSection
        cityName={urlSearchParams.cityName || 'Unknown'}
        restaurants={streamingData()?.restaurants || []}
        isLoading={isLoading()}
      />

      {/* Show skeletons while loading, real data when available */}
      <Show
        when={hasData()}
        fallback={<SkeletonRestaurantGrid count={10} />}
      >
        <RestaurantResults restaurants={streamingData().restaurants} />
      </Show>

      {/* Progressive loading indicator */}
      <Show when={isLoading()}>
        <div class="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <Loader2 class="animate-spin" size={16} />
          <span>Loading restaurants... ({streamingData()?.restaurants?.length || 0} found)</span>
        </div>
      </Show>
    </div>
  );
}
```

### 2. Progressive Map Loading

**File**: `src/components/features/Map/Map.tsx`

Initialize map immediately with city, add markers as they arrive:

```typescript
interface MapComponentProps {
  cityName: string;
  restaurants: RestaurantDetailedInfo[];
  isLoading: boolean;
}

export default function MapComponent(props: MapComponentProps) {
  const [map, setMap] = createSignal<L.Map | null>(null);
  const [cityCenter, setCityCenter] = createSignal<[number, number] | null>(null);
  const markersRef: L.Marker[] = [];

  // Initialize map immediately with city name
  onMount(async () => {
    // Geocode city name to get coordinates
    const center = await geocodeCity(props.cityName);
    setCityCenter(center);

    // Initialize Leaflet map immediately
    const mapInstance = L.map('map').setView(center, 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapInstance);
    setMap(mapInstance);

    console.log('✅ Map initialized for:', props.cityName);
  });

  // Add markers progressively as restaurants arrive
  createEffect(() => {
    const restaurants = props.restaurants;
    const mapInstance = map();

    if (!mapInstance || !restaurants) return;

    // Clear old markers
    markersRef.forEach(marker => marker.remove());
    markersRef.length = 0;

    // Add new markers
    restaurants.forEach((restaurant, index) => {
      const marker = L.marker([restaurant.latitude, restaurant.longitude])
        .bindPopup(`
          <strong>${restaurant.name}</strong><br/>
          ${restaurant.cuisine_type}<br/>
          ⭐ ${restaurant.rating}
        `);

      marker.addTo(mapInstance);
      markersRef.push(marker);

      // Animate marker appearance (optional)
      setTimeout(() => {
        marker.setOpacity(0);
        marker.setOpacity(1);
      }, index * 50); // Stagger animations
    });

    // Fit bounds to show all markers (if any exist)
    if (markersRef.length > 0) {
      const group = L.featureGroup(markersRef);
      mapInstance.fitBounds(group.getBounds().pad(0.1));
    }

    console.log(`🗺️ Map updated with ${restaurants.length} markers`);
  });

  return (
    <div class="relative">
      <div id="map" class="w-full h-[500px] rounded-lg" />

      {/* Loading overlay on map */}
      <Show when={props.isLoading}>
        <div class="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center pointer-events-none">
          <div class="bg-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
            <Loader2 class="animate-spin" size={16} />
            <span>Loading map data...</span>
          </div>
        </div>
      </Show>
    </div>
  );
}

// Helper: Geocode city name to coordinates (can cache results)
async function geocodeCity(cityName: string): Promise<[number, number]> {
  // Try cache first
  const cached = localStorage.getItem(`geocode_${cityName}`);
  if (cached) return JSON.parse(cached);

  // Use Nominatim API (or your preferred geocoding service)
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}`
    );
    const data = await response.json();
    if (data[0]) {
      const coords: [number, number] = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      localStorage.setItem(`geocode_${cityName}`, JSON.stringify(coords));
      return coords;
    }
  } catch (error) {
    console.error('Geocoding error:', error);
  }

  // Fallback to default coordinates
  return [37.7749, -122.4194]; // San Francisco
}
```

### 3. Update useChatSession to Emit Progress Events

**File**: `src/lib/hooks/useChatSession.ts`

Emit events as each restaurant arrives (you may already have this):

```typescript
case 'restaurants':
  const restaurants = eventData.data || eventData.Data;
  if (restaurants && Array.isArray(restaurants)) {
    console.log(`🍽️ Received ${restaurants.length} restaurants (progressive update)`);

    // Merge with existing data (your existing mergeUniqueById logic)
    const updated = {
      ...currentData,
      restaurants: mergeUniqueById(currentData.restaurants, restaurants)
    };

    setStreamingData(updated);

    // Emit progress event for UI updates
    if (options.onProgress) {
      options.onProgress({
        type: 'restaurants',
        count: updated.restaurants.length,
        isComplete: false
      });
    }
  }
  break;
```

---

## Map-Specific Considerations

### ✅ **Advantages of Progressive Map Loading**

1. **Immediate Context**: User sees the city area right away
2. **Progressive Discovery**: Markers "pop in" as they load (feels responsive)
3. **No Blank Screen**: Map shows something useful immediately
4. **Better Perceived Performance**: Users can interact with the map while data loads

### 🎯 **Best Practices**

1. **Initialize map immediately** with city center (from URL params)
2. **Show a loading overlay** (semi-transparent) while markers load
3. **Add markers progressively** as restaurants arrive
4. **Auto-fit bounds** once all markers are loaded
5. **Cache geocoded coordinates** to avoid re-geocoding on navigation

### 📊 **Performance Tips**

- Use marker clustering for 50+ POIs: `leaflet.markercluster`
- Lazy-load map tiles: Already done by Leaflet
- Debounce marker updates: If receiving many small batches

---

## Example Flow Timeline

```
0ms:   User clicks "Restaurants in Dallas"
50ms:  Navigate to /restaurants?sessionId=xxx&cityName=Dallas&streaming=true
100ms: Page loads, shows skeleton cards + map initializing
200ms: Map shows Dallas city view (from geocoding cache)
500ms: Geocoding API returns Dallas coordinates
1s:    First 3 restaurants arrive → 3 skeleton cards replaced, 3 markers added to map
3s:    Next 4 restaurants arrive → 7 total shown
5s:    Final 3 restaurants arrive → All 10 shown
6s:    Stream completes → Remove "Loading..." indicator, enable all features
```

---

## Benefits of This Approach

### vs. Waiting for All Data
❌ **Old**: 20 second wait → sudden page change → all data at once
✅ **New**: Instant navigation → progressive updates → feels 20x faster

### User Experience
- **Instant feedback**: User knows their action worked
- **Engagement**: Can start browsing while data loads
- **Perceived performance**: Feels much faster even with same load time
- **Map interaction**: Can pan/zoom while markers load

### For Maps Specifically
- **Context first**: User sees where they are immediately
- **Progressive refinement**: Map becomes more useful as markers arrive
- **No blank states**: Always showing something useful

---

## Additional Enhancements

### 1. Staggered Animations
Make restaurant cards "slide in" as they arrive:

```css
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.restaurant-card {
  animation: slideIn 0.3s ease-out;
}
```

### 2. Count-Up Animation
Show running count as restaurants load:

```typescript
<div class="text-lg font-semibold">
  {streamingData()?.restaurants?.length || 0} restaurants found
  {isLoading() && '...'}
</div>
```

### 3. Smooth Marker Additions
Add markers with a slight delay for visual effect:

```typescript
restaurants.forEach((restaurant, index) => {
  setTimeout(() => {
    addMarkerToMap(restaurant);
  }, index * 100); // 100ms between each marker
});
```

---

## Summary

**Your current setup is already 90% there!** You just need to:

1. ✅ Keep early navigation (already implemented)
2. ✅ Add skeleton UI while streaming
3. ✅ Initialize map immediately with city name
4. ✅ Add markers progressively as data streams
5. ✅ Show "loading" indicator with count

**This approach is PERFECT for maps** because users get immediate context and see the map become more useful as data arrives, rather than staring at a blank screen.
