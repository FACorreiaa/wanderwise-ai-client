import { A } from "@solidjs/router";
import { Check, Star, Zap, Crown, Heart, MapPin, Brain, Clock } from "lucide-solid";
import { createSignal, Show } from "solid-js";
import PromoCodeSection from "~/components/PromoCodeSection";

export default function Pricing() {
  const [appliedPromo, setAppliedPromo] = createSignal(null);

  const handlePromoSuccess = (promoData: any) => {
    setAppliedPromo(promoData);
    console.log('Promo applied:', promoData);
  };

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for casual explorers",
      icon: Heart,
      color: "gray",
      features: [
        "Core AI recommendations",
        "Basic preference filters",
        "Up to 10 saved locations",
        "Interactive map view",
        "Mobile-optimized experience",
        "Community support"
      ],
      limitations: [
        "Limited to 5 searches per day",
        "Basic filtering options only",
        "Non-intrusive contextual ads"
      ],
      cta: "Get Started Free",
      popular: false
    },
    {
      name: "Explorer",
      price: "$3.99",
      period: "per month",
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
        "Enhanced AI recommendations"
      ],
      limitations: [],
      cta: "Start Explorer Plan",
      popular: true
    },
    {
      name: "Pro",
      price: "$9.99",
      period: "per month",
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
        "Dedicated account manager"
      ],
      limitations: [],
      cta: "Coming Soon",
      popular: false,
      disabled: true
    }
  ];

  const features = [
    {
      category: "AI & Personalization",
      items: [
        { feature: "Basic AI recommendations", free: true, explorer: true, pro: true },
        { feature: "Advanced AI with learning", free: false, explorer: true, pro: true },
        { feature: "Semantic search & embeddings", free: false, explorer: false, pro: true },
        { feature: "24/7 AI agent", free: false, explorer: false, pro: "Coming Soon" }
      ]
    },
    {
      category: "Search & Discovery",
      items: [
        { feature: "Daily searches", free: "5 per day", explorer: "Unlimited", pro: "Unlimited" },
        { feature: "Basic filters", free: true, explorer: true, pro: true },
        { feature: "Advanced filters", free: false, explorer: true, pro: true },
        { feature: "Multi-city planning", free: false, explorer: false, pro: true }
      ]
    },
    {
      category: "Organization",
      items: [
        { feature: "Saved locations", free: "10", explorer: "100", pro: "Unlimited" },
        { feature: "Custom lists", free: false, explorer: true, pro: true },
        { feature: "Itinerary planning", free: "Basic", explorer: "Advanced", pro: "Premium" },
        { feature: "Export capabilities", free: false, explorer: false, pro: true }
      ]
    },
    {
      category: "Experience",
      items: [
        { feature: "Mobile experience", free: true, explorer: true, pro: true },
        { feature: "Offline access", free: false, explorer: false, pro: true },
        { feature: "Ad-free experience", free: false, explorer: true, pro: true },
        { feature: "Exclusive content", free: false, explorer: false, pro: true }
      ]
    }
  ];

  const getColorClasses = (color: string, type: 'bg' | 'text' | 'border') => {
    const colors = {
      gray: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' },
      blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200' }
    };
    return colors[color as keyof typeof colors][type];
  };

  return (
    <div class="min-h-screen bg-background text-foreground transition-colors">
      <div class="max-w-7xl mx-auto px-4 py-12 space-y-12">
        {/* Hero Section */}
        <header class="text-center">
          <div class="rounded-3xl bg-gradient-to-br from-[#1e66f5]/12 via-[#04a5e5]/12 to-[#df8e1d]/12 border border-[hsl(223,16%,83%)]/70 dark:border-white/10 shadow-[0_30px_80px_rgba(4,165,229,0.18)] p-10 space-y-4">
            <h1 class="text-4xl md:text-6xl font-bold text-foreground dark:text-white">
              Simple <span class="text-[#1e66f5] dark:text-blue-400">Pricing</span>
            </h1>
            <p class="text-xl text-[hsl(233,13%,41%)] dark:text-slate-200/85 max-w-3xl mx-auto leading-relaxed">
              Choose the perfect plan for your exploration needs. Catppuccin Latte keeps light mode calm; dark stays bold.
            </p>
            <div class="inline-flex items-center bg-[hsl(109,58%,40%)]/10 text-[hsl(109,58%,40%)] dark:bg-green-900/50 dark:text-green-200 px-4 py-2 rounded-full text-sm font-medium border border-[hsl(223,16%,83%)] dark:border-green-800">
              <Star class="w-4 h-4 mr-2" aria-hidden="true" />
              30-day money-back guarantee on all paid plans
            </div>
          </div>
        </header>

        {/* Promo Code Section */}
        <PromoCodeSection onSuccess={handlePromoSuccess} className="mb-16" />

        {/* Promo Success Banner */}
        <Show when={appliedPromo()}>
          <div class="max-w-4xl mx-auto mb-12">
            <div class="glass-panel gradient-border text-slate-900 dark:text-white rounded-2xl p-6 shadow-lg border-0">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-[#0c7df2] rounded-full flex items-center justify-center text-white shadow-lg ring-2 ring-white/60 dark:ring-slate-800">
                  <Star class="w-6 h-6" />
                </div>
                <div class="flex-1">
                  <h3 class="text-xl font-bold mb-1">Promo Code Applied Successfully! 🎉</h3>
                  <p class="text-slate-700 dark:text-slate-200">{appliedPromo()?.description}</p>
                  <Show when={appliedPromo()?.type === 'discount'}>
                    <p class="text-sm text-slate-500 dark:text-slate-300 mt-1">Your discount will be applied at checkout</p>
                  </Show>
                </div>
              </div>
            </div>
          </div>
        </Show>

        {/* Pricing Cards */}
        <section class="grid md:grid-cols-3 gap-8 mb-20" aria-labelledby="pricing-plans">
          <h2 id="pricing-plans" class="sr-only">Pricing Plans</h2>
          {plans.map((plan, index) => {
            const IconComponent = plan.icon;
            return (
              <article class={`relative bg-card border-2 rounded-2xl shadow-lg transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 ${
                plan.disabled 
                  ? 'border-gray-300 dark:border-gray-600 opacity-75' 
                  : plan.popular
                    ? 'border-blue-500 dark:border-blue-400 scale-105 hover:shadow-xl'
                    : 'border-border hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-xl'
                }`} aria-labelledby={`plan-${index}`}>
                {plan.popular && !plan.disabled && (
                  <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div class="bg-blue-500 dark:bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                      <Zap class="w-4 h-4 mr-1" aria-hidden="true" />
                      Most Popular
                    </div>
                  </div>
                )}
                
                {plan.disabled && (
                  <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div class="bg-orange-500 dark:bg-orange-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                      <Clock class="w-4 h-4 mr-1" aria-hidden="true" />
                      Coming Soon
                    </div>
                  </div>
                )}

                <div class="p-8">
                  <div class="flex items-center mb-4">
                    <div class={`${getColorClasses(plan.color, 'bg')} dark:bg-opacity-50 p-3 rounded-lg mr-4`} aria-hidden="true">
                      <IconComponent class={`w-6 h-6 ${getColorClasses(plan.color, 'text')} dark:opacity-90`} />
                    </div>
                    <h3 id={`plan-${index}`} class="text-2xl font-bold text-card-foreground">{plan.name}</h3>
                  </div>

                  <div class="mb-4">
                    <div class="flex items-center gap-2">
                      <span class={`text-4xl font-bold ${plan.disabled ? 'text-gray-500 dark:text-gray-400' : 'text-card-foreground'}`}>{plan.price}</span>
                      <span class={`ml-2 ${plan.disabled ? 'text-gray-500 dark:text-gray-400' : 'text-muted-foreground'}`}>/{plan.period}</span>
                    </div>
                    {/* Show discount for applicable plans */}
                    <Show when={appliedPromo() && appliedPromo()?.type === 'discount' && plan.name !== 'Free' && (appliedPromo()?.planAccess === 'any' || appliedPromo()?.planAccess === plan.name.toLowerCase())}>
                      <div class="flex items-center gap-2 mt-2">
                        <span class="text-lg text-muted-foreground line-through">{plan.price}</span>
                        <span class="text-2xl font-bold text-green-600 dark:text-green-400">
                          ${(parseFloat(plan.price.replace('$', '')) * (1 - appliedPromo()?.discount / 100)).toFixed(2)}
                        </span>
                        <span class="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded text-sm font-medium">
                          {appliedPromo()?.discount}% OFF
                        </span>
                      </div>
                    </Show>
                    {/* Show free trial indicator */}
                    <Show when={appliedPromo() && appliedPromo()?.type === 'free_trial' && plan.name !== 'Free' && (appliedPromo()?.planAccess === 'any' || appliedPromo()?.planAccess === plan.name.toLowerCase())}>
                      <div class="mt-2">
                        <span class="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                          FREE for {appliedPromo()?.duration} days
                        </span>
                      </div>
                    </Show>
                    {/* Show free access indicator */}
                    <Show when={appliedPromo() && appliedPromo()?.type === 'free_access' && plan.name !== 'Free' && (appliedPromo()?.planAccess === 'any' || appliedPromo()?.planAccess === plan.name.toLowerCase())}>
                      <div class="mt-2">
                        <span class="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full text-sm font-medium">
                          FREE ACCESS
                        </span>
                      </div>
                    </Show>
                  </div>

                  <p class="text-muted-foreground mb-6">{plan.description}</p>

                  <button
                    class={`w-full py-3 px-6 rounded-lg font-semibold transition-colors mb-6 focus:outline-none ${
                      plan.disabled
                        ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        : plan.popular
                          ? 'bg-blue-600 hover:bg-blue-700 focus:bg-blue-700 text-white focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                          : 'border border-border text-card-foreground hover:bg-muted focus:bg-muted focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                      }`}
                    disabled={plan.disabled}
                    aria-label={plan.disabled ? `${plan.name} plan coming soon` : `Choose ${plan.name} plan for ${plan.price} ${plan.period}`}
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
                    <h4 class={`font-semibold ${plan.disabled ? 'text-gray-500 dark:text-gray-400' : 'text-card-foreground'}`}>Includes:</h4>
                    <ul class="space-y-2" role="list">
                      {plan.features.map((feature) => (
                        <li class="flex items-start" role="listitem">
                          <Check class={`w-5 h-5 mr-3 mt-0.5 flex-shrink-0 ${
                            plan.disabled 
                              ? 'text-gray-400 dark:text-gray-500' 
                              : 'text-green-500 dark:text-green-400'
                          }`} aria-hidden="true" />
                          <span class={`text-sm ${
                            plan.disabled 
                              ? 'text-gray-500 dark:text-gray-400' 
                              : 'text-muted-foreground'
                          }`}>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {plan.limitations.length > 0 && (
                      <>
                        <hr class="my-4 border-border" />
                        <h4 class="font-semibold text-card-foreground text-sm">Limitations:</h4>
                        <ul class="space-y-2" role="list">
                          {plan.limitations.map((limitation) => (
                            <li class="flex items-start" role="listitem">
                              <div class="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" aria-hidden="true">
                                <div class="w-1.5 h-1.5 bg-muted-foreground rounded-full mx-auto mt-2"></div>
                              </div>
                              <span class="text-muted-foreground/80 text-sm">{limitation}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        {/* Feature Comparison Table */}
        <section class="bg-muted/50 rounded-2xl p-8 mb-20" aria-labelledby="feature-comparison">
          <h2 id="feature-comparison" class="text-3xl font-bold text-foreground text-center mb-8">Feature Comparison</h2>
          <div class="overflow-x-auto">
            <table class="w-full" role="table" aria-label="Feature comparison across pricing plans">
              <thead>
                <tr class="border-b border-border">
                  <th class="text-left py-4 pr-4 font-semibold text-foreground" scope="col">Features</th>
                  <th class="text-center py-4 px-4 font-semibold text-foreground" scope="col">Free</th>
                  <th class="text-center py-4 px-4 font-semibold text-blue-600 dark:text-blue-400" scope="col">Explorer</th>
                  <th class="text-center py-4 pl-4 font-semibold text-purple-600 dark:text-purple-400" scope="col">Pro</th>
                </tr>
              </thead>
              <tbody>
                {features.map((category, categoryIndex) => (
                  <>
                    <tr>
                      <td colspan="4" class="py-4">
                        <h3 class="font-semibold text-foreground">{category.category}</h3>
                      </td>
                    </tr>
                    {category.items.map((item, itemIndex) => (
                      <tr class="border-b border-border/50">
                        <td class="py-3 pr-4 text-muted-foreground">{item.feature}</td>
                        <td class="text-center py-3 px-4">
                          {typeof item.free === 'boolean' ? (
                            item.free ? (
                              <Check class="w-5 h-5 text-green-500 dark:text-green-400 mx-auto" aria-label="Included" />
                            ) : (
                              <div class="w-5 h-5 mx-auto flex items-center justify-center" aria-label="Not included">
                                <div class="w-4 h-0.5 bg-muted-foreground/50"></div>
                              </div>
                            )
                          ) : (
                            <span class="text-sm text-muted-foreground">{item.free}</span>
                          )}
                        </td>
                        <td class="text-center py-3 px-4">
                          {typeof item.explorer === 'boolean' ? (
                            item.explorer ? (
                              <Check class="w-5 h-5 text-green-500 dark:text-green-400 mx-auto" aria-label="Included" />
                            ) : (
                              <div class="w-5 h-5 mx-auto flex items-center justify-center" aria-label="Not included">
                                <div class="w-4 h-0.5 bg-muted-foreground/50"></div>
                              </div>
                            )
                          ) : (
                            <span class="text-sm text-blue-600 dark:text-blue-400 font-medium">{item.explorer}</span>
                          )}
                        </td>
                        <td class="text-center py-3 pl-4">
                          {typeof item.pro === 'boolean' ? (
                            item.pro ? (
                              <Check class="w-5 h-5 text-green-500 dark:text-green-400 mx-auto" aria-label="Included" />
                            ) : (
                              <div class="w-5 h-5 mx-auto flex items-center justify-center" aria-label="Not included">
                                <div class="w-4 h-0.5 bg-muted-foreground/50"></div>
                              </div>
                            )
                          ) : (
                            <span class="text-sm text-purple-600 dark:text-purple-400 font-medium">{item.pro}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ Section */}
        <section class="mb-20" aria-labelledby="faq">
          <h2 id="faq" class="text-3xl font-bold text-foreground text-center mb-12">Frequently Asked Questions</h2>
          <div class="max-w-3xl mx-auto space-y-6" role="list">
            <article class="bg-card rounded-lg p-6 border border-border" role="listitem">
              <h3 class="font-semibold text-card-foreground mb-2">Can I upgrade or downgrade my plan anytime?</h3>
              <p class="text-muted-foreground">Yes, you can change your plan at any time. Changes take effect immediately, and we'll prorate the charges accordingly.</p>
            </article>
            <article class="bg-card rounded-lg p-6 border border-border" role="listitem">
              <h3 class="font-semibold text-card-foreground mb-2">Is there a free trial for paid plans?</h3>
              <p class="text-muted-foreground">We don't offer a traditional free trial, but our Free plan gives you access to core features. Plus, all paid plans come with a 30-day money-back guarantee.</p>
            </article>
            <article class="bg-card rounded-lg p-6 border border-border" role="listitem">
              <h3 class="font-semibold text-card-foreground mb-2">How does the AI learn my preferences?</h3>
              <p class="text-muted-foreground">Our AI analyzes your explicit preferences, saved locations, and interaction patterns to provide increasingly personalized recommendations over time.</p>
            </article>
            <article class="bg-card rounded-lg p-6 border border-border" role="listitem">
              <h3 class="font-semibold text-card-foreground mb-2">Do you offer discounts for annual subscriptions?</h3>
              <p class="text-muted-foreground">Yes! Annual subscriptions receive a 20% discount. Contact our support team to set up annual billing.</p>
            </article>
          </div>
        </section>

        {/* Call to Action */}
        <section class="text-center glass-panel gradient-border rounded-2xl p-12" aria-labelledby="final-cta">
          <h2 id="final-cta" class="text-3xl font-bold mb-4 text-foreground">Ready to Start Exploring?</h2>
          <p class="text-lg mb-8 text-muted-foreground max-w-2xl mx-auto">
            Join thousands of users who've already discovered their perfect spots with Loci.
            Start free and upgrade when you're ready for more.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <A href="/auth/signup" class="inline-block">
              <button
                class="bg-[#0c7df2] text-white font-semibold px-8 py-3 rounded-lg hover:bg-[#0a6ed6] focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 transition-colors shadow-[0_14px_32px_rgba(12,125,242,0.22)] border border-white/30 dark:border-slate-800/60"
                aria-label="Sign up for Loci to start exploring for free"
              >
                Start Free Today
              </button>
            </A>
            <A href="/features" class="inline-block">
              <button
                class="border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:bg-white/60 dark:hover:bg-slate-900/60 font-semibold px-8 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 transition-colors"
                aria-label="Learn more about Loci features"
              >
                Learn More
              </button>
            </A>
          </div>
        </section>
      </div>
    </div>
  );
}
