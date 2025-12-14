import { For } from "solid-js";
import { Title, Meta } from "@solidjs/meta";
import {
  CheckCircle2,
  Rocket,
  Zap,
  Globe,
  Share2,
  Download,
  Mic,
  Calendar
} from "lucide-solid";
import { A } from "@solidjs/router";

interface Phase {
  number: number;
  title: string;
  status: "completed" | "in-progress" | "planned";
  description: string;
  features: string[];
}

export default function Roadmap() {
  const phases: Phase[] = [
    {
      number: 1,
      title: "MVP Foundation",
      status: "completed",
      description: "The core engine powering personal travel discovery.",
      features: [
        "Gemini-powered recommendation engine",
        "Interactive map & routing",
        "User accounts & basic bookmarks",
        "Itinerary personalization"
      ]
    },
    {
      number: 2,
      title: "Enhanced Intelligence",
      status: "in-progress",
      description: "Deepening the AI capabilities and premium features.",
      features: [
        "Vector database (pgvector) context",
        "Speech-to-text hands-free planning",
        "PDF/Markdown itinerary downloads",
        "Premium subscription tier"
      ]
    },
    {
      number: 3,
      title: "Global Scale",
      status: "planned",
      description: "Mobile apps and community-driven exploration.",
      features: [
        "Native iOS & Android Apps",
        "Collaborative trip planning",
        "Offline maps & guides",
        "Community curated lists"
      ]
    }
  ];

  return (
    <>
      <Title>Product Roadmap - Loci</Title>
      <Meta name="description" content="Explore Loci's product roadmap and vision." />

      {/* Main Page Container - Adaptive Theme */}
      <div class="min-h-screen bg-white dark:bg-[#111111] text-gray-900 dark:text-white selection:bg-blue-500/30 font-sans transition-colors duration-300">

        {/* HERO SECTION with Diagonal Cut */}
        <section class="relative bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 overflow-hidden pb-32 lg:pb-48">
          {/* Diagonal Cut Effect - matches the body background */}
          <div
            class="absolute bottom-0 left-0 right-0 h-24 bg-white dark:bg-[#111111] transition-colors duration-300"
            style={{ "clip-path": "polygon(0 100%, 100% 0, 100% 100%)" }}
          />

          <div class="container mx-auto px-4 pt-24 sm:pt-32 relative z-10">
            <div class="max-w-4xl">
              <h1 class="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 tracking-tight text-white">
                Roadmap
              </h1>
              <p class="text-xl sm:text-2xl text-blue-100 max-w-2xl font-light leading-relaxed">
                We love travel and mad science. Here is what powers Loci and where we are heading next.
              </p>
            </div>

            {/* Floating 3D-ish Element */}
            <div class="hidden lg:block absolute right-10 top-20 opacity-90 animate-in fade-in slide-in-from-right-10 duration-1000">
              <div class="relative w-96 h-96">
                <div class="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full" />
                <Rocket class="w-full h-full text-blue-300 drop-shadow-[0_0_30px_rgba(59,130,246,0.5)] rotate-12" />
              </div>
            </div>
          </div>
        </section>

        {/* PHASES GRID */}
        <section class="container mx-auto px-4 py-12 -mt-10 relative z-20">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-16">

            {/* COMPLETED */}
            <div class="group">
              <div class="flex items-start gap-6">
                <div class="shrink-0">
                  <CheckCircle2 class="w-16 h-16 text-emerald-500 hover:scale-110 transition-transform" />
                </div>
                <div>
                  <h2 class="text-3xl font-bold mb-3 text-gray-900 dark:text-white">MVP Foundation</h2>
                  <p class="text-gray-600 dark:text-gray-400 leading-relaxed mb-4 text-lg">
                    {phases[0].description}
                  </p>
                  <ul class="space-y-2">
                    <For each={phases[0].features}>
                      {(feat) => (
                        <li class="flex items-center gap-2 text-gray-700 dark:text-gray-400 text-sm font-medium">
                          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          {feat}
                        </li>
                      )}
                    </For>
                  </ul>
                </div>
              </div>
            </div>

            {/* IN PROGRESS */}
            <div class="group">
              <div class="flex items-start gap-6">
                <div class="shrink-0">
                  <Zap class="w-16 h-16 text-amber-500 hover:scale-110 transition-transform" />
                </div>
                <div>
                  <h2 class="text-3xl font-bold mb-3 text-gray-900 dark:text-white">Enhanced Intelligence</h2>
                  <p class="text-gray-600 dark:text-gray-400 leading-relaxed mb-4 text-lg">
                    {phases[1].description}
                  </p>
                  <ul class="space-y-2">
                    <For each={phases[1].features}>
                      {(feat) => (
                        <li class="flex items-center gap-2 text-gray-700 dark:text-gray-400 text-sm font-medium">
                          <span class="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          {feat}
                        </li>
                      )}
                    </For>
                  </ul>
                </div>
              </div>
            </div>

            {/* PLANNED */}
            <div class="group lg:col-span-2 lg:w-2/3">
              <div class="flex items-start gap-6">
                <div class="shrink-0">
                  <Globe class="w-16 h-16 text-blue-500 hover:scale-110 transition-transform" />
                </div>
                <div>
                  <h2 class="text-3xl font-bold mb-3 text-gray-900 dark:text-white">Global Scale</h2>
                  <p class="text-gray-600 dark:text-gray-400 leading-relaxed mb-4 text-lg">
                    {phases[2].description}
                  </p>
                  <ul class="space-y-2">
                    <For each={phases[2].features}>
                      {(feat) => (
                        <li class="flex items-center gap-2 text-gray-700 dark:text-gray-400 text-sm font-medium">
                          <span class="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          {feat}
                        </li>
                      )}
                    </For>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* FEATURE DETAILS STACK */}
        <section class="container mx-auto px-4 py-24">
          <div class="mb-12">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-gray-200 mb-2">Upcoming Highlights</h3>
            <div class="h-1 w-20 bg-blue-500 rounded-full" />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Highlight 1 */}
            <div class="flex gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
              <div class="mt-1">
                <Mic class="w-8 h-8 text-purple-500 dark:text-purple-400" />
              </div>
              <div>
                <h4 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Voice Interaction</h4>
                <p class="text-gray-600 dark:text-gray-400">Speak to Loci naturally to refine plans while on the go. Perfect for when you need quick answers without typing.</p>
              </div>
            </div>

            {/* Highlight 2 */}
            <div class="flex gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
              <div class="mt-1">
                <Share2 class="w-8 h-8 text-pink-500 dark:text-pink-400" />
              </div>
              <div>
                <h4 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Social Itineraries</h4>
                <p class="text-gray-600 dark:text-gray-400">Share your perfect trip with friends or publish it to the Loci community to help others discover hidden gems.</p>
              </div>
            </div>

            {/* Highlight 3 */}
            <div class="flex gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
              <div class="mt-1">
                <Download class="w-8 h-8 text-cyan-500 dark:text-cyan-400" />
              </div>
              <div>
                <h4 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Offline Mode</h4>
                <p class="text-gray-600 dark:text-gray-400">Download your city guides and maps for use without data roaming. Essential for international travel.</p>
              </div>
            </div>

            {/* Highlight 4 */}
            <div class="flex gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
              <div class="mt-1">
                <Calendar class="w-8 h-8 text-indigo-500 dark:text-indigo-400" />
              </div>
              <div>
                <h4 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Smart Scheduling</h4>
                <p class="text-gray-600 dark:text-gray-400">AI that understands opening hours and travel time to build realistically playable itineraries.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ANGLED SEPARATOR / CTA Section */}
        <section class="relative bg-blue-600 mt-20 pt-24 pb-24 overflow-hidden">
          {/* Top Diagonal - matches body background */}
          <div
            class="absolute top-0 left-0 right-0 h-16 bg-white dark:bg-[#111111] transition-colors duration-300"
            style={{ "clip-path": "polygon(0 0, 100% 0, 0 100%)" }}
          />

          <div class="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div class="text-white max-w-lg">
              <h2 class="text-3xl md:text-4xl font-bold mb-4">Join the party now</h2>
              <p class="text-blue-100 text-lg opacity-90">
                Start planning your next adventure with the most advanced AI travel companion.
              </p>
            </div>

            <div class="flex flex-col gap-4">
              <A href="/auth/signup">
                <button class="bg-white text-blue-600 font-bold px-8 py-4 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-lg w-full md:w-auto">
                  Get Loci for Free
                </button>
              </A>
              <div class="flex items-center gap-4 opacity-75 grayscale hover:grayscale-0 transition-all cursor-not-allowed">
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" class="h-12" alt="Play Store" />
                {/* Placeholder for App Store */}
              </div>
            </div>
          </div>
        </section>

        {/* Footer Area */}
        <section class="bg-gray-100 dark:bg-[#0b0b0f] pt-12 pb-20 transition-colors duration-300">
          {/* This area just blends into the main footer component if it exists, or acts as a buffer */}
        </section>

      </div>
    </>
  );
}
