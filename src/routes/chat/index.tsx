import { createSignal, For, Show, onMount } from "solid-js";
import {
  MessageCircle,
  Send,
  Bot,
  User,
  MapPin,
  Heart,
  Share2,
  Plus,
  Loader2,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-solid";
import {
  sendUnifiedChatMessageStream,
  ContinueChatStream,
  detectDomain,
  useGetChatSessionsQuery,
  domainToContextType,
} from "~/lib/api/llm";
import {
  streamingService,
  createStreamingSession,
} from "~/lib/streaming-service";
import type {
  DomainType,
}
  from "~/lib/api/types";
import { useUserLocation } from "~/contexts/LocationContext";
import HotelResults from "~/components/results/HotelResults";
import RestaurantResults from "~/components/results/RestaurantResults";
import ActivityResults from "~/components/results/ActivityResults";
import ItineraryResults from "~/components/results/ItineraryResults";
import DetailedItemModal from "~/components/DetailedItemModal";
import { useQuery, useQueryClient } from "@tanstack/solid-query";
import { useDefaultSearchProfile } from "~/lib/api/profiles";
import { TypingAnimation } from "~/components/TypingAnimation";
import { API_BASE_URL } from "~/lib/api/shared";

export default function ChatPage() {
  const queryClient = useQueryClient();
  const [messages, setMessages] = createSignal<any[]>([]);
  const [currentMessage, setCurrentMessage] = createSignal("");
  const [isLoading, setIsLoading] = createSignal(false);
  const [sessionId, setSessionId] = createSignal<string | null>(null);
  const [activeProfile, setActiveProfile] = createSignal("Solo Explorer");
  const [showProfileSelector, setShowProfileSelector] = createSignal(false);
  const [selectedSession, setSelectedSession] = createSignal(null);
  const [streamingSession, setStreamingSession] = createSignal<any>(null);
  const [streamProgress, setStreamProgress] = createSignal("");
  const [expandedResults, setExpandedResults] = createSignal<Set<string>>(new Set());
  const [selectedItem, setSelectedItem] = createSignal(null);
  const [showDetailModal, setShowDetailModal] = createSignal(false);
  const [localSessionsVersion, setLocalSessionsVersion] = createSignal(0);

  const { userLocation } = useUserLocation() as any;
  const userLatitude = userLocation()?.latitude || 38.7223;
  const userLongitude = userLocation()?.longitude || -9.1393;

  // Get default search profile
  const defaultProfileQuery = useDefaultSearchProfile();
  const profileId = () => defaultProfileQuery.data?.id;

  // Get chat sessions from API - only query when profileId is available
  const chatSessionsQuery = useQuery(() =>
    useGetChatSessionsQuery(profileId()),
  );

  const sessions = () => {
    // Include localSessionsVersion in the reactive dependency to trigger updates
    const versionCheck = localSessionsVersion();
    console.log("📂 Sessions function called, version:", versionCheck);

    const apiSessions = chatSessionsQuery.data || [];

    // Always try to merge API sessions with local sessions
    try {
      const localStorageData = localStorage.getItem("localChatSessions");
      console.log("🔍 Raw localStorage data:", localStorageData);

      const localSessions = JSON.parse(localStorageData || "[]");
      console.log(
        "📂 API sessions:",
        apiSessions.length,
        "Local sessions:",
        localSessions.length,
      );
      console.log("📂 API error status:", chatSessionsQuery.isError);
      console.log("📂 API loading status:", chatSessionsQuery.isLoading);
      console.log("📂 Local sessions data:", localSessions);

      // If API is working, merge with local sessions (but prioritize API)
      if (!chatSessionsQuery.isError && apiSessions.length > 0) {
        // Remove local sessions that might be duplicated in API
        const apiSessionIds = new Set(apiSessions.map((s) => s.id));
        const uniqueLocalSessions = localSessions.filter(
          (s: any) => !apiSessionIds.has(s.id),
        );
        console.log("🔄 Merging API and local sessions");
        console.log(
          "🔄 Unique local sessions after dedup:",
          uniqueLocalSessions,
        );
        return [...apiSessions, ...uniqueLocalSessions];
      }

      // If API fails or has no data, use local sessions
      if (localSessions.length > 0) {
        console.log("📱 Using local sessions as fallback");
        return localSessions;
      }
    } catch (error) {
      console.warn("Failed to load local sessions:", error);
    }

    console.log("📂 Returning API sessions:", apiSessions);
    return apiSessions;
  };

  const profiles = [
    {
      id: "solo",
      name: "Solo Explorer",
      icon: "🎒",
      description: "Independent travel focused",
    },
    {
      id: "foodie",
      name: "Foodie Adventure",
      icon: "🍽️",
      description: "Culinary experiences",
    },
    {
      id: "family",
      name: "Family Fun",
      icon: "👨‍👩‍👧‍👦",
      description: "Family-friendly activities",
    },
    {
      id: "culture",
      name: "Culture Seeker",
      icon: "🎨",
      description: "Museums and arts",
    },
  ];

  const quickPrompts = [
    {
      icon: "🌟",
      text: "Hidden gems in Paris",
      description: "Discover off-the-beaten-path spots",
    },
    {
      icon: "🍕",
      text: "Best food markets in Italy",
      description: "Authentic local markets and food",
    },
    {
      icon: "🏛️",
      text: "3-day cultural tour of Rome",
      description: "Museums, history, and architecture",
    },
    {
      icon: "👨‍👩‍👧‍👦",
      text: "Family weekend in Amsterdam",
      description: "Kid-friendly activities and places",
    },
    {
      icon: "📸",
      text: "Instagram spots in Santorini",
      description: "Most photogenic locations",
    },
    {
      icon: "🎭",
      text: "Nightlife in Berlin",
      description: "Bars, clubs, and entertainment",
    },
  ];

  // Initialize chat
  onMount(() => {
    console.log("🚀 Chat page mounted - starting fresh session");

    // Clear any previous session data to ensure fresh start
    sessionStorage.removeItem('currentStreamingSession');
    sessionStorage.removeItem('completedStreamingSession');
    sessionStorage.removeItem('localChatSessions');
    setSessionId(null);
    setStreamingSession(null);

    // Add welcome message
    setMessages([
      {
        id: "welcome",
        type: "assistant",
        content: `Hello! I'm your AI travel assistant. I'll help you discover amazing places and create personalized itineraries based on your preferences.\n\nCurrently using your "${activeProfile()}" profile. What would you like to explore today?`,
        timestamp: new Date(),
        hasItinerary: false,
      },
    ]);
  });

  const sendMessage = async () => {
    if (!currentMessage().trim() || isLoading()) return;

    const userMessage = {
      id: `msg-${Date.now()}`,
      type: "user",
      content: currentMessage().trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageContent = currentMessage().trim();
    setCurrentMessage("");
    setIsLoading(true);
    setStreamProgress("Analyzing your request...");

    try {
      const currentSessionId = sessionId();

      if (currentSessionId) {
        // Use ContinueChat for follow-up messages to maintain LLM context
        console.log("💬 Continuing existing session:", currentSessionId);
        await continueExistingSession(currentSessionId, messageContent);
      } else {
        // Start new session for first message
        console.log("🆕 Starting fresh chat session for message:", messageContent);
        await startNewSession(messageContent);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setIsLoading(false);
      setStreamProgress("");

      const errorMessage = {
        id: `msg-${Date.now()}-error`,
        type: "error",
        content:
          "Sorry, there was an error processing your request. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  // Function to start a new session (original logic)
  const startNewSession = async (messageContent: string) => {
    // Detect domain from the message
    const domain = detectDomain(messageContent);
    console.log("Detected domain:", domain);

    // Create streaming session
    const session = createStreamingSession(domain);
    session.query = messageContent;
    setStreamingSession(session);

    // Store session in localStorage for persistence
    sessionStorage.setItem("currentStreamingSession", JSON.stringify(session));

    // Get current profile ID
    const currentProfileId = profileId();
    if (!currentProfileId) {
      throw new Error("No default search profile found");
    }

    // Start streaming request
    const response = await sendUnifiedChatMessageStream({
      profileId: currentProfileId,
      message: messageContent,
      contextType: domainToContextType(domain),
      userLocation: {
        userLat: userLatitude,
        userLon: userLongitude,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Set up streaming manager
    streamingService.startStream(response, {
      session,
      onProgress: (updatedSession) => {
        setStreamingSession(updatedSession);

        // Update progress message based on domain and progress
        const domain = updatedSession.domain;
        if ('general_city_data' in updatedSession.data && updatedSession.data.general_city_data) {
          setStreamProgress(
            `Found information about ${updatedSession.data.general_city_data.city}...`,
          );
        } else if (domain === "accommodation") {
          setStreamProgress("Finding hotels...");
        } else if (domain === "dining") {
          setStreamProgress("Searching restaurants...");
        } else if (domain === "activities") {
          setStreamProgress("Discovering activities...");
        } else {
          setStreamProgress("Creating your itinerary...");
        }

        // Update session storage
        sessionStorage.setItem(
          "currentStreamingSession",
          JSON.stringify(updatedSession),
        );
      },
      onComplete: (completedSession) => {
        setStreamingSession(completedSession);
        setIsLoading(false);
        setStreamProgress("");

        // *** CAPTURE SESSION ID FROM NEW SESSION ***
        if (completedSession.sessionId) {
          console.log(
            "✅ Captured session ID from new session:",
            completedSession.sessionId,
          );
          setSessionId(completedSession.sessionId);

          // Store session locally as backup when backend chat history fails
          try {
            console.log("💾 Starting local session save process...");
            console.log("💾 Completed session data:", completedSession);
            console.log("💾 Session ID:", completedSession.sessionId);
            console.log("💾 Session city:", completedSession.city);

            const existingData = localStorage.getItem("localChatSessions");
            console.log("💾 Existing localStorage data:", existingData);

            const localSessions = JSON.parse(existingData || "[]");
            console.log("💾 Parsed existing sessions:", localSessions);

            const sessionSummary = {
              id: completedSession.sessionId,
              title:
                (completedSession.data as any).itinerary_response?.itinerary_name ||
                `Trip to ${completedSession.city}` ||
                "New Conversation",
              preview: `Created an itinerary for ${completedSession.city || "your destination"}`,
              timestamp: new Date().toISOString(),
              messageCount: 2, // Initial user message + response
              hasItinerary: !!(
                (completedSession.data as any).points_of_interest ||
                (completedSession.data as any).itinerary_response
              ),
              cityName: completedSession.city,
              isLocal: true, // Mark as locally stored
            };

            console.log("💾 Created session summary:", sessionSummary);

            // Add to local sessions (keep max 10)
            localSessions.unshift(sessionSummary);
            if (localSessions.length > 10) {
              localSessions.splice(10);
            }

            console.log("💾 Updated local sessions array:", localSessions);

            localStorage.setItem(
              "localChatSessions",
              JSON.stringify(localSessions),
            );
            console.log("💾 Successfully saved session to localStorage");

            // Verify the save worked
            const verifyData = localStorage.getItem("localChatSessions");
            console.log(
              "💾 Verification - localStorage now contains:",
              verifyData,
            );

            // Force trigger a reactivity update by invalidating the query AND updating version
            // This will cause the sessions() function to be re-evaluated
            queryClient.invalidateQueries({
              queryKey: ["chatSessions", profileId()],
            });

            // Also increment version to trigger reactive updates in SolidJS
            setLocalSessionsVersion((prev) => prev + 1);
            console.log(
              "💾 Triggered query invalidation and version bump to refresh chat history",
            );
          } catch (error) {
            console.error("💾 Failed to save session locally:", error);
          }
        }

        // Add assistant message with results
        const assistantMessage = {
          id: `msg-${Date.now()}-response`,
          type: "assistant",
          content: getCompletionMessage(
            completedSession.domain,
            completedSession.city,
          ),
          timestamp: new Date(),
          hasItinerary: true,
          streamingData: completedSession.data,
          showResults: true, // New flag to show expanded results
        };

        setMessages((prev) => [...prev, assistantMessage]);

        // Store completed session
        sessionStorage.setItem(
          "completedStreamingSession",
          JSON.stringify(completedSession),
        );

        // Invalidate chat sessions query to refresh the sidebar
        const currentProfileId = profileId();
        if (currentProfileId) {
          queryClient.invalidateQueries({
            queryKey: ["chatSessions", currentProfileId],
          });
        }
      },
      onError: (error) => {
        console.error("Streaming error:", error);
        setIsLoading(false);
        setStreamProgress("");

        const errorMessage = {
          id: `msg-${Date.now()}-error`,
          type: "error",
          content: `Sorry, there was an error processing your request: ${error}`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      },
      onRedirect: (domain, data) => {
        // This will be called when streaming completes
        console.log("Streaming complete, redirecting to:", domain, data);
      },
    });
  };

  // Function to continue an existing session (maintains LLM context)
  const continueExistingSession = async (existingSessionId: string, messageContent: string) => {
    setStreamProgress("Continuing conversation...");

    const domain = detectDomain(messageContent);
    const currentProfileId = profileId();

    if (!currentProfileId) {
      throw new Error("No default search profile found");
    }

    // Get city name from current streaming session
    const currentCity = streamingSession()?.city ||
      streamingSession()?.data?.general_city_data?.city ||
      "";

    console.log("🔄 ContinueChat request:", {
      sessionId: existingSessionId,
      message: messageContent,
      city: currentCity,
      domain
    });

    try {
      const response = await ContinueChatStream({
        sessionId: existingSessionId,
        message: messageContent,
        cityName: currentCity,
        contextType: domainToContextType(domain),
      });

      if (!response.ok) {
        // Session might be expired or invalid - start a new session
        console.warn("⚠️ ContinueChat failed, session may be expired. Starting new session...");
        setSessionId(null); // Clear invalid session
        await startNewSession(messageContent);
        return;
      }

      // Create a session object for the streaming service
      const session = createStreamingSession(domain);
      session.query = messageContent;
      session.sessionId = existingSessionId;
      session.city = currentCity;
      setStreamingSession(session);

      // Set up streaming manager (same as startNewSession)
      streamingService.startStream(response, {
        session,
        onProgress: (updatedSession) => {
          setStreamingSession(updatedSession);

          // Update progress message based on response content
          if ('general_city_data' in updatedSession.data && updatedSession.data.general_city_data) {
            setStreamProgress(
              `Processing updates for ${updatedSession.data.general_city_data.city}...`,
            );
          } else {
            setStreamProgress("Processing your follow-up request...");
          }

          // Update session storage
          sessionStorage.setItem(
            "currentStreamingSession",
            JSON.stringify(updatedSession),
          );
        },
        onComplete: (completedSession) => {
          setStreamingSession(completedSession);
          setIsLoading(false);
          setStreamProgress("");

          // Keep the existing session ID (don't overwrite with new one)
          console.log("✅ ContinueChat completed, session maintained:", existingSessionId);

          // Add assistant message with results
          const assistantMessage = {
            id: `msg-${Date.now()}-response`,
            type: "assistant",
            content: getCompletionMessage(
              completedSession.domain,
              completedSession.city,
            ),
            timestamp: new Date(),
            hasItinerary: true,
            streamingData: completedSession.data,
            showResults: true,
          };

          setMessages((prev) => [...prev, assistantMessage]);

          // Store completed session
          sessionStorage.setItem(
            "completedStreamingSession",
            JSON.stringify(completedSession),
          );

          // Invalidate chat sessions query to refresh the sidebar
          const currentProfileIdValue = profileId();
          if (currentProfileIdValue) {
            queryClient.invalidateQueries({
              queryKey: ["chatSessions", currentProfileIdValue],
            });
          }
        },
        onError: (error) => {
          console.error("ContinueChat streaming error:", error);

          // Check if this is a session-not-found error
          if (error.includes("not found") || error.includes("expired")) {
            console.log("Session expired, clearing and will start fresh on next message");
            setSessionId(null);
          }

          setIsLoading(false);
          setStreamProgress("");

          const errorMessage = {
            id: `msg-${Date.now()}-error`,
            type: "error",
            content: `Sorry, there was an error: ${error}. Try sending your message again.`,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, errorMessage]);
        },
        onRedirect: (redirectDomain, data) => {
          console.log("ContinueChat redirect:", redirectDomain, data);
        },
      });
    } catch (error: any) {
      console.error("ContinueChat exception:", error);
      // If ContinueChat fails completely, try starting a new session
      console.log("Falling back to new session...");
      setSessionId(null);
      await startNewSession(messageContent);
    }
  };

  const getCompletionMessage = (domain: DomainType, city?: string) => {
    const cityText = city ? `for ${city}` : "";

    switch (domain) {
      case "accommodation":
        return `Great! I've found some excellent hotel options ${cityText}. Click below to view all recommendations and book your stay.`;
      case "dining":
        return `Perfect! I've discovered amazing restaurants ${cityText} that match your preferences. Explore the full list to find your next dining experience.`;
      case "activities":
        return `Wonderful! I've curated exciting activities and attractions ${cityText}. Check out all the options to plan your perfect day.`;
      case "itinerary":
      case "general":
      default:
        return `Excellent! I've created a personalized itinerary ${cityText} based on your preferences. View the complete plan with all the details, maps, and recommendations.`;
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const useQuickPrompt = (prompt: any) => {
    setCurrentMessage(prompt.text);
    sendMessage();
  };

  const toggleResultExpansion = (messageId: string) => {
    setExpandedResults((prev) => {
      const newSet = new Set<string>(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  };

  const handleItemClick = (item: any, type: string) => {
    console.log("Opening modal for item:", item.name, "type:", type);
    setSelectedItem({
      ...item,
      type: type,
    });
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedItem(null);
  };

  const renderStreamingResults = (
    streamingData: any,
    messageId: string,
    compact = false,
  ) => {
    const isExpanded = expandedResults().has(messageId);
    const actualCompact = compact && !isExpanded;

    return (
      <div class="space-y-4">
        <Show when={streamingData.hotels && streamingData.hotels.length > 0}>
          <HotelResults
            hotels={streamingData.hotels}
            compact={actualCompact}
            showToggle={false}
            initialLimit={3}
            limit={actualCompact ? 3 : undefined}
            onItemClick={(hotel: any) => handleItemClick(hotel, "hotel")}
          />
        </Show>
        <Show
          when={
            streamingData.restaurants && streamingData.restaurants.length > 0
          }
        >
          <RestaurantResults
            restaurants={streamingData.restaurants}
            compact={actualCompact}
            showToggle={false}
            initialLimit={3}
            limit={actualCompact ? 3 : undefined}
            onItemClick={(restaurant: any) =>
              handleItemClick(restaurant, "restaurant")
            }
          />
        </Show>
        <Show
          when={streamingData.activities && streamingData.activities.length > 0}
        >
          <ActivityResults
            activities={streamingData.activities}
            compact={actualCompact}
            showToggle={false}
            initialLimit={3}
            limit={actualCompact ? 3 : undefined}
            onItemClick={(activity: any) => handleItemClick(activity, "activity")}
          />
        </Show>
        {(() => {
          const itineraryPOIs =
            streamingData.points_of_interest?.length
              ? streamingData.points_of_interest
              : (streamingData as any).itinerary_response?.points_of_interest || [];
          return (
            <Show when={itineraryPOIs.length > 0}>
              <ItineraryResults
                pois={itineraryPOIs}
                itinerary={(streamingData as any).itinerary_response}
                compact={actualCompact}
                showToggle={false}
                initialLimit={5}
                limit={actualCompact ? 5 : undefined}
                onItemClick={(poi: any) => handleItemClick(poi, "poi")}
              />
            </Show>
          );
        })()}

        {/* Render generated itinerary if strict structure exists */}
        <Show when={(streamingData as any).itinerary_response}>
          <ItineraryResults
            itinerary={(streamingData as any).itinerary_response}
            compact={actualCompact}
            showToggle={false}
            initialLimit={5}
            limit={actualCompact ? 5 : undefined}
            onItemClick={(poi: any) => handleItemClick(poi, "poi")}
          />
        </Show>
        {/* Fallback visualizer for generic points_of_interest if no itinerary response */}
        <Show when={!(streamingData as any).itinerary_response && streamingData.points_of_interest && streamingData.points_of_interest.length > 0 && !streamingData.hotels && !streamingData.restaurants && !streamingData.activities}>
          <ItineraryResults
            pois={streamingData.points_of_interest}
            compact={actualCompact}
            showToggle={false}
            initialLimit={5}
            limit={actualCompact ? 5 : undefined}
            onItemClick={(poi: any) => handleItemClick(poi, "poi")}
          />
        </Show>
      </div>
    );
  };



  const newChat = () => {
    console.log("🔥 Starting new chat - clearing all session data");

    setMessages([
      {
        id: "welcome-new",
        type: "assistant",
        content: `Hello! I'm ready to help you plan your next adventure. What would you like to explore today?`,
        timestamp: new Date(),
        hasItinerary: false,
      },
    ]);
    setSessionId(null); // Clear session ID to start fresh
    setSelectedSession(null);
    setStreamingSession(null); // Clear streaming session
    setStreamProgress("");
    setExpandedResults(new Set<string>()); // Clear expanded results

    // Clear all session storage to prevent cache issues and data bleed between city searches
    sessionStorage.removeItem("currentStreamingSession");
    sessionStorage.removeItem("completedStreamingSession");
    sessionStorage.removeItem("localChatSessions");
    sessionStorage.removeItem("lastKnownSessionId");
    sessionStorage.removeItem("fallbackSessionId");

    console.log("✅ All session data cleared");
  };

  const loadSession = async (session: any) => {
    console.log("📂 Loading chat session:", session);

    // Clear current session state first
    setSelectedSession(session);
    setMessages([]); // Clear existing messages
    setCurrentMessage("");
    setExpandedResults(new Set<string>());

    // Clear old session storage
    sessionStorage.removeItem("currentStreamingSession");
    sessionStorage.removeItem("completedStreamingSession");

    setIsLoading(true);
    setStreamProgress("Loading conversation history...");

    try {
      // Try to get detailed session data
      // First, try to find the session in our existing sessions list
      const allSessions = sessions();
      const fullSession = allSessions.find((s: any) => s.id === session.id);

      let sessionData;
      if (fullSession && fullSession.conversationHistory) {
        console.log("📖 Using cached session data:", fullSession);
        sessionData = {
          ...fullSession,
          conversation_history: fullSession.conversationHistory,
        };
      } else if (session.isLocal) {
        // Handle local sessions (no API data available)
        console.log("📱 Loading local session:", session);
        sessionData = {
          ...session,
          conversation_history: [], // Local sessions don't have full conversation history
        };
      } else {
        // Fallback: try to load from API (this endpoint might not exist)
        try {
          const response = await fetch(
            `${API_BASE_URL}/llm/prompt-response/chat/sessions/details/${session.id}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("access_token") || sessionStorage.getItem("access_token") || ""}`,
              },
            },
          );

          if (response.ok) {
            sessionData = await response.json();
            console.log("📖 Loaded session data from API:", sessionData);
          } else {
            throw new Error(`API responded with ${response.status}`);
          }
        } catch (apiError) {
          console.log(
            "⚠️ API load failed, using basic session data:",
            apiError,
          );
          // Use the basic session info we have
          sessionData = {
            ...session,
            conversation_history: [], // We'll create a placeholder conversation
          };
        }
      }

      // Convert conversation history to our message format
      let conversationMessages = [];

      if (
        sessionData.conversation_history &&
        sessionData.conversation_history.length > 0
      ) {
        conversationMessages = sessionData.conversation_history.map(
          (msg: any, index: any) => ({
            id: `session-${session.id}-msg-${index}`,
            type: msg.role === "user" ? "user" : "assistant",
            content: msg.content || msg.message || "No content available",
            timestamp: new Date(
              msg.timestamp ||
              msg.created_at ||
              sessionData.updated_at ||
              sessionData.timestamp,
            ),
            hasItinerary:
              msg.role === "assistant" && (msg.data || msg.streaming_data)
                ? true
                : false,
            streamingData: msg.data || msg.streaming_data || null,
            showResults:
              msg.role === "assistant" && (msg.data || msg.streaming_data)
                ? true
                : false,
          }),
        );
      } else {
        // Create placeholder messages if no conversation history
        console.log("📝 No conversation history found, creating placeholder");
        conversationMessages = [
          {
            id: `session-${session.id}-placeholder-user`,
            type: "user",
            content: session.preview || "Previous conversation",
            timestamp: new Date(session.timestamp),
            hasItinerary: false,
            streamingData: null,
            showResults: false,
          },
          {
            id: `session-${session.id}-placeholder-assistant`,
            type: "assistant",
            content: `I helped you with ${session.title.toLowerCase()}${session.cityName ? ` in ${session.cityName}` : ""}.`,
            timestamp: new Date(session.timestamp),
            hasItinerary: session.hasItinerary || false,
            streamingData: null,
            showResults: false,
          },
        ];
      }

      // Set the session ID and restore session state
      setSessionId(session.id);

      // If there's session data from the last assistant message, restore it
      const lastAssistantMessage = sessionData.conversation_history
        ?.filter((msg: any) => msg.role === "assistant" && msg.data)
        ?.pop();

      if (lastAssistantMessage?.data) {
        console.log(
          "🔄 Restoring session streaming data:",
          lastAssistantMessage.data,
        );
        const streamingSessionData = {
          sessionId: session.id,
          domain: lastAssistantMessage.data.domain || "general",
          city:
            session.cityName ||
            lastAssistantMessage.data.general_city_data?.city,
          query: "", // Will be set on next message
          data: lastAssistantMessage.data,
        };

        setStreamingSession(streamingSessionData);

        // Update session storage
        sessionStorage.setItem(
          "completedStreamingSession",
          JSON.stringify(streamingSessionData),
        );
      }

      // Load all conversation messages
      setMessages([
        ...conversationMessages,
        {
          id: "session-loaded",
          type: "assistant",
          content: `Welcome back! I've loaded our previous conversation${session.cityName ? ` about your trip to ${session.cityName}` : ""} with ${conversationMessages.length} messages. How can I help you continue planning?`,
          timestamp: new Date(),
          hasItinerary: false,
        },
      ]);

      console.log("✅ Session loaded successfully");
    } catch (error) {
      console.error("❌ Error loading session:", error);

      // Fallback to basic session info
      const contextMessage = session.cityName
        ? `I found your previous conversation about ${session.cityName}, but couldn't load the full history. Let's continue from here!`
        : `I found your previous conversation, but couldn't load the full history. Let's continue from here!`;

      setMessages([
        {
          id: "session-error",
          type: "assistant",
          content: contextMessage,
          timestamp: new Date(),
          hasItinerary: session.hasItinerary || false,
        },
      ]);

      // Still set the session ID so we can continue the conversation
      setSessionId(session.id);
    } finally {
      setIsLoading(false);
      setStreamProgress("");
    }
  };

  const formatTimestamp = (timestamp: any) => {
    return new Date(timestamp).toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Helper function to format message content for display
  const formatMessageContent = (content: string) => {
    // Handle prefixed responses like [city_data], [itinerary], etc.
    let cleanedContent = content.trim();

    // Remove common LLM response prefixes
    const prefixPatterns = [
      /^\[city_data\]\s*/i,
      /^\[itinerary\]\s*/i,
      /^\[restaurants\]\s*/i,
      /^\[hotels\]\s*/i,
      /^\[activities\]\s*/i,
      /^\[pois\]\s*/i,
      /^\[general_pois\]\s*/i,
      /^\[personalized_pois\]\s*/i,
    ];

    for (const pattern of prefixPatterns) {
      cleanedContent = cleanedContent.replace(pattern, "");
    }

    // Remove markdown code blocks if present
    cleanedContent = cleanedContent.replace(/```json\s*(.*?)\s*```/s, "$1");
    cleanedContent = cleanedContent.trim();

    // Check if cleaned content looks like JSON (starts with { or [)
    if (cleanedContent.startsWith("{") || cleanedContent.startsWith("[")) {
      try {
        const parsed = JSON.parse(cleanedContent);

        // Handle different JSON response types
        if (parsed.city && parsed.country) {
          const details = [];
          if (parsed.description) details.push(parsed.description);
          if (parsed.population)
            details.push(`Population: ${parsed.population}`);
          if (parsed.weather) details.push(`Weather: ${parsed.weather}`);

          let result = `Let me tell you about ${parsed.city}, ${parsed.country}!`;
          if (details.length > 0) {
            result += ` ${details.join(". ")}.`;
          }
          return result;
        }

        if (Array.isArray(parsed) && parsed.length > 0) {
          const firstItem = parsed[0];
          if (firstItem.name && firstItem.category) {
            const type = firstItem.cuisine_type
              ? "restaurants"
              : firstItem.poi_type
                ? "attractions"
                : "places";
            return `I found ${parsed.length} great ${type} for you! Including ${firstItem.name} and ${parsed.length - 1} more options.`;
          }
        }

        if (
          parsed.points_of_interest &&
          Array.isArray(parsed.points_of_interest)
        ) {
          const count = parsed.points_of_interest.length;
          const first =
            parsed.points_of_interest[0]?.name || "some amazing places";
          return `I created a personalized itinerary with ${count} places to visit, including ${first} and more!`;
        }

        // Check for general city data structure
        if (parsed.general_city_data) {
          const cityData = parsed.general_city_data;
          return `I found information about ${cityData.city}, ${cityData.country}. ${cityData.description || "Let me share the details with you!"}`;
        }

        // Generic fallback for other JSON
        return "I've prepared some personalized recommendations for you! Check out the details below.";
      } catch {
        // If JSON parsing fails, check if we can extract some meaning
        const lowerContent = cleanedContent.toLowerCase();

        if (lowerContent.includes("city") || lowerContent.includes("country")) {
          return "I found information about your destination. Let me share the details with you!";
        }

        if (
          lowerContent.includes("hotel") ||
          lowerContent.includes("accommodation")
        ) {
          return "I found some excellent hotel options for you!";
        }

        if (
          lowerContent.includes("restaurant") ||
          lowerContent.includes("dining")
        ) {
          return "I discovered some amazing restaurants for you!";
        }

        if (
          lowerContent.includes("itinerary") ||
          lowerContent.includes("plan")
        ) {
          return "I created a personalized travel plan for you!";
        }

        // Return original content if we can't parse it
        return content;
      }
    }

    // Return original content if it's not JSON
    return content;
  };

  const renderMessage = (message: any) => (
    <div
      class={`flex gap-2 sm:gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
    >
      {message.type === "assistant" && (
        <div class="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
          <Bot class="w-3 h-3 sm:w-4 sm:h-4 text-white" />
        </div>
      )}

      <div
        class={`max-w-[85%] sm:max-w-[70%] ${message.type === "user" ? "order-1" : ""}`}
      >
        <div
          class={`rounded-2xl px-3 py-2 sm:px-4 sm:py-3 shadow-sm ${message.type === "user"
            ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-blue-500/20"
            : message.type === "error"
              ? "bg-red-50/80 dark:bg-red-900/30 text-red-800 dark:text-red-200 border border-red-200/50 dark:border-red-800/50 backdrop-blur-sm"
              : "bg-white/80 dark:bg-slate-800/80 text-gray-800 dark:text-gray-200 backdrop-blur-sm border border-gray-200/50 dark:border-white/10"
            }`}
        >
          <div class="text-sm whitespace-pre-wrap">
            <TypingAnimation text={formatMessageContent(message.content)} />
          </div>
        </div>

        {/* Streaming data preview */}
        <Show when={message.streamingData}>
          <div class="mt-2 sm:mt-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 rounded-xl p-3 sm:p-4 shadow-lg shadow-gray-500/5 dark:shadow-black/20">
            {/* Header section */}
            <Show when={message.streamingData.general_city_data}>
              <div class="flex items-center justify-between mb-2 sm:mb-3">
                <div class="min-w-0 flex-1 pr-2">
                  <h4 class="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">
                    {(() => {
                      const rawName =
                        message.streamingData.itinerary_response?.itinerary_name;
                      if (!rawName)
                        return `${message.streamingData.general_city_data.city} Guide`;

                      // Handle case where itinerary_name might be a JSON string or object
                      if (typeof rawName === "string" && rawName.startsWith("{")) {
                        try {
                          const parsed = JSON.parse(rawName);
                          return (
                            parsed.itinerary_name ||
                            parsed.name ||
                            `${message.streamingData.general_city_data.city} Guide`
                          );
                        } catch (e) {
                          console.warn(
                            "Failed to parse itinerary name JSON in chat:",
                            e,
                          );
                          return `${message.streamingData.general_city_data.city} Guide`;
                        }
                      } else if (
                        typeof rawName === "object" &&
                        rawName?.itinerary_name
                      ) {
                        return rawName.itinerary_name;
                      }

                      return (
                        rawName ||
                        `${message.streamingData.general_city_data.city} Guide`
                      );
                    })()}
                  </h4>
                  <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-300 truncate">
                    {message.streamingData.general_city_data.city},{" "}
                    {message.streamingData.general_city_data.country}
                  </p>
                </div>
                <div class="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                  <button
                    class="p-1.5 sm:p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                    title="Save"
                  >
                    <Heart class="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                  <button
                    class="p-1.5 sm:p-2 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg"
                    title="Share"
                  >
                    <Share2 class="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            </Show>

            {/* Compact results preview */}
            {renderStreamingResults(message.streamingData, message.id, true)}

            {/* Expand/Collapse button */}
            <Show when={message.showResults}>
              <button
                class="w-full mt-2 sm:mt-3 flex items-center justify-center gap-1 sm:gap-2 py-2 text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700 transition-colors"
                onClick={() => toggleResultExpansion(message.id)}
              >
                <span>
                  {expandedResults().has(message.id)
                    ? "Show Less"
                    : "Show All Details"}
                </span>
                {expandedResults().has(message.id) ? (
                  <ChevronUp class="w-3 h-3 sm:w-4 sm:h-4" />
                ) : (
                  <ChevronDown class="w-3 h-3 sm:w-4 sm:h-4" />
                )}
              </button>
            </Show>
          </div>
        </Show>

        <p
          class={`text-xs mt-1 sm:mt-2 ${message.type === "user" ? "text-blue-100 text-right" : "text-gray-500 dark:text-gray-400"}`}
        >
          {formatTimestamp(message.timestamp)}
        </p>
      </div>

      {message.type === "user" && (
        <div class="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
          <User class="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-300" />
        </div>
      )}
    </div>
  );

  return (
    <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col lg:flex-row relative overflow-hidden">
      {/* Background decorative effects */}
      <div class="absolute inset-0 domain-grid pointer-events-none opacity-40" />
      <div class="absolute inset-0 domain-veil pointer-events-none" />
      <div class="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div class="absolute bottom-0 left-0 w-80 h-80 bg-purple-400/10 dark:bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Sidebar - Chat History - Mobile First */}
      <div class="w-full lg:w-80 glass-panel lg:rounded-none lg:rounded-r-2xl flex flex-col order-2 lg:order-1 relative z-10">
        {/* Sidebar Header - Mobile First */}
        <div class="p-3 sm:p-4 border-b border-gray-200/50 dark:border-white/10">
          <div class="flex items-center justify-between mb-3 sm:mb-4">
            <h2 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              AI Assistant
            </h2>
            <button
              onClick={newChat}
              class="cb-button cb-button-primary p-2 text-sm"
              title="New chat"
            >
              <Plus class="w-4 h-4" />
            </button>
          </div>

          {/* Profile Selector - Mobile First */}
          <div class="relative">
            <button
              onClick={() => setShowProfileSelector(!showProfileSelector())}
              class="w-full flex items-center gap-2 p-2 sm:p-3 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-lg hover:bg-white/70 dark:hover:bg-slate-700/70 transition-all border border-gray-200/50 dark:border-white/10"
            >
              <div class="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs sm:text-sm">
                🎒
              </div>
              <div class="flex-1 text-left min-w-0">
                <p class="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">
                  {activeProfile()}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                  Active profile
                </p>
              </div>
            </button>

            <Show when={showProfileSelector()}>
              <div class="absolute top-full left-0 right-0 mt-2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 rounded-xl shadow-xl shadow-gray-500/10 dark:shadow-black/30 z-10 max-h-60 overflow-y-auto">
                <For each={profiles}>
                  {(profile) => (
                    <button
                      onClick={() => {
                        setActiveProfile(profile.name);
                        setShowProfileSelector(false);
                      }}
                      class={`w-full flex items-center gap-2 sm:gap-3 p-2 sm:p-3 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700 transition-colors first:rounded-t-lg last:rounded-b-lg ${activeProfile() === profile.name
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300"
                        }`}
                    >
                      <span class="text-base sm:text-lg">{profile.icon}</span>
                      <div class="flex-1 text-left min-w-0">
                        <p class="text-xs sm:text-sm font-medium truncate">
                          {profile.name}
                        </p>
                        <p class="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                          {profile.description}
                        </p>
                      </div>
                    </button>
                  )}
                </For>
              </div>
            </Show>
          </div>
        </div>

        {/* Chat Sessions - Mobile First */}
        <div class="flex-1 overflow-y-auto">
          <div class="p-3 sm:p-4">
            <h3 class="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
              Recent Conversations
            </h3>

            <Show when={chatSessionsQuery.isLoading}>
              <div class="flex items-center justify-center py-8">
                <Loader2 class="w-5 h-5 animate-spin text-gray-400" />
              </div>
            </Show>

            <Show when={chatSessionsQuery.isError}>
              <div class="text-center py-4 px-3">
                <div class="w-12 h-12 mx-auto mb-3 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                  <MessageCircle class="w-6 h-6 text-red-500 dark:text-red-400" />
                </div>
                <p class="text-xs text-red-600 dark:text-red-400 font-medium mb-1">
                  Chat History Unavailable
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-3 leading-relaxed">
                  There's a temporary issue loading your chat history. You can
                  still start new conversations.
                </p>
                <button
                  onClick={() => chatSessionsQuery.refetch()}
                  class="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Try again
                </button>
              </div>
            </Show>

            <Show
              when={!chatSessionsQuery.isLoading && !chatSessionsQuery.isError}
            >
              <div class="space-y-1 sm:space-y-2">
                <Show when={sessions().length === 0}>
                  <div class="text-center py-8 px-4">
                    <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center">
                      <MessageCircle class="w-8 h-8 text-blue-500 dark:text-blue-400" />
                    </div>
                    <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      No chat history yet
                    </h3>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
                      Start a conversation to explore destinations, get
                      recommendations, and create personalized itineraries.
                    </p>
                    <div class="space-y-2">
                      <div class="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                        <div class="w-2 h-2 bg-green-500 rounded-full" />
                        <span>Ask about any destination</span>
                      </div>
                      <div class="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                        <div class="w-2 h-2 bg-blue-500 rounded-full" />
                        <span>Get personalized recommendations</span>
                      </div>
                      <div class="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                        <div class="w-2 h-2 bg-purple-500 rounded-full" />
                        <span>Create custom itineraries</span>
                      </div>
                    </div>
                  </div>
                </Show>

                <For each={sessions()}>
                  {(session) => (
                    <button
                      onClick={() => loadSession(session)}
                      disabled={isLoading()}
                      class={`w-full text-left p-2 sm:p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${(selectedSession() as any)?.id === session.id
                        ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700"
                        : "border border-transparent"
                        }`}
                    >
                      <div class="flex items-start justify-between mb-1">
                        <div class="flex-1 min-w-0">
                          <div class="flex items-center gap-1">
                            <h4 class="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">
                              {session.title}
                            </h4>
                            {session.isLocal && (
                              <span
                                class="text-xs bg-amber-100 text-amber-700 px-1 py-0.5 rounded"
                                title="Stored locally (backend unavailable)"
                              >
                                📱
                              </span>
                            )}
                          </div>
                          <Show when={session.cityName}>
                            <div class="flex items-center gap-1 mt-0.5">
                              <MapPin class="w-3 h-3 text-gray-400 flex-shrink-0" />
                              <span class="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {session.cityName}
                              </span>
                            </div>
                          </Show>
                          {/* Content metrics summary */}
                          <Show when={session.contentMetrics}>
                            <div class="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                              <Show
                                when={session.contentMetrics!.total_pois > 0}
                              >
                                <span class="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-1 py-0.5 rounded text-xs">
                                  {session.contentMetrics!.total_pois} POIs
                                </span>
                              </Show>
                              <Show
                                when={session.contentMetrics!.total_hotels > 0}
                              >
                                <span class="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-1 py-0.5 rounded text-xs">
                                  {session.contentMetrics!.total_hotels} Hotels
                                </span>
                              </Show>
                              <Show
                                when={
                                  session.contentMetrics!.total_restaurants > 0
                                }
                              >
                                <span class="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-1 py-0.5 rounded text-xs">
                                  {session.contentMetrics!.total_restaurants}{" "}
                                  Restaurants
                                </span>
                              </Show>
                            </div>
                          </Show>
                        </div>
                        <div class="flex items-center gap-1 flex-shrink-0 ml-1">
                          <Show when={session.hasItinerary}>
                            <Sparkles class="w-3 h-3 text-purple-500 dark:text-purple-400" />
                          </Show>
                          {/* Engagement level indicator */}
                          <Show when={session.engagementMetrics}>
                            <div
                              class={`w-2 h-2 rounded-full ${session.engagementMetrics!.engagement_level ===
                                "high"
                                ? "bg-green-500"
                                : session.engagementMetrics!
                                  .engagement_level === "medium"
                                  ? "bg-yellow-500"
                                  : "bg-gray-400"
                                }`}
                              title={`${session.engagementMetrics!.engagement_level} engagement`}
                            />
                          </Show>
                          {/* Complexity score indicator */}
                          <Show
                            when={
                              session.contentMetrics &&
                              session.contentMetrics.complexity_score >= 7
                            }
                          >
                            <div
                              class="w-1.5 h-1.5 bg-blue-500 rounded-full"
                              title="Complex session"
                            />
                          </Show>
                        </div>
                      </div>
                      <p class="text-xs text-gray-600 dark:text-gray-300 truncate mb-1 sm:mb-2 leading-relaxed">
                        {session.preview}
                      </p>
                      <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span class="text-xs">
                          {formatTimestamp(session.timestamp)}
                        </span>
                        <div class="flex items-center gap-2">
                          {/* Performance indicator */}
                          <Show
                            when={
                              session.performanceMetrics &&
                              session.performanceMetrics.avg_response_time_ms >
                              0
                            }
                          >
                            <span
                              class="text-xs hidden sm:inline"
                              title={`Avg response: ${session.performanceMetrics!.avg_response_time_ms}ms`}
                            >
                              ⚡{" "}
                              {Math.round(
                                session.performanceMetrics!
                                  .avg_response_time_ms / 1000,
                              )}
                              s
                            </span>
                          </Show>
                          <span class="text-xs hidden sm:inline">
                            {session.messageCount} messages
                          </span>
                          <span class="text-xs sm:hidden">
                            {session.messageCount}m
                          </span>
                          <Show when={session.hasItinerary}>
                            <span class="text-xs text-purple-600 dark:text-purple-400 hidden sm:inline">
                              • Itinerary
                            </span>
                          </Show>
                        </div>
                      </div>
                    </button>
                  )}
                </For>
              </div>
            </Show>
          </div>
        </div>
      </div>

      {/* Main Chat Area - Mobile First */}
      <div class="flex-1 flex flex-col order-1 lg:order-2 relative z-10">
        {/* Chat Header - Mobile First */}
        <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-white/10 p-3 sm:p-4 shadow-sm">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <div class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot class="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div class="min-w-0 flex-1">
                <h1 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
                  AI Travel Assistant
                </h1>
                <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-300 hidden sm:block">
                  Get personalized travel recommendations
                </p>
              </div>
            </div>

            <div class="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <span class="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">
                Using:
              </span>
              <span class="text-xs font-medium text-blue-600 dark:text-blue-400 truncate max-w-20 sm:max-w-none">
                {activeProfile()}
              </span>
              {/* Session indicator and controls */}
              <Show when={sessionId()}>
                <div class="flex items-center gap-1 text-xs">
                  <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span class="text-green-600 dark:text-green-400 font-medium hidden sm:inline">
                    Connected
                  </span>
                  <button
                    onClick={newChat}
                    class="ml-1 px-2 py-1 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded border border-red-200 dark:border-red-700"
                    title="Clear session and start fresh"
                  >
                    Clear
                  </button>
                </div>
              </Show>
            </div>
          </div>
        </div>

        {/* Messages - Mobile First */}
        <div class="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-white/30 dark:bg-slate-900/30 backdrop-blur-sm">
          <For each={messages()}>{(message) => renderMessage(message)}</For>

          {/* Loading indicator with streaming progress - Mobile First */}
          <Show when={isLoading()}>
            <div class="flex gap-2 sm:gap-3 justify-start">
              <div class="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <Bot class="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <div class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-white/10 rounded-2xl px-3 py-2 sm:px-4 sm:py-3 max-w-xs sm:max-w-md shadow-sm">
                <div class="flex items-center gap-1 sm:gap-2 text-gray-600 dark:text-gray-300 mb-2">
                  <Loader2 class="w-3 h-3 sm:w-4 sm:h-4 animate-spin flex-shrink-0" />
                  <span class="text-xs sm:text-sm">
                    {streamProgress() || "Processing your request..."}
                  </span>
                </div>

                {/* Streaming session progress - Mobile First */}
                <Show when={streamingSession()}>
                  <div class="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                    <div class="flex items-center gap-1 sm:gap-2">
                      <span class="inline-block w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                      <span class="truncate">
                        Domain: {streamingSession()?.domain}
                      </span>
                    </div>
                    <Show when={streamingSession()?.city}>
                      <div class="flex items-center gap-1 sm:gap-2">
                        <MapPin class="w-3 h-3 flex-shrink-0" />
                        <span class="truncate">
                          City: {streamingSession()?.city}
                        </span>
                      </div>
                    </Show>
                    <Show when={streamingSession()?.sessionId}>
                      <div class="flex items-center gap-1 sm:gap-2">
                        <span class="inline-block w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                        <span class="truncate">Session: Active</span>
                      </div>
                    </Show>
                  </div>
                </Show>
              </div>
            </div>
          </Show>

          {/* Quick Prompts - Mobile First */}
          <Show when={messages().length <= 1 && !isLoading()}>
            <div class="max-w-4xl mx-auto">
              <h3 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                Try asking about:
              </h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <For each={quickPrompts}>
                  {(prompt) => (
                    <button
                      onClick={() => useQuickPrompt(prompt)}
                      class="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-gray-200/50 dark:border-white/10 rounded-xl hover:bg-white/90 dark:hover:bg-slate-700/90 hover:shadow-lg hover:shadow-blue-500/10 hover:border-blue-300/50 dark:hover:border-blue-500/30 transition-all duration-300 p-3 sm:p-4 text-left group"
                    >
                      <div class="flex items-start gap-2 sm:gap-3">
                        <span class="text-xl sm:text-2xl flex-shrink-0">
                          {prompt.icon}
                        </span>
                        <div class="min-w-0 flex-1">
                          <h4 class="font-medium text-gray-900 dark:text-white mb-1 text-sm sm:text-base">
                            {prompt.text}
                          </h4>
                          <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                            {prompt.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  )}
                </For>
              </div>
            </div>
          </Show>
        </div>

        {/* Message Input - Mobile First */}
        <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-gray-200/50 dark:border-white/10 p-3 sm:p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div class="max-w-4xl mx-auto">
            <div class="flex items-end gap-2 sm:gap-3">
              <div class="flex-1">
                <textarea
                  value={currentMessage()}
                  onInput={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about destinations, activities, or let me create an itinerary for you..."
                  class="w-full resize-none border border-gray-200/50 dark:border-white/10 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm text-gray-900 dark:text-white rounded-xl px-3 py-2 sm:px-4 sm:py-3 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 placeholder-gray-500 dark:placeholder-gray-400 text-sm sm:text-base transition-all"
                  rows="2"
                  disabled={isLoading()}
                />
              </div>
              <button
                onClick={sendMessage}
                disabled={!currentMessage().trim() || isLoading()}
                class="cb-button cb-button-primary px-3 py-2 sm:px-4 sm:py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
              >
                <Send class="w-4 h-4" />
                <span class="hidden sm:inline">Send</span>
              </button>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Item Modal */}
      <DetailedItemModal
        item={selectedItem()}
        isOpen={showDetailModal()}
        onClose={closeDetailModal}
      />
    </div>
  );
}
