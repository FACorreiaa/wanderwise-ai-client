import { For, Show } from "solid-js";
import { Brain, Database, Eye, RotateCcw, ShieldCheck } from "lucide-solid";
import {
  usePersonalizationSettings,
  useResetTasteProfile,
  useTasteProfile,
  useUpdatePersonalizationSettings,
} from "~/lib/api/recommendations";
import { Button } from "~/ui/button";

export default function TasteAndPrivacy() {
  const settings = usePersonalizationSettings();
  const taste = useTasteProfile();
  const update = useUpdatePersonalizationSettings();
  const reset = useResetTasteProfile();

  const save = (key: "personalizationEnabled" | "contributeAggregate", value: boolean) => {
    const current = settings.data;
    if (!current) return;
    update.mutate({
      personalizationEnabled:
        key === "personalizationEnabled" ? value : current.personalizationEnabled,
      contributeAggregate: key === "contributeAggregate" ? value : current.contributeAggregate,
      disclosureSeen: true,
    });
  };

  return (
    <section class="rounded-xl border border-border bg-card p-6 sm:p-8">
      <div class="flex items-start gap-4">
        <span class="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-secondary text-secondary-foreground">
          <Brain class="h-5 w-5" />
        </span>
        <div>
          <p class="font-coord text-[10px] uppercase tracking-[0.18em] text-accent">
            Your taste · your control
          </p>
          <h3 class="mt-1 text-2xl">How Loci learns</h3>
          <p class="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Loci learns from places you keep, remove, visit, and rate. Search text and precise
            location are not stored in recommendation traces.
          </p>
        </div>
      </div>

      <Show
        when={settings.data}
        fallback={<div class="mt-6 h-24 animate-pulse rounded-lg bg-muted" />}
      >
        {(current) => (
          <div class="mt-7 grid gap-3">
            <label class="flex cursor-pointer items-start justify-between gap-5 rounded-lg border border-border bg-background p-4">
              <span class="flex gap-3">
                <Eye class="mt-0.5 h-5 w-5 text-primary" />
                <span>
                  <span class="block text-sm font-semibold">Personalize my recommendations</span>
                  <span class="mt-1 block text-xs leading-5 text-muted-foreground">
                    Use your private taste profile to reorder places for you.
                  </span>
                </span>
              </span>
              <input
                type="checkbox"
                checked={current().personalizationEnabled}
                onChange={(event) => save("personalizationEnabled", event.currentTarget.checked)}
                class="h-5 w-5 accent-[hsl(var(--accent))]"
              />
            </label>
            <label class="flex cursor-pointer items-start justify-between gap-5 rounded-lg border border-border bg-background p-4">
              <span class="flex gap-3">
                <Database class="mt-0.5 h-5 w-5 text-primary" />
                <span>
                  <span class="block text-sm font-semibold">Improve Loci for everyone</span>
                  <span class="mt-1 block text-xs leading-5 text-muted-foreground">
                    Include de-identified outcomes in aggregate quality measurement. This is
                    separate from personal recommendations.
                  </span>
                </span>
              </span>
              <input
                type="checkbox"
                checked={current().contributeAggregate}
                onChange={(event) => save("contributeAggregate", event.currentTarget.checked)}
                class="h-5 w-5 accent-[hsl(var(--accent))]"
              />
            </label>
          </div>
        )}
      </Show>

      <div class="mt-8 border-t border-border pt-7">
        <div class="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div class="flex items-center gap-2 text-sm font-semibold">
              <ShieldCheck class="h-4 w-4 text-accent" />
              Taste profile
            </div>
            <p class="mt-1 text-xs text-muted-foreground">
              Based on {taste.data?.feedbackCount || 0} explicit outcomes ·{" "}
              {taste.data?.algorithmVersion || "taste-v1"}
            </p>
          </div>
          <Button
            variant="outline"
            class="gap-2 text-destructive"
            disabled={reset.isPending}
            onClick={() => {
              if (window.confirm("Delete your learned taste and recommendation history?"))
                reset.mutate();
            }}
          >
            <RotateCcw class="h-4 w-4" />
            Reset learned taste
          </Button>
        </div>
        <Show
          when={taste.data?.traits?.length}
          fallback={
            <p class="mt-5 rounded-lg bg-muted p-4 text-sm text-muted-foreground">
              Keep, remove, or rate a few places and your inspectable taste traits will appear here.
            </p>
          }
        >
          <div class="mt-5 grid gap-3 sm:grid-cols-2">
            <For each={taste.data?.traits}>
              {(trait) => (
                <div class="rounded-lg border border-border bg-background p-4">
                  <div class="flex items-center justify-between gap-3">
                    <span class="text-sm font-semibold">{trait.label}</span>
                    <span class="font-coord text-[9px] uppercase tracking-wider text-muted-foreground">
                      {Math.round(trait.confidence * 100)}% sure
                    </span>
                  </div>
                  <div class="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      class="h-full rounded-full bg-accent"
                      style={{ width: `${Math.max(4, Math.abs(trait.score) * 100)}%` }}
                    />
                  </div>
                  <p class="mt-2 text-xs text-muted-foreground">{trait.evidenceCount} signals</p>
                </div>
              )}
            </For>
          </div>
        </Show>
      </div>
    </section>
  );
}
