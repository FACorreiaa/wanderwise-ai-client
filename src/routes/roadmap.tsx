import { createSignal, For, Show } from "solid-js";
import {
  Sparkles,
  Brain,
  Filter,
  Map as MapIcon,
  Bookmark,
  Smartphone,
  CheckCircle2,
  Clock,
  Rocket,
  Zap,
  Download,
  Upload,
  MessageSquare,
  Star,
  DollarSign,
  Globe,
  Layers,
  MicIcon
} from "lucide-solid";
import { A } from "@solidjs/router";

interface Phase {
  number: number;
  title: string;
  status: "completed" | "in-progress" | "planned";
  features: string[];
  subFeatures?: { title: string; items: string[] }[];
}

interface Feature {
  icon: any;
  title: string;
  description: string;
  color: string;
}

export default function Roadmap() {
  const [selectedPhase, setSelectedPhase] = createSignal<number>(1);

  const phases: Phase[] = [
    {
      number: 1,
      title: "MVP Foundation",
      status: "completed",
      features: [
        "Core recommendation engine (Gemini-powered)",
        "User accounts & authentication",
        "Interactive map view",
        "Itinerary personalization",
        "Basic search & filtering"
      ]
    },
    {
      number: 2,
      title: "Enhanced Intelligence",
      status: "in-progress",
      features: [
        "Premium tier launch",
        "Enhanced AI with embeddings",
        "Vector database (pgvector) integration",
        "Reviews & ratings system",
        "Booking partnerships"
      ],
      subFeatures: [
        {
          title: "Gemini Advanced Features",
          items: [
            "Speech to text for hands-free planning",
            "Itinerary download (PDF/Markdown formats)",
            "Itinerary uploads & sharing",
            "24/7 personalized AI agent"
          ]
        }
      ]
    },
    {
      number: 3,
      title: "Global Scale",
      status: "planned",
      features: [
        "Multi-city expansion",
        "Curated editorial content",
        "Native mobile apps (iOS & Android)",
        "Collaborative trip planning",
        "Offline mode support"
      ]
    }
  ];

  const coreFeatures: Feature[] = [
    {
      icon: Brain,
      title: "AI-Powered Personalization",
      description: "Recommendations adapt based on explicit user preferences and learned behavior over time.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Filter,
      title: "Contextual Filtering",
      description: "Smart filters by distance, available time, opening hours, interests, and budget to show only what matters to you.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: MapIcon,
      title: "Interactive Map Integration",
      description: "Visualize recommendations, your location, and potential routes in an intuitive map interface.",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: Bookmark,
      title: "Save & Organize",
      description: "Bookmark favorites, create custom lists or simple itineraries. Enhanced organization in Premium.",
      color: "from-amber-500 to-orange-500"
    },
    {
      icon: Smartphone,
      title: "Mobile-First Design",
      description: "Optimized for on-the-go browsing via web browser, with native apps coming in Phase 3.",
      color: "from-rose-500 to-red-500"
    }
  ];

  const getStatusColor = (status: Phase["status"]) => {
    switch (status) {
      case "completed":
        return "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700";
      case "in-progress":
        return "bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700";
      case "planned":
        return "bg-gray-200 dark:bg-gray-800/40 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700";
    }
  };

  const getStatusIcon = (status: Phase["status"]) => {
    switch (status) {
      case "completed":
        return CheckCircle2;
      case "in-progress":
        return Clock;
      case "planned":
        return Rocket;
    }
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 dark:from-[#050915] dark:via-[#0b1c36] dark:to-[#030712] text-gray-900 dark:text-white transition-colors">
      <div class="absolute inset-0 opacity-40 dark:opacity-60 pointer-events-none">
        <div class="domain-grid" aria-hidden="true" />
        <div class="domain-veil" aria-hidden="true" />
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Header */}
        <div class="text-center mb-12 sm:mb-16">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-700 mb-6">
            <Sparkles class="w-4 h-4" />
            Building the Future of Travel Discovery
          </div>

          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-6">
            <span class="text-gray-900 dark:text-white">Product </span>
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 dark:from-cyan-300 dark:via-emerald-200 dark:to-blue-300">
              Roadmap
            </span>
          </h1>

          <p class="text-lg sm:text-xl text-gray-700 dark:text-slate-200/90 max-w-3xl mx-auto leading-relaxed">
            Follow our journey as we build intelligent, personalized travel experiences that adapt to your unique preferences and lifestyle.
          </p>
        </div>

        {/* Elevator Pitch */}
        <section class="mb-16 sm:mb-20">
          <div class="glass-panel gradient-border rounded-3xl p-6 sm:p-8 lg:p-10">
            <div class="flex items-start gap-4 mb-4">
              <div class="p-3 rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 dark:bg-cyan-900/40 border border-blue-300 dark:border-cyan-700 shadow-sm">
                <Zap class="w-6 h-6 text-blue-700 dark:text-cyan-300" />
              </div>
              <div>
                <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  The Vision
                </h2>
                <p class="text-sm text-gray-600 dark:text-slate-400 uppercase tracking-wider font-semibold">
                  Elevator Pitch
                </p>
              </div>
            </div>

            <p class="text-lg text-gray-800 dark:text-slate-200 leading-relaxed mb-4">
              Tired of generic city guides? <span class="font-bold text-blue-600 dark:text-cyan-300">Loci</span> learns what you love—be it history, food, art, nightlife, or hidden gems—and combines it with your available time and location to suggest the perfect spots, activities, and restaurants.
            </p>

            <p class="text-lg text-gray-800 dark:text-slate-200 leading-relaxed">
              Whether you're a tourist on a tight schedule or a local looking for something new, discover your city like never before with <span class="font-semibold">hyper-personalized, intelligent recommendations</span>.
            </p>
          </div>
        </section>

        {/* Roadmap Phases */}
        <section class="mb-16 sm:mb-20">
          <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white text-center mb-10">
            Development Phases
          </h2>

          {/* Phase Timeline */}
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <For each={phases}>
              {(phase) => {
                const StatusIcon = getStatusIcon(phase.status);
                const isSelected = selectedPhase() === phase.number;

                return (
                  <button
                    onClick={() => setSelectedPhase(phase.number)}
                    class={`glass-panel rounded-2xl p-6 text-left transition-all duration-300 border-2 ${
                      isSelected
                        ? 'border-blue-500 dark:border-cyan-400 shadow-xl scale-105'
                        : 'border-transparent hover:border-blue-300 dark:hover:border-cyan-600 hover:shadow-lg'
                    }`}
                  >
                    <div class="flex items-center gap-3 mb-4">
                      <div class={`p-2 rounded-xl ${getStatusColor(phase.status)} border`}>
                        <StatusIcon class="w-5 h-5" />
                      </div>
                      <span class={`text-xs font-bold px-2 py-1 rounded-full ${getStatusColor(phase.status)} border`}>
                        {phase.status === "completed" ? "Completed" : phase.status === "in-progress" ? "In Progress" : "Planned"}
                      </span>
                    </div>

                    <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      Phase {phase.number}
                    </h3>
                    <p class="text-base font-semibold text-gray-700 dark:text-slate-300">
                      {phase.title}
                    </p>
                  </button>
                );
              }}
            </For>
          </div>

          {/* Selected Phase Details */}
          <Show when={phases.find(p => p.number === selectedPhase())}>
            {(phase) => (
              <div class="glass-panel gradient-border rounded-2xl p-6 sm:p-8 animate-in fade-in duration-300">
                <div class="flex items-center gap-3 mb-6">
                  <div class="p-3 rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 dark:bg-blue-900/40 border border-blue-300 dark:border-blue-700 shadow-sm">
                    <Layers class="w-6 h-6 text-blue-700 dark:text-blue-300" />
                  </div>
                  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
                    Phase {phase().number}: {phase().title}
                  </h3>
                </div>

                <div class="space-y-3 mb-6">
                  <For each={phase().features}>
                    {(feature) => (
                      <div class="flex items-start gap-3 p-3 rounded-xl bg-white/60 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                        <CheckCircle2 class="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span class="text-gray-800 dark:text-slate-200 font-medium">{feature}</span>
                      </div>
                    )}
                  </For>
                </div>

                <Show when={phase().subFeatures}>
                  <For each={phase().subFeatures}>
                    {(subFeature) => (
                      <div class="mt-6 p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800">
                        <div class="flex items-center gap-2 mb-4">
                          <Sparkles class="w-5 h-5 text-purple-600 dark:text-purple-400" />
                          <h4 class="text-lg font-bold text-gray-900 dark:text-white">
                            {subFeature.title}
                          </h4>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <For each={subFeature.items}>
                            {(item) => {
                              let Icon = MessageSquare;
                              if (item.includes("Speech")) Icon = MicIcon;
                              if (item.includes("download")) Icon = Download;
                              if (item.includes("upload")) Icon = Upload;
                              if (item.includes("24/7")) Icon = Clock;

                              return (
                                <div class="flex items-start gap-2 p-3 rounded-lg bg-white dark:bg-white/5">
                                  <Icon class="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                                  <span class="text-sm text-gray-800 dark:text-slate-200 font-medium">{item}</span>
                                </div>
                              );
                            }}
                          </For>
                        </div>
                      </div>
                    )}
                  </For>
                </Show>
              </div>
            )}
          </Show>
        </section>

        {/* Core Features */}
        <section class="mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white text-center mb-10">
            Core Features
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <For each={coreFeatures}>
              {(feature) => (
                <div class="glass-panel gradient-border rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group">
                  <div class={`inline-flex p-3 rounded-2xl bg-gradient-to-r ${feature.color} mb-4 shadow-lg`}>
                    <feature.icon class="w-6 h-6 text-white" />
                  </div>

                  <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>

                  <p class="text-gray-700 dark:text-slate-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              )}
            </For>
          </div>
        </section>

        {/* CTA Section */}
        <section class="text-center">
          <div class="glass-panel gradient-border rounded-3xl p-8 sm:p-10 lg:p-12">
            <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 mb-6">
              <Rocket class="w-4 h-4" />
              Ready to Join the Journey?
            </div>

            <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Be Part of Our Story
            </h2>

            <p class="text-lg text-gray-700 dark:text-slate-200 max-w-2xl mx-auto mb-8">
              Sign up today to experience the future of personalized travel discovery and help shape our roadmap with your feedback.
            </p>

            <div class="flex flex-wrap items-center justify-center gap-4">
              <A href="/auth/signup">
                <button class="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 dark:bg-cyan-500 text-white dark:text-slate-950 hover:from-blue-700 hover:to-cyan-700 dark:hover:bg-cyan-400 transition-all shadow-lg hover:shadow-xl">
                  Get Started Free
                  <Sparkles class="w-4 h-4" />
                </button>
              </A>

              <A href="/discover">
                <button class="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold border-2 border-gray-300 dark:border-white/30 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all">
                  Try Without Signup
                  <MapIcon class="w-4 h-4" />
                </button>
              </A>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
