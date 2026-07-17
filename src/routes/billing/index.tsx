import { createSignal, Show, For } from "solid-js";
import { A } from "@solidjs/router";
import {
  CreditCard,
  Crown,
  Zap,
  CheckCircle,
  Clock,
  ArrowUpRight,
  FileText,
  AlertCircle,
  Sparkles,
} from "lucide-solid";
import {
  useUserSubscription,
  useCreateCheckoutSession,
  useCreateCustomerPortalSession,
} from "~/lib/api/billing";
import { Button } from "~/ui/button";

// Plan configurations
const PLANS = {
  free: {
    name: "Free",
    icon: Zap,
    color: "gray",
    price: "$0",
    period: "forever",
    features: ["5 AI searches per day", "10 saved locations", "Basic recommendations"],
  },
  paid: {
    name: "Explorer",
    icon: CreditCard,
    color: "blue",
    price: "$3.99",
    period: "/month",
    features: [
      "Unlimited searches",
      "100 saved locations",
      "Advanced filters",
      "Ad-free",
      "Priority support",
    ],
  },
  premium: {
    name: "Pro",
    icon: Crown,
    color: "purple",
    price: "$9.99",
    period: "/month",
    features: [
      "Everything in Explorer",
      "Unlimited saved locations",
      "Offline access",
      "24/7 AI agent",
      "Premium partnerships",
    ],
  },
};

export default function BillingPage() {
  const subscriptionQuery = useUserSubscription();
  const createCheckoutMutation = useCreateCheckoutSession();
  const createPortalMutation = useCreateCustomerPortalSession();

  const [isUpgrading, setIsUpgrading] = createSignal(false);

  const subscription = () => subscriptionQuery.data;
  const currentPlan = () => subscription()?.plan || "free";
  const planConfig = () => PLANS[currentPlan() as keyof typeof PLANS] || PLANS.free;

  const handleUpgrade = async (targetPlan: "paid" | "premium") => {
    setIsUpgrading(true);
    try {
      const result = await createCheckoutMutation.mutateAsync({
        priceId: targetPlan === "paid" ? "price_explorer" : "price_pro",
        successUrl: `${window.location.origin}/billing?success=true`,
        cancelUrl: `${window.location.origin}/billing?canceled=true`,
      });
      if (result.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      console.error("Failed to create checkout session:", error);
    } finally {
      setIsUpgrading(false);
    }
  };

  const handleManageBilling = async () => {
    try {
      const result = await createPortalMutation.mutateAsync({
        returnUrl: window.location.href,
      });
      if (result.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      console.error("Failed to open billing portal:", error);
    }
  };

  const usagePercentage = () => {
    const usage = subscription()?.usage;
    if (!usage) return 0;
    return Math.min((usage.requestsToday / usage.requestsLimit) * 100, 100);
  };

  return (
    <div class="min-h-screen relative bg-background transition-colors">
      <div class="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(12,125,242,0.08),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(99,179,237,0.08),transparent_28%)] dark:bg-[radial-gradient(circle_at_20%_20%,rgba(12,125,242,0.15),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(99,179,237,0.1),transparent_28%)]" />

      <div class="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-foreground mb-2">
            Billing & Subscription
          </h1>
          <p class="text-muted-foreground">
            Manage your plan, usage, and payment methods
          </p>
        </div>

        <div class="grid gap-6 lg:grid-cols-3">
          {/* Current Plan Card */}
          <div class="lg:col-span-2">
            <div class="relative overflow-hidden rounded-3xl border border-white/30 bg-gradient-to-br from-[#0c7df2] via-[#6aa5ff] to-[#0c1747] text-white shadow-2xl">
              <div class="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.45),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.35),transparent_30%)]" />
              <div class="relative p-6 sm:p-8">
                <div class="flex items-start justify-between mb-6">
                  <div class="flex items-center gap-4">
                    <div class="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                      {(() => {
                        const PlanIcon = planConfig().icon;
                        return <PlanIcon class="w-7 h-7 text-white" />;
                      })()}
                    </div>
                    <div>
                      <div class="flex items-center gap-2">
                        <h2 class="text-2xl font-bold">{planConfig().name} Plan</h2>
                        <Show when={currentPlan() !== "free"}>
                          <span class="px-2.5 py-0.5 rounded-full bg-accent/20 text-accent-foreground text-xs font-medium border border-accent/30">
                            Active
                          </span>
                        </Show>
                      </div>
                      <div class="flex items-baseline gap-1 mt-1">
                        <span class="text-3xl font-bold">{planConfig().price}</span>
                        <span class="text-white/70">{planConfig().period}</span>
                      </div>
                    </div>
                  </div>

                  <Show when={currentPlan() !== "free"}>
                    <Button
                      variant="secondary"
                      class="bg-white/15 hover:bg-white/25 text-white border-white/20"
                      onClick={handleManageBilling}
                      disabled={createPortalMutation.isPending}
                    >
                      Manage Billing
                      <ArrowUpRight class="w-4 h-4 ml-1" />
                    </Button>
                  </Show>
                </div>

                {/* Usage Stats */}
                <div class="grid grid-cols-2 gap-4 mb-6">
                  <div class="rounded-2xl bg-white/10 border border-white/20 p-4 backdrop-blur">
                    <div class="text-xs uppercase tracking-wide text-white/70 mb-2">
                      Today's Usage
                    </div>
                    <div class="text-2xl font-bold">
                      {subscription()?.usage?.requestsToday || 0} /{" "}
                      {subscription()?.usage?.requestsLimit || 5}
                    </div>
                    <div class="text-xs text-white/80">AI searches used</div>
                    <div class="mt-3 h-2 rounded-full bg-white/20 overflow-hidden">
                      <div
                        class="h-full rounded-full bg-accent transition-all duration-500"
                        style={{ width: `${usagePercentage()}%` }}
                      />
                    </div>
                  </div>
                  <div class="rounded-2xl bg-white/10 border border-white/20 p-4 backdrop-blur">
                    <div class="text-xs uppercase tracking-wide text-white/70 mb-2">
                      Plan Features
                    </div>
                    <ul class="space-y-1">
                      <For each={planConfig().features.slice(0, 3)}>
                        {(feature) => (
                          <li class="flex items-center gap-2 text-sm">
                            <CheckCircle class="w-3.5 h-3.5 text-accent" />
                            <span class="text-white/90">{feature}</span>
                          </li>
                        )}
                      </For>
                    </ul>
                  </div>
                </div>

                {/* Upgrade Prompt */}
                <Show when={currentPlan() === "free"}>
                  <div class="flex items-center justify-between p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur">
                    <div class="flex items-center gap-3">
                      <Sparkles class="w-5 h-5 text-accent" />
                      <span class="text-sm font-medium">
                        Unlock unlimited AI searches and premium features
                      </span>
                    </div>
                    <Button
                      class="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                      onClick={() => handleUpgrade("paid")}
                      disabled={isUpgrading()}
                    >
                      {isUpgrading() ? "Redirecting..." : "Upgrade Now"}
                    </Button>
                  </div>
                </Show>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div class="space-y-4">
            <div class="rounded-2xl glass-panel border border-border p-6 shadow-sm">
              <h3 class="font-semibold text-foreground mb-4">Quick Actions</h3>
              <div class="space-y-3">
                <Show when={currentPlan() !== "free"}>
                  <button
                    onClick={handleManageBilling}
                    class="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-muted text-foreground border border-border hover:border-primary/30 transition-all"
                  >
                    <span class="flex items-center gap-2 text-sm font-medium">
                      <CreditCard class="w-4 h-4 text-primary" />
                      Update Payment Method
                    </span>
                    <ArrowUpRight class="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button
                    onClick={handleManageBilling}
                    class="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-muted text-foreground border border-border hover:border-primary/30 transition-all"
                  >
                    <span class="flex items-center gap-2 text-sm font-medium">
                      <FileText class="w-4 h-4 text-primary" />
                      View Invoices
                    </span>
                    <ArrowUpRight class="w-4 h-4 text-muted-foreground" />
                  </button>
                </Show>
                <A
                  href="/pricing"
                  class="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-muted text-foreground border border-border hover:border-primary/30 transition-all"
                >
                  <span class="flex items-center gap-2 text-sm font-medium">
                    <Zap class="w-4 h-4 text-primary" />
                    Compare Plans
                  </span>
                  <ArrowUpRight class="w-4 h-4 text-muted-foreground" />
                </A>
              </div>
            </div>

            {/* Need Help */}
            <div class="rounded-2xl bg-primary/5 border border-primary/20 p-6 shadow-sm">
              <div class="flex items-center gap-2 mb-2">
                <AlertCircle class="w-5 h-5 text-primary" />
                <h4 class="font-semibold text-foreground">Need Help?</h4>
              </div>
              <p class="text-sm text-muted-foreground mb-3">
                Questions about billing or your subscription? We're here to help.
              </p>
              <a
                href="mailto:support@loci.app"
                class="text-sm text-primary font-medium hover:underline"
              >
                Contact Support →
              </a>
            </div>
          </div>
        </div>

        {/* Available Plans (for upgrades) */}
        <Show when={currentPlan() !== "premium"}>
          <div class="mt-8">
            <h2 class="text-xl font-bold text-foreground mb-4">Available Upgrades</h2>
            <div class="grid gap-4 sm:grid-cols-2">
              <Show when={currentPlan() === "free"}>
                <div class="rounded-2xl glass-panel border-2 border-primary/30 p-6 shadow-sm relative">
                  <div class="absolute -top-3 left-4">
                    <span class="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                      Popular
                    </span>
                  </div>
                  <div class="flex items-center gap-3 mb-3">
                    <CreditCard class="w-6 h-6 text-primary" />
                    <h3 class="text-lg font-bold text-foreground">Explorer</h3>
                  </div>
                  <div class="flex items-baseline gap-1 mb-3">
                    <span class="text-2xl font-bold text-foreground">$3.99</span>
                    <span class="text-muted-foreground">/month</span>
                  </div>
                  <ul class="space-y-2 mb-4">
                    <For each={PLANS.paid.features}>
                      {(feature) => (
                        <li class="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle class="w-4 h-4 text-accent" />
                          {feature}
                        </li>
                      )}
                    </For>
                  </ul>
                  <Button
                    class="w-full"
                    onClick={() => handleUpgrade("paid")}
                    disabled={isUpgrading()}
                  >
                    {isUpgrading() ? "Processing..." : "Upgrade to Explorer"}
                  </Button>
                </div>
              </Show>

              <div
                class={`rounded-2xl glass-panel border border-border p-6 shadow-sm ${currentPlan() === "free" ? "" : "sm:col-span-2 max-w-md"}`}
              >
                <div class="flex items-center gap-3 mb-3">
                  <Crown class="w-6 h-6 text-primary" />
                  <h3 class="text-lg font-bold text-foreground">Pro</h3>
                  <span class="px-2 py-0.5 rounded bg-accent/10 text-accent text-xs font-medium">
                    Coming Soon
                  </span>
                </div>
                <div class="flex items-baseline gap-1 mb-3">
                  <span class="text-2xl font-bold text-foreground">$9.99</span>
                  <span class="text-muted-foreground">/month</span>
                </div>
                <ul class="space-y-2 mb-4">
                  <For each={PLANS.premium.features.slice(0, 4)}>
                    {(feature) => (
                      <li class="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle class="w-4 h-4 text-accent" />
                        {feature}
                      </li>
                    )}
                  </For>
                </ul>
                <Button variant="outline" class="w-full" disabled>
                  <Clock class="w-4 h-4 mr-2" />
                  Coming Soon
                </Button>
              </div>
            </div>
          </div>
        </Show>
      </div>
    </div>
  );
}
