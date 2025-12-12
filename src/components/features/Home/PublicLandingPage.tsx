import { createSignal, Show, For, lazy } from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import {
  Send,
  Loader2,
  Sparkles,
  Mail,
  ArrowRight,
  Smartphone,
  ShieldCheck,
  Clock3,
  MapPin,
  Utensils,
  Compass,
  Bed,
  Star,
} from "lucide-solid";
import { useUserLocation } from "~/contexts/LocationContext";
import { Button } from "~/ui/button";
import { TextField, TextFieldRoot } from "~/ui/textfield";
import { TextArea } from "~/ui/textarea";
import { Label } from "~/ui/label";
import { handleLinkPreload } from "~/lib/preload";

const RealTimeStats = lazy(() => import("~/components/features/Home/RealTimeStats"));
const MobileAppAnnouncement = lazy(() => import("~/components/features/Home/MobileAppAnnouncement"));
const LocationPermissionPrompt = lazy(() => import("~/components/LocationPermissionPrompt"));
import { sendUnifiedChatMessageStreamFree, detectDomain } from "~/lib/api/llm";
import {
  streamingService,
  createStreamingSession,
  getDomainRoute,
} from "~/lib/streaming-service";

const statsData = {
  badgeText: "Seen in beta",
};

const previewCards = [
  {
    title: "Itinerary Lab",
    description: "Map-first previews that respect your timebox and mood.",
    icon: Compass,
    href: "/preview/itinerary",
    accent: "from-cyan-400/80 to-blue-600/70",
  },
  {
    title: "Restaurants",
    description: "Taste-aware picks you can sort by vibe, diet, or budget.",
    icon: Utensils,
    href: "/preview/restaurants",
    accent: "from-amber-300/80 to-orange-500/70",
  },
  {
    title: "Activities",
    description: "Workshops, trails, and tickets that match your pace.",
    icon: Sparkles,
    href: "/preview/activities",
    accent: "from-emerald-300/70 to-teal-500/70",
  },
  {
    title: "Hotels",
    description: "Sleep, soak, or sprint — filtered for your rituals.",
    icon: Bed,
    href: "/preview/hotels",
    accent: "from-indigo-300/80 to-slate-600/70",
  },
  {
    title: "Discover",
    description: "Search any city. Trends stay gated until you register.",
    icon: MapPin,
    href: "/preview/discover",
    accent: "from-fuchsia-300/70 to-purple-600/70",
  },
];

const valueStack = [
  {
    label: "Problem agitation",
    copy: "Travel research is endless tabs, ads, and FOMO. Loci compresses the chaos into one calm brief.",
  },
  {
    label: "Value stack",
    copy: "Taste profiles, timeboxing, and local nuance sit in one recommendation brain.",
  },
  {
    label: "Objection handling",
    copy: "Not another generic AI. Every suggestion is annotated, source-linked, and filterable.",
  },
  {
    label: "Risk reversal",
    copy: "Try searches free. No credit card. Keep chat and saves once you register.",
  },
  {
    label: "Scarcity",
    copy: "We onboard in weekly cohorts to keep suggestions pristine. Join the next drop.",
  },
];

const socialProof = [
  {
    quote:
      "Feels like a concierge who already knows my taste in coffee, museums, and bedtime.",
    name: "Nadia — prototype user in Lisbon",
  },
  {
    quote: "The glass UI makes even the planning feel like travel.",
    name: "Kenji — weekend warrior in Tokyo",
  },
];

export default function PublicLandingPage() {
  const navigate = useNavigate();
  const [currentMessage, setCurrentMessage] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [emailSubmitted, setEmailSubmitted] = createSignal(false);
  const [isLoading, setIsLoading] = createSignal(false);
  const [emailError, setEmailError] = createSignal("");
  const [searchError, setSearchError] = createSignal("");
  const { userLocation } = useUserLocation();

  const handleGetStarted = () => {
    navigate("/auth/signin");
  };

  const handleEmailSubmit = (event: Event) => {
    event.preventDefault();
    const emailValue = email().trim();
    if (!emailValue) {
      setEmailError("Email is required");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    setEmailError("");
    setEmailSubmitted(true);
    setEmail("");
    setTimeout(() => setEmailSubmitted(false), 3200);
  };

  const handleSearchClick = async () => {
    const message = currentMessage().trim();
    if (!message) {
      setSearchError("Please enter a search query");
      return;
    }
    if (isLoading()) return;
    setSearchError("");

    setIsLoading(true);

    try {
      const domain = detectDomain(message);
      const session = createStreamingSession(domain);
      session.query = message;

      sessionStorage.setItem(
        "currentStreamingSession",
        JSON.stringify(session),
      );

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

  const prefillAndSearch = (prompt: string) => {
    setCurrentMessage(prompt);
    handleSearchClick();
  };

  return (
    <div class="min-h-screen relative overflow-hidden pb-16 bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 dark:from-[#050915] dark:via-[#0b1c36] dark:to-[#030712] text-gray-900 dark:text-white transition-colors">
      <div class="absolute inset-0 opacity-40 dark:opacity-60">
        <div class="domain-grid" aria-hidden="true" />
        <div class="domain-veil" aria-hidden="true" />
        <div class="domain-halo" aria-hidden="true" />
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        {/* Hero */}
        <section class="rounded-3xl border border-gray-300 dark:border-white/10 bg-white/90 dark:bg-white/5 backdrop-blur-2xl shadow-xl dark:shadow-[0_35px_120px_rgba(3,7,18,0.55)] overflow-hidden">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 p-8 sm:p-10 lg:p-12">
            <div class="space-y-6">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold bg-emerald-100 dark:bg-emerald-400/10 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-300/30 w-fit">
                <Sparkles class="w-4 h-4" />
                Taste-first city intelligence
              </div>
              <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white">
                Plan like a local.
                <span class="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 dark:from-cyan-300 dark:via-emerald-200 dark:to-blue-300">
                  See it in action.
                </span>
              </h1>
              <p class="text-lg sm:text-xl text-gray-700 dark:text-slate-200/90 leading-relaxed max-w-xl">
                Loci learns what you actually like — coffee strength, gallery pace,
                bedtime — then curates itineraries, restaurants, activities, and hotels
                that feel handpicked.
              </p>
              <div class="flex flex-wrap gap-3">
                <Button
                  onClick={() => navigate("/preview/discover")}
                  class="gap-2"
                >
                  Preview: 48h in Tokyo
                  <ArrowRight class="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={handleGetStarted}
                  class="gap-2"
                >
                  Create my account
                </Button>
              </div>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div class="glass-panel gradient-border rounded-2xl p-4">
                  <p class="font-semibold text-gray-900 dark:text-white mb-1">Problem → Solution</p>
                  <p class="text-gray-700 dark:text-slate-200/80">
                    Endless tabs? We compress everything into one AI co-pilot that cites sources.
                  </p>
                </div>
                <div class="glass-panel gradient-border rounded-2xl p-4">
                  <p class="font-semibold text-gray-900 dark:text-white mb-1">Value stack</p>
                  <p class="text-gray-700 dark:text-slate-200/80">
                    Taste profiles, accessibility cues, and timeboxing baked into every suggestion.
                  </p>
                </div>
              </div>
            </div>

            <div class="space-y-6">
              {/* Email capture */}
              <form
                onSubmit={handleEmailSubmit}
                class="glass-panel gradient-border rounded-2xl p-4 sm:p-5 space-y-4"
              >
                <div class="flex items-center gap-3">
                  <div class="p-3 rounded-2xl bg-emerald-100 dark:bg-white/10 border border-emerald-300 dark:border-white/15">
                    <Mail class="w-5 h-5 text-emerald-700 dark:text-emerald-200" />
                  </div>
                  <div>
                    <p class="text-sm uppercase tracking-[0.2em] text-gray-600 dark:text-slate-200/70">
                      Stay in the loop
                    </p>
                    <p class="text-base text-gray-900 dark:text-white font-semibold">
                      Early updates + native app drop
                    </p>
                  </div>
                </div>
                <div class="flex flex-col gap-2">
                  <div class="flex flex-col sm:flex-row gap-3">
                    <Label class="sr-only" for="beta-email">
                      Email for product updates
                    </Label>
                    <TextFieldRoot class="flex-1">
                      <TextField
                        id="beta-email"
                        type="email"
                        value={email()}
                        onInput={(e) => {
                          setEmail(e.currentTarget.value);
                          if (emailError()) setEmailError("");
                        }}
                        class={emailError() ? "border-destructive focus-visible:ring-destructive" : ""}
                        placeholder="you@travelersclub.com"
                      />
                    </TextFieldRoot>
                    <Button type="submit">
                      Join updates
                    </Button>
                  </div>
                  <Show when={emailError()}>
                    <p class="text-sm text-red-500 dark:text-red-400">{emailError()}</p>
                  </Show>
                </div>
                <Show when={emailSubmitted()}>
                  <p class="text-sm text-emerald-700 dark:text-emerald-200 font-medium">
                    Added — we'll only email when something real ships.
                  </p>
                </Show>
              </form>

              {/* Search preview */}
              <div class="glass-panel gradient-border rounded-2xl p-4 sm:p-5 space-y-4">
                <div class="flex items-center justify-between gap-3">
                  <div class="flex items-center gap-2 text-gray-700 dark:text-slate-200">
                    <Smartphone class="w-4 h-4" />
                    <span class="text-sm font-medium">See Loci in action</span>
                  </div>
                  <span class="text-xs px-2 py-1 rounded-full bg-emerald-100 dark:bg-white/10 border border-emerald-300 dark:border-white/15 text-emerald-800 dark:text-emerald-100 font-semibold">
                    Live Demo
                  </span>
                </div>
                <div class="flex flex-col gap-2">
                  <div class="flex items-end gap-3">
                    <TextFieldRoot class="flex-1">
                      <TextArea
                        value={currentMessage()}
                        onInput={(e) => {
                          setCurrentMessage(e.currentTarget.value);
                          if (searchError()) setSearchError("");
                        }}
                        placeholder={'"Best vinyl bars near Barcelona" or "Quiet art walks in Copenhagen"'}
                        class={`min-h-[56px] border-none bg-transparent ${searchError() ? "border-b-2 border-destructive" : ""}`}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSearchClick();
                          }
                        }}
                      />
                    </TextFieldRoot>
                    <Button
                      onClick={handleSearchClick}
                      disabled={isLoading()}
                      aria-label="Search"
                      class="gap-2"
                    >
                      <Show when={isLoading()} fallback={<Send class="w-4 h-4" />}>
                        <Loader2 class="w-4 h-4 animate-spin" />
                      </Show>
                      <span class="hidden sm:inline">
                        <Show when={isLoading()} fallback="Run">
                          Working...
                        </Show>
                      </span>
                    </Button>
                  </div>
                  <Show when={searchError()}>
                    <p class="text-sm text-red-500 dark:text-red-400">{searchError()}</p>
                  </Show>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    variant="ghost"
                    onClick={() => navigate("/preview/discover")}
                    class="glass-panel rounded-xl px-4 py-3 h-auto text-left justify-start flex-col items-start"
                  >
                    <div class="flex items-center gap-2 text-sm text-accent font-medium">
                      <Sparkles class="w-4 h-4" />
                      Quick Example
                    </div>
                    <p class="text-foreground font-semibold">Tokyo: Cyberpunk & Shrines</p>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => navigate("/preview/discover")}
                    class="glass-panel rounded-xl px-4 py-3 h-auto text-left justify-start flex-col items-start"
                  >
                    <div class="flex items-center gap-2 text-sm text-accent font-medium">
                      <Sparkles class="w-4 h-4" />
                      Quick Example
                    </div>
                    <p class="text-foreground font-semibold">Tokyo: Best Sushi Spots</p>
                  </Button>
                </div>
                <Show when={isLoading()}>
                  <div class="flex items-center gap-3 text-gray-700 dark:text-slate-100">
                    <Loader2 class="w-5 h-5 animate-spin" />
                    <span class="font-medium">Curating a mini-brief for you...</span>
                  </div>
                </Show>
              </div>
            </div>
          </div>
        </section>

        {/* Domain previews */}
        <section class="mt-12">
          <h2 class="sr-only">Explore Features</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <For each={previewCards}>{(card) => (
              <A
                href={card.href}
                onMouseEnter={() => handleLinkPreload(card.href)}
                class="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10 bg-white/90 dark:bg-white/5 backdrop-blur-xl p-5 shadow-xl dark:shadow-[0_20px_80px_rgba(3,7,18,0.45)] hover:-translate-y-1 transition-all"
              >
                <div class={`absolute inset-0 bg-gradient-to-br ${card.accent} opacity-20 dark:opacity-40`} aria-hidden="true" />
                <div class="relative flex items-start gap-3">
                  <div class="p-3 rounded-2xl bg-gray-100 dark:bg-white/15 border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white">
                    <card.icon class="w-5 h-5" />
                  </div>
                  <div class="flex-1">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{card.title}</h3>
                    <p class="text-sm text-gray-700 dark:text-slate-100/80 mt-1">{card.description}</p>
                  </div>
                </div>
                <div class="relative mt-4 flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-100 group-hover:text-emerald-800 dark:group-hover:text-white">
                  <ShieldCheck class="w-4 h-4" />
                  Search available. Unlock chat when you register.
                </div>
              </A>
            )}</For>
          </div>
        </section>

        {/* Value stack + social proof */}
        <section class="mt-14 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 space-y-4">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Why travelers stay</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <For each={valueStack}>{(item) => (
                <div class="glass-panel gradient-border rounded-2xl p-4 bg-white/90 dark:bg-white/5">
                  <p class="text-xs uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-200 mb-2">
                    {item.label}
                  </p>
                  <p class="text-sm text-gray-700 dark:text-slate-100/85">{item.copy}</p>
                </div>
              )}</For>
            </div>
          </div>
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Star class="w-4 h-4 text-amber-500 dark:text-amber-300" />
              Social proof
            </h3>
            <div class="space-y-3">
              <For each={socialProof}>{(proof) => (
                <div class="glass-panel rounded-2xl p-4 bg-white/90 dark:bg-white/5">
                  <p class="text-sm text-gray-900 dark:text-white/90">{proof.quote}</p>
                  <p class="text-xs text-gray-600 dark:text-slate-200/70 mt-2">{proof.name}</p>
                </div>
              )}</For>
            </div>
          </div>
        </section>

        {/* Stats + future mobile */}
        <RealTimeStats badgeText={statsData.badgeText} />
        <MobileAppAnnouncement />

        {/* Objection handling */}
        <section class="mt-6">
          <div class="glass-panel gradient-border rounded-3xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-white/90 dark:bg-white/5">
            <div class="space-y-2">
              <p class="text-xs uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-200">
                Objections handled
              </p>
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Safe to try. Easy to leave.</h2>
              <p class="text-sm text-gray-700 dark:text-slate-100/80">
                Search free. No spam. Delete your data from settings anytime.
              </p>
            </div>
            <div class="space-y-3">
              <div class="flex items-center gap-3 text-gray-700 dark:text-white/90">
                <Clock3 class="w-4 h-4 text-emerald-600 dark:text-emerald-200" />
                <span class="text-sm">Twice-daily stat refresh — no flaky SSE calls.</span>
              </div>
              <div class="flex items-center gap-3 text-gray-700 dark:text-white/90">
                <ShieldCheck class="w-4 h-4 text-emerald-600 dark:text-emerald-200" />
                <span class="text-sm">Transparent recommendations with source notes.</span>
              </div>
              <div class="flex items-center gap-3 text-gray-700 dark:text-white/90">
                <Smartphone class="w-4 h-4 text-emerald-600 dark:text-emerald-200" />
                <span class="text-sm">Native iOS + Android in the works; join the drop list.</span>
              </div>
            </div>
            <div class="flex flex-col gap-3">
              <Button
                onClick={handleGetStarted}
                class="w-full gap-2"
              >
                Register to unlock chat
                <ArrowRight class="w-4 h-4" />
              </Button>
              <p class="text-xs text-muted-foreground text-center">
                Risk-free beta · cancel anytime
              </p>
            </div>
          </div>
        </section>
      </div>

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
