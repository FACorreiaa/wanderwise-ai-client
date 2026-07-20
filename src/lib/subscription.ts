// Subscription helpers shared by pricing, billing, and Trip Kit gating.
// Backend stores plan as free | premium_monthly | premium_annual (see
// loci-connect-server/internal/domain/subscription/limits.go). Clients may also
// see legacy/marketing strings; treat those conservatively.

export type PlanKind = "free" | "pro";

/** True when the plan string is a paid Pro tier. */
export function isProPlan(plan?: string | null): boolean {
  if (!plan) return false;
  const p = plan.trim().toLowerCase();
  return (
    p === "premium_monthly" ||
    p === "premium_annual" ||
    p === "premium" ||
    p === "pro" ||
    // Legacy UI labels that never existed in the DB enum — still treat as paid
    // if somehow present so we do not downgrade active subscribers.
    p === "paid" ||
    p === "explorer"
  );
}

export function planKind(plan?: string | null): PlanKind {
  return isProPlan(plan) ? "pro" : "free";
}

/** Human label for the current plan. */
export function planDisplayName(plan?: string | null): string {
  if (!plan || plan === "free") return "Free";
  if (plan === "premium_annual") return "Pro (Annual)";
  if (isProPlan(plan)) return "Pro";
  return "Free";
}

/** Stripe price IDs from Vite env (must match server STRIPE_PRICE_ID_*). */
export function stripePriceIds(): { monthly: string; annual: string } {
  return {
    monthly: (import.meta.env.VITE_STRIPE_PRICE_ID_MONTHLY ?? "").trim(),
    annual: (import.meta.env.VITE_STRIPE_PRICE_ID_ANNUAL ?? "").trim(),
  };
}

export function hasCheckoutConfigured(): boolean {
  const { monthly, annual } = stripePriceIds();
  return Boolean(monthly || annual);
}
