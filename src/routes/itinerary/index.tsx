import {
  createSignal,
  createEffect,
  For,
  Show,
  onMount,
  batch,
} from "solid-js";
import { useLocation, useSearchParams } from "@solidjs/router";
import mapboxgl from "mapbox-gl";
import {
  MapPin,
  Clock,
  Star,
  Filter,
  Heart,
  Share2,
  Download,
  Edit3,
  Plus,
  X,
  Navigation,
  Calendar,
  Users,
  DollarSign,
  Camera,
  Coffee,
  Utensils,
  Building,
  TreePine,
  ShoppingBag,
  Loader2,
  MessageCircle,
  Send,
  Compass,
  Palette,
  Cloud,
} from "lucide-solid";
// @ts-ignore - Map component type
import MapComponent from "~/components/features/Map/Map";
// @ts-ignore - API hooks type
import {
  useItineraries,
  useItinerary,
  useUpdateItineraryMutation,
  useSaveItineraryMutation,
  useRemoveItineraryMutation,
  useAllUserItineraries,
} from "~/lib/api/itineraries";
// @ts-ignore - POI favorites API hooks type
import {
  useFavorites,
  useAddToFavoritesMutation,
  useRemoveFromFavoritesMutation,
} from "~/lib/api/pois";
// @ts-ignore - API types
import type { AiCityResponse, POIDetail } from "~/lib/api/types";
// @ts-ignore - Results component type
import { ItineraryResults } from "~/components/results";
// @ts-ignore - Animation component type
import { TypingAnimation } from "~/components/TypingAnimation";
// @ts-ignore - Chat hook type
import { useChatSession } from "~/lib/hooks/useChatSession";
// @ts-ignore - Chat interface type
import ChatInterface from "~/components/ui/ChatInterface";
// @ts-ignore - Auth context type
import { useAuth } from "~/contexts/AuthContext";

interface LocationState {
  streamingData?: any;
  sessionId?: string;
  originalMessage?: string;
}

interface ConvertedPOI {
  id: string;
  name: string;
  category: string;
  description: string;
  latitude: number | null;
  longitude: number | null;
  timeToSpend: string;
  budget: string;
  rating: number;
  tags: string[];
  priority: number;
  dogFriendly: boolean;
  address: string;
  website: string;
  openingHours: string;
  hasValidCoordinates?: boolean;
}

interface FilterState {
  categories: string[];
  timeToSpend: string[];
  budget: string[];
  accessibility: string[];
  dogFriendly: boolean;
}

export default function ItineraryResultsPage() {
  const location = useLocation<LocationState>();
  const [searchParams] = useSearchParams();
  const auth = useAuth();
  const [map, setMap] = createSignal(null);
  const [selectedPOI, setSelectedPOI] = createSignal(null);
  const [showFilters, setShowFilters] = createSignal(false);
  const [viewMode, setViewMode] = createSignal("split"); // 'map', 'list', 'split'
  const [myTrip, setMyTrip] = createSignal([]); // Track selected POIs for the trip
  const [currentItineraryId, setCurrentItineraryId] = createSignal(null);
  const [streamingData, setStreamingData] = createSignal(null);
  const [fromChat, setFromChat] = createSignal(false);

  // Separate signal for POI updates to prevent map re-render issues
  const [poisUpdateTrigger, setPoisUpdateTrigger] = createSignal(0);
  const [mapDisabled, setMapDisabled] = createSignal(false);
  const [showAllGeneralPOIs, setShowAllGeneralPOIs] = createSignal(false);

  // Chat functionality using the reusable hook
  const chatSession = useChatSession({
    sessionIdPrefix: "itinerary",
    getStreamingData: () => streamingData(),
    setStreamingData: setStreamingData,
    setMapDisabled: setMapDisabled,
    setPoisUpdateTrigger: setPoisUpdateTrigger,
    onUpdateStart: () => setIsUpdatingItinerary(true),
    onUpdateComplete: () => setIsUpdatingItinerary(false),
    enableNavigation: true, // Enable URL navigation
    onNavigationData: (navigation) => {
      console.log("Navigation data received:", navigation);
      // Additional navigation handling if needed
    },
    onStreamingComplete: (data) => {
      setFromChat(true);
      // Trigger POI update for the map
      setPoisUpdateTrigger((prev) => prev + 1);
      setMapDisabled(true);
      setTimeout(() => setMapDisabled(false), 1500);
    },
  });
  const [isUpdatingItinerary, setIsUpdatingItinerary] = createSignal(false);

  // Conditionally load authentication-dependent API hooks
  const isAuthenticated = () => auth.isAuthenticated();

  // API hooks - only enabled for authenticated users
  const itinerariesQuery = useItineraries(1, 10, {
    enabled: isAuthenticated(),
  });
  const itineraryQuery = useItinerary(currentItineraryId() || "", {
    enabled: isAuthenticated() && !!currentItineraryId(),
  });
  const allItinerariesQuery = useAllUserItineraries({
    enabled: isAuthenticated(),
  });
  const updateItineraryMutation = useUpdateItineraryMutation();
  const saveItineraryMutation = useSaveItineraryMutation();
  const removeItineraryMutation = useRemoveItineraryMutation();

  // Favorites hooks
  const favoritesQuery = useFavorites();
  const addToFavoritesMutation = useAddToFavoritesMutation();
  const removeFromFavoritesMutation = useRemoveFromFavoritesMutation();

  // Filter states - more inclusive when we have streaming data
  const [activeFilters, setActiveFilters] = createSignal<FilterState>({
    categories: [], // Start with empty categories to show all streaming POIs
    timeToSpend: [],
    budget: [],
    accessibility: [],
    dogFriendly: true,
  });

  // Initialize with streaming data on mount
  onMount(() => {
    console.log("=== ITINERARY PAGE MOUNT ===");
    console.log("Location state:", location.state);
    console.log("Search params:", searchParams);
    console.log("Session storage keys:", Object.keys(sessionStorage));

    // Check for URL parameters first (priority for deep linking)
    const urlSessionId = searchParams.sessionId;
    const urlCityName = searchParams.cityName;
    const urlDomain = searchParams.domain;

    if (urlSessionId) {
      console.log("Found session ID in URL parameters:", urlSessionId);
      chatSession.setSessionId(urlSessionId);

      // Try to retrieve session data based on URL parameters
      const sessionKey = `session_${urlSessionId}`;
      const storedSessionData = sessionStorage.getItem(sessionKey);
      if (storedSessionData) {
        try {
          const sessionData = JSON.parse(storedSessionData);
          console.log("Loading session data from URL parameters:", sessionData);
          setStreamingData(sessionData);
          setFromChat(true);
        } catch (error) {
          console.error("Error parsing session data from URL:", error);
        }
      }
    }

    // Check for streaming data from route state
    if (location.state?.streamingData) {
      console.log("Found streaming data in route state");
      setStreamingData(location.state.streamingData);
      setFromChat(true);
      console.log(
        "Received streaming data from chat:",
        location.state.streamingData,
      );
      console.log(
        "Points of interest:",
        location.state.streamingData.points_of_interest,
      );
      console.log(
        "Itinerary POIs:",
        location.state.streamingData.itinerary_response?.points_of_interest,
      );

      // Extract session ID from streaming data if available
      if (location.state?.sessionId) {
        chatSession.setSessionId(location.state.sessionId);
        console.log(
          "Found session ID from route state:",
          location.state.sessionId,
        );
      }
    } else {
      console.log("No streaming data in route state, checking session storage");
      // Try to get data from session storage
      const storedSession = sessionStorage.getItem("completedStreamingSession");
      console.log("Session storage content:", storedSession);

      if (storedSession) {
        try {
          const session = JSON.parse(storedSession);
          console.log("Parsed session:", session);
          console.log("Session keys:", Object.keys(session));

          if (session.data) {
            console.log("Setting streaming data from session storage");
            setStreamingData(session.data);
            setFromChat(true);
            console.log(
              "Loaded streaming data from session storage:",
              session.data,
            );
            console.log("Points of interest:", session.data.points_of_interest);
            console.log(
              "Itinerary POIs:",
              session.data.itinerary_response?.points_of_interest,
            );
          } else {
            console.log("No data found in session");
          }

          // Extract session ID from stored session - check multiple possible locations
          let extractedSessionId = null;

          console.log("🔍 Extracting session ID from stored session...");
          console.log("Session object keys:", Object.keys(session));
          console.log("Session.sessionId:", session.sessionId);
          console.log("Session.data:", session.data);
          if (session.data) {
            console.log("Session.data keys:", Object.keys(session.data));
            console.log("Session.data.session_id:", session.data.session_id);
            console.log("Session.data.sessionId:", session.data.sessionId);
          }

          if (session.sessionId) {
            extractedSessionId = session.sessionId;
            console.log(
              "✅ Found session ID from session.sessionId:",
              extractedSessionId,
            );
          } else if (session.data?.session_id) {
            extractedSessionId = session.data.session_id;
            console.log(
              "✅ Found session ID from session.data.session_id:",
              extractedSessionId,
            );
          } else if (session.data?.sessionId) {
            extractedSessionId = session.data.sessionId;
            console.log(
              "✅ Found session ID from session.data.sessionId:",
              extractedSessionId,
            );
          } else {
            console.warn(
              "❌ No session ID found in stored session. Available keys:",
              Object.keys(session),
            );
            if (session.data) {
              console.warn("Session data keys:", Object.keys(session.data));
            }
          }

          if (extractedSessionId) {
            chatSession.setSessionId(extractedSessionId);
            console.log("Set session ID:", extractedSessionId);
          }
        } catch (error) {
          console.error("Error parsing stored session:", error);
        }
      } else {
        console.log("No stored session found");
      }
    }

    // Debug current streaming data state and session ID
    setTimeout(() => {
      console.log("=== STREAMING DATA STATE AFTER MOUNT ===");
      console.log("Current streamingData():", streamingData());
      console.log("Current sessionId():", chatSession.sessionId());
      console.log("Map POIs:", mapPointsOfInterest());
      console.log("Filtered Map POIs:", filteredMapPOIs());

      // If we have streaming data but no session ID, only warn (don't auto-create)
      if (streamingData() && !chatSession.sessionId()) {
        console.warn(
          "Have streaming data but no session ID - user will need to start new session if they want to chat",
        );
      }
    }, 100);
  });

  // Fallback function to create a new session when session ID is missing
  const createFallbackSession = async () => {
    const streaming = streamingData();
    if (!streaming || !streaming.general_city_data?.city) {
      console.warn("Cannot create fallback session - missing city data");
      return;
    }

    try {
      console.log(
        "Creating fallback session for city:",
        streaming.general_city_data.city,
      );

      // Create a fallback session ID (UUID v4)
      const fallbackSessionId = crypto.randomUUID();
      chatSession.setSessionId(fallbackSessionId);

      console.log("Generated fallback session ID:", fallbackSessionId);

      // Update session storage with the new session ID
      const storedSession = sessionStorage.getItem("completedStreamingSession");
      if (storedSession) {
        try {
          const session = JSON.parse(storedSession);
          session.sessionId = fallbackSessionId;
          sessionStorage.setItem(
            "completedStreamingSession",
            JSON.stringify(session),
          );
          console.log("Updated session storage with fallback session ID");
        } catch (error) {
          console.error("Error updating session storage:", error);
        }
      }
    } catch (error) {
      console.error("Error creating fallback session:", error);
      // Fallback to a simple UUID if crypto.randomUUID is not available
      const simpleUuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          const r = (Math.random() * 16) | 0;
          const v = c == "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        },
      );
      chatSession.setSessionId(simpleUuid);
      console.log("Created simple fallback session ID:", simpleUuid);
    }
  };

  // Get current itinerary data from streaming data, API, or fallback
  const itinerary = () => {
    const streaming = streamingData();

    if (streaming && streaming.general_city_data) {
      // Map streaming data to itinerary format
      const itineraryName = streaming.itinerary_response?.itinerary_name;
      console.log("Raw itinerary name:", itineraryName);

      // Handle case where itinerary_name might be a JSON string or object
      let parsedName = itineraryName;
      if (typeof itineraryName === "string" && itineraryName.startsWith("{")) {
        try {
          const parsed = JSON.parse(itineraryName);
          parsedName =
            parsed.itinerary_name ||
            parsed.name ||
            `${streaming.general_city_data.city} Adventure`;
        } catch (e) {
          console.warn("Failed to parse itinerary name JSON:", e);
          parsedName = `${streaming.general_city_data.city} Adventure`;
        }
      } else if (
        typeof itineraryName === "object" &&
        itineraryName?.itinerary_name
      ) {
        parsedName = itineraryName.itinerary_name;
      }

      console.log("Parsed itinerary name:", parsedName);

      return {
        name: parsedName || `${streaming.general_city_data.city} Adventure`,
        description:
          streaming.itinerary_response?.overall_description ||
          streaming.general_city_data.description,
        city: streaming.general_city_data.city,
        country: streaming.general_city_data.country,
        duration: "Personalized", // TODO: Extract from data
        centerLat: streaming.general_city_data.center_latitude,
        centerLng: streaming.general_city_data.center_longitude,
        pois: [],
        streamingData: streaming,
      };
    }

    if (itineraryQuery.data) {
      return itineraryQuery.data;
    }

    // Fallback data for demo
    return {
      name: "Porto's Charms: Sightseeing & Local Delights (Dog-Friendly)",
      description:
        "This itinerary focuses on showcasing Porto's key landmarks and offering authentic local experiences, all while keeping your furry friend in mind.",
      city: "Porto",
      country: "Portugal",
      duration: "3 days",
      centerLat: 41.1579,
      centerLng: -8.6291,
      pois: [],
    };
  };

  // Convert streaming POI data to itinerary format with coordinate validation
  const convertPOIToItineraryFormat = (
    poi: POIDetail,
    allowMissingCoordinates = false,
  ): ConvertedPOI | null => {
    // Early validation of POI object
    if (!poi) {
      console.warn(
        "convertPOIToItineraryFormat: null or undefined POI provided",
      );
      return null;
    }

    // Simplified coordinate validation (similar to restaurants page)
    const validateCoordinates = (lat: any, lng: any) => {
      console.log(
        `🔍 validateCoordinates input: lat=${lat} (type: ${typeof lat}), lng=${lng} (type: ${typeof lng})`,
      );

      // Simple coordinate conversion
      const numLat = typeof lat === "string" ? parseFloat(lat) : lat;
      const numLng = typeof lng === "string" ? parseFloat(lng) : lng;

      // Only filter out if coordinates are actually invalid (NaN or undefined/null)
      if (isNaN(numLat) || isNaN(numLng) || numLat == null || numLng == null) {
        console.warn(
          `❌ Invalid coordinates: lat=${numLat}, lng=${numLng} (original: lat=${lat}, lng=${lng})`,
        );
        return null;
      }

      console.log(`✅ Valid coordinates: lat=${numLat}, lng=${numLng}`);
      return { latitude: numLat, longitude: numLng };
    };

    // Infer time to spend based on category
    const getTimeToSpend = (category: string) => {
      const lowerCategory = category.toLowerCase();
      if (lowerCategory.includes("museum") || lowerCategory.includes("palace"))
        return "2-3 hours";
      if (
        lowerCategory.includes("market") ||
        lowerCategory.includes("restaurant")
      )
        return "1-2 hours";
      if (
        lowerCategory.includes("viewpoint") ||
        lowerCategory.includes("plaza")
      )
        return "30-60 minutes";
      if (lowerCategory.includes("park") || lowerCategory.includes("garden"))
        return "1-2 hours";
      return "1-2 hours"; // Default
    };

    // Infer budget based on category
    const getBudget = (category: string) => {
      const lowerCategory = category.toLowerCase();
      if (
        lowerCategory.includes("free") ||
        lowerCategory.includes("park") ||
        lowerCategory.includes("plaza")
      )
        return "Free";
      if (lowerCategory.includes("museum") || lowerCategory.includes("palace"))
        return "€€";
      if (
        lowerCategory.includes("restaurant") ||
        lowerCategory.includes("market")
      )
        return "€€€";
      return "€€"; // Default
    };

    // Generate a reasonable rating based on category
    const getRating = (category: string) => {
      // Most tourist attractions have good ratings
      return 4.2 + Math.random() * 0.6; // Random between 4.2 and 4.8
    };

    const coordinates = validateCoordinates(poi.latitude, poi.longitude);
    if (!coordinates) {
      console.warn(
        `convertPOIToItineraryFormat: Invalid coordinates for POI ${poi.name}: lat=${poi.latitude}, lng=${poi.longitude}`,
      );

      if (allowMissingCoordinates) {
        console.log(
          `📍 Creating POI without coordinates for cards: ${poi.name}`,
        );
        // Return POI without coordinates for card display only
        return {
          id: poi.id || `poi-${Math.random().toString(36).substr(2, 9)}`,
          name: poi.name || "Unknown Location",
          category: poi.category || "Attraction",
          description: poi.description_poi || "No description available",
          latitude: null, // Mark as missing
          longitude: null, // Mark as missing
          timeToSpend: getTimeToSpend(poi.category || ""),
          budget: getBudget(poi.category || ""),
          rating: Number(getRating(poi.category || "").toFixed(1)),
          tags: [poi.category || "Attraction"],
          priority: 1,
          dogFriendly: true,
          address: poi.address || "Address not available",
          website: poi.website || "",
          openingHours: poi.opening_hours || "Hours not available",
          hasValidCoordinates: false, // Flag to indicate missing coordinates
        };
      }

      return null; // Return null for POIs with invalid coordinates when coordinates are required
    }

    return {
      id: poi.id || `poi-${Math.random().toString(36).substr(2, 9)}`,
      name: poi.name || "Unknown Location",
      category: poi.category || "Attraction",
      description: poi.description_poi || "No description available",
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      timeToSpend: getTimeToSpend(poi.category || ""),
      budget: getBudget(poi.category || ""),
      rating: Number(getRating(poi.category || "").toFixed(1)),
      tags: [poi.category || "Attraction"],
      priority: 1,
      dogFriendly: true, // Default to true
      address: poi.address || "Address not available",
      website: poi.website || "",
      openingHours: poi.opening_hours || "Hours not available",
      hasValidCoordinates: true, // Flag to indicate valid coordinates
    };
  };

  // POIs for the MAP - these should be the curated itinerary POIs
  const mapPointsOfInterest = () => {
    // Include poisUpdateTrigger to react to updates
    poisUpdateTrigger(); // Access trigger to create dependency

    const streaming = streamingData();

    console.log("=== MAP POIs DEBUG ===");
    console.log("Streaming data:", streaming);

    if (streaming) {
      // Use ITINERARY POIs for the map (these are the curated selection)
      const itineraryPois = streaming.itinerary_response?.points_of_interest;

      console.log("Raw itinerary POIs:", itineraryPois);
      console.log("Itinerary POIs type:", typeof itineraryPois);
      console.log("Itinerary POIs is array:", Array.isArray(itineraryPois));
      console.log("Itinerary POIs length:", itineraryPois?.length);

      if (
        itineraryPois &&
        Array.isArray(itineraryPois) &&
        itineraryPois.length > 0
      ) {
        console.log("Processing each POI for map:");
        const convertedPOIs = itineraryPois
          .map((poi, index) => {
            console.log(`POI ${index}:`, poi);
            console.log(`  - Name: ${poi.name}`);
            console.log(`  - Lat: ${poi.latitude} (${typeof poi.latitude})`);
            console.log(`  - Lng: ${poi.longitude} (${typeof poi.longitude})`);
            // For map, require valid coordinates (allowMissingCoordinates = false)
            const converted = convertPOIToItineraryFormat(poi, false);
            console.log(`  - Converted:`, converted);
            return converted;
          })
          .filter((poi) => poi !== null); // Filter out null values (invalid coordinates)
        console.log("Final converted POIs for MAP:", convertedPOIs);

        // If we have converted POIs, return them
        if (convertedPOIs.length > 0) {
          return convertedPOIs;
        }
      }

      console.log("No itinerary POIs found for map - checking fallbacks");
      const generalPois = streaming.points_of_interest;
      console.log("General POIs as fallback:", generalPois);

      if (generalPois && Array.isArray(generalPois) && generalPois.length > 0) {
        // For map, require valid coordinates (allowMissingCoordinates = false)
        const convertedPOIs = generalPois
          .map((poi) => convertPOIToItineraryFormat(poi, false))
          .filter((poi) => poi !== null);
        console.log("Using GENERAL POIs as fallback for MAP:", convertedPOIs);
        return convertedPOIs;
      }
    }

    console.log("Returning empty array for map POIs");
    return [];
  };

  // POIs for the CARDS - these should be the general POIs for context
  const cardPointsOfInterest = () => {
    const streaming = streamingData();

    if (streaming) {
      // Use GENERAL POIs for the cards (these provide more context)
      const generalPois = streaming.points_of_interest;
      const itineraryPois = streaming.itinerary_response?.points_of_interest;

      console.log("Cards - General POIs:", generalPois);
      console.log("Cards - Itinerary POIs:", itineraryPois);

      // Combine both general and itinerary POIs for cards, but prioritize itinerary
      let allPois = [];

      if (itineraryPois && Array.isArray(itineraryPois)) {
        allPois = [...itineraryPois];
      }

      if (generalPois && Array.isArray(generalPois)) {
        // Add general POIs that aren't already in itinerary
        const itineraryNames = new Set(allPois.map((poi) => poi.name));
        const additionalPois = generalPois.filter(
          (poi) => !itineraryNames.has(poi.name),
        );
        allPois = [...allPois, ...additionalPois];
      }

      if (allPois.length > 0) {
        // For cards, allow POIs without coordinates so they can still be displayed
        const convertedPOIs = allPois
          .map((poi) => convertPOIToItineraryFormat(poi, true))
          .filter((poi) => poi !== null);
        console.log(
          "Using COMBINED POIs for CARDS (including those without coordinates):",
          convertedPOIs,
        );
        return convertedPOIs;
      }

      console.log("No POIs found for cards");
    }

    console.log("Returning fallback POIs for cards");
    return itinerary().pois || [];
  };

  // Legacy function for backwards compatibility - now uses card POIs
  const pointsOfInterest = () => cardPointsOfInterest();

  // All chat logic is now handled by the useChatSession hook

  const filterOptions = {
    categories: [
      { id: "historic", label: "Historic Sites", icon: Building },
      { id: "cuisine", label: "Local Cuisine", icon: Utensils },
      //{ id: 'museums', label: 'Museums', icon: Museum },
      { id: "architecture", label: "Architecture", icon: Building },
      { id: "nature", label: "Nature & Parks", icon: TreePine },
      { id: "shopping", label: "Shopping", icon: ShoppingBag },
    ],
    timeToSpend: [
      "30-60 minutes",
      "1-2 hours",
      "2-3 hours",
      "Half day",
      "Full day",
    ],
    budget: ["Free", "€", "€€", "€€€"],
    accessibility: [
      "Wheelchair Accessible",
      "Dog Friendly",
      "Family Friendly",
      "Public Transport",
    ],
  };

  const getCategoryIcon = (category: string) => {
    const iconMap: Record<string, any> = {
      "Bookstore & Architecture": Building,
      "Bridge & Landmark": Navigation,
      "Historical District": Building,
      //'Palace & Museum': Museum,
      "Parks & Gardens": TreePine,
      "Wine Tasting": Coffee,
    };
    return iconMap[category] || MapPin;
  };

  const getBudgetColor = (budget: string) => {
    const colorMap: Record<string, string> = {
      Free: "text-green-600",
      "€": "text-blue-600",
      "€€": "text-orange-600",
      "€€€": "text-red-600",
    };
    return colorMap[budget] || "text-gray-600";
  };

  const getPriorityColor = (priority: number) => {
    return priority === 1 ? "bg-red-500" : "bg-blue-500";
  };

  // Filtered POIs for CARDS (applies filters to card POIs)
  const filteredCardPOIs = () => {
    const pois = cardPointsOfInterest();
    console.log("Filtering Card POIs:", pois);

    const filtered = pois.filter((poi) => {
      const filters = activeFilters();

      // Dog-friendly filter
      if (filters.dogFriendly && !poi.dogFriendly) return false;

      // Category filter - make it more flexible for streaming data
      if (filters.categories.length > 0) {
        const poiCategory = poi.category?.toLowerCase() || "";
        const poiTags = poi.tags?.map((tag) => tag.toLowerCase()) || [];

        const hasMatchingCategory = filters.categories.some(
          (filterCategory) => {
            const lowerFilterCategory = filterCategory.toLowerCase();

            // Direct match
            if (
              poiTags.includes(lowerFilterCategory) ||
              poiCategory.includes(lowerFilterCategory)
            ) {
              return true;
            }

            // Fuzzy matching for common categories
            if (
              lowerFilterCategory.includes("historic") &&
              (poiCategory.includes("historic") ||
                poiCategory.includes("heritage") ||
                poiCategory.includes("monument"))
            )
              return true;
            if (
              lowerFilterCategory.includes("cuisine") &&
              (poiCategory.includes("restaurant") ||
                poiCategory.includes("food") ||
                poiCategory.includes("market"))
            )
              return true;
            if (
              lowerFilterCategory.includes("museum") &&
              poiCategory.includes("museum")
            )
              return true;
            if (
              lowerFilterCategory.includes("architecture") &&
              (poiCategory.includes("building") ||
                poiCategory.includes("palace") ||
                poiCategory.includes("cathedral"))
            )
              return true;

            return false;
          },
        );

        if (!hasMatchingCategory) return false;
      }

      // Time to spend filter
      if (
        filters.timeToSpend.length > 0 &&
        !filters.timeToSpend.includes(poi.timeToSpend)
      )
        return false;

      // Budget filter
      if (filters.budget.length > 0 && !filters.budget.includes(poi.budget))
        return false;

      return true;
    });

    console.log("Filtered Card POIs result:", filtered);
    return filtered;
  };

  // Filtered POIs for MAP (applies filters to map POIs)
  const filteredMapPOIs = () => {
    const pois = mapPointsOfInterest();
    console.log("Filtering Map POIs:", pois);

    // For now, don't filter map POIs too heavily - show the full itinerary
    // You can add filtering here if needed
    console.log("Map POIs (unfiltered):", pois);
    return pois;
  };

  // Legacy function for backwards compatibility - now uses card POIs
  const filteredPOIs = () => filteredCardPOIs();

  const toggleFilter = (filterType: keyof FilterState, value: string) => {
    setActiveFilters((prev) => {
      if (filterType === "dogFriendly") {
        return { ...prev, dogFriendly: !prev.dogFriendly };
      }

      const currentArray = prev[filterType] as string[];
      return {
        ...prev,
        [filterType]: currentArray.includes(value)
          ? currentArray.filter((v: string) => v !== value)
          : [...currentArray, value],
      };
    });
  };

  const movePOI = (poiId: string, direction: "up" | "down") => {
    // Note: This function would need to update the streaming data to reorder POIs
    // For now, just log the action since we don't have a setPointsOfInterest function
    console.log(`Move POI ${poiId} ${direction}`);
    // TODO: Implement POI reordering by updating the streamingData
  };

  const renderMap = () => {
    console.log("Rendering map container");
    return <div id="map-container" class="h-full rounded-lg overflow-hidden" />;
  };

  const renderPOICard = (poi: ConvertedPOI) => {
    const IconComponent = getCategoryIcon(poi.category);
    return (
      <div
        class={`bg-white rounded-lg border p-4 cursor-pointer transition-all hover:shadow-md ${selectedPOI()?.id === poi.id ? "ring-2 ring-blue-500 shadow-md" : "border-gray-200"}`}
        onClick={() => setSelectedPOI(poi)}
      >
        <div class="flex items-start gap-3">
          <div
            class={`w-12 h-12 rounded-full ${getPriorityColor(poi.priority)} flex items-center justify-center flex-shrink-0`}
          >
            <IconComponent class="w-6 h-6 text-white" />
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between mb-2">
              <div class="flex-1 min-w-0">
                <h3 class="font-semibold text-gray-900 text-base mb-1">
                  {poi.name}
                </h3>

                {/* Enhanced Filter Labels */}
                <div class="flex flex-wrap items-center gap-2 mb-2">
                  {/* POI Category Label */}
                  <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    📍 {poi.category}
                  </span>

                  {/* Location Status Indicator */}
                  <Show when={poi.hasValidCoordinates === false}>
                    <span class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                      📍 Location TBD
                    </span>
                  </Show>

                  {/* Budget/Price Range with Enhanced Styling */}
                  <span
                    class={`px-3 py-1 rounded-full text-xs font-bold border ${
                      getBudgetColor(poi.budget).includes("green")
                        ? "bg-green-50 text-green-700 border-green-200"
                        : getBudgetColor(poi.budget).includes("blue")
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : getBudgetColor(poi.budget).includes("orange")
                            ? "bg-orange-50 text-orange-700 border-orange-200"
                            : "bg-red-50 text-red-700 border-red-200"
                    }`}
                  >
                    {poi.budget}{" "}
                    {poi.budget === "Free"
                      ? "Entry"
                      : poi.budget === "€"
                        ? "Budget"
                        : poi.budget === "€€"
                          ? "Moderate"
                          : "Premium"}
                  </span>

                  {/* Rating/Popularity Label */}
                  <Show when={poi.rating >= 4.5}>
                    <span class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                      ⭐ Must Visit
                    </span>
                  </Show>
                  <Show when={poi.rating >= 4.0 && poi.rating < 4.5}>
                    <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      ✓ Recommended
                    </span>
                  </Show>

                  {/* Time to Spend Label */}
                  <span class="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                    🕒 {poi.timeToSpend}
                  </span>

                  {/* Priority Label */}
                  <Show when={poi.priority === 1}>
                    <span class="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                      🔥 Priority
                    </span>
                  </Show>

                  {/* Dog Friendly Label */}
                  <Show when={poi.dogFriendly}>
                    <span class="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs">
                      🐕 Pet Friendly
                    </span>
                  </Show>
                </div>
              </div>

              {/* Rating Badge */}
              <div class="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full border border-yellow-200">
                <Star class="w-3 h-3 text-yellow-500 fill-current" />
                <span class="text-yellow-800 font-medium text-xs">
                  {poi.rating}
                </span>
              </div>
            </div>

            <p class="text-sm text-gray-600 mb-3 line-clamp-2">
              {poi.description}
            </p>

            {/* Enhanced Footer with Better Visual Hierarchy */}
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="text-lg font-bold text-gray-900">{poi.budget}</div>
              </div>

              {/* Control Buttons */}
              <div class="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    movePOI(poi.id, "up");
                  }}
                  class="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title="Move up"
                >
                  ↑
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    movePOI(poi.id, "down");
                  }}
                  class="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title="Move down"
                >
                  ↓
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // chat component

  const renderFiltersPanel = () => (
    <Show when={showFilters()}>
      <div class="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg border border-gray-200 shadow-lg p-4 z-10">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <h4 class="font-semibold text-gray-900 mb-2 text-sm">Categories</h4>
            <div class="space-y-1">
              <For each={filterOptions.categories}>
                {(category) => {
                  const IconComponent = category.icon;
                  return (
                    <label class="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <input
                        type="checkbox"
                        class="rounded border-gray-300"
                        checked={activeFilters().categories.includes(
                          category.label,
                        )}
                        onChange={() =>
                          toggleFilter("categories", category.label)
                        }
                      />
                      <IconComponent class="w-4 h-4 text-gray-500" />
                      <span class="text-gray-700">{category.label}</span>
                    </label>
                  );
                }}
              </For>
            </div>
          </div>
          <div>
            <h4 class="font-semibold text-gray-900 mb-2 text-sm">
              Time to Spend
            </h4>
            <div class="space-y-1">
              <For each={filterOptions.timeToSpend}>
                {(time) => (
                  <label class="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
                    <input
                      type="checkbox"
                      class="rounded border-gray-300"
                      checked={activeFilters().timeToSpend.includes(time)}
                      onChange={() => toggleFilter("timeToSpend", time)}
                    />
                    <span class="text-gray-700">{time}</span>
                  </label>
                )}
              </For>
            </div>
          </div>
          <div>
            <h4 class="font-semibold text-gray-900 mb-2 text-sm">Budget</h4>
            <div class="space-y-1">
              <For each={filterOptions.budget}>
                {(budget) => (
                  <label class="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
                    <input
                      type="checkbox"
                      class="rounded border-gray-300"
                      checked={activeFilters().budget.includes(budget)}
                      onChange={() => toggleFilter("budget", budget)}
                    />
                    <span class={`font-medium ${getBudgetColor(budget)}`}>
                      {budget}
                    </span>
                  </label>
                )}
              </For>
            </div>
          </div>
          <div>
            <h4 class="font-semibold text-gray-900 mb-2 text-sm">
              Accessibility
            </h4>
            <div class="space-y-1">
              <label class="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
                <input
                  type="checkbox"
                  class="rounded border-gray-300"
                  checked={activeFilters().dogFriendly}
                  onChange={() =>
                    setActiveFilters((prev) => ({
                      ...prev,
                      dogFriendly: !prev.dogFriendly,
                    }))
                  }
                />
                <span class="text-gray-700">🐕 Dog Friendly</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </Show>
  );

  const addToTrip = (poi: ConvertedPOI) => {
    setMyTrip((prev) =>
      prev.some((item) => item.id === poi.id) ? prev : [...prev, poi],
    );
  };

  // Check if current itinerary is bookmarked
  const isCurrentItineraryBookmarked = () => {
    if (!isAuthenticated() || !allItinerariesQuery.data) return false;

    const sessionId = chatSession.sessionId();
    if (!sessionId) return false;

    const savedItineraries = allItinerariesQuery.data.itineraries;
    // Add null safety check
    if (!savedItineraries || !Array.isArray(savedItineraries)) return false;

    // Use the same logic as getBookmarkedItineraryId to ensure consistency
    const currentItinerary = itinerary();
    const streaming = streamingData();
    const primaryCityName =
      streaming?.general_city_data?.city || currentItinerary.city || "unknown";
    const expectedTitle =
      currentItinerary.name || `${primaryCityName} Adventure`;

    return savedItineraries.some(
      (saved) => {
        const titleMatch = saved.title === expectedTitle;
        const sessionMatch = (saved.source_llm_interaction_id && saved.source_llm_interaction_id === sessionId) ||
                           (saved.session_id && saved.session_id === sessionId);
        return titleMatch || sessionMatch;
      }
    );
  };

  // Get the bookmarked itinerary ID if it exists
  const getBookmarkedItineraryId = () => {
    if (!isAuthenticated() || !allItinerariesQuery.data) return null;

    const sessionId = chatSession.sessionId();
    if (!sessionId) return null;

    const savedItineraries = allItinerariesQuery.data.itineraries;
    // Add null safety check
    if (!savedItineraries || !Array.isArray(savedItineraries)) return null;

    const currentItinerary = itinerary();
    const streaming = streamingData();
    const primaryCityName =
      streaming?.general_city_data?.city || currentItinerary.city || "unknown";
    const expectedTitle =
      currentItinerary.name || `${primaryCityName} Adventure`;

    const foundItinerary = savedItineraries.find(
      (saved) => {
        const titleMatch = saved.title === expectedTitle;
        const sessionMatch = (saved.source_llm_interaction_id && saved.source_llm_interaction_id === sessionId) ||
                           (saved.session_id && saved.session_id === sessionId);
        return titleMatch || sessionMatch;
      }
    );

    return foundItinerary?.id || null;
  };

  const toggleBookmark = () => {
    // Prevent multiple rapid calls while mutation is pending
    if (removeItineraryMutation.isPending || saveItineraryMutation.isPending) {
      console.log("Bookmark operation already in progress, ignoring duplicate call");
      return;
    }

    if (isCurrentItineraryBookmarked()) {
      // Remove bookmark
      const itineraryId = getBookmarkedItineraryId();
      if (itineraryId) {
        removeItineraryMutation.mutate(itineraryId);
      }
    } else {
      // Add bookmark
      saveItinerary();
    }
  };

  const saveItinerary = () => {
    // Get the current session ID from chat session or storage
    const sessionId = chatSession.sessionId();

    if (!sessionId) {
      console.error("No session ID available for saving itinerary");
      // Try to get session ID from session storage as fallback
      const storedSession = sessionStorage.getItem("completedStreamingSession");
      if (storedSession) {
        try {
          const session = JSON.parse(storedSession);
          const fallbackSessionId =
            session.sessionId ||
            session.data?.session_id ||
            session.data?.sessionId;
          if (fallbackSessionId) {
            console.log(
              "Using fallback session ID from storage:",
              fallbackSessionId,
            );
            chatSession.setSessionId(fallbackSessionId);
          } else {
            console.error("No session ID found in storage either");
            return;
          }
        } catch (error) {
          console.error("Error parsing stored session:", error);
          return;
        }
      } else {
        console.error("No stored session found for fallback");
        return;
      }
    }

    const currentItinerary = itinerary();
    const streaming = streamingData();

    // Extract primary city name from streaming data or use a fallback
    const primaryCityName =
      streaming?.general_city_data?.city || currentItinerary.city || "unknown";

    // Create the bookmark request with proper format
    const itineraryData = {
      session_id: sessionId,
      primary_city_name: primaryCityName,
      title: currentItinerary.name || `${primaryCityName} Adventure`,
      description:
        currentItinerary.description ||
        `Personalized itinerary for ${primaryCityName}`,
      tags: [primaryCityName.toLowerCase(), "ai-generated", "personalized"],
      is_public: false,
    };

    console.log("Saving itinerary with data:", itineraryData);
    saveItineraryMutation.mutate(itineraryData);
  };

  const updateItinerary = (updates: any) => {
    if (currentItineraryId()) {
      updateItineraryMutation.mutate({
        itineraryId: currentItineraryId(),
        data: updates,
      });
    }
  };

  // Favorites functionality
  const isFavorite = (poiName: string) => {
    const favs = favoritesQuery.data || [];
    return favs.some((poi) => poi.name === poiName);
  };

  const toggleFavorite = (poiName: string, poi: any) => {
    if (!isAuthenticated()) {
      console.log("User not authenticated, cannot toggle favorite");
      return;
    }

    console.log("Toggle favorite for POI:", {
      poiName,
      isFavorite: isFavorite(poiName),
    });

    // Convert the itinerary POI format to POIDetailedInfo format
    const poiData = {
      id: poi.name, // Use name as fallback ID
      city: itinerary().city || "Unknown",
      name: poi.name,
      latitude: poi.latitude || 0,
      longitude: poi.longitude || 0,
      category: poi.category || "attraction",
      description: poi.description_poi || "",
      address: poi.address || "",
      website: poi.website || "",
      phone_number: "",
      opening_hours: poi.opening_hours || "",
      price_level: poi.budget || "Free",
      amenities: [],
      tags: [],
      images: [],
      rating: poi.rating || 4.0,
      time_to_spend: poi.timeToSpend || "1-2 hours",
      budget: poi.budget || "Free",
      priority: poi.priority || 1,
      llm_interaction_id: chatSession.sessionId() || "unknown",
    };

    if (isFavorite(poiName)) {
      console.log("Removing from favorites...");
      // Include POI data for name-based removal fallback
      removeFromFavoritesMutation.mutate({ poiId: poiName, poiData });
    } else {
      console.log("Adding to favorites...");
      addToFavoritesMutation.mutate({ poiId: poi.name, poiData });
    }
  };
  console.log(
    "location.state?.originalMessage",
    location.state?.originalMessage,
  );

  return (
    <div class="min-h-screen relative">
      {/* Chat Success Banner */}
      <Show when={fromChat()}>
        <div class="px-4 py-3 sm:px-6">
          <div class="max-w-7xl mx-auto">
            <div class="flex items-center gap-3 glass-panel gradient-border rounded-xl p-3">
              <div class="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow">
                <MessageCircle class="w-4 h-4 text-white" />
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                  ✨{" "}
                  <TypingAnimation text="Your personalized itinerary is ready!" />
                </p>
                <p class="text-xs text-slate-700 dark:text-slate-300">
                  Generated from your chat: "
                  {location.state?.originalMessage || "chat"}"
                </p>
              </div>
              <button
                onClick={() => setFromChat(false)}
                class="p-1 text-emerald-700 hover:text-emerald-800 dark:text-emerald-200 dark:hover:text-emerald-100"
              >
                <X class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </Show>

      {/* Non-authenticated user message */}
      <Show when={!isAuthenticated()}>
        <div class="px-4 py-4 sm:px-6">
          <div class="max-w-7xl mx-auto">
            <div class="flex items-center gap-4 glass-panel gradient-border rounded-xl p-4">
              <div class="w-10 h-10 bg-[#0c7df2] rounded-full flex items-center justify-center text-white shadow">
                <Star class="w-5 h-5 text-white" />
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-slate-900 dark:text-white">
                  🎉 Your free itinerary preview is ready!
                </h3>
                <p class="text-sm text-slate-700 dark:text-slate-300 mt-1">
                  Create a free account to unlock full features: save favorites,
                  share itineraries, continue planning with AI, and access your
                  travel history.
                </p>
              </div>
              <div class="flex gap-2">
                <button
                  onClick={() => (window.location.href = "/auth/signup")}
                  class="px-4 py-2 bg-[#0c7df2] hover:bg-[#0a6ed6] text-white rounded-lg transition-colors text-sm font-medium shadow-[0_12px_32px_rgba(12,125,242,0.22)] border border-white/30 dark:border-slate-800/60"
                >
                  Sign Up Free
                </button>
                <button
                  onClick={() => (window.location.href = "/auth/signin")}
                  class="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors text-sm font-medium"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      </Show>

      {/* Header - Mobile First */}
      <div class="bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl border-b border-white/60 dark:border-slate-800/70 px-4 py-3 sm:px-6 sm:py-4">
        <div class="max-w-7xl mx-auto">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 class="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
                {itinerary().name}
              </h1>
              <p class="text-sm text-gray-600 dark:text-gray-300 mt-1 sm:text-base">
                {itinerary().city}, {itinerary().country} •{" "}
                {itinerary().duration}
              </p>
            </div>
            <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              {/* View Mode Toggle - Stack on Mobile */}
              <div class="flex bg-gray-100 rounded-lg p-1 w-full sm:w-auto">
                <button
                  onClick={() => setViewMode("map")}
                  class={`flex-1 px-3 py-1 rounded text-sm font-medium transition-colors sm:flex-initial ${viewMode() === "map" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"}`}
                  title="Show only map"
                >
                  Map
                </button>
                <button
                  onClick={() => setViewMode("split")}
                  class={`flex-1 px-3 py-1 rounded text-sm font-medium transition-colors sm:flex-initial ${viewMode() === "split" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"}`}
                  title="Split view: Map + Cards"
                >
                  Split
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  class={`flex-1 px-3 py-1 rounded text-sm font-medium transition-colors sm:flex-initial ${viewMode() === "list" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"}`}
                  title="Show only cards"
                >
                  List
                </button>
              </div>

              {/* Action Buttons - Stack on Mobile */}
              <div class="flex flex-col gap-2 sm:flex-row sm:gap-3">
                <Show when={isAuthenticated()}>
                  <button
                    onClick={() => chatSession.setShowChat(true)}
                    class="flex items-center justify-center gap-2 px-4 py-2 bg-[#0c7df2] hover:bg-[#0a6ed6] text-white rounded-lg transition-all shadow-sm text-sm font-medium shadow-[0_12px_32px_rgba(12,125,242,0.22)] border border-white/30 dark:border-slate-800/60"
                  >
                    <MessageCircle class="w-4 h-4" />
                    Continue Planning
                  </button>
                </Show>

                <div class="flex gap-2">
                  <Show
                    when={isAuthenticated()}
                    fallback={
                      <button
                        disabled
                        class="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-gray-400 bg-gray-100 rounded-lg transition-colors text-sm sm:flex-initial disabled:cursor-not-allowed"
                        title="Sign in to save itineraries"
                      >
                        <Heart class="w-4 h-4" />
                        <span class="hidden sm:inline">Save</span>
                      </button>
                    }
                  >
                    <button
                      onClick={toggleBookmark}
                      disabled={
                        saveItineraryMutation.isPending ||
                        removeItineraryMutation.isPending
                      }
                      class={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm sm:flex-initial disabled:opacity-50 ${
                        isCurrentItineraryBookmarked()
                          ? "text-red-600 bg-red-50 hover:bg-red-100"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      title={
                        isCurrentItineraryBookmarked()
                          ? "Remove from bookmarks"
                          : "Save to bookmarks"
                      }
                    >
                      <Heart
                        class={`w-4 h-4 ${isCurrentItineraryBookmarked() ? "fill-current" : ""}`}
                      />
                      <span class="hidden sm:inline">
                        {saveItineraryMutation.isPending ||
                        removeItineraryMutation.isPending
                          ? isCurrentItineraryBookmarked()
                            ? "Removing..."
                            : "Saving..."
                          : isCurrentItineraryBookmarked()
                            ? "Saved"
                            : "Save"}
                      </span>
                    </button>
                  </Show>

                  <Show
                    when={isAuthenticated()}
                    fallback={
                      <button
                        disabled
                        class="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-gray-400 bg-gray-100 rounded-lg transition-colors text-sm sm:flex-initial disabled:cursor-not-allowed"
                        title="Sign in to share itineraries"
                      >
                        <Share2 class="w-4 h-4" />
                        <span class="hidden sm:inline">Share</span>
                      </button>
                    }
                  >
                    <button class="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm sm:flex-initial">
                      <Share2 class="w-4 h-4" />
                      <span class="hidden sm:inline">Share</span>
                    </button>
                  </Show>

                  <button class="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:flex-initial">
                    <Download class="w-4 h-4" />
                    <span class="hidden sm:inline">Export</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Bar - Mobile First */}
      <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 relative sm:px-6">
        <div class="max-w-7xl mx-auto">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters())}
                class={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors text-sm font-medium ${showFilters() ? "bg-blue-50 border-blue-200 text-blue-700" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}
              >
                <Filter class="w-4 h-4" />
                Filters
              </button>
              <div class="text-sm text-gray-600">
                {filteredCardPOIs().length} places in cards,{" "}
                {filteredMapPOIs().length} on map
              </div>
            </div>
            <div class="flex items-center gap-2 text-sm text-gray-600">
              <Calendar class="w-4 h-4" />
              <span class="hidden sm:inline">
                Best visited: May - September
              </span>
              <span class="sm:hidden">May - Sep</span>
            </div>
          </div>
          {renderFiltersPanel()}
        </div>
      </div>

      {/* City Information and General POIs - Only show when we have streaming data */}
      <Show when={streamingData() && streamingData().general_city_data}>
        <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div class="max-w-7xl mx-auto px-4 py-6 sm:px-6">
            <div class="grid gap-6 lg:grid-cols-3">
              {/* City Information */}
              <div class="lg:col-span-2">
                <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <MapPin class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    About {streamingData()?.general_city_data?.city}
                  </h2>
                  <p class="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-6">
                    {streamingData()?.general_city_data?.description}
                  </p>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <Users class="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <div>
                        <div class="text-xs font-medium text-gray-600 dark:text-gray-300">
                          Population
                        </div>
                        <div class="text-sm text-gray-900 dark:text-white">
                          {streamingData()?.general_city_data?.population}
                        </div>
                      </div>
                    </div>
                    <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <MessageCircle class="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <div>
                        <div class="text-xs font-medium text-gray-600 dark:text-gray-300">
                          Language
                        </div>
                        <div class="text-sm text-gray-900 dark:text-white">
                          {streamingData()?.general_city_data?.language}
                        </div>
                      </div>
                    </div>
                    <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <Cloud class="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <div>
                        <div class="text-xs font-medium text-gray-600 dark:text-gray-300">
                          Weather
                        </div>
                        <div class="text-sm text-gray-900 dark:text-white">
                          {streamingData()?.general_city_data?.weather}
                        </div>
                      </div>
                    </div>
                    <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <Clock class="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <div>
                        <div class="text-xs font-medium text-gray-600 dark:text-gray-300">
                          Timezone
                        </div>
                        <div class="text-sm text-gray-900 dark:text-white">
                          {streamingData()?.general_city_data?.timezone}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 class="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Star class="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Quick Stats
                </h3>
                <div class="space-y-4">
                  <Show when={streamingData()?.points_of_interest}>
                    <div class="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <span class="text-sm text-gray-700 dark:text-gray-300">
                        Places to explore
                      </span>
                      <span class="font-semibold text-blue-600 dark:text-blue-400">
                        {streamingData()?.points_of_interest?.length || 0}
                      </span>
                    </div>
                  </Show>
                  <Show
                    when={
                      streamingData()?.itinerary_response?.points_of_interest
                    }
                  >
                    <div class="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <span class="text-sm text-gray-700 dark:text-gray-300">
                        In your itinerary
                      </span>
                      <span class="font-semibold text-green-600 dark:text-green-400">
                        {streamingData()?.itinerary_response?.points_of_interest
                          ?.length || 0}
                      </span>
                    </div>
                  </Show>
                  <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span class="text-sm text-gray-700 dark:text-gray-300">
                      Total area
                    </span>
                    <span class="font-semibold text-gray-900 dark:text-white">
                      {streamingData()?.general_city_data?.area}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* General POIs Summary */}
            <Show
              when={
                streamingData()?.points_of_interest &&
                streamingData().points_of_interest.length > 0
              }
            >
              <div class="mt-6">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Compass class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    All Points of Interest in{" "}
                    {streamingData()?.general_city_data?.city}
                  </h3>
                  <span class="text-sm text-gray-500 dark:text-gray-400">
                    {streamingData()?.points_of_interest?.length} places
                  </span>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <For
                    each={
                      showAllGeneralPOIs()
                        ? streamingData()?.points_of_interest
                        : streamingData()?.points_of_interest?.slice(0, 6)
                    }
                  >
                    {(poi) => (
                      <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer group">
                        <div class="flex items-start gap-3">
                          <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                            {(() => {
                              const category =
                                poi.category?.toLowerCase() || "";
                              if (
                                category.includes("museum") ||
                                category.includes("cultural")
                              )
                                return (
                                  <Palette class="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                );
                              if (
                                category.includes("park") ||
                                category.includes("garden")
                              )
                                return (
                                  <TreePine class="w-4 h-4 text-green-600 dark:text-green-400" />
                                );
                              if (
                                category.includes("restaurant") ||
                                category.includes("food")
                              )
                                return (
                                  <Utensils class="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                );
                              if (
                                category.includes("hotel") ||
                                category.includes("accommodation")
                              )
                                return (
                                  <Building class="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                );
                              return (
                                <MapPin class="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              );
                            })()}
                          </div>
                          <div class="flex-1 min-w-0">
                            <h4 class="font-medium text-gray-900 dark:text-white text-sm mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {poi.name}
                            </h4>
                            <p class="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full w-fit mb-2">
                              {poi.category}
                            </p>
                            <p class="text-xs text-gray-700 dark:text-gray-300 line-clamp-2">
                              {poi.description_poi}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </For>
                </div>
                <Show when={streamingData()?.points_of_interest?.length > 6}>
                  <div class="mt-4 text-center">
                    <button
                      onClick={() =>
                        setShowAllGeneralPOIs(!showAllGeneralPOIs())
                      }
                      class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                    >
                      {showAllGeneralPOIs()
                        ? "Show less places ↑"
                        : `View all ${streamingData().points_of_interest.length - 6} remaining places →`}
                    </button>
                  </div>
                </Show>
              </div>
            </Show>
          </div>
        </div>
      </Show>

      {/* Main Content - Mobile First */}
      <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 sm:py-6">
        <div
          class={`${viewMode() === "split" ? "flex flex-col gap-4 sm:gap-6" : "grid grid-cols-1 gap-4 sm:gap-6"}`}
        >
          <Show when={viewMode() === "map" || viewMode() === "split"}>
            <div
              class={
                viewMode() === "map"
                  ? "w-full h-[400px] sm:h-[600px]"
                  : "w-full h-[400px] sm:h-[500px]"
              }
            >
              {(() => {
                const mapPOIs = filteredMapPOIs();
                console.log("=== RENDERING MAP COMPONENT ===");
                console.log("Map POIs being passed to MapComponent:", mapPOIs);
                console.log("Map POIs length:", mapPOIs.length);

                // Debug each POI's coordinates
                mapPOIs.forEach((poi, index) => {
                  console.log(
                    `🗺️ Map POI ${index + 1}: ${poi.name} - lat: ${poi.latitude}, lng: ${poi.longitude}`,
                  );
                });

                console.log("Center coordinates:", [
                  itinerary().centerLng,
                  itinerary().centerLat,
                ]);

                // *** VALIDATE CENTER COORDINATES BEFORE PASSING TO MAP ***
                const rawCenter = [
                  itinerary().centerLng,
                  itinerary().centerLat,
                ];
                const validatedCenter = (() => {
                  const [lng, lat] = rawCenter;

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
                      `🚫 Invalid center coordinates from itinerary: lng=${lng} (${typeof lng}), lat=${lat} (${typeof lat})`,
                    );
                    return [-8.6291, 41.1579]; // Default to Porto coordinates
                  }

                  // Check coordinate ranges
                  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
                    console.warn(
                      `🚫 Center coordinates out of range from itinerary: lng=${lng}, lat=${lat}`,
                    );
                    return [-8.6291, 41.1579]; // Default to Porto coordinates
                  }

                  console.log(
                    `✅ Valid center coordinates from itinerary: lng=${lng}, lat=${lat}`,
                  );
                  return rawCenter;
                })();

                console.log("Validated center coordinates:", validatedCenter);

                // Don't render map during POI updates to prevent symbol layer errors
                if (mapDisabled()) {
                  return (
                    <div class="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                      <div class="text-center">
                        <Loader2 class="w-8 h-8 animate-spin mx-auto mb-2 text-blue-600" />
                        <p class="text-sm text-gray-600">Updating map...</p>
                      </div>
                    </div>
                  );
                }

                return (
                  <MapComponent
                    center={validatedCenter}
                    zoom={12}
                    minZoom={10}
                    maxZoom={22}
                    pointsOfInterest={mapPOIs}
                    style="mapbox://styles/mapbox/streets-v12"
                    showRoutes={true}
                    onMarkerClick={(poi, index) => {
                      console.log(
                        `Marker clicked: ${poi.name} (index: ${index})`,
                      );
                      // Find the corresponding POI in our filtered list and highlight it
                      const matchingPOI = filteredCardPOIs().find(
                        (cardPoi) => cardPoi.name === poi.name,
                      );
                      if (matchingPOI) {
                        setSelectedPOI(matchingPOI);
                        console.log(`Set selected POI to: ${matchingPOI.name}`);
                      }
                    }}
                  />
                );
              })()}
            </div>
          </Show>

          <Show when={viewMode() === "list" || viewMode() === "split"}>
            <div class="w-full">
              <div class="space-y-4">
                <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div class="flex items-center gap-2">
                      <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                        Your Curated Itinerary
                      </h2>
                      <Show when={isUpdatingItinerary()}>
                        <div class="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                          <Loader2 class="w-4 h-4 animate-spin" />
                          <span>Updating...</span>
                        </div>
                      </Show>
                    </div>
                    <p class="text-sm text-gray-600 dark:text-gray-300">
                      Personalized places to visit based on your preferences
                    </p>
                  </div>
                  <button class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 self-start sm:self-auto">
                    <Edit3 class="w-4 h-4" />
                    Customize Order
                  </button>
                </div>
                <ItineraryResults
                  pois={filteredPOIs().map((poi) => ({
                    name: poi.name,
                    latitude: poi.latitude,
                    longitude: poi.longitude,
                    category: poi.category,
                    description_poi: poi.description,
                    address: poi.address,
                    website: poi.website,
                    opening_hours: poi.openingHours,
                    rating: poi.rating,
                    priority: poi.priority,
                    timeToSpend: poi.timeToSpend,
                    budget: poi.budget,
                    distance: 0, // Calculate if needed
                  }))}
                  compact={false}
                  showToggle={filteredPOIs().length > 5}
                  initialLimit={5}
                  onToggleFavorite={
                    isAuthenticated() ? toggleFavorite : undefined
                  }
                  onShareClick={
                    isAuthenticated()
                      ? (poi) => {
                          if (navigator.share) {
                            navigator.share({
                              title: poi.name,
                              text: `Check out ${poi.name} - ${poi.description_poi}`,
                              url: window.location.href,
                            });
                          } else {
                            navigator.clipboard.writeText(
                              `Check out ${poi.name}: ${poi.description_poi}`,
                            );
                          }
                        }
                      : undefined
                  }
                  favorites={
                    isAuthenticated()
                      ? (favoritesQuery.data || []).map((fav) => fav.name)
                      : []
                  }
                  isLoadingFavorites={
                    addToFavoritesMutation.isPending ||
                    removeFromFavoritesMutation.isPending
                  }
                  showAuthMessage={!isAuthenticated()}
                />
              </div>
            </div>
          </Show>
        </div>
      </div>

      {/* Chat Interface - Mobile Optimized - Only for authenticated users */}
      <Show when={isAuthenticated()}>
        <ChatInterface
          showChat={chatSession.showChat()}
          chatMessage={chatSession.chatMessage()}
          chatHistory={chatSession.chatHistory()}
          isLoading={chatSession.isLoading()}
          setShowChat={chatSession.setShowChat}
          setChatMessage={chatSession.setChatMessage}
          sendChatMessage={chatSession.sendChatMessage}
          handleKeyPress={chatSession.handleKeyPress}
          title="Continue Planning"
          placeholder="Ask me to modify your itinerary..."
          emptyStateTitle="Ask me to modify your itinerary!"
          emptyStateSubtitle='Try: "Add the Eiffel Tower" or "Remove expensive activities"'
          loadingMessage="Updating your itinerary..."
          headerColor="bg-blue-600"
          userMessageColor="bg-blue-600"
          floatingButtonColor="bg-blue-600 hover:bg-blue-700"
          focusRingColor="focus:ring-blue-500"
        />
      </Show>

      {/* Selected POI Details - Mobile First Modal */}
      <Show when={selectedPOI()}>
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
          <div class="bg-white rounded-t-lg sm:rounded-lg max-w-2xl w-full max-h-[90vh] sm:max-h-[80vh] overflow-y-auto">
            <div class="p-4 sm:p-6">
              <div class="flex items-start justify-between mb-4">
                <div class="flex-1 min-w-0">
                  <h3 class="text-lg font-bold text-gray-900 sm:text-xl pr-2">
                    {selectedPOI().name}
                  </h3>
                  <p class="text-gray-600 text-sm sm:text-base">
                    {selectedPOI().category}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedPOI(null)}
                  class="p-2 hover:bg-gray-100 rounded-lg flex-shrink-0"
                >
                  <X class="w-5 h-5" />
                </button>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 text-sm">
                <div class="flex items-center gap-2">
                  <Clock class="w-4 h-4 text-gray-500" />
                  <span>{selectedPOI().timeToSpend}</span>
                </div>
                <div class="flex items-center gap-2">
                  <DollarSign class="w-4 h-4 text-gray-500" />
                  <span class={getBudgetColor(selectedPOI().budget)}>
                    {selectedPOI().budget}
                  </span>
                </div>
                <div class="flex items-center gap-2 col-span-1 sm:col-span-2">
                  <MapPin class="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <span class="text-xs sm:text-sm">
                    {selectedPOI().address}
                  </span>
                </div>
                <div class="flex items-center gap-2">
                  <Star class="w-4 h-4 text-yellow-500 fill-current" />
                  <span>{selectedPOI().rating}/5</span>
                </div>
              </div>

              <p class="text-gray-700 mb-4 text-sm sm:text-base">
                {selectedPOI().description}
              </p>

              <div class="flex flex-wrap gap-2 mb-4">
                <For each={selectedPOI().tags}>
                  {(tag) => (
                    <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                      {tag}
                    </span>
                  )}
                </For>
              </div>

              <div class="border-t pt-4">
                <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div class="text-sm text-gray-600">
                    <p>
                      <strong>Hours:</strong> {selectedPOI().openingHours}
                    </p>
                  </div>
                  <div class="flex flex-col gap-2 sm:flex-row">
                    <button
                      onClick={() => addToTrip(selectedPOI())}
                      class={`px-4 py-2 rounded-lg text-sm font-medium ${myTrip().some((item) => item.id === selectedPOI().id) ? "bg-green-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700"}`}
                    >
                      {myTrip().some((item) => item.id === selectedPOI().id)
                        ? "Added"
                        : "Add to My Trip"}
                    </button>
                    <button class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm">
                      Get Directions
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
}
