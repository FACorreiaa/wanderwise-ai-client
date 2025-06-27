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
        try {
            currentMarkers.forEach(marker => marker.remove());
            currentMarkers = [];

            // Clear route layer and source if they exist
            if (map && map.isStyleLoaded() && map.getSource('route')) {
                if (map.getLayer('route')) {
                    map.removeLayer('route');
                }
                map.removeSource('route');
            }
        } catch (error) {
            console.error('Error clearing markers:', error);
            // Reset markers array even if there was an error
            currentMarkers = [];
        }
    };



    // Function to add markers to the map
    const addMarkers = (pois) => {
        console.log('=== MAP COMPONENT addMarkers ===');
        console.log('Input POIs:', pois);
        console.log('POIs length:', pois?.length);
        console.log('Map instance:', map);
        if (!map || !map.isStyleLoaded() || !map.loaded()) {
            console.log('Map not fully loaded, skipping marker update');
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

            // Responsive marker sizing
            const isMobile = mapContainer.offsetWidth < 768;
            const markerSize = isMobile ? 28 : 32;
            const fontSize = isMobile ? 12 : 14;
            const borderWidth = isMobile ? 2 : 3;

            markerElement.style.cssText = `
                width: ${markerSize}px;
                height: ${markerSize}px;
                border-radius: 50%;
                background-color: ${poi.priority === 1 ? '#ef4444' : '#3b82f6'};
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
            markerElement.textContent = index + 1;

            // Add hover effect
            markerElement.addEventListener('mouseenter', () => {
                markerElement.style.transform = 'scale(1.1)';
            });
            markerElement.addEventListener('mouseleave', () => {
                markerElement.style.transform = 'scale(1)';
            });

            const marker = new mapboxgl.Marker(markerElement)
                .setLngLat([lng, lat])
                .addTo(map);

            console.log(`  - Marker created and added to map`);
            currentMarkers.push(marker);

            // Responsive popup content
            const popupWidth = isMobile ? 'min-w-[180px] max-w-[250px]' : 'min-w-[200px] max-w-[300px]';
            const textSize = isMobile ? 'text-xs' : 'text-sm';
            const titleSize = isMobile ? 'text-sm' : 'text-base';

            const popup = new mapboxgl.Popup({
                offset: isMobile ? 20 : 25,
                closeButton: true,
                closeOnClick: false,
                maxWidth: isMobile ? '250px' : '300px'
            })
                .setHTML(`
                    <div class="p-3 ${popupWidth}">
                        <h3 class="font-semibold text-gray-900 mb-1 ${titleSize}">${poi.name}</h3>
                        <p class="${textSize} text-gray-600 mb-2">${poi.category}</p>
                        <div class="flex items-center justify-between ${textSize} text-gray-500">
                            <span>⭐ ${poi.rating}</span>
                            <span>${poi.timeToSpend}</span>
                            <span class="font-medium">${poi.budget}</span>
                        </div>
                        ${poi.dogFriendly ? `<div class="mt-2 ${textSize} bg-green-100 text-green-800 px-2 py-1 rounded-full">🐕 Dog Friendly</div>` : ''}
                    </div>
                `);

            marker.setPopup(popup);
        });

        console.log(`Total markers created: ${currentMarkers.length}`);

        // Create optimized route line
        if (optimizedPOIs.length > 1) {
            try {
                const isMobile = mapContainer.offsetWidth < 768;

                const coordinates = optimizedPOIs.map(poi => {
                    const lat = typeof poi.latitude === 'string' ? parseFloat(poi.latitude) : poi.latitude;
                    const lng = typeof poi.longitude === 'string' ? parseFloat(poi.longitude) : poi.longitude;
                    return [lng, lat];
                });

                console.log('Route coordinates:', coordinates);

                // Only add route if map is ready and style is loaded
                if (map.isStyleLoaded()) {
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

                    // Add the route layer with responsive styling
                    const routeWidth = isMobile ? 2 : 3;
                    const dashArray = isMobile ? [2, 2] : [3, 3];

                    map.addLayer({
                        id: 'route',
                        type: 'line',
                        source: 'route',
                        layout: {
                            'line-join': 'round',
                            'line-cap': 'round',
                            'symbol-z-elevate': true
                        },
                        paint: {
                            'line-color': '#3b82f6',
                            'line-width': routeWidth,
                            'line-dasharray': dashArray,
                            'line-opacity': 0.7
                        }
                    });
                } else {
                    console.warn('Map style not loaded, skipping route creation');
                }
            } catch (error) {
                console.error('Error creating route:', error);
            }
        }

        // Fit map to show all markers with padding
        if (optimizedPOIs.length > 0) {
            const bounds = new mapboxgl.LngLatBounds();
            optimizedPOIs.forEach(poi => {
                const lat = typeof poi.latitude === 'string' ? parseFloat(poi.latitude) : poi.latitude;
                const lng = typeof poi.longitude === 'string' ? parseFloat(poi.longitude) : poi.longitude;
                bounds.extend([lng, lat]);
            });
            // Responsive padding based on container size
            const isMobile = mapContainer.offsetWidth < 768;
            const padding = isMobile
                ? { top: 20, bottom: 20, left: 20, right: 20 }
                : { top: 50, bottom: 50, left: 50, right: 50 };

            map.fitBounds(bounds, {
                padding: padding,
                maxZoom: isMobile ? 14 : 16
            });
            console.log('Map bounds fitted to show all markers');
        }
    };

    // Initialize map on mount
    onMount(() => {
        const mapboxToken = import.meta.env.VITE_MAPBOX_API_KEY;
        console.log('Mapbox token from env:', mapboxToken ? 'SET' : 'NOT SET');
        mapboxgl.accessToken = mapboxToken;

        console.log('=== MAP COMPONENT INIT ===');
        console.log('Container:', mapContainer);
        console.log('Center:', center);
        console.log('Initial POIs:', pointsOfInterest);

        // Detect if mobile for responsive initialization
        const isMobile = window.innerWidth < 768;

        map = new mapboxgl.Map({
            container: mapContainer,
            style: style,
            center: center,
            zoom: isMobile ? (zoom || 11) : (zoom || 12),
            minZoom: minZoom || 10,
            maxZoom: maxZoom || 22,
            preserveDrawingBuffer: true,
            interactive: true,
            touchZoomRotate: true,
            touchPitch: true,
            dragRotate: !isMobile, // Disable drag rotate on mobile for better UX
            pitchWithRotate: !isMobile
        });

        // Add responsive navigation controls
        const nav = new mapboxgl.NavigationControl({
            showCompass: !isMobile,
            showZoom: true,
            visualizePitch: !isMobile
        });
        map.addControl(nav, 'top-right');

        map.on('load', () => {
            console.log('Map loaded successfully');
            console.log('Current layers:', map.getStyle().layers);

            // Test with hardcoded marker to verify map is working
            console.log('Adding test marker at map center');
            const testMarker = new mapboxgl.Marker()
                .setLngLat(center)
                .addTo(map);

            // Remove test marker after 3 seconds
            setTimeout(() => {
                testMarker.remove();
                console.log('Test marker removed');
            }, 3000);

            // Add initial markers if POIs are available
            if (pointsOfInterest && pointsOfInterest.length > 0) {
                addMarkers(pointsOfInterest);
            }
        });

        map.on('error', (e) => {
            console.error('Map error:', e);
        });

        // Add resize handler for responsive behavior
        const resizeObserver = new ResizeObserver(() => {
            if (map) {
                map.resize();
            }
        });

        if (mapContainer) {
            resizeObserver.observe(mapContainer);
        }

        // Handle window resize and orientation changes
        const handleResize = () => {
            if (map) {
                setTimeout(() => {
                    map.resize();
                }, 100); // Small delay to ensure container has resized
            }
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', handleResize);

        // Cleanup resize observer and event listeners
        onCleanup(() => {
            if (resizeObserver && mapContainer) {
                resizeObserver.unobserve(mapContainer);
            }
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('orientationchange', handleResize);
        });
    });

    // React to POI changes with debouncing
    createEffect(() => {
        console.log('=== MAP COMPONENT EFFECT ===');
        console.log('POIs changed:', pointsOfInterest);

        // Debounce rapid updates to prevent map conflicts
        const updateTimeout = setTimeout(() => {
            if (map && map.isStyleLoaded() && map.loaded()) {
                try {
                    addMarkers(pointsOfInterest);
                } catch (error) {
                    console.error('Error updating markers:', error);
                    // If there's an error, try to recover by clearing and re-adding
                    try {
                        clearMarkers();
                        setTimeout(() => {
                            if (map && map.isStyleLoaded()) {
                                addMarkers(pointsOfInterest);
                            }
                        }, 200);
                    } catch (recoveryError) {
                        console.error('Recovery attempt failed:', recoveryError);
                    }
                }
            } else if (map) {
                // If map exists but isn't ready, wait for it
                const onMapReady = () => {
                    try {
                        addMarkers(pointsOfInterest);
                    } catch (error) {
                        console.error('Error adding markers on map ready:', error);
                    }
                    map.off('idle', onMapReady); // Remove listener after use
                };
                map.on('idle', onMapReady);
            }
        }, 150); // Debounce for 150ms

        // Cleanup function to cancel timeout if effect runs again
        return () => clearTimeout(updateTimeout);
    });

    onCleanup(() => {
        console.log('Cleaning up map component');
        if (map) {
            clearMarkers();
            map.remove();
        }
    });

    return <div ref={mapContainer} class="w-full h-full min-h-[300px] rounded-lg overflow-hidden" />;
}