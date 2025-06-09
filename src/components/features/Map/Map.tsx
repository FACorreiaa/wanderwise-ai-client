import { createEffect, onMount } from 'solid-js';
import type { LngLatLike } from 'mapbox-gl';

// Define a type for your POI data for clarity
interface POI {
    id: string;
    name: string;
    category: string;
    longitude: number;
    latitude: number;
    priority: number;
}

interface MapProps {
    center: LngLatLike;
    zoom: number;
    pointsOfInterest: POI[];
    minZoom?: number;
    maxZoom?: number;
}

export default function Map(props: MapProps) {
    let mapContainer: HTMLDivElement;
    let mapInstance: mapboxgl.Map | null = null;

    onMount(async () => {
        // --- The SSR Fix ---
        // 1. Dynamically import mapbox-gl library and its CSS only on the client.
        const mapboxgl = (await import("mapbox-gl")).default;
        await import("mapbox-gl/dist/mapbox-gl.css");
        // --- End of Fix ---

        // 2. Check for the API key
        const accessToken = import.meta.env.VITE_MAPBOX_API_KEY;
        if (!accessToken) {
            console.error("Mapbox access token is not set!");
            return;
        }
        mapboxgl.accessToken = accessToken;

        // 3. Initialize the map
        if (mapContainer) {
            mapInstance = new mapboxgl.Map({
                container: mapContainer,
                style: 'mapbox://styles/mapbox/streets-v12',
                center: props.center,
                zoom: props.zoom
            });
        }
    });

    // This effect will run whenever the pointsOfInterest prop changes
    createEffect(() => {
        if (!mapInstance || !props.pointsOfInterest) return;

        // A more efficient way to manage markers: remove old ones, add new ones.
        // In a real app, you might diff them, but this is fine for this scale.
        document.querySelectorAll('.mapboxgl-marker').forEach(marker => marker.remove());

        const mapboxgl = window.mapboxgl; // The library is now available on the window object
        if (!mapboxgl) return;

        props.pointsOfInterest.forEach(poi => {
            new mapboxgl.Marker({
                color: poi.priority === 1 ? '#EF4444' : '#3B82F6' // Red for high priority
            })
                .setLngLat([poi.longitude, poi.latitude])
                .setPopup(new mapboxgl.Popup().setHTML(`<h3>${poi.name}</h3><p>${poi.category}</p>`))
                .addTo(mapInstance!);
        });

        // Optionally, fit the map to the new markers
        if (props.pointsOfInterest.length > 0) {
            const bounds = new mapboxgl.LngLatBounds();
            props.pointsOfInterest.forEach(poi => {
                bounds.extend([poi.longitude, poi.latitude]);
            });
            mapInstance.fitBounds(bounds, { padding: 60, maxZoom: 15, duration: 1000 });
        }
    });

    // The ref={mapContainer} connects this div to our mapContainer variable.
    return <div ref={mapContainer!} class="h-full w-full rounded-lg" />;
}