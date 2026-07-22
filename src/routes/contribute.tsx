import { createMemo, createSignal, For, Show } from "solid-js";
import { CheckCircle2, MapPin, ShieldCheck, Users } from "lucide-solid";
import {
  type PlaceFactField,
  type VerificationTask,
  useContributorProfile,
  useSubmitPlaceClaim,
  useVerificationTasks,
} from "~/lib/api/place-intelligence";
import { Button } from "~/ui/button";

const fieldLabel = (field: PlaceFactField) =>
  field
    .replace("PLACE_FACT_FIELD_", "")
    .toLowerCase()
    .split("_")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");

export default function ContributePage() {
  const tasks = useVerificationTasks();
  const profile = useContributorProfile();
  const submit = useSubmitPlaceClaim();
  const [selected, setSelected] = createSignal<VerificationTask>();
  const [field, setField] = createSignal<PlaceFactField>();
  const [value, setValue] = createSignal("");
  const selectedFields = createMemo(() => selected()?.requestedFields || []);

  const selectTask = (task: VerificationTask) => {
    setSelected(task);
    setField(task.requestedFields[0]);
    setValue("");
  };

  return (
    <main class="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <section class="loci-hero">
        <div class="loci-hero__content grid gap-8 p-7 sm:p-10 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p class="font-coord text-[10px] uppercase tracking-[0.2em] text-primary-foreground/65">
              Local scout network
            </p>
            <h1 class="mt-3 max-w-2xl text-4xl text-primary-foreground sm:text-5xl">
              Make the field guide more true.
            </h1>
            <p class="mt-4 max-w-xl text-sm leading-6 text-primary-foreground/72">
              Confirm the useful details algorithms miss: current hours, accessibility, noise,
              crowds, and the feel of a place.
            </p>
          </div>
          <div class="grid grid-cols-3 gap-3 text-center">
            <div class="loci-hero__stat">
              <b class="block text-xl">{profile.data?.reputation || 0}</b>
              <span class="text-[10px] text-primary-foreground/60">Reputation</span>
            </div>
            <div class="loci-hero__stat">
              <b class="block text-xl">{profile.data?.submittedClaims || 0}</b>
              <span class="text-[10px] text-primary-foreground/60">Reports</span>
            </div>
            <div class="loci-hero__stat">
              <b class="block text-xl">{profile.data?.acceptedClaims || 0}</b>
              <span class="text-[10px] text-primary-foreground/60">Verified</span>
            </div>
          </div>
        </div>
      </section>

      <div class="mt-8 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <section>
          <div class="mb-4 flex items-end justify-between gap-4">
            <div>
              <p class="font-coord text-[10px] uppercase tracking-[0.18em] text-accent">
                Nearby knowledge gaps
              </p>
              <h2 class="mt-1 text-2xl">Places that need a fresh look</h2>
            </div>
            <span class="text-xs text-muted-foreground">Two matching reports verify a fact</span>
          </div>
          <div class="grid gap-3">
            <For
              each={tasks.data}
              fallback={<div class="h-32 animate-pulse rounded-xl bg-muted" />}
            >
              {(task) => (
                <button
                  type="button"
                  onClick={() => selectTask(task)}
                  class={`w-full rounded-xl border bg-card p-5 text-left transition hover:border-accent ${selected()?.poiId === task.poiId ? "border-accent ring-2 ring-accent/15" : "border-border"}`}
                >
                  <div class="flex items-start justify-between gap-4">
                    <div class="flex gap-3">
                      <MapPin class="mt-0.5 h-5 w-5 text-accent" />
                      <div>
                        <h3 class="text-lg">{task.poiName}</h3>
                        <p class="mt-1 text-xs text-muted-foreground">
                          Needs {task.requestedFields.map(fieldLabel).join(", ")}
                        </p>
                      </div>
                    </div>
                    <span class="font-coord text-[9px] uppercase tracking-wider text-muted-foreground">
                      Verify
                    </span>
                  </div>
                </button>
              )}
            </For>
          </div>
        </section>

        <aside class="h-fit rounded-xl border border-border bg-card p-6 lg:sticky lg:top-24">
          <Show
            when={selected()}
            fallback={
              <div class="py-10 text-center">
                <Users class="mx-auto h-7 w-7 text-muted-foreground" />
                <h2 class="mt-4 text-xl">Choose a place</h2>
                <p class="mt-2 text-sm text-muted-foreground">
                  Share only what you observed yourself and recently.
                </p>
              </div>
            }
          >
            {(task) => (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  const selectedField = field();
                  if (!selectedField || !value().trim()) return;
                  submit.mutate(
                    { poiId: task().poiId, field: selectedField, value: value().trim() },
                    { onSuccess: () => setValue("") },
                  );
                }}
              >
                <p class="font-coord text-[10px] uppercase tracking-[0.18em] text-accent">
                  Field report
                </p>
                <h2 class="mt-2 text-2xl">{task().poiName}</h2>
                <label class="mt-6 block text-sm font-semibold">What did you verify?</label>
                <select
                  value={field()}
                  onChange={(event) => setField(event.currentTarget.value as PlaceFactField)}
                  class="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                >
                  <For each={selectedFields()}>
                    {(item) => <option value={item}>{fieldLabel(item)}</option>}
                  </For>
                </select>
                <label class="mt-5 block text-sm font-semibold">What is true right now?</label>
                <textarea
                  value={value()}
                  onInput={(event) => setValue(event.currentTarget.value)}
                  rows={4}
                  maxlength={1000}
                  placeholder="Be specific and concise…"
                  class="mt-2 w-full rounded-lg border border-border bg-background p-3 text-sm"
                />
                <div class="mt-4 flex items-start gap-2 rounded-lg bg-secondary/60 p-3 text-xs leading-5 text-secondary-foreground">
                  <ShieldCheck class="mt-0.5 h-4 w-4 shrink-0" /> Reports expire as places change.
                  Your reputation grows when another scout corroborates your observation.
                </div>
                <Button
                  type="submit"
                  class="mt-5 w-full gap-2"
                  disabled={!value().trim() || submit.isPending}
                >
                  <CheckCircle2 class="h-4 w-4" />
                  {submit.isPending ? "Submitting…" : "Submit field report"}
                </Button>
                <Show when={submit.isSuccess}>
                  <p class="mt-3 text-center text-sm text-accent">
                    Report received. Thank you, scout.
                  </p>
                </Show>
              </form>
            )}
          </Show>
        </aside>
      </div>
    </main>
  );
}
