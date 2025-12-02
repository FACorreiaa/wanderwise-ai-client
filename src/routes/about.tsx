import { A } from "@solidjs/router";
import { Title, Meta } from "@solidjs/meta";

export default function About() {
  return (
    <>
      <Title>About Loci - The Taste-Aware Travel OS | AI-Powered City Discovery</Title>
      <Meta name="description" content="Learn about Loci, the intelligent travel companion that delivers hyper-personalized city exploration. Powered by Google Gemini AI, PostGIS, and advanced semantic search technology." />
      <Meta name="keywords" content="about Loci, travel technology, AI travel companion, Google Gemini, PostGIS, semantic search, personalized travel, city discovery, travel innovation" />
      <Meta property="og:title" content="About Loci - The Taste-Aware Travel OS" />
      <Meta property="og:description" content="Discover how Loci uses AI, geospatial intelligence, and semantic search to deliver hyper-personalized city exploration experiences." />
      <Meta property="og:url" content="https://loci.app/about" />
      <Meta name="twitter:title" content="About Loci - AI-Powered City Discovery" />
      <Meta name="twitter:description" content="The intelligent travel companion powered by Google Gemini AI and advanced geospatial technology." />
      <link rel="canonical" href="https://loci.app/about" />

      {/* Structured Data - AboutPage */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "name": "About Loci",
          "description": "Learn about Loci, the intelligent travel companion that delivers hyper-personalized city exploration",
          "mainEntity": {
            "@type": "Organization",
            "name": "Loci",
            "url": "https://loci.app",
            "description": "AI-powered travel discovery platform delivering hyper-personalized city exploration recommendations based on user interests, time, location, and an evolving AI engine",
            "foundingDate": "2024",
            "slogan": "The taste-aware travel OS",
            "knowsAbout": [
              "Travel Technology",
              "Artificial Intelligence",
              "Personalized Recommendations",
              "City Discovery",
              "Geospatial Intelligence"
            ]
          }
        })}
      </script>

    <div class="min-h-screen bg-background text-foreground transition-colors">
      <div class="max-w-5xl mx-auto px-4 py-12 space-y-12">
        {/* Hero Section */}
        <header class="text-center">
          <div class="rounded-3xl bg-gradient-to-br from-[#1e66f5]/10 via-[#04a5e5]/12 to-[#40a02b]/10 border border-[hsl(223,16%,83%)]/70 dark:border-white/10 shadow-[0_30px_80px_rgba(4,165,229,0.18)] p-10">
            <p class="text-sm uppercase tracking-[0.2em] text-[hsl(11,59%,67%)] dark:text-emerald-200 mb-3">About Loci</p>
            <h1 class="text-4xl md:text-6xl font-bold text-foreground dark:text-white mb-4">
              The taste-aware travel OS.
            </h1>
            <p class="text-xl text-[hsl(233,13%,41%)] dark:text-slate-200/85 max-w-3xl mx-auto leading-relaxed">
              Personalized City Discovery 🗺️✨ powered by Catppuccin Latte hues for clarity in light mode.
            </p>
          </div>
        </header>

        <section class="grid md:grid-cols-3 gap-4">
          {[
            { title: "Human-grade curation", body: "Annotated picks with source notes, not generic lists.", tone: "from-[#dc8a78]/25 to-[#dd7878]/20" },
            { title: "Glass accessibility", body: "High-contrast cards that stay legible in Latte or dark.", tone: "from-[#04a5e5]/25 to-[#1e66f5]/20" },
            { title: "Native-first future", body: "iOS + Android launching with offline brains for paid users.", tone: "from-[#40a02b]/25 to-[#df8e1d]/20" },
          ].map((item) => (
            <div class={`rounded-2xl p-5 border border-[hsl(223,16%,83%)]/80 dark:border-white/10 bg-gradient-to-br ${item.tone} backdrop-blur`}>
              <h3 class="text-lg font-semibold text-foreground dark:text-white mb-2">{item.title}</h3>
              <p class="text-[hsl(233,10%,47%)] dark:text-slate-200/85 text-sm leading-relaxed">{item.body}</p>
            </div>
          ))}
        </section>

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
    </>
  );
}
