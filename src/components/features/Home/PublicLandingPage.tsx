import { Component, createSignal, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { Send, Loader2 } from "lucide-solid";
import CTA from "~/components/features/Home/CTA";
import ContentGrid from "~/components/features/Home/ContentGrid";
import RealTimeStats from "~/components/features/Home/RealTimeStats";
import MobileAppAnnouncement from "~/components/features/Home/MobileAppAnnouncement";
import LocationPermissionPrompt from "~/components/LocationPermissionPrompt";
import { useUserLocation } from "~/contexts/LocationContext";
import { sendUnifiedChatMessageStreamFree, detectDomain } from "~/lib/api/llm";
import {
  streamingService,
  createStreamingSession,
  getDomainRoute,
} from "~/lib/streaming-service";

const statsData = {
  badgeText: "This month on Loci",
  items: [
    { value: "69,420", label: "Users registered" },
    { value: "12,109", label: "Personalized Itineraries Saved" },
    { value: "41,004", label: "Unique Points of Interest" },
  ],
};

const contentData = [
  {
    logo: <span class="text-5xl">🗺️</span>,
    title: "New in Paris: Hidden Gems",
    description:
      "Our AI has uncovered 15 new unique spots in Le Marais, from artisan shops to quiet courtyards.",
    tag: "New Itinerary",
    tagColorClass: "bg-blue-100 text-blue-800",
    imageUrl: "",
  },
  {
    logo: <span class="text-5xl">🤖</span>,
    title: "AI-Curated: A Foodie's Weekend in Lisbon",
    description:
      "From classic Pastéis de Nata to modern seafood, let our AI guide your taste buds through Lisbon's best.",
    tag: "AI-Powered",
    tagColorClass: "bg-purple-100 text-purple-800",
    imageUrl: "",
  },
  {
    logo: <span class="text-5xl">⭐️</span>,
    title: "User Favorite: The Ancient Rome Route",
    description:
      "Explore the Colosseum, Forum, and Palatine Hill with a personalized route optimized for a 4-hour window.",
    tag: "Top Rated",
    tagColorClass: "bg-amber-100 text-amber-800",
    imageUrl: "",
  },
];

export default function PublicLandingPage() {
  const navigate = useNavigate();
  const [currentMessage, setCurrentMessage] = createSignal("");
  const [isLoading, setIsLoading] = createSignal(false);
  const { userLocation } = useUserLocation();

  const handleGetStarted = () => {
    navigate("/auth/signin");
  };

  const handleSearchClick = async () => {
    const message = currentMessage().trim();
    if (!message || isLoading()) return;

    setIsLoading(true);

    try {
      // Detect domain from the message
      const domain = detectDomain(message);
      console.log("Detected domain:", domain);

      // Create streaming session with detected domain
      const session = createStreamingSession(domain);
      session.query = message;

      // Store session in sessionStorage for consistency with LoggedInDashboard
      sessionStorage.setItem(
        "currentStreamingSession",
        JSON.stringify(session),
      );

      // Start free streaming request
      const response = await sendUnifiedChatMessageStreamFree({
        profileId: "free",
        message: message,
        userLocation: userLocation()
          ? {
              userLat: userLocation()!.latitude,
              userLon: userLocation()!.longitude,
            }
          : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Set up streaming manager
      streamingService.startStream(response, {
        session,
        onProgress: (updatedSession) => {
          sessionStorage.setItem(
            "currentStreamingSession",
            JSON.stringify(updatedSession),
          );
        },
        onComplete: (completedSession) => {
          setIsLoading(false);
          sessionStorage.setItem(
            "completedStreamingSession",
            JSON.stringify(completedSession),
          );
          const route = getDomainRoute(
            completedSession.domain,
            completedSession.sessionId,
            completedSession.city,
          );
          if (route) {
            navigate(route, {
              state: {
                streamingData: completedSession.data,
                sessionId: completedSession.sessionId,
                originalMessage: message,
              },
            });
          }
        },
        onError: (error) => {
          console.error("Free streaming error:", error);
          setIsLoading(false);
        },
      });
    } catch (error) {
      console.error("Error starting free chat:", error);
      setIsLoading(false);
      handleGetStarted();
    }
  };

  return (
    <div class="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Background gradient effects */}
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-transparent pointer-events-none"></div>

      <div class="relative">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <div class="space-y-8">
            <div class="space-y-4">
              <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                Discover Your Perfect
                <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
                  City Adventure
                </span>
              </h1>
              <p class="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                AI-powered recommendations that learn your preferences and adapt
                to your time, location, and interests.
              </p>
            </div>

            {/* Main search interface */}
            <div class="max-w-2xl mx-auto mb-8">
              <div class="flex items-end gap-3 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
                <div class="flex-1">
                  <textarea
                    value={currentMessage()}
                    onInput={(e) => setCurrentMessage(e.target.value)}
                    placeholder="What would you like to discover? Try 'Hidden gems in Paris' or 'Best food markets in Italy'"
                    class="w-full h-12 px-0 py-0 border-none resize-none focus:outline-none focus:ring-0 dark:bg-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    rows="1"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSearchClick();
                      }
                    }}
                  />
                </div>
                <button
                  onClick={handleSearchClick}
                  disabled={isLoading() || !currentMessage().trim()}
                  class="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors flex items-center gap-2"
                >
                  <Show when={isLoading()} fallback={<Send class="w-4 h-4" />}>
                    <Loader2 class="w-4 h-4 animate-spin" />
                  </Show>
                  <span class="hidden sm:inline">
                    <Show when={isLoading()} fallback="Try Free">
                      Discovering...
                    </Show>
                  </span>
                </button>
              </div>
            </div>

            {/* Loading State */}
            <Show when={isLoading()}>
              <div class="max-w-4xl mx-auto mt-8 mb-12">
                <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
                  <div class="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                    <Loader2 class="w-5 h-5 animate-spin" />
                    <span>
                      AI is analyzing your request and preparing your
                      personalized recommendations...
                    </span>
                  </div>
                </div>
              </div>
            </Show>

            {/* Quick suggestion buttons */}
            <Show when={!isLoading()}>
              <div class="max-w-4xl mx-auto mt-12">
                <p class="text-gray-600 dark:text-gray-400 mb-6 font-medium">
                  Try these popular searches for free:
                </p>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button
                    onClick={() => {
                      setCurrentMessage("Hidden gems in Paris");
                      handleSearchClick();
                    }}
                    disabled={isLoading()}
                    class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all group text-left disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div class="flex items-start gap-3">
                      <span class="text-2xl">🌟</span>
                      <div>
                        <h4 class="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          Hidden gems in Paris
                        </h4>
                        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Try free AI recommendations
                        </p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentMessage("Best food markets in Italy");
                      handleSearchClick();
                    }}
                    disabled={isLoading()}
                    class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all group text-left disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div class="flex items-start gap-3">
                      <span class="text-2xl">🍕</span>
                      <div>
                        <h4 class="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          Best food markets in Italy
                        </h4>
                        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Try free AI recommendations
                        </p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentMessage("3-day cultural tour of Rome");
                      handleSearchClick();
                    }}
                    disabled={isLoading()}
                    class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all group text-left disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div class="flex items-start gap-3">
                      <span class="text-2xl">🏛️</span>
                      <div>
                        <h4 class="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          3-day cultural tour of Rome
                        </h4>
                        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Try free AI recommendations
                        </p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentMessage("Weekend nightlife in Barcelona");
                      handleSearchClick();
                    }}
                    disabled={isLoading()}
                    class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all group text-left disabled:opacity  disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div class="flex items-start gap-3">
                      <span class="text-2xl">🌃</span>
                      <div>
                        <h4 class="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          Weekend nightlife in Barcelona
                        </h4>
                        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Try free AI recommendations
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </Show>
          </div>
        </div>
      </div>

      <RealTimeStats badgeText={statsData.badgeText} />
      <ContentGrid items={contentData} />
      <MobileAppAnnouncement />
      <CTA />

      {/* Location Permission Prompt */}
      <LocationPermissionPrompt
        onPermissionGranted={() => {
          console.log("Location permission granted");
        }}
        onPermissionDenied={() => {
          console.log("Location permission denied");
        }}
      />
    </div>
  );
}
