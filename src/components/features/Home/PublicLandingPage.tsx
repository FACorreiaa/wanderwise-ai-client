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

export default function PublicLandingPage(): JSX.Element {
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
    <div class="min-h-screen relative overflow-hidden pb-16">
      <div class="relative">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <div class="space-y-10">
            <div class="space-y-4">
              <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white leading-tight tracking-tight">
                Discover Your Perfect
                <span class="text-sky-700 dark:text-sky-300 block">
                  City Adventure
                </span>
              </h1>
              <p class="max-w-2xl mx-auto text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                AI-powered recommendations that learn your preferences and adapt
                to your time, location, and interests.
              </p>
            </div>

            {/* Main search interface */}
            <div class="max-w-2xl mx-auto mb-10">
              <div class="flex items-end gap-3 glass-panel gradient-border rounded-3xl p-4 sm:p-5">
                <div class="flex-1">
                  <textarea
                    value={currentMessage()}
                    onInput={(e) => setCurrentMessage(e.target.value)}
                    placeholder="What would you like to discover? Try 'Hidden gems in Paris' or 'Best food markets in Italy'"
                    class="w-full h-12 px-0 py-0 border-none resize-none focus:outline-none focus:ring-0 bg-transparent text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
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
                  class="px-6 py-3 bg-[#0c7df2] hover:bg-[#0a6ed6] disabled:bg-slate-400/70 disabled:cursor-not-allowed text-white rounded-2xl font-semibold transition-all flex items-center gap-2 shadow-[0_14px_32px_rgba(12,125,242,0.22)]"
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
                <div class="glass-panel gradient-border rounded-2xl p-6">
                  <div class="flex items-center gap-3 text-slate-700 dark:text-slate-200">
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
                <p class="text-slate-600 dark:text-slate-300 mb-6 font-medium">
                  Try these popular searches for free:
                </p>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button
                    onClick={() => {
                      setCurrentMessage("Hidden gems in Paris");
                      handleSearchClick();
                    }}
                    disabled={isLoading()}
                    class="glass-panel gradient-border rounded-xl p-4 shadow-none hover:shadow-[0_16px_40px_rgba(14,165,233,0.25)] transition-all group text-left disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div class="flex items-start gap-3">
                      <span class="text-2xl">🌟</span>
                      <div>
                        <h4 class="font-semibold text-slate-900 dark:text-white group-hover:text-cyan-500 dark:group-hover:text-cyan-300 transition-colors">
                          Hidden gems in Paris
                        </h4>
                        <p class="text-sm text-slate-600 dark:text-slate-300 mt-1">
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
                    class="glass-panel gradient-border rounded-xl p-4 shadow-none hover:shadow-[0_16px_40px_rgba(14,165,233,0.25)] transition-all group text-left disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div class="flex items-start gap-3">
                      <span class="text-2xl">🍕</span>
                      <div>
                        <h4 class="font-semibold text-slate-900 dark:text-white group-hover:text-cyan-500 dark:group-hover:text-cyan-300 transition-colors">
                          Best food markets in Italy
                        </h4>
                        <p class="text-sm text-slate-600 dark:text-slate-300 mt-1">
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
                    class="glass-panel gradient-border rounded-xl p-4 shadow-none hover:shadow-[0_16px_40px_rgba(14,165,233,0.25)] transition-all group text-left disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div class="flex items-start gap-3">
                      <span class="text-2xl">🏛️</span>
                      <div>
                        <h4 class="font-semibold text-slate-900 dark:text-white group-hover:text-cyan-500 dark:group-hover:text-cyan-300 transition-colors">
                          3-day cultural tour of Rome
                        </h4>
                        <p class="text-sm text-slate-600 dark:text-slate-300 mt-1">
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
                    class="glass-panel gradient-border rounded-xl p-4 shadow-none hover:shadow-[0_16px_40px_rgba(14,165,233,0.25)] transition-all group text-left disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div class="flex items-start gap-3">
                      <span class="text-2xl">🌃</span>
                      <div>
                        <h4 class="font-semibold text-slate-900 dark:text-white group-hover:text-cyan-500 dark:group-hover:text-cyan-300 transition-colors">
                          Weekend nightlife in Barcelona
                        </h4>
                        <p class="text-sm text-slate-600 dark:text-slate-300 mt-1">
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
