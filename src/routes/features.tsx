import { A } from "@solidjs/router";
import { Brain, MapPin, Filter, Heart, List, Clock, Smartphone, Zap, Globe, Users } from "lucide-solid";

export default function Features() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Personalization",
      description: "Our advanced AI learns your preferences and adapts recommendations based on your interests, past choices, and behavior patterns.",
      details: ["Learns from your explicit preferences", "Adapts to your behavior over time", "Powered by Google Gemini AI", "Gets smarter with every interaction"]
    },
    {
      icon: Filter,
      title: "Contextual Filtering",
      description: "Filter recommendations by distance, available time, opening hours, interests, and soon budget to find exactly what fits your needs.",
      details: ["Distance & location-based filtering", "Time-aware suggestions", "Opening hours integration", "Interest-based categorization", "Budget filtering (coming soon)"]
    },
    {
      icon: MapPin,
      title: "Interactive Map Integration",
      description: "Visualize all recommendations on an interactive map with routes, directions, and real-time location tracking.",
      details: ["Interactive map visualization", "Route planning and directions", "Real-time location tracking", "Geospatial intelligence with PostGIS"]
    },
    {
      icon: Heart,
      title: "Save & Organize",
      description: "Bookmark your favorite places, create custom lists, and build personalized itineraries for future visits.",
      details: ["Bookmark favorite locations", "Create custom lists", "Build personalized itineraries", "Enhanced organization in Premium"]
    },
    {
      icon: Smartphone,
      title: "Mobile-First Design",
      description: "Optimized for on-the-go exploration with a responsive design that works perfectly on any device.",
      details: ["Mobile-optimized interface", "Progressive Web App (PWA)", "Offline access (Premium)", "Cross-platform compatibility"]
    },
    {
      icon: Clock,
      title: "Time-Aware Recommendations",
      description: "Get suggestions based on your available time, whether you have 30 minutes or a full day to explore.",
      details: ["Duration-based filtering", "Quick activities for short breaks", "Full-day itinerary planning", "Real-time availability updates"]
    }
  ];

  const searchCapabilities = [
    {
      icon: Globe,
      title: "Cities & Destinations",
      description: "Discover new cities and explore destinations with AI-curated recommendations tailored to your interests."
    },
    {
      icon: Users,
      title: "Restaurants & Dining",
      description: "Find the perfect dining experiences from local hidden gems to acclaimed establishments, filtered by cuisine and preferences."
    },
    {
      icon: MapPin,
      title: "Hotels & Accommodation",
      description: "Search and discover hotels, boutique stays, and unique accommodations that match your travel style and budget."
    },
    {
      icon: Zap,
      title: "Activities & Attractions",
      description: "Uncover activities, attractions, and experiences that align with your interests, from museums to outdoor adventures."
    }
  ];

  return (
    <div class="min-h-screen bg-background text-foreground transition-colors">
      <div class="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <header class="text-center mb-16">
          <h1 class="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Powerful <span class="text-blue-600 dark:text-blue-400">Features</span>
          </h1>
          <p class="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover what makes Loci the smartest way to explore cities. Our AI-powered platform 
            offers everything you need for personalized urban discovery.
          </p>
        </header>

        {/* Core Features Grid */}
        <section class="mb-20" aria-labelledby="core-features">
          <h2 id="core-features" class="text-3xl font-bold text-foreground text-center mb-12">Core Features</h2>
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8" role="list">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <article 
                  class="bg-card border border-border rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2"
                  role="listitem"
                  aria-labelledby={`feature-${index}`}
                >
                  <div class="flex items-center mb-4">
                    <div class="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-lg mr-4" aria-hidden="true">
                      <IconComponent class="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 id={`feature-${index}`} class="text-xl font-semibold text-card-foreground">{feature.title}</h3>
                  </div>
                  <p class="text-muted-foreground mb-4 leading-relaxed">
                    {feature.description}
                  </p>
                  <ul class="space-y-2" role="list">
                    {feature.details.map((detail) => (
                      <li class="flex items-center text-sm text-muted-foreground" role="listitem">
                        <div class="w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 rounded-full mr-2" aria-hidden="true"></div>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </section>

        {/* Search Capabilities */}
        <section class="mb-20" aria-labelledby="search-capabilities">
          <h2 id="search-capabilities" class="text-3xl font-bold text-foreground text-center mb-12">What You Can Discover</h2>
          <div class="grid md:grid-cols-2 gap-8" role="list">
            {searchCapabilities.map((capability, index) => {
              const IconComponent = capability.icon;
              return (
                <article 
                  class="bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-lg p-6 border border-blue-200/50 dark:border-blue-800/50"
                  role="listitem"
                  aria-labelledby={`capability-${index}`}
                >
                  <div class="flex items-center mb-4">
                    <div class="bg-background p-3 rounded-lg mr-4 shadow-md" aria-hidden="true">
                      <IconComponent class="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 id={`capability-${index}`} class="text-xl font-semibold text-foreground">{capability.title}</h3>
                  </div>
                  <p class="text-foreground/80 leading-relaxed">
                    {capability.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        {/* AI Capabilities */}
        <section class="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 rounded-lg p-8 mb-20 text-white" aria-labelledby="ai-capabilities">
          <div class="text-center mb-8">
            <h2 id="ai-capabilities" class="text-3xl font-bold mb-4">AI-Generated Itineraries</h2>
            <p class="text-lg text-white/90 max-w-3xl mx-auto">
              Let our advanced AI create personalized itineraries based on your interests, available time, 
              and location. From quick lunch breaks to full-day adventures.
            </p>
          </div>
          <div class="grid md:grid-cols-3 gap-6" role="list">
            <div class="text-center" role="listitem">
              <div class="bg-white/20 rounded-lg p-4 mb-4" aria-hidden="true">
                <Clock class="w-8 h-8 mx-auto" />
              </div>
              <h3 class="font-semibold mb-2">Time-Optimized</h3>
              <p class="text-sm text-white/80">Perfect timing for every activity</p>
            </div>
            <div class="text-center" role="listitem">
              <div class="bg-white/20 rounded-lg p-4 mb-4" aria-hidden="true">
                <Brain class="w-8 h-8 mx-auto" />
              </div>
              <h3 class="font-semibold mb-2">Personalized</h3>
              <p class="text-sm text-white/80">Tailored to your unique interests</p>
            </div>
            <div class="text-center" role="listitem">
              <div class="bg-white/20 rounded-lg p-4 mb-4" aria-hidden="true">
                <MapPin class="w-8 h-8 mx-auto" />
              </div>
              <h3 class="font-semibold mb-2">Location-Aware</h3>
              <p class="text-sm text-white/80">Optimized routes and distances</p>
            </div>
          </div>
        </section>

        {/* Coming Soon */}
        <section class="bg-muted/50 rounded-lg p-8 mb-12" aria-labelledby="coming-soon">
          <h2 id="coming-soon" class="text-2xl font-bold text-foreground text-center mb-6">Coming Soon</h2>
          <div class="grid md:grid-cols-2 gap-6" role="list">
            <div class="flex items-center" role="listitem">
              <div class="bg-green-100 dark:bg-green-900/50 p-2 rounded-lg mr-4" aria-hidden="true">
                <Zap class="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 class="font-semibold text-foreground">Speech-to-Text</h3>
                <p class="text-sm text-muted-foreground">Voice-powered search and commands</p>
              </div>
            </div>
            <div class="flex items-center" role="listitem">
              <div class="bg-green-100 dark:bg-green-900/50 p-2 rounded-lg mr-4" aria-hidden="true">
                <List class="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 class="font-semibold text-foreground">Itinerary Export</h3>
                <p class="text-sm text-muted-foreground">Download as PDF or Markdown</p>
              </div>
            </div>
            <div class="flex items-center" role="listitem">
              <div class="bg-green-100 dark:bg-green-900/50 p-2 rounded-lg mr-4" aria-hidden="true">
                <Users class="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 class="font-semibold text-foreground">24/7 AI Agent</h3>
                <p class="text-sm text-muted-foreground">Personal travel companion</p>
              </div>
            </div>
            <div class="flex items-center" role="listitem">
              <div class="bg-green-100 dark:bg-green-900/50 p-2 rounded-lg mr-4" aria-hidden="true">
                <Globe class="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 class="font-semibold text-foreground">Multi-City Support</h3>
                <p class="text-sm text-muted-foreground">Expand beyond your current city</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section class="text-center" aria-labelledby="cta-heading">
          <h2 id="cta-heading" class="text-2xl font-bold text-foreground mb-4">
            Ready to Experience These Features?
          </h2>
          <p class="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Start exploring with our free tier or upgrade to Premium for advanced features and unlimited access.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <A href="/auth/signup" class="inline-block">
              <button 
                class="bg-blue-600 hover:bg-blue-700 focus:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                aria-label="Sign up for free to start using Loci features"
              >
                Get Started Free
              </button>
            </A>
            <A href="/pricing" class="inline-block">
              <button 
                class="border border-border text-foreground hover:bg-muted focus:bg-muted font-semibold px-8 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                aria-label="View pricing plans for Loci"
              >
                View Pricing
              </button>
            </A>
          </div>
        </section>
      </div>
    </div>
  );
}