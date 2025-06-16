import { onMount, onCleanup, createEffect } from 'solid-js';
import mapboxgl from 'mapbox-gl';

export default function MapComponent({ center, zoom, minZoom, maxZoom, pointsOfInterest, style = 'mapbox://styles/mapbox/streets-v12' }) {
    let mapContainer;
    let map;
    let currentMarkers = [];

    // Function to optimize route order (simple nearest neighbor algorithm)
    const optimizeRoute = (pois) => {
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
                    Math.pow(poi.longitude - current.longitude, 2)
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

    // Function to clear existing markers and route
    const clearMarkers = () => {
        currentMarkers.forEach(marker => marker.remove());
        currentMarkers = [];

        // Clear route layer and source if they exist
        if (map && map.getSource('route')) {
            if (map.getLayer('route')) {
                map.removeLayer('route');
            }
            map.removeSource('route');
        }
    };

    // Function to add markers to the map
    const addMarkers = (pois) => {
        console.log('=== MAP COMPONENT addMarkers ===');
        console.log('Input POIs:', pois);
        console.log('POIs length:', pois?.length);
        console.log('Map instance:', map);

        if (!map) {
            console.log('Map not ready, cannot add markers');
            return;
        }

        if (!pois || !Array.isArray(pois) || pois.length === 0) {
            console.log('No valid POIs provided');
            clearMarkers();
            return;
        }

        clearMarkers();

        const optimizedPOIs = optimizeRoute(pois);
        console.log('Optimized POIs for markers:', optimizedPOIs);

        // Add markers for each POI
        optimizedPOIs.forEach((poi, index) => {
            console.log(`Creating marker ${index + 1}:`, poi);
            console.log(`  - Name: ${poi.name}`);
            console.log(`  - Coordinates: [${poi.longitude}, ${poi.latitude}]`);
            console.log(`  - Lat type: ${typeof poi.latitude}, Lng type: ${typeof poi.longitude}`);

            // Convert coordinates to numbers if they're strings
            const lat = typeof poi.latitude === 'string' ? parseFloat(poi.latitude) : poi.latitude;
            const lng = typeof poi.longitude === 'string' ? parseFloat(poi.longitude) : poi.longitude;

            if (isNaN(lat) || isNaN(lng)) {
                console.error(`Invalid coordinates for POI ${poi.name}: lat=${poi.latitude}, lng=${poi.longitude}`);
                return;
            }

            console.log(`  - Converted coordinates: [${lng}, ${lat}]`);

            const markerElement = document.createElement('div');
            markerElement.className = 'custom-marker';
            markerElement.style.cssText = `
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background-color: ${poi.priority === 1 ? '#ef4444' : '#3b82f6'};
                border: 3px solid white;
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                font-size: 14px;
                cursor: pointer;
            `;
            markerElement.textContent = index + 1;

            const marker = new mapboxgl.Marker(markerElement)
                .setLngLat([lng, lat])
                .addTo(map);

            console.log(`  - Marker created and added to map`);
            currentMarkers.push(marker);

            const popup = new mapboxgl.Popup({ offset: 25 })
                .setHTML(`
                    <div class="p-3 min-w-[200px]">
                        <h3 class="font-semibold text-gray-900 mb-1">${poi.name}</h3>
                        <p class="text-sm text-gray-600 mb-2">${poi.category}</p>
                        <div class="flex items-center justify-between text-xs text-gray-500">
                            <span>⭐ ${poi.rating}</span>
                            <span>${poi.timeToSpend}</span>
                            <span class="font-medium">${poi.budget}</span>
                        </div>
                        ${poi.dogFriendly ? '<div class="mt-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">🐕 Dog Friendly</div>' : ''}
                    </div>
                `);

            marker.setPopup(popup);
        });

        console.log(`Total markers created: ${currentMarkers.length}`);

        // Create optimized route line
        if (optimizedPOIs.length > 1) {
            const coordinates = optimizedPOIs.map(poi => {
                const lat = typeof poi.latitude === 'string' ? parseFloat(poi.latitude) : poi.latitude;
                const lng = typeof poi.longitude === 'string' ? parseFloat(poi.longitude) : poi.longitude;
                return [lng, lat];
            });

            console.log('Route coordinates:', coordinates);

            map.addSource('route', {
                type: 'geojson',
                data: {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'LineString',
                        coordinates: coordinates
                    }
                }
            });

            // Add the route layer
            map.addLayer({
                id: 'route',
                type: 'line',
                source: 'route',
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                paint: {
                    'line-color': '#3b82f6',
                    'line-width': 3,
                    'line-dasharray': [3, 3],
                    'line-opacity': 0.7
                }
            });
        }

        // Fit map to show all markers with padding
        if (optimizedPOIs.length > 0) {
            const bounds = new mapboxgl.LngLatBounds();
            optimizedPOIs.forEach(poi => {
                const lat = typeof poi.latitude === 'string' ? parseFloat(poi.latitude) : poi.latitude;
                const lng = typeof poi.longitude === 'string' ? parseFloat(poi.longitude) : poi.longitude;
                bounds.extend([lng, lat]);
            });
            map.fitBounds(bounds, {
                padding: { top: 50, bottom: 50, left: 50, right: 50 }
            });
            console.log('Map bounds fitted to show all markers');
        }
    };

    // Initialize map on mount
    onMount(() => {
        mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY;

        console.log('=== MAP COMPONENT INIT ===');
        console.log('Container:', mapContainer);
        console.log('Center:', center);
        console.log('Initial POIs:', pointsOfInterest);

        map = new mapboxgl.Map({
            container: mapContainer,
            style: style,
            center: center,
            zoom: zoom || 12,
            minZoom: minZoom || 10,
            maxZoom: maxZoom || 22
        });

        map.on('load', () => {
            console.log('Map loaded successfully');
            // Add initial markers if POIs are available
            if (pointsOfInterest && pointsOfInterest.length > 0) {
                addMarkers(pointsOfInterest);
            }
        });

        map.on('error', (e) => {
            console.error('Map error:', e);
        });
    });

    // React to POI changes
    createEffect(() => {
        console.log('=== MAP COMPONENT EFFECT ===');
        console.log('POIs changed:', pointsOfInterest);

        if (map && map.isStyleLoaded()) {
            addMarkers(pointsOfInterest);
        } else if (map) {
            // If map exists but style isn't loaded yet, wait for it
            map.on('style.load', () => {
                addMarkers(pointsOfInterest);
            });
        }
    });

    onCleanup(() => {
        console.log('Cleaning up map component');
        if (map) {
            clearMarkers();
            map.remove();
        }
    });

    return <div ref={mapContainer} class="w-full h-full" />;
}