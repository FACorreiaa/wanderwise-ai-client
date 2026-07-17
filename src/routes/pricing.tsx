import { A } from "@solidjs/router";
import { Title, Meta } from "@solidjs/meta";
import { Check, Star, Zap, Crown, Heart, MapPin, Clock } from "lucide-solid";
import { createSignal, Show, For } from "solid-js";
import PromoCodeSection from "~/components/PromoCodeSection";

export default function Pricing() {
  const [appliedPromo, setAppliedPromo] = createSignal<any>(null);

  const handlePromoSuccess = (promoData: any) => {
    setAppliedPromo(promoData);
    console.log("Promo applied:", promoData);
  };

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      yearlyPrice: null,
      description: "Perfect for casual explorers",
      icon: Heart,
      color: "gray",
      features: [
        "Core AI recommendations",
        "Basic preference filters",
        "Up to 10 saved locations",
        "Interactive map view",
        "Mobile-optimized experience",
        "Community support",
      ],
      limitations: [
        "Limited to 5 searches per day",
        "Basic filtering options only",
        "Non-intrusive contextual ads",
      ],
      cta: "Get Started Free",
      popular: false,
    },
    {
      name: "Explorer",
      price: "$3.99",
      period: "per month",
      yearlyPrice: "$39.90 / yr",
      description: "For regular city discoverers",
      icon: MapPin,
      color: "blue",
      features: [
        "Everything in Free",
        "Unlimited searches & recommendations",
        "Advanced filtering (cuisine, accessibility, niche tags)",
        "Up to 100 saved locations",
        "Custom lists & collections",
        "Priority customer support",
        "Ad-free experience",
        "Enhanced AI recommendations",
      ],
      limitations: [],
      cta: "Start Explorer Plan",
      popular: true,
    },
    {
      name: "Pro",
      price: "$9.99",
      period: "per month",
      yearlyPrice: "$99.90 / yr",
      description: "For travel enthusiasts & professionals",
      icon: Crown,
      color: "purple",
      features: [
        "Everything in Explorer",
        "Unlimited saved locations & lists",
        "Offline access & sync",
        "Exclusive curated content",
        "Advanced AI with semantic search",
        "24/7 personalized AI agent",
        "Speech-to-text capabilities",
        "Itinerary export (PDF/Markdown)",
        "Multi-city trip planning",
        "Premium partnerships & exclusive deals",
        "Priority feature access",
        "Dedicated account manager",
      ],
      limitations: [],
      cta: "Coming Soon",
      popular: false,
      disabled: true,
    },
  ];

  const features = [
    {
      category: "AI & Personalization",
      items: [
        { feature: "Basic AI recommendations", free: true, explorer: true, pro: true },
        { feature: "Advanced AI with learning", free: false, explorer: true, pro: true },
        { feature: "Semantic search & embeddings", free: false, explorer: false, pro: true },
        { feature: "24/7 AI agent", free: false, explorer: false, pro: "Coming Soon" },
      ],
    },
    {
      category: "Search & Discovery",
      items: [
        { feature: "Daily searches", free: "5 per day", explorer: "Unlimited", pro: "Unlimited" },
        { feature: "Basic filters", free: true, explorer: true, pro: true },
        { feature: "Advanced filters", free: false, explorer: true, pro: true },
        { feature: "Multi-city planning", free: false, explorer: false, pro: true },
      ],
    },
    {
      category: "Organization",
      items: [
        { feature: "Saved locations", free: "10", explorer: "100", pro: "Unlimited" },
        { feature: "Custom lists", free: false, explorer: true, pro: true },
        { feature: "Itinerary planning", free: "Basic", explorer: "Advanced", pro: "Premium" },
        { feature: "Export capabilities", free: false, explorer: false, pro: true },
      ],
    },
    {
      category: "Experience",
      items: [
        { feature: "Mobile experience", free: true, explorer: true, pro: true },
        { feature: "Offline access", free: false, explorer: false, pro: true },
        { feature: "Ad-free experience", free: false, explorer: true, pro: true },
        { feature: "Exclusive content", free: false, explorer: false, pro: true },
      ],
    },
  ];

  const getColorClasses = (color: string, type: "bg" | "text" | "border") => {
    const colors = {
      gray: { bg: "bg-muted", text: "text-muted-foreground", border: "border-border" },
      blue: { bg: "bg-primary/10", text: "text-primary", border: "border-primary/30" },
      purple: { bg: "bg-accent/10", text: "text-accent", border: "border-accent/30" },
    };
    return colors[color as keyof typeof colors][type];
  };

  return (
    <>
      <Title>Pricing Plans - Free, Explorer & Pro | Loci AI Travel Companion</Title>
      <Meta
        name="description"
        content="Choose the perfect Loci plan for your travel needs. Start free with basic AI recommendations or upgrade to Explorer ($3.99/mo) or Pro ($9.99/mo) for unlimited searches, advanced features, and premium perks. 30-day money-back guarantee."
      />
      <Meta
        name="keywords"
        content="Loci pricing, travel app plans, AI travel subscription, free travel planner, premium travel features, Explorer plan, Pro plan, travel app cost"
      />
      <Meta property="og:title" content="Pricing Plans - Free, Explorer & Pro | Loci" />
      <Meta
        property="og:description"
        content="Flexible pricing for every traveler. Free plan available, Explorer at $3.99/mo, Pro at $9.99/mo. 30-day money-back guarantee on all paid plans."
      />
      <Meta property="og:url" content="https://loci.app/pricing" />
      <Meta name="twitter:title" content="Pricing Plans - Loci AI Travel Companion" />
      <Meta
        name="twitter:description"
        content="Start free or choose Explorer ($3.99/mo) or Pro ($9.99/mo) for advanced AI travel features. 30-day money-back guarantee."
      />
      <link rel="canonical" href="https://loci.app/pricing" />

      {/* Structured Data - Product with Multiple Offers */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: "Loci - AI Travel Companion",
          description: "AI-powered travel discovery platform with personalized recommendations",
          brand: {
            "@type": "Brand",
            name: "Loci",
          },
          offers: [
            {
              "@type": "Offer",
              name: "Free Plan",
              price: "0",
              priceCurrency: "USD",
              description: "Perfect for casual explorers with core AI recommendations",
              availability: "https://schema.org/InStock",
            },
            {
              "@type": "Offer",
              name: "Explorer Plan",
              price: "3.99",
              priceCurrency: "USD",
              billingIncrement: "monthly",
              description:
                "For regular city discoverers with unlimited searches and advanced features",
              availability: "https://schema.org/InStock",
            },
            {
              "@type": "Offer",
              name: "Pro Plan",
              price: "9.99",
              priceCurrency: "USD",
              billingIncrement: "monthly",
              description:
                "For travel enthusiasts with offline access, 24/7 AI agent, and premium features",
              availability: "https://schema.org/PreOrder",
            },
          ],
        })}
      </script>

      {/* Structured Data - FAQ */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "Can I upgrade or downgrade my plan anytime?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes, you can change your plan at any time. Changes take effect immediately, and we'll prorate the charges accordingly.",
              },
            },
            {
              "@type": "Question",
              name: "Is there a free trial for paid plans?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "We don't offer a traditional free trial, but our Free plan gives you access to core features. Plus, all paid plans come with a 30-day money-back guarantee.",
              },
            },
            {
              "@type": "Question",
              name: "How does the AI learn my preferences?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Our AI analyzes your explicit preferences, saved locations, and interaction patterns to provide increasingly personalized recommendations over time.",
              },
            },
            {
              "@type": "Question",
              name: "Do you offer discounts for annual subscriptions?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes! Annual subscriptions receive a 20% discount. Contact our support team to set up annual billing.",
              },
            },
          ],
        })}
      </script>

      <div class="min-h-screen bg-background text-foreground transition-colors">
        <div class="max-w-7xl mx-auto px-4 py-12 space-y-12">
          {/* Hero Section */}
          <header class="text-center">
            <div class="rounded-3xl bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 border border-border shadow-lg p-10 space-y-4">
              <h1 class="text-4xl md:text-6xl font-bold text-foreground">
                Simple <span class="text-primary">Pricing</span>
              </h1>
              <p class="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Choose the perfect plan for your exploration needs. Plans adapt to your active design
                theme and color mode.
              </p>
              <div class="inline-flex items-center bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/30">
                <Star class="w-4 h-4 mr-2" aria-hidden="true" />
                30-day money-back guarantee on all paid plans
              </div>
            </div>
          </header>

          {/* Promo Code Section */}
          <div class="mb-16">
            <PromoCodeSection onSuccess={handlePromoSuccess} />
          </div>

          {/* Promo Success Banner */}
          <Show when={appliedPromo()}>
            <div class="max-w-4xl mx-auto mb-12">
              <div class="glass-panel gradient-border rounded-2xl p-6 shadow-lg border-0">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-lg ring-2 ring-primary/30">
                    <Star class="w-6 h-6" />
                  </div>
                  <div class="flex-1">
                    <h3 class="text-xl font-bold mb-1 text-foreground">
                      Promo Code Applied Successfully! 🎉
                    </h3>
                    <p class="text-muted-foreground">{appliedPromo()?.description}</p>
                    <Show when={appliedPromo()?.type === "discount"}>
                      <p class="text-sm text-muted-foreground mt-1">
                        Your discount will be applied at checkout
                      </p>
                    </Show>
                  </div>
                </div>
              </div>
            </div>
          </Show>

          {/* Pricing Cards */}
          <section class="grid md:grid-cols-3 gap-8 mb-20" aria-labelledby="pricing-plans">
            <h2 id="pricing-plans" class="sr-only">
              Pricing Plans
            </h2>
            <For each={plans}>
              {(plan, index) => {
                const IconComponent = plan.icon;
                return (
                  <article
                    class={`relative bg-card border-2 rounded-2xl shadow-lg transition-all duration-300 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ${
                      plan.disabled
                        ? "border-muted opacity-75"
                        : plan.popular
                          ? "border-primary scale-105 hover:shadow-xl"
                          : "border-border hover:border-primary/50 hover:shadow-xl"
                    }`}
                    aria-labelledby={`plan-${index()}`}
                  >
                    {plan.popular && !plan.disabled && (
                      <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <div class="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium flex items-center">
                          <Zap class="w-4 h-4 mr-1" aria-hidden="true" />
                          Most Popular
                        </div>
                      </div>
                    )}

                    {plan.disabled && (
                      <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <div class="bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-medium flex items-center">
                          <Clock class="w-4 h-4 mr-1" aria-hidden="true" />
                          Coming Soon
                        </div>
                      </div>
                    )}

                    <div class="p-8">
                      <div class="flex items-center mb-4">
                        <div
                          class={`${getColorClasses(plan.color, "bg")} dark:bg-opacity-50 p-3 rounded-lg mr-4`}
                          aria-hidden="true"
                        >
                          <IconComponent
                            class={`w-6 h-6 ${getColorClasses(plan.color, "text")} dark:opacity-90`}
                          />
                        </div>
                        <h3 id={`plan-${index()}`} class="text-2xl font-bold text-card-foreground">
                          {plan.name}
                        </h3>
                      </div>

                      <div class="mb-4">
                        <div class="flex items-center gap-2">
                          <span
                            class={`text-4xl font-bold ${plan.disabled ? "text-muted-foreground" : "text-card-foreground"}`}
                          >
                            {plan.price}
                          </span>
                          <span
                            class={`ml-2 ${plan.disabled ? "text-muted-foreground" : "text-muted-foreground"}`}
                          >
                            /{plan.period}
                          </span>
                        </div>
                        <Show when={plan.yearlyPrice}>
                          <div class="flex items-center gap-2 mt-1 text-sm">
                            <span class="px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                              Yearly: {plan.yearlyPrice}
                            </span>
                            <span class="text-muted-foreground">
                              Save vs monthly
                            </span>
                          </div>
                        </Show>
                        {/* Show discount for applicable plans */}
                        <Show
                          when={
                            appliedPromo() &&
                            appliedPromo()?.type === "discount" &&
                            plan.name !== "Free" &&
                            (appliedPromo()?.planAccess === "any" ||
                              appliedPromo()?.planAccess === plan.name.toLowerCase())
                          }
                        >
                          <div class="flex items-center gap-2 mt-2">
                            <span class="text-lg text-muted-foreground line-through">
                              {plan.price}
                            </span>
                            <span class="text-2xl font-bold text-primary">
                              $
                              {(
                                parseFloat(plan.price.replace("$", "")) *
                                (1 - appliedPromo()?.discount / 100)
                              ).toFixed(2)}
                            </span>
                            <span class="bg-primary/10 text-primary px-2 py-1 rounded text-sm font-medium">
                              {appliedPromo()?.discount}% OFF
                            </span>
                          </div>
                        </Show>
                        {/* Show free trial indicator */}
                        <Show
                          when={
                            appliedPromo() &&
                            appliedPromo()?.type === "free_trial" &&
                            plan.name !== "Free" &&
                            (appliedPromo()?.planAccess === "any" ||
                              appliedPromo()?.planAccess === plan.name.toLowerCase())
                          }
                        >
                          <div class="mt-2">
                            <span class="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                              FREE for {appliedPromo()?.duration} days
                            </span>
                          </div>
                        </Show>
                        {/* Show free access indicator */}
                        <Show
                          when={
                            appliedPromo() &&
                            appliedPromo()?.type === "free_access" &&
                            plan.name !== "Free" &&
                            (appliedPromo()?.planAccess === "any" ||
                              appliedPromo()?.planAccess === plan.name.toLowerCase())
                          }
                        >
                          <div class="mt-2">
                            <span class="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-medium">
                              FREE ACCESS
                            </span>
                          </div>
                        </Show>
                      </div>

                      <p class="text-muted-foreground mb-6">{plan.description}</p>

                      <button
                        class={`w-full py-3 px-6 rounded-lg font-semibold transition-colors mb-6 focus:outline-none ${
                          plan.disabled
                            ? "bg-muted text-muted-foreground cursor-not-allowed"
                            : plan.popular
                              ? "bg-primary hover:bg-primary/90 text-primary-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2"
                              : "border border-border text-card-foreground hover:bg-muted focus:bg-muted focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        }`}
                        disabled={plan.disabled}
                        aria-label={
                          plan.disabled
                            ? `${plan.name} plan coming soon`
                            : `Choose ${plan.name} plan for ${plan.price} ${plan.period}`
                        }
                      >
                        {plan.disabled ? (
                          <div class="flex items-center justify-center gap-2">
                            <Clock class="w-4 h-4" aria-hidden="true" />
                            {plan.cta}
                          </div>
                        ) : (
                          plan.cta
                        )}
                      </button>

                      <div class="space-y-3">
                        <h4
                          class={`font-semibold ${plan.disabled ? "text-muted-foreground" : "text-card-foreground"}`}
                        >
                          Includes:
                        </h4>
                        <ul class="space-y-2" role="list">
                          <For each={plan.features}>
                            {(feature) => (
                              <li class="flex items-start" role="listitem">
                                <Check
                                  class={`w-5 h-5 mr-3 mt-0.5 flex-shrink-0 ${
                                    plan.disabled ? "text-muted-foreground/60" : "text-primary"
                                  }`}
                                  aria-hidden="true"
                                />
                                <span
                                  class={`text-sm ${
                                    plan.disabled ? "text-muted-foreground" : "text-muted-foreground"
                                  }`}
                                >
                                  {feature}
                                </span>
                              </li>
                            )}
                          </For>
                        </ul>

                        {plan.limitations.length > 0 && (
                          <>
                            <hr class="my-4 border-border" />
                            <h4 class="font-semibold text-card-foreground text-sm">Limitations:</h4>
                            <ul class="space-y-2" role="list">
                              <For each={plan.limitations}>
                                {(limitation) => (
                                  <li class="flex items-start" role="listitem">
                                    <div
                                      class="w-5 h-5 mr-3 mt-0.5 flex-shrink-0"
                                      aria-hidden="true"
                                    >
                                      <div class="w-1.5 h-1.5 bg-muted-foreground rounded-full mx-auto mt-2" />
                                    </div>
                                    <span class="text-muted-foreground/80 text-sm">
                                      {limitation}
                                    </span>
                                  </li>
                                )}
                              </For>
                            </ul>
                          </>
                        )}
                      </div>
                    </div>
                  </article>
                );
              }}
            </For>
          </section>

          {/* API Access for Developers Section */}
          <section class="mb-20" aria-labelledby="api-access">
            <div class="relative bg-foreground text-background rounded-3xl p-8 md:p-12 shadow-2xl border border-border overflow-hidden">
              <div class="absolute inset-0 overflow-hidden pointer-events-none">
                <div class="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
                <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
              </div>

              <div class="relative z-10">
                <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-4">
                      <div class="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                        <svg
                          class="w-6 h-6 text-primary-foreground"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                          />
                        </svg>
                      </div>
                      <div>
                        <h2 id="api-access" class="text-2xl md:text-3xl font-bold text-background">
                          API Access for Developers
                        </h2>
                        <span class="inline-flex items-center gap-1.5 mt-1 px-3 py-1 bg-accent/20 text-accent text-xs font-semibold rounded-full border border-accent/30">
                          <Clock class="w-3 h-3" />
                          Coming Soon for Premium Users
                        </span>
                      </div>
                    </div>
                    <p class="text-background/70 text-lg mb-6 max-w-2xl">
                      Build custom integrations with the Loci API. Access our AI-powered travel
                      recommendations, POI data, and personalization engine directly in your
                      applications.
                    </p>
                    <ul class="grid grid-cols-1 md:grid-cols-2 gap-3 text-background/80">
                      <li class="flex items-center gap-2">
                        <Check class="w-5 h-5 text-primary flex-shrink-0" />
                        <span>RESTful & gRPC endpoints</span>
                      </li>
                      <li class="flex items-center gap-2">
                        <Check class="w-5 h-5 text-primary flex-shrink-0" />
                        <span>Real-time streaming responses</span>
                      </li>
                      <li class="flex items-center gap-2">
                        <Check class="w-5 h-5 text-primary flex-shrink-0" />
                        <span>AI recommendation engine</span>
                      </li>
                      <li class="flex items-center gap-2">
                        <Check class="w-5 h-5 text-primary flex-shrink-0" />
                        <span>Comprehensive documentation</span>
                      </li>
                      <li class="flex items-center gap-2">
                        <Check class="w-5 h-5 text-primary flex-shrink-0" />
                        <span>SDKs for popular languages</span>
                      </li>
                      <li class="flex items-center gap-2">
                        <Check class="w-5 h-5 text-primary flex-shrink-0" />
                        <span>Developer support</span>
                      </li>
                    </ul>
                  </div>
                  <div class="flex flex-col items-center md:items-end gap-4">
                    <div class="text-center md:text-right">
                      <div class="text-background/60 text-sm mb-1">Starting at</div>
                      <div class="text-4xl font-bold text-background">
                        $49<span class="text-lg text-background/60">/mo</span>
                      </div>
                      <div class="text-background/60 text-sm">for 10,000 API calls</div>
                    </div>
                    <button
                      class="inline-flex items-center gap-2 px-6 py-3 bg-background/10 text-background/80 rounded-xl font-semibold border border-background/20 cursor-not-allowed"
                      disabled
                    >
                      <Clock class="w-5 h-5" />
                      Notify Me When Available
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section class="bg-muted/50 rounded-2xl p-8 mb-20" aria-labelledby="feature-comparison">
            <h2 id="feature-comparison" class="text-3xl font-bold text-foreground text-center mb-8">
              Feature Comparison
            </h2>
            <div class="overflow-x-auto">
              <table
                class="w-full"
                role="table"
                aria-label="Feature comparison across pricing plans"
              >
                <thead>
                  <tr class="border-b border-border">
                    <th class="text-left py-4 pr-4 font-semibold text-foreground" scope="col">
                      Features
                    </th>
                    <th class="text-center py-4 px-4 font-semibold text-foreground" scope="col">
                      Free
                    </th>
                    <th
                      class="text-center py-4 px-4 font-semibold text-primary"
                      scope="col"
                    >
                      Explorer
                    </th>
                    <th
                      class="text-center py-4 pl-4 font-semibold text-accent"
                      scope="col"
                    >
                      Pro
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <For each={features}>
                    {(category) => (
                      <>
                        <tr>
                          <td colspan="4" class="py-4">
                            <h3 class="font-semibold text-foreground">{category.category}</h3>
                          </td>
                        </tr>
                        <For each={category.items}>
                          {(item) => (
                            <tr class="border-b border-border/50">
                              <td class="py-3 pr-4 text-muted-foreground">{item.feature}</td>
                              <td class="text-center py-3 px-4">
                                {typeof item.free === "boolean" ? (
                                  item.free ? (
                                    <Check
                                      class="w-5 h-5 text-accent mx-auto"
                                      aria-label="Included"
                                    />
                                  ) : (
                                    <div
                                      class="w-5 h-5 mx-auto flex items-center justify-center"
                                      aria-label="Not included"
                                    >
                                      <div class="w-4 h-0.5 bg-muted-foreground/50" />
                                    </div>
                                  )
                                ) : (
                                  <span class="text-sm text-muted-foreground">{item.free}</span>
                                )}
                              </td>
                              <td class="text-center py-3 px-4">
                                {typeof item.explorer === "boolean" ? (
                                  item.explorer ? (
                                    <Check
                                      class="w-5 h-5 text-accent mx-auto"
                                      aria-label="Included"
                                    />
                                  ) : (
                                    <div
                                      class="w-5 h-5 mx-auto flex items-center justify-center"
                                      aria-label="Not included"
                                    >
                                      <div class="w-4 h-0.5 bg-muted-foreground/50" />
                                    </div>
                                  )
                                ) : (
                                  <span class="text-sm text-primary font-medium">
                                    {item.explorer}
                                  </span>
                                )}
                              </td>
                              <td class="text-center py-3 pl-4">
                                {typeof item.pro === "boolean" ? (
                                  item.pro ? (
                                    <Check
                                      class="w-5 h-5 text-accent mx-auto"
                                      aria-label="Included"
                                    />
                                  ) : (
                                    <div
                                      class="w-5 h-5 mx-auto flex items-center justify-center"
                                      aria-label="Not included"
                                    >
                                      <div class="w-4 h-0.5 bg-muted-foreground/50" />
                                    </div>
                                  )
                                ) : (
                                  <span class="text-sm text-accent font-medium">
                                    {item.pro}
                                  </span>
                                )}
                              </td>
                            </tr>
                          )}
                        </For>
                      </>
                    )}
                  </For>
                </tbody>
              </table>
            </div>
          </section>

          {/* FAQ Section */}
          <section class="mb-20" aria-labelledby="faq">
            <h2 id="faq" class="text-3xl font-bold text-foreground text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div class="max-w-3xl mx-auto space-y-6" role="list">
              <article class="bg-card rounded-lg p-6 border border-border" role="listitem">
                <h3 class="font-semibold text-card-foreground mb-2">
                  Can I upgrade or downgrade my plan anytime?
                </h3>
                <p class="text-muted-foreground">
                  Yes, you can change your plan at any time. Changes take effect immediately, and
                  we'll prorate the charges accordingly.
                </p>
              </article>
              <article class="bg-card rounded-lg p-6 border border-border" role="listitem">
                <h3 class="font-semibold text-card-foreground mb-2">
                  Is there a free trial for paid plans?
                </h3>
                <p class="text-muted-foreground">
                  We don't offer a traditional free trial, but our Free plan gives you access to
                  core features. Plus, all paid plans come with a 30-day money-back guarantee.
                </p>
              </article>
              <article class="bg-card rounded-lg p-6 border border-border" role="listitem">
                <h3 class="font-semibold text-card-foreground mb-2">
                  How does the AI learn my preferences?
                </h3>
                <p class="text-muted-foreground">
                  Our AI analyzes your explicit preferences, saved locations, and interaction
                  patterns to provide increasingly personalized recommendations over time.
                </p>
              </article>
              <article class="bg-card rounded-lg p-6 border border-border" role="listitem">
                <h3 class="font-semibold text-card-foreground mb-2">
                  Do you offer discounts for annual subscriptions?
                </h3>
                <p class="text-muted-foreground">
                  Yes! Annual subscriptions receive a 20% discount. Contact our support team to set
                  up annual billing.
                </p>
              </article>
            </div>
          </section>

          {/* Call to Action */}
          <section
            class="text-center glass-panel gradient-border rounded-2xl p-12"
            aria-labelledby="final-cta"
          >
            <h2 id="final-cta" class="text-3xl font-bold mb-4 text-foreground">
              Ready to Start Exploring?
            </h2>
            <p class="text-lg mb-8 text-muted-foreground max-w-2xl mx-auto">
              Join thousands of users who've already discovered their perfect spots with Loci. Start
              free and upgrade when you're ready for more.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <A href="/auth/signup" class="inline-block">
                <button
                  class="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-colors shadow-lg"
                  aria-label="Sign up for Loci to start exploring for free"
                >
                  Start Free Today
                </button>
              </A>
              <A href="/features" class="inline-block">
                <button
                  class="border border-border text-foreground hover:bg-muted font-semibold px-8 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-colors"
                  aria-label="Learn more about Loci features"
                >
                  Learn More
                </button>
              </A>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
