import { onMount, onCleanup } from 'solid-js';
import mapboxgl from 'mapbox-gl';

export default function MapComponent({ center, zoom, minZoom, maxZoom, pointsOfInterest }) {
    let mapContainer;
    let map;

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

    onMount(() => {
        mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY;

        map = new mapboxgl.Map({
            container: mapContainer,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: center,
            zoom: zoom,
            minZoom: minZoom,
            maxZoom: maxZoom
        });

        map.on('load', () => {
            const optimizedPOIs = optimizeRoute(pointsOfInterest);

            // Add markers for each POI
            optimizedPOIs.forEach((poi, index) => {
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
                    .setLngLat([poi.longitude, poi.latitude])
                    .addTo(map);

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

            // Create optimized route line
            if (optimizedPOIs.length > 1) {
                const coordinates = optimizedPOIs.map(poi => [poi.longitude, poi.latitude]);

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
            if (pointsOfInterest.length > 0) {
                const bounds = new mapboxgl.LngLatBounds();
                pointsOfInterest.forEach(poi => {
                    bounds.extend([poi.longitude, poi.latitude]);
                });
                map.fitBounds(bounds, {
                    padding: { top: 50, bottom: 50, left: 50, right: 50 }
                });
            }
        });
    });

    onCleanup(() => {
        if (map) map.remove();
    });

    return <div ref={mapContainer} class="w-full h-full" />;
}