// SolidStart route configurations with preloading
import { type RouteDefinition } from "@solidjs/router";
import { prefetchAuthData } from './auth-solidstart';
import { getFavorites, prefetchLocationPOIs } from './pois-solidstart';
import { getChatSessions, prefetchChatData } from './llm-solidstart';
import { prefetchLocationContent, prefetchCityContent } from './content-solidstart';

// =======================
// ROUTE PRELOAD FUNCTIONS
// =======================

// Dashboard preloading - loads essential user data
export const preloadDashboard = async () => {
  console.log("🚀 Preloading dashboard data...");
  
  try {
    await Promise.allSettled([
      prefetchAuthData(),
      getFavorites.preload({ limit: 10 }), // Recent favorites
      getChatSessions.preload({ limit: 5 }), // Recent chats
    ]);
    console.log("✅ Dashboard data preloaded successfully");
  } catch (error) {
    console.warn("⚠️ Some dashboard data failed to preload:", error);
  }
};

// Chat page preloading
export const preloadChatPage = async () => {
  console.log("🚀 Preloading chat page data...");
  
  try {
    await Promise.allSettled([
      prefetchAuthData(),
      prefetchChatData(),
    ]);
    console.log("✅ Chat page data preloaded successfully");
  } catch (error) {
    console.warn("⚠️ Chat page data failed to preload:", error);
  }
};

// Favorites page preloading
export const preloadFavoritesPage = async () => {
  console.log("🚀 Preloading favorites page data...");
  
  try {
    await Promise.allSettled([
      prefetchAuthData(),
      getFavorites.preload({ limit: 20 }), // More favorites for dedicated page
    ]);
    console.log("✅ Favorites page data preloaded successfully");
  } catch (error) {
    console.warn("⚠️ Favorites page data failed to preload:", error);
  }
};

// Hotels page preloading
export const preloadHotelsPage = async () => {
  console.log("🚀 Preloading hotels page data...");
  
  try {
    await Promise.allSettled([
      prefetchAuthData(),
      // Location-based content will be loaded once user location is available
    ]);
    console.log("✅ Hotels page data preloaded successfully");
  } catch (error) {
    console.warn("⚠️ Hotels page data failed to preload:", error);
  }
};

// Restaurants page preloading
export const preloadRestaurantsPage = async () => {
  console.log("🚀 Preloading restaurants page data...");
  
  try {
    await Promise.allSettled([
      prefetchAuthData(),
      // Location-based content will be loaded once user location is available
    ]);
    console.log("✅ Restaurants page data preloaded successfully");
  } catch (error) {
    console.warn("⚠️ Restaurants page data failed to preload:", error);
  }
};

// Activities page preloading
export const preloadActivitiesPage = async () => {
  console.log("🚀 Preloading activities page data...");
  
  try {
    await Promise.allSettled([
      prefetchAuthData(),
      // POI data will be loaded based on user location
    ]);
    console.log("✅ Activities page data preloaded successfully");
  } catch (error) {
    console.warn("⚠️ Activities page data failed to preload:", error);
  }
};

// Location-based preloading (when user location is available)
export const preloadLocationData = async (latitude: number, longitude: number) => {
  console.log(`🚀 Preloading location data for ${latitude}, ${longitude}...`);
  
  try {
    await Promise.allSettled([
      prefetchLocationPOIs(latitude, longitude, 5000), // 5km radius
      prefetchLocationContent(latitude, longitude, 5000),
    ]);
    console.log("✅ Location data preloaded successfully");
  } catch (error) {
    console.warn("⚠️ Location data failed to preload:", error);
  }
};

// City-based preloading
export const preloadCityData = async (cityId: string) => {
  console.log(`🚀 Preloading city data for ${cityId}...`);
  
  try {
    await Promise.allSettled([
      prefetchCityContent(cityId),
    ]);
    console.log("✅ City data preloaded successfully");
  } catch (error) {
    console.warn(`⚠️ City data failed to preload for ${cityId}:`, error);
  }
};

// =======================
// ROUTE DEFINITIONS
// =======================

// Main dashboard route
export const dashboardRoute: RouteDefinition = {
  path: "/",
  preload: preloadDashboard,
};

// Chat routes
export const chatRoute: RouteDefinition = {
  path: "/chat",
  preload: preloadChatPage,
};

export const chatSessionRoute: RouteDefinition = {
  path: "/chat/:sessionId",
  preload: async (params) => {
    await Promise.allSettled([
      preloadChatPage(),
      // Session-specific data will be loaded by the component
    ]);
  },
};

// Content routes
export const favoritesRoute: RouteDefinition = {
  path: "/favorites",
  preload: preloadFavoritesPage,
};

export const hotelsRoute: RouteDefinition = {
  path: "/hotels",
  preload: preloadHotelsPage,
};

export const hotelDetailRoute: RouteDefinition = {
  path: "/hotels/:id",
  preload: async (params) => {
    await Promise.allSettled([
      prefetchAuthData(),
      // Hotel details will be loaded by the component
    ]);
  },
};

export const restaurantsRoute: RouteDefinition = {
  path: "/restaurants",
  preload: preloadRestaurantsPage,
};

export const restaurantDetailRoute: RouteDefinition = {
  path: "/restaurants/:id",
  preload: async (params) => {
    await Promise.allSettled([
      prefetchAuthData(),
      // Restaurant details will be loaded by the component
    ]);
  },
};

export const activitiesRoute: RouteDefinition = {
  path: "/activities",
  preload: preloadActivitiesPage,
};

// City-specific routes
export const cityRecentsRoute: RouteDefinition = {
  path: "/recents/:city",
  preload: async (params) => {
    await Promise.allSettled([
      prefetchAuthData(),
      // City data preloading would need city ID mapping
    ]);
  },
};

// User profile routes
export const profileRoute: RouteDefinition = {
  path: "/profile",
  preload: async () => {
    await Promise.allSettled([
      prefetchAuthData(),
      getFavorites.preload({ limit: 5 }), // Recent favorites for profile
    ]);
  },
};

export const settingsRoute: RouteDefinition = {
  path: "/settings",
  preload: prefetchAuthData,
};

// Lists and itinerary routes
export const listsRoute: RouteDefinition = {
  path: "/lists",
  preload: async () => {
    await Promise.allSettled([
      prefetchAuthData(),
      // Lists data will be added when implemented
    ]);
  },
};

export const itineraryRoute: RouteDefinition = {
  path: "/itinerary",
  preload: async () => {
    await Promise.allSettled([
      prefetchAuthData(),
      // Itinerary data will be added when implemented
    ]);
  },
};

// =======================
// ROUTE CONFIGURATION HELPERS
// =======================

// Create a route with authentication preloading
export const createAuthRoute = (path: string, additionalPreload?: () => Promise<any>): RouteDefinition => ({
  path,
  preload: async (params?) => {
    await Promise.allSettled([
      prefetchAuthData(),
      additionalPreload?.(),
    ]);
  },
});

// Create a route with location-aware preloading
export const createLocationRoute = (
  path: string,
  getLocationPreload: (params: any) => Promise<any>
): RouteDefinition => ({
  path,
  preload: async (params) => {
    await Promise.allSettled([
      prefetchAuthData(),
      getLocationPreload(params),
    ]);
  },
});

// Batch preload multiple routes (useful for prefetching during idle time)
export const batchPreloadRoutes = async (routes: (() => Promise<any>)[]) => {
  console.log(`🚀 Batch preloading ${routes.length} routes...`);
  
  try {
    await Promise.allSettled(routes.map(preload => preload()));
    console.log("✅ Batch preload completed successfully");
  } catch (error) {
    console.warn("⚠️ Some routes failed to preload:", error);
  }
};

// Preload all main routes (can be called during app initialization)
export const preloadMainRoutes = async () => {
  await batchPreloadRoutes([
    preloadDashboard,
    preloadChatPage,
    preloadFavoritesPage,
    preloadHotelsPage,
    preloadRestaurantsPage,
    preloadActivitiesPage,
  ]);
};

// =======================
// ROUTE CONFIGURATION EXPORT
// =======================

// Export all route definitions for easy import in router configuration
export const allRouteDefinitions = {
  dashboard: dashboardRoute,
  chat: chatRoute,
  chatSession: chatSessionRoute,
  favorites: favoritesRoute,
  hotels: hotelsRoute,
  hotelDetail: hotelDetailRoute,
  restaurants: restaurantsRoute,
  restaurantDetail: restaurantDetailRoute,
  activities: activitiesRoute,
  cityRecents: cityRecentsRoute,
  profile: profileRoute,
  settings: settingsRoute,
  lists: listsRoute,
  itinerary: itineraryRoute,
};

// Conditional preloading based on user authentication status
export const conditionalPreload = {
  // Preload for authenticated users
  authenticated: async () => {
    await Promise.allSettled([
      preloadDashboard(),
      getFavorites.preload({ limit: 10 }),
      getChatSessions.preload({ limit: 5 }),
    ]);
  },
  
  // Preload for unauthenticated users
  unauthenticated: async () => {
    // Minimal preloading for public pages
    console.log("🚀 Preloading public content...");
  },
};

// Smart preloading based on time of day, user patterns, etc.
export const smartPreload = {
  // Morning routine - preload travel planning tools
  morning: () => batchPreloadRoutes([
    preloadChatPage,
    preloadActivitiesPage,
    preloadHotelsPage,
  ]),
  
  // Lunch time - preload restaurant data
  lunch: () => batchPreloadRoutes([
    preloadRestaurantsPage,
  ]),
  
  // Evening - preload entertainment and dining
  evening: () => batchPreloadRoutes([
    preloadRestaurantsPage,
    preloadActivitiesPage,
  ]),
  
  // Weekend - preload comprehensive travel data
  weekend: () => preloadMainRoutes(),
};