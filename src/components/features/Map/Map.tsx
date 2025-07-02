import { onMount, onCleanup, createEffect } from "solid-js";
import mapboxgl from "mapbox-gl";

interface POI {
  id: string;
  name: string;
  category: string;
  latitude: number | string;
  longitude: number | string;
  priority?: number;
  rating?: number;
  timeToSpend?: string;
  budget?: string;
  dogFriendly?: boolean;
}

interface MapComponentProps {
  center: [number, number];
  zoom?: number;
  minZoom?: number;
  maxZoom?: number;
  pointsOfInterest: POI[];
  style?: string;
  showRoutes?: boolean; // New prop to control route lines
  onMarkerClick?: (poi: POI, index: number) => void; // New prop for marker click handling
}

export default function MapComponent({
  center,
  zoom,
  minZoom,
  maxZoom,
  pointsOfInterest,
  style = "mapbox://styles/mapbox/standard",
  showRoutes = true,
  onMarkerClick,
}: MapComponentProps) {
  let mapContainer: HTMLDivElement | undefined;
  let map: mapboxgl.Map | undefined;
  let currentMarkers: mapboxgl.Marker[] = [];

  // Function to optimize route order (simple nearest neighbor algorithm)
  const optimizeRoute = (pois: POI[]): POI[] => {
    if (pois.length <= 1) return pois;

    const optimized = [pois[0]]; // Start with first POI
    const remaining = [...pois.slice(1)];

    while (remaining.length > 0) {
      const current = optimized[optimized.length - 1];
      let nearestIndex = 0;
      let nearestDistance = Infinity;

      remaining.forEach((poi, index) => {
        const distance = Math.sqrt(
          Math.pow(poi.latitude - current.latitude, 2) +
            Math.pow(poi.longitude - current.longitude, 2),
        );
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      });

      optimized.push(remaining[nearestIndex]);
      remaining.splice(nearestIndex, 1);
    }

    return optimized;
  };

  const clearMapFeatures = () => {
    console.log("Clearing map features...");

    // Remove DOM markers
    try {
      currentMarkers.forEach((marker) => {
        if (marker && typeof marker.remove === "function") {
          marker.remove();
        }
      });
      currentMarkers = [];
      console.log("Cleared all markers");
    } catch (error) {
      console.error("Error clearing markers:", error);
      currentMarkers = []; // Reset array even if cleanup failed
    }

    // Safely remove map layers and sources
    if (map && map.isStyleLoaded()) {
      try {
        // Remove layer first, then source
        if (map.getLayer("route")) {
          console.log("Removing route layer");
          map.removeLayer("route");
        }
        if (map.getSource("route")) {
          console.log("Removing route source");
          map.removeSource("route");
        }
      } catch (error) {
        console.error("Error clearing map layers/sources:", error);
        // Continue execution - don't let this break the app
      }
    } else {
      console.log("Map not ready for layer/source removal");
    }
  };

  // Function to add markers to the map
  const addMarkers = (pois: POI[]) => {
    console.log("=== MAP COMPONENT addMarkers ===");
    console.log("Input POIs:", pois);
    console.log("POIs length:", pois?.length);
    console.log("Map instance:", map);
    if (!map || !map.isStyleLoaded() || !map.loaded()) {
      console.log("Map not fully loaded, skipping marker update");
      return;
    }

    if (!pois || !Array.isArray(pois) || pois.length === 0) {
      console.log("No valid POIs provided");
      clearMapFeatures();
      return;
    }

    // Filter out POIs with invalid coordinates before processing
    const validPOIs = pois.filter((poi) => {
      if (!poi) {
        console.warn("🚫 Filtering out null/undefined POI");
        return false;
      }

      console.log(
        `🔍 Checking POI: ${poi.name} - lat: ${poi.latitude} (${typeof poi.latitude}), lng: ${poi.longitude} (${typeof poi.longitude})`,
      );

      // Handle missing coordinate properties
      if (!poi.hasOwnProperty("latitude") || !poi.hasOwnProperty("longitude")) {
        console.warn(
          `🚫 POI ${poi.name} missing latitude or longitude properties`,
        );
        return false;
      }

      const lat =
        typeof poi.latitude === "string"
          ? parseFloat(poi.latitude)
          : poi.latitude;
      const lng =
        typeof poi.longitude === "string"
          ? parseFloat(poi.longitude)
          : poi.longitude;

      // Check for null, undefined, or empty values
      if (
        poi.latitude === null ||
        poi.latitude === undefined ||
        poi.longitude === null ||
        poi.longitude === undefined
      ) {
        console.warn(
          `🚫 POI ${poi.name} has null/undefined coordinates: lat=${poi.latitude}, lng=${poi.longitude}`,
        );
        return false;
      }

      // Check for empty strings
      if (poi.latitude === "" || poi.longitude === "") {
        console.warn(
          `🚫 POI ${poi.name} has empty string coordinates: lat='${poi.latitude}', lng='${poi.longitude}'`,
        );
        return false;
      }

      // Check for NaN after parsing
      if (isNaN(lat) || isNaN(lng)) {
        console.warn(
          `🚫 POI ${poi.name} has NaN coordinates after parsing: lat=${lat}, lng=${lng} (original: lat=${poi.latitude}, lng=${poi.longitude})`,
        );
        return false;
      }

      // Check for reasonable coordinate ranges
      if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        console.warn(
          `🚫 POI ${poi.name} has out-of-range coordinates: lat=${lat}, lng=${lng}`,
        );
        return false;
      }

      // Check for suspicious zero coordinates
      if (lat === 0 && lng === 0) {
        console.warn(
          `⚠️  POI ${poi.name} has suspicious (0,0) coordinates - might indicate missing location data`,
        );
        // Still allow (0,0) but log it as suspicious
      }

      console.log(
        `✅ POI ${poi.name} has valid coordinates: lat=${lat}, lng=${lng}`,
      );
      return true;
    });

    if (validPOIs.length === 0) {
      console.log("No POIs with valid coordinates found");
      clearMapFeatures();
      return;
    }

    console.log(
      `Filtered ${pois.length} POIs down to ${validPOIs.length} valid POIs`,
    );

    clearMapFeatures();

    const optimizedPOIs = optimizeRoute(validPOIs);
    console.log("Optimized POIs for markers:", optimizedPOIs);

    // Add markers for each POI
    optimizedPOIs.forEach((poi: POI, index: number) => {
      console.log(`Creating marker ${index + 1}:`, poi);
      console.log(`  - Name: ${poi.name}`);
      console.log(`  - Coordinates: [${poi.longitude}, ${poi.latitude}]`);
      console.log(
        `  - Lat type: ${typeof poi.latitude}, Lng type: ${typeof poi.longitude}`,
      );

      // Convert coordinates to numbers if they're strings (already validated above)
      const lat =
        typeof poi.latitude === "string"
          ? parseFloat(poi.latitude)
          : poi.latitude;
      const lng =
        typeof poi.longitude === "string"
          ? parseFloat(poi.longitude)
          : poi.longitude;

      console.log(`  - Converted coordinates: [${lng}, ${lat}]`);

      const markerElement = document.createElement("div");
      markerElement.className = "custom-marker";

      // Responsive marker sizing
      const isMobile = mapContainer ? mapContainer.offsetWidth < 768 : true;
      const markerSize = isMobile ? 28 : 32;
      const fontSize = isMobile ? 12 : 14;
      const borderWidth = isMobile ? 2 : 3;

      markerElement.style.cssText = `
                width: ${markerSize}px;
                height: ${markerSize}px;
                border-radius: 50%;
                background-color: ${poi.priority === 1 ? "#ef4444" : "#3b82f6"};
                border: ${borderWidth}px solid white;
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                font-size: ${fontSize}px;
                cursor: pointer;
                transition: transform 0.2s ease;
            `;
      markerElement.textContent = String(index + 1);

      // Add hover effect
      markerElement.addEventListener("mouseenter", () => {
        markerElement.style.transform = "scale(1.1)";
      });
      markerElement.addEventListener("mouseleave", () => {
        markerElement.style.transform = "scale(1)";
      });

      // Add click event to trigger callback
      if (onMarkerClick) {
        markerElement.addEventListener("click", (e) => {
          e.stopPropagation();
          onMarkerClick(poi, index);
        });
      }

      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat([lng, lat])
        .addTo(map!);

      console.log(`  - Marker created and added to map`);
      currentMarkers.push(marker);

      // Responsive popup content
      const popupWidth = isMobile
        ? "min-w-[180px] max-w-[250px]"
        : "min-w-[200px] max-w-[300px]";
      const textSize = isMobile ? "text-xs" : "text-sm";
      const titleSize = isMobile ? "text-sm" : "text-base";

      const popup = new mapboxgl.Popup({
        offset: isMobile ? 20 : 25,
        closeButton: true,
        closeOnClick: false,
        maxWidth: isMobile ? "250px" : "300px",
      }).setHTML(`
                    <div class="p-3 ${popupWidth}">
                        <h3 class="font-semibold text-gray-900 mb-1 ${titleSize}">${poi.name}</h3>
                        <p class="${textSize} text-gray-600 mb-2">${poi.category}</p>
                        <div class="flex items-center justify-between ${textSize} text-gray-500">
                            <span>⭐ ${poi.rating}</span>
                            <span>${poi.timeToSpend}</span>
                            <span class="font-medium">${poi.budget}</span>
                        </div>
                        ${poi.dogFriendly ? `<div class="mt-2 ${textSize} bg-green-100 text-green-800 px-2 py-1 rounded-full">🐕 Dog Friendly</div>` : ""}
                    </div>
                `);

      marker.setPopup(popup);
    });

    console.log(`Total markers created: ${currentMarkers.length}`);

    // Create optimized route line (only if showRoutes is true)
    if (showRoutes && optimizedPOIs.length > 1) {
      try {
        const isMobile = mapContainer ? mapContainer.offsetWidth < 768 : true;

        const coordinates = optimizedPOIs.map((poi: POI) => {
          const lat =
            typeof poi.latitude === "string"
              ? parseFloat(poi.latitude)
              : poi.latitude;
          const lng =
            typeof poi.longitude === "string"
              ? parseFloat(poi.longitude)
              : poi.longitude;
          return [lng, lat];
        });

        console.log("Route coordinates:", coordinates);

        // Only add route if map is ready and style is loaded
        if (map.isStyleLoaded()) {
          // Double-check that source doesn't exist (defensive programming)
          if (map.getSource("route")) {
            console.warn(
              "Route source already exists, skipping route creation",
            );
            return;
          }

          map.addSource("route", {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: {
                type: "LineString",
                coordinates: coordinates,
              },
            },
          });

          // Add the route layer with responsive styling - FIX: use correct source name
          const routeWidth = isMobile ? 2 : 3;
          const dashArray = isMobile ? [2, 2] : [3, 3];

          map.addLayer({
            id: "route",
            type: "line",
            source: "route", // FIX: was 'trace', should be 'route'
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#3b82f6",
              "line-width": routeWidth,
              "line-dasharray": dashArray,
              "line-opacity": 0.7,
            },
          });
        } else {
          console.warn("Map style not loaded, skipping route creation");
        }
      } catch (error) {
        console.error("Error creating route:", error);
      }
    }

    // Fit map to show all markers with padding
    if (optimizedPOIs.length > 0) {
      try {
        const bounds = new mapboxgl.LngLatBounds();
        optimizedPOIs.forEach((poi: POI) => {
          const lat =
            typeof poi.latitude === "string"
              ? parseFloat(poi.latitude)
              : poi.latitude;
          const lng =
            typeof poi.longitude === "string"
              ? parseFloat(poi.longitude)
              : poi.longitude;
          bounds.extend([lng, lat]);
        });

        // Responsive padding based on container size
        const isMobile = mapContainer ? mapContainer.offsetWidth < 768 : true;
        const padding = isMobile
          ? { top: 20, bottom: 20, left: 20, right: 20 }
          : { top: 50, bottom: 50, left: 50, right: 50 };

        map.fitBounds(bounds, {
          padding: padding,
          maxZoom: isMobile ? 14 : 16,
        });
        console.log("Map bounds fitted to show all markers");
      } catch (error) {
        console.error("Error fitting map bounds:", error);
      }
    }
  };

  const addFeaturesToMap = (pois: POI[]) => {
    if (!map || !map.isStyleLoaded() || !pois || pois.length === 0) {
      console.log("Map not ready or no POIs provided to addFeaturesToMap");
      return;
    }

    // Filter out POIs with invalid coordinates
    const validPOIs = pois.filter((poi: POI) => {
      if (!poi) return false;

      const lat =
        typeof poi.latitude === "string"
          ? parseFloat(poi.latitude)
          : poi.latitude;
      const lng =
        typeof poi.longitude === "string"
          ? parseFloat(poi.longitude)
          : poi.longitude;

      if (
        isNaN(lat) ||
        isNaN(lng) ||
        lat === null ||
        lng === null ||
        lat === undefined ||
        lng === undefined
      ) {
        console.warn(
          `Filtering out POI with invalid coordinates in addFeaturesToMap: ${poi.name}`,
        );
        return false;
      }

      if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        console.warn(
          `Filtering out POI with out-of-range coordinates in addFeaturesToMap: ${poi.name}`,
        );
        return false;
      }

      return true;
    });

    if (validPOIs.length === 0) {
      console.log("No valid POIs found in addFeaturesToMap");
      clearMapFeatures();
      return;
    }

    const optimizedPOIs = optimizeRoute(validPOIs);
    console.log(
      "addFeaturesToMap: Processing",
      optimizedPOIs.length,
      "valid POIs",
    );

    // Add markers for each POI
    optimizedPOIs.forEach((poi: POI, index: number) => {
      const lat =
        typeof poi.latitude === "string"
          ? parseFloat(poi.latitude)
          : poi.latitude;
      const lng =
        typeof poi.longitude === "string"
          ? parseFloat(poi.longitude)
          : poi.longitude;

      const markerElement = document.createElement("div");
      // ... (your existing marker styling is fine)
      markerElement.className = "custom-marker";
      const markerSize = 32;
      markerElement.style.cssText = `
                width: ${markerSize}px; height: ${markerSize}px; border-radius: 50%;
                background-color: ${poi.priority === 1 ? "#ef4444" : "#3b82f6"};
                border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                display: flex; align-items: center; justify-content: center;
                color: white; font-weight: bold; font-size: 14px; cursor: pointer;
            `;
      markerElement.textContent = String(index + 1);

      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat([lng, lat])
        .addTo(map!);

      currentMarkers.push(marker);

      const popup = new mapboxgl.Popup({ offset: 25, closeButton: false })
        .setHTML(`
                    <div class="p-2 min-w-[200px]">
                        <h3 class="font-semibold text-gray-900 mb-1 text-base">${poi.name}</h3>
                        <p class="text-sm text-gray-600">${poi.category}</p>
                    </div>
                `);
      marker.setPopup(popup);
    });

    // Create optimized route line
    if (optimizedPOIs.length > 1) {
      try {
        const coordinates = optimizedPOIs.map((poi: POI) => {
          const lat =
            typeof poi.latitude === "string"
              ? parseFloat(poi.latitude)
              : poi.latitude;
          const lng =
            typeof poi.longitude === "string"
              ? parseFloat(poi.longitude)
              : poi.longitude;
          return [lng, lat];
        });

        // Defensive check to prevent adding source if it somehow still exists
        if (map.getSource("route")) {
          console.warn(
            "Route source already exists in addFeaturesToMap, skipping",
          );
          return;
        }

        map.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: { type: "LineString", coordinates },
          },
        });

        map.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#3b82f6",
            "line-width": 3,
            "line-dasharray": [2, 2],
            "line-opacity": 0.8,
          },
        });
      } catch (error) {
        console.error("Error creating route in addFeaturesToMap:", error);
      }
    }

    // Fit map to show all markers
    try {
      const bounds = new mapboxgl.LngLatBounds();
      optimizedPOIs.forEach((poi: POI) => {
        const lat =
          typeof poi.latitude === "string"
            ? parseFloat(poi.latitude)
            : poi.latitude;
        const lng =
          typeof poi.longitude === "string"
            ? parseFloat(poi.longitude)
            : poi.longitude;
        bounds.extend([lng, lat]);
      });
      map.fitBounds(bounds, { padding: 60, maxZoom: 15 });
    } catch (error) {
      console.error("Error fitting bounds in addFeaturesToMap:", error);
    }
  };

  // Initialize map on mount
  onMount(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY;

    // *** DEFENSIVE CENTER COORDINATE VALIDATION ***
    let validCenter = center;

    // Validate and sanitize center coordinates before map creation
    if (!center || !Array.isArray(center) || center.length !== 2) {
      console.warn("🚫 Invalid center prop provided to Map:", center);
      validCenter = [-8.6291, 41.1579]; // Default to Porto coordinates
    } else {
      const [lng, lat] = center;

      // Check for null, undefined, or NaN values
      if (
        lng === null ||
        lng === undefined ||
        lat === null ||
        lat === undefined ||
        isNaN(lng) ||
        isNaN(lat) ||
        typeof lng !== "number" ||
        typeof lat !== "number"
      ) {
        console.warn(
          `🚫 Invalid center coordinates: lng=${lng} (${typeof lng}), lat=${lat} (${typeof lat})`,
        );
        validCenter = [-8.6291, 41.1579]; // Default to Porto coordinates
      }

      // Check coordinate ranges
      else if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        console.warn(
          `🚫 Center coordinates out of range: lng=${lng}, lat=${lat}`,
        );
        validCenter = [-8.6291, 41.1579]; // Default to Porto coordinates
      }

      // Log valid coordinates
      else {
        console.log(`✅ Valid center coordinates: lng=${lng}, lat=${lat}`);
        validCenter = center;
      }
    }

    console.log("🗺️ Initializing map with center:", validCenter);

    map = new mapboxgl.Map({
      container: mapContainer!,
      style: style,
      center: validCenter,
      zoom: zoom || 20,
      bearing: 30,
      minZoom: minZoom || 10,
      maxZoom: maxZoom || 22,
      config: {
        basemap: {
          colorPlaceLabelHighlight: "red",
          colorPlaceLabelSelect: "blue",
        },
      },
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.on("load", () => {
      console.log("Map loaded. Adding initial markers.");
      // Use the main addMarkers function instead of addFeaturesToMap
      addMarkers(pointsOfInterest);
    });

    const resizeObserver = new ResizeObserver(() => map && map.resize());
    resizeObserver.observe(mapContainer!);

    onCleanup(() => {
      resizeObserver.disconnect();
    });
  });

  // React to POI changes with improved error handling and debouncing
  createEffect(() => {
    const pois = pointsOfInterest; // Get the latest POIs
    console.log("Map createEffect triggered with POIs:", pois?.length);

    if (!map || !map.isStyleLoaded()) {
      console.log("Map not ready for POI updates, deferring to load event");
      return;
    }

    // Early return if POIs are empty or invalid
    if (!pois || !Array.isArray(pois)) {
      console.log("No valid POIs array provided, clearing map features");
      clearMapFeatures();
      return;
    }

    // Check if POIs have valid coordinates before proceeding
    const hasValidPOIs = pois.some((poi: POI) => {
      if (!poi) return false;

      // More comprehensive coordinate validation
      const lat =
        typeof poi.latitude === "string"
          ? parseFloat(poi.latitude)
          : poi.latitude;
      const lng =
        typeof poi.longitude === "string"
          ? parseFloat(poi.longitude)
          : poi.longitude;

      // Check for null, undefined, empty string, NaN
      if (
        lat === null ||
        lat === undefined ||
        lng === null ||
        lng === undefined ||
        lat === "" ||
        lng === "" ||
        isNaN(lat) ||
        isNaN(lng)
      ) {
        console.warn(
          `🚫 POI ${poi.name} has invalid coordinates in hasValidPOIs check: lat=${lat}, lng=${lng}`,
        );
        return false;
      }

      // Check coordinate ranges
      if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        console.warn(
          `🚫 POI ${poi.name} has out-of-range coordinates in hasValidPOIs check: lat=${lat}, lng=${lng}`,
        );
        return false;
      }

      return true;
    });

    if (!hasValidPOIs) {
      console.log(
        "No POIs with valid coordinates found, clearing map features",
      );
      clearMapFeatures();
      return;
    }

    // *** IMPROVED MAP UPDATE STRATEGY ***
    try {
      // 1. Clear everything from the map immediately.
      clearMapFeatures();

      // 2. Use a small timeout to let the map settle before adding new features
      //    This is more reliable than waiting for 'idle' event in some cases
      setTimeout(() => {
        // 3. Double-check map is still valid and ready
        if (!map || !map.getStyle() || !map.isStyleLoaded()) {
          console.warn("Map became invalid during POI update, skipping");
          return;
        }

        console.log("Adding features to map after clearing");
        addMarkers(pois);
      }, 100); // Small delay to ensure map has processed the clearing
    } catch (error) {
      console.error("Error during POI update effect:", error);
      // Fallback: try to clear features to prevent broken state
      try {
        clearMapFeatures();
      } catch (clearError) {
        console.error("Error during fallback clear:", clearError);
      }
    }
  });

  onCleanup(() => {
    console.log("Cleaning up map component");
    if (map) {
      clearMapFeatures();
      map.remove();
    }
  });

  return (
    <div
      ref={mapContainer}
      class="w-full h-full min-h-[300px] rounded-lg overflow-hidden"
    />
  );
}
