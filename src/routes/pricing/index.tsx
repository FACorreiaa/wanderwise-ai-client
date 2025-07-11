import { A } from "@solidjs/router";
import { ArrowLeft, Check, MapPin, Star } from "lucide-solid";
import { createSignal, Show } from "solid-js";

export default function PlanSelection() {
  const [selectedPeriod, setSelectedPeriod] = createSignal<
    "monthly" | "yearly"
  >("monthly");

  const plans = {
    monthly: {
      name: "Explorer",
      price: "$5.99",
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
        "Enhanced AI recommendations",
      ],
      total: "$5.99/month",
      billing: "Billed monthly",
    },
    yearly: {
      name: "Explorer",
      price: "$55",
      period: "per year",
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
      total: "$55/year",
      billing: "Billed annually",
      savings: "Save $16.88 per year",
    },
  };

  const currentPlan = () => plans[selectedPeriod()];
  const IconComponent = MapPin;

  return (
    <div class="min-h-screen bg-background text-foreground transition-colors">
      <div class="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <header class="mb-8">
          <div class="flex items-center gap-4 mb-6">
            <A
              href="/pricing"
              class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft class="w-5 h-5" />
            </A>
            <h1 class="text-3xl font-bold text-foreground">Choose Your Plan</h1>
          </div>
          <p class="text-lg text-muted-foreground">
            Select your preferred billing cycle for the Explorer Plan
          </p>
        </header>

        {/* Plan Selection Toggle */}
        <div class="mb-8">
          <div class="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg inline-flex">
            <button
              onClick={() => setSelectedPeriod("monthly")}
              class={`px-6 py-3 rounded-md font-medium transition-colors ${
                selectedPeriod() === "monthly"
                  ? "bg-white dark:bg-gray-700 text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setSelectedPeriod("yearly")}
              class={`px-6 py-3 rounded-md font-medium transition-colors relative ${
                selectedPeriod() === "yearly"
                  ? "bg-white dark:bg-gray-700 text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Yearly
              <span class="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Save 23%
              </span>
            </button>
          </div>
        </div>

        {/* Selected Plan Card */}
        <div class="grid md:grid-cols-2 gap-8">
          {/* Plan Details */}
          <div class="bg-card border-2 border-blue-500 rounded-2xl shadow-lg p-8 relative">
            <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div class="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                <Star class="w-4 h-4 mr-1" />
                Most Popular
              </div>
            </div>

            <div class="flex items-center mb-6">
              <div class="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-lg mr-4">
                <IconComponent class="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 class="text-2xl font-bold text-card-foreground">
                  {currentPlan().name}
                </h3>
                <p class="text-muted-foreground">{currentPlan().description}</p>
              </div>
            </div>

            <div class="mb-6">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-4xl font-bold text-card-foreground">
                  {currentPlan().price}
                </span>
                <span class="text-muted-foreground">
                  /{selectedPeriod() === "monthly" ? "month" : "year"}
                </span>
              </div>
              <p class="text-sm text-muted-foreground">
                {currentPlan().billing}
              </p>
              <Show when={selectedPeriod() === "yearly"}>
                <p class="text-sm text-green-600 font-medium mt-1">
                  {currentPlan().savings}
                </p>
              </Show>
            </div>

            <div class="space-y-3 mb-8">
              <h4 class="font-semibold text-card-foreground">Includes:</h4>
              <ul class="space-y-2">
                {currentPlan().features.map((feature) => (
                  <li class="flex items-start">
                    <Check class="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-green-500" />
                    <span class="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button class="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">
              Subscribe to {currentPlan().name} - {currentPlan().total}
            </button>
          </div>

          {/* Summary Card */}
          <div class="bg-muted/50 rounded-2xl p-8">
            <h3 class="text-xl font-bold mb-6">Order Summary</h3>

            <div class="space-y-4 mb-6">
              <div class="flex justify-between items-center">
                <span class="text-muted-foreground">Plan</span>
                <span class="font-medium">{currentPlan().name}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-muted-foreground">Billing</span>
                <span class="font-medium">
                  {selectedPeriod() === "monthly" ? "Monthly" : "Yearly"}
                </span>
              </div>
              <Show when={selectedPeriod() === "yearly"}>
                <div class="flex justify-between items-center text-green-600">
                  <span>Savings</span>
                  <span class="font-medium">$16.88/year</span>
                </div>
              </Show>
              <hr class="border-border" />
              <div class="flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span>{currentPlan().total}</span>
              </div>
            </div>

            <div class="space-y-4">
              <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div class="flex items-center gap-2 mb-2">
                  <Star class="w-4 h-4 text-blue-600" />
                  <span class="font-medium text-blue-800 dark:text-blue-200">
                    30-day money-back guarantee
                  </span>
                </div>
                <p class="text-sm text-blue-700 dark:text-blue-300">
                  Cancel anytime within 30 days for a full refund
                </p>
              </div>

              <div class="text-sm text-muted-foreground">
                <p>• Cancel or change your plan anytime</p>
                <p>• Secure payment processing</p>
                <p>• Instant access to all features</p>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Pricing Link */}
        <div class="mt-8 text-center">
          <A
            href="/pricing"
            class="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to all pricing plans
          </A>
        </div>
      </div>
    </div>
  );
}
