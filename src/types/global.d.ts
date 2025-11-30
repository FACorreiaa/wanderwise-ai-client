// Global type definitions for missing modules

declare module '~/components/features/Map/Map' {
  const MapComponent: any;
  export default MapComponent;
}

declare module '~/lib/api/itineraries' {
  export const useItineraries: () => any;
  export const useItinerary: (id: string) => any;
  export const useUpdateItineraryMutation: () => any;
  export const useSaveItineraryMutation: () => any;
}

declare module '~/components/results' {
  export const ItineraryResults: any;
  export const HotelResults: any;
  export const RestaurantResults: any;
  export const ActivityResults: any;
}

declare module '~/components/TypingAnimation' {
  export const TypingAnimation: any;
}

declare module '~/lib/hooks/useChatSession' {
  export const useChatSession: (options?: any) => any;
}

declare module '~/components/ui/ChatInterface' {
  const ChatInterface: any;
  export default ChatInterface;
}

declare module '~/contexts/AuthContext' {
  export const useAuth: () => any;
}

declare module '~/contexts/LocationContext' {
  export const useUserLocation: () => any;
}

declare module 'virtual:pwa-register' {
  export function registerSW(options?: any): any;
}

// Global environment variables
declare module '@env' {
  export const VITE_CONNECT_BASE_URL: string;
  export const VITE_MAPBOX_API_KEY: string;
}

// Utility types for the project
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

// JSX namespace for SolidJS
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}