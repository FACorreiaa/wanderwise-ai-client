// LocationContext.tsx
import { createContext, useContext, createSignal, onMount } from "solid-js";
import type { JSX } from "solid-js";

export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface LocationContextValue {
  userLocation: () => UserLocation | null;
  isLoadingLocation: () => boolean;
  error: () => string | null;
  requestLocation: () => Promise<void>;
  permissionStatus: () => string | null;
}

const LocationContext = createContext<LocationContextValue>();

export function useUserLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
}

interface LocationProviderProps {
  children: JSX.Element;
}

export function LocationProvider(props: LocationProviderProps) {
  const [userLocation, setUserLocation] = createSignal<UserLocation | null>(null);
  const [isLoadingLocation, setisLoadingLocation] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [permissionStatus, setPermissionStatus] = createSignal<string | null>(null);

  const isGeolocationSupported = "geolocation" in navigator;

  // Function to request location and trigger the browser prompt
  const requestLocation = async () => {
    if (!isGeolocationSupported) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setisLoadingLocation(true);
    setError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000, // 10 seconds timeout
          maximumAge: 0, // No cached position
        });
      });

      const userLocation: UserLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      };

      setUserLocation(userLocation);
      setPermissionStatus("granted");
    } catch (err) {
      let errorMessage = "Failed to get location.";
      if (err instanceof GeolocationPositionError) {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError("Location access was denied by the user.");
            setPermissionStatus("denied");
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case err.TIMEOUT:
            errorMessage = "The request to get your location timed out.";
            break;
        }
      }
      setError(errorMessage);
    } finally {
      setisLoadingLocation(false);
    }
  };

  // Initialize permission status and listen for changes (without auto-requesting)
  onMount(() => {
    if (!isGeolocationSupported) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    if ("permissions" in navigator) {
      navigator.permissions.query({ name: "geolocation" }).then((permission) => {
        setPermissionStatus(permission.state);
        // Only auto-fetch if permission was already granted previously
        // This avoids triggering the browser prompt on page load
        if (permission.state === "granted") {
          requestLocation();
        }

        // Listen for permission changes
        permission.onchange = () => {
          setPermissionStatus(permission.state);
          if (permission.state === "granted") {
            requestLocation();
          }
        };
      });
    }
  });

  const contextValue: LocationContextValue = {
    userLocation,
    isLoadingLocation,
    error,
    requestLocation,
    permissionStatus,
  };

  return <LocationContext.Provider value={contextValue}>{props.children}</LocationContext.Provider>;
}
