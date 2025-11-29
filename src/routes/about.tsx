import { A } from "@solidjs/router";

export default function About() {
  return (
    <div class="min-h-screen bg-background text-foreground transition-colors">
      <div class="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <header class="text-center mb-16">
          <h1 class="text-4xl md:text-6xl font-bold text-foreground mb-6">
            About <span class="text-blue-600 dark:text-blue-400">Loci</span>
          </h1>
          <p class="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Personalized City Discovery 🗺️✨
          </p>
        </header>

        {/* Main Content */}
        <main class="max-w-none">
          <section class="bg-muted/50 rounded-lg p-8 mb-12" aria-labelledby="what-is-loci">
            <h2 id="what-is-loci" class="text-2xl font-semibold text-foreground mb-4">What is Loci?</h2>
            <p class="text-foreground/80 text-lg leading-relaxed mb-6">
              Loci is a smart, mobile-first web application delivering hyper-personalized city exploration 
              recommendations based on user interests, time, location, and an evolving AI engine. 
              It starts with an HTTP/REST API, utilizing WebSockets/SSE for real-time features.
            </p>
            <p class="text-foreground/80 text-lg leading-relaxed">
              Tired of generic city guides? Loci learns your preferences (history, food, art, etc.) 
              and combines them with your available time and location to suggest the perfect spots.
            </p>
          </section>

          {/* Mission Section */}
          <section class="mb-12" aria-labelledby="our-mission">
            <h2 id="our-mission" class="text-3xl font-bold text-foreground mb-6">Our Mission</h2>
            <p class="text-foreground/80 text-lg leading-relaxed mb-4">
              Whether you're a tourist on a tight schedule or a local looking for something new, 
              discover your city like never before with hyper-personalized, intelligent recommendations.
            </p>
            <p class="text-foreground/80 text-lg leading-relaxed">
              We believe that every city has hidden gems waiting to be discovered, and our AI-powered 
              platform helps you find exactly what matches your interests and available time.
            </p>
          </section>

          {/* Technology Section */}
          <section class="bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 rounded-lg p-8 mb-12" aria-labelledby="technology">
            <h2 id="technology" class="text-2xl font-semibold text-foreground mb-4">Powered by Advanced Technology</h2>
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <h3 class="text-lg font-semibold text-foreground mb-2">AI & Machine Learning</h3>
                <p class="text-foreground/75">
                  Direct Google Gemini API integration for deep personalization and intelligent recommendations 
                  that adapt to your preferences over time.
                </p>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-foreground mb-2">Geospatial Intelligence</h3>
                <p class="text-foreground/75">
                  PostgreSQL with PostGIS for precise location-based queries and spatial analysis 
                  to find the perfect spots near you.
                </p>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-foreground mb-2">Modern Architecture</h3>
                <p class="text-foreground/75">
                  Built with Go backend for performance and SolidJS frontend for a smooth, 
                  responsive user experience across all devices.
                </p>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-foreground mb-2">Vector Embeddings</h3>
                <p class="text-foreground/75">
                  Advanced semantic search capabilities using PostgreSQL with pgvector extension 
                  for more intelligent content matching.
                </p>
              </div>
            </div>
          </section>

          {/* Roadmap */}
          <section class="mb-12" aria-labelledby="roadmap">
            <h2 id="roadmap" class="text-3xl font-bold text-foreground mb-6">What's Coming Next</h2>
            <div class="space-y-6" role="list">
              <div class="border-l-4 border-blue-500 dark:border-blue-400 pl-6" role="listitem">
                <h3 class="text-xl font-semibold text-foreground mb-2">Phase 1 (MVP)</h3>
                <p class="text-foreground/80">
                  Core recommendation engine powered by Gemini, user accounts, interactive map view, 
                  and personalized itinerary creation.
                </p>
              </div>
              <div class="border-l-4 border-green-500 dark:border-green-400 pl-6" role="listitem">
                <h3 class="text-xl font-semibold text-foreground mb-2">Phase 2</h3>
                <p class="text-foreground/80">
                  Premium tier launch, enhanced AI with embeddings, speech-to-text capabilities, 
                  itinerary download/upload features, and 24/7 personalized AI agent.
                </p>
              </div>
              <div class="border-l-4 border-purple-500 dark:border-purple-400 pl-6" role="listitem">
                <h3 class="text-xl font-semibold text-foreground mb-2">Phase 3</h3>
                <p class="text-foreground/80">
                  Multi-city expansion, curated content partnerships, and native mobile app exploration.
                </p>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section class="text-center glass-panel gradient-border rounded-lg p-8" aria-labelledby="cta-heading">
            <h2 id="cta-heading" class="text-2xl font-bold mb-4 text-foreground">Ready to Discover Your City?</h2>
            <p class="text-lg mb-6 text-muted-foreground">
              Join thousands of explorers who've already discovered their perfect spots with Loci.
            </p>
            <A href="/auth/signup" class="inline-block">
              <button 
                class="bg-[#0c7df2] text-white font-semibold px-8 py-3 rounded-lg hover:bg-[#0a6ed6] focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 transition-colors shadow-[0_14px_32px_rgba(12,125,242,0.22)] border border-white/30 dark:border-slate-800/60"
                aria-label="Sign up for Loci to start discovering your city"
              >
                Get Started Today
              </button>
            </A>
          </section>
        </main>
      </div>
    </div>
  );
}
