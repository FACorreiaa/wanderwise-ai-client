// Entitlement (freemium feature) error classification.
// Server returns Connect Code.PermissionDenied with metadata:
//   x-loci-entitlement: lists | places
//   x-loci-entitlement-limit / x-loci-entitlement-used
import { Code, ConnectError } from "@connectrpc/connect";
import { showUpgradePrompt, type UpgradePromptKind } from "./upgrade-prompt";

export const ENTITLEMENT_HEADER = "x-loci-entitlement";

export type EntitlementFeature = "lists" | "places" | "filters" | "export" | null;

export interface EntitlementErrorInfo {
  feature: EntitlementFeature;
  userMessage: string;
  upgradeKind: UpgradePromptKind;
}

const MESSAGES: Record<Exclude<EntitlementFeature, null>, string> = {
  lists: "Free plans include 5 lists. Upgrade to Pro for unlimited lists.",
  places: "Free plans include 50 saved places. Upgrade to Pro for unlimited saves.",
  filters:
    "Advanced filters are a Pro feature. Upgrade to unlock cuisine, accessibility, and niche tags.",
  export: "Full multi-day export is Pro. Upgrade to download every day.",
};

function featureFromHeader(raw: string | null | undefined): EntitlementFeature {
  if (!raw) return null;
  const v = raw.trim().toLowerCase();
  if (v === "lists" || v === "places" || v === "filters" || v === "export") return v;
  return null;
}

function featureFromMessage(message: string): EntitlementFeature {
  const lower = message.toLowerCase();
  if (lower.includes("lists limit") || lower.includes("list limit")) return "lists";
  if (lower.includes("places limit") || lower.includes("place limit")) return "places";
  return null;
}

export function classifyEntitlementError(error: unknown): EntitlementErrorInfo | null {
  if (!(error instanceof ConnectError) && !(error instanceof Error)) {
    return null;
  }

  let feature: EntitlementFeature = null;
  let message = "";

  if (error instanceof ConnectError) {
    if (error.code !== Code.PermissionDenied) return null;
    feature = featureFromHeader(error.metadata.get(ENTITLEMENT_HEADER));
    message = error.rawMessage || error.message;
    if (!feature) feature = featureFromMessage(message);
  } else {
    message = error.message;
    feature = featureFromMessage(message);
    if (!feature) return null;
  }

  if (!feature) {
    // Generic permission denied on save paths — still nudge upgrade if message hints freemium.
    if (/free plan|upgrade|entitlement|limit reached/i.test(message)) {
      feature = "places";
    } else {
      return null;
    }
  }

  return {
    feature,
    userMessage: MESSAGES[feature],
    upgradeKind:
      feature === "filters" || feature === "export" || feature === "lists" || feature === "places"
        ? "entitlement"
        : "free_quota",
  };
}

/** If error is an entitlement denial, open upgrade prompt and return true. */
export function handleEntitlementError(error: unknown): boolean {
  const info = classifyEntitlementError(error);
  if (!info) return false;
  showUpgradePrompt(info.upgradeKind, info.userMessage);
  return true;
}
