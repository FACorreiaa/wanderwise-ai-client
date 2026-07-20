import { Show, createMemo } from "solid-js";
import { A } from "@solidjs/router";
import { useLists } from "~/lib/api/lists";
import { useFavoritesList } from "~/lib/api/favorites";
import { useUserSubscription } from "~/lib/api/billing";
import { isProPlan } from "~/lib/subscription";

/** Free-tier caps — keep in sync with server subscription/entitlements.go + PRICING.md */
export const FREE_MAX_LISTS = 5;
export const FREE_MAX_PLACES = 50;

/**
 * Shows free-tier list/place usage (e.g. Lists 2/5 · Saves 12/50).
 * Hidden for Pro or when unauthenticated queries return empty.
 */
export default function EntitlementsBadge() {
  const subscription = useUserSubscription();
  const lists = useLists();
  const favorites = useFavoritesList();

  const isPro = () => isProPlan(subscription.data?.plan);

  const listCount = createMemo(() => (lists.data ?? []).length);
  const placeCount = createMemo(() => {
    const favs = favorites.data?.items?.length ?? 0;
    // List item totals aren't in GetLists payload cheaply — favorites alone is
    // the visible "saves" signal until EntitlementService lands.
    return favs;
  });

  const nearListLimit = () => !isPro() && listCount() >= FREE_MAX_LISTS - 1;
  const nearPlaceLimit = () => !isPro() && placeCount() >= FREE_MAX_PLACES - 5;

  return (
    <Show when={!isPro() && (listCount() > 0 || placeCount() > 0)}>
      <A
        href="/pricing"
        class={`hidden sm:inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors hover:border-primary/40 ${
          nearListLimit() || nearPlaceLimit()
            ? "border-amber-400/50 bg-amber-500/10 text-amber-800 dark:text-amber-200"
            : "border-border bg-muted/40 text-muted-foreground"
        }`}
        title="Free plan usage — upgrade for unlimited saves"
      >
        <span>
          Lists {listCount()}/{FREE_MAX_LISTS}
        </span>
        <span class="opacity-40">·</span>
        <span>
          Saves {placeCount()}/{FREE_MAX_PLACES}
        </span>
      </A>
    </Show>
  );
}
