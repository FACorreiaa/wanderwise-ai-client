import { createSignal, Show } from "solid-js";
import { A } from "@solidjs/router";
import { CalendarPlus, Crown, Download, Lock } from "lucide-solid";
import { exportTripICS, exportTripPDF } from "~/lib/api/trips";
import { showUpgradePrompt } from "~/lib/upgrade-prompt";

export interface TripExportMenuProps {
  tripId: string;
  dayCount: number;
  isPro: boolean;
}

/**
 * ICS always available. Full multi-day PDF is Pro; free users get Day-1 tease
 * via upgrade prompt when dayCount > 1.
 */
export default function TripExportMenu(props: TripExportMenuProps) {
  const [busy, setBusy] = createSignal<"ics" | "pdf" | null>(null);
  const [toast, setToast] = createSignal<string | null>(null);

  const flash = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3200);
  };

  const handleICS = async () => {
    if (!props.isPro && props.dayCount > 1) {
      showUpgradePrompt("free_quota");
      flash("Day-1 calendar works free. Pro unlocks the full multi-day .ics.");
    }
    setBusy("ics");
    try {
      await exportTripICS(props.tripId);
      flash(
        props.isPro || props.dayCount <= 1
          ? "Calendar downloaded."
          : "Downloaded. Upgrade for every day.",
      );
    } catch (e) {
      flash(e instanceof Error ? e.message : "Export failed");
    } finally {
      setBusy(null);
    }
  };

  const handlePDF = async () => {
    if (!props.isPro && props.dayCount > 1) {
      showUpgradePrompt("free_quota");
      flash("Upgrade to Pro for the full multi-day PDF pack.");
      return;
    }
    setBusy("pdf");
    try {
      await exportTripPDF(props.tripId);
      flash("PDF downloaded.");
    } catch (e) {
      flash(e instanceof Error ? e.message : "PDF export failed");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div class="relative flex flex-wrap items-center gap-2">
      <button
        type="button"
        class="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm hover:bg-accent disabled:opacity-50"
        disabled={busy() !== null}
        onClick={() => void handleICS()}
      >
        <CalendarPlus class="h-4 w-4" />
        {busy() === "ics" ? "…" : ".ics"}
      </button>
      <button
        type="button"
        class="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm hover:bg-accent disabled:opacity-50"
        disabled={busy() !== null}
        onClick={() => void handlePDF()}
      >
        <Show when={!props.isPro && props.dayCount > 1} fallback={<Download class="h-4 w-4" />}>
          <Lock class="h-4 w-4" />
        </Show>
        {busy() === "pdf" ? "…" : "PDF"}
        <Show when={!props.isPro && props.dayCount > 1}>
          <Crown class="h-3.5 w-3.5 text-amber-500" />
        </Show>
      </button>
      <Show when={!props.isPro}>
        <A href="/pricing" class="text-xs text-muted-foreground underline-offset-2 hover:underline">
          Pro unlocks full export
        </A>
      </Show>
      <Show when={toast()}>
        <p class="basis-full text-xs text-muted-foreground">{toast()}</p>
      </Show>
    </div>
  );
}
