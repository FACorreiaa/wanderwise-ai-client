import { createSignal, For, Show, createEffect } from "solid-js";
import { useParams } from "@solidjs/router";
import {
  useTrip,
  useReorderStops,
  useRenameStop,
  useEditStopDuration,
  useSetConstraint,
  useShareTrip,
  type Trip,
  type TripDay,
  type TripStop,
  type TripConstraint,
} from "~/lib/api/trips";
import { TripPace } from "@buf/loci_loci-proto.bufbuild_es/loci/trip/trip_pb.js";
import { useUserSubscription } from "~/lib/api/billing";
import { isProPlan } from "~/lib/subscription";
import TripExportMenu from "~/components/trip/TripExportMenu";
import WhyThisStop from "~/components/poi/WhyThisStop";
import { cacheTripOffline } from "~/lib/trip-offline-cache";

const minutesToHHMM = (m?: number) => {
  if (m == null) return "";
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${String(h).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
};
const hhmmToMinutes = (v: string): number | undefined => {
  if (!v) return undefined;
  const [h, m] = v.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return undefined;
  return h * 60 + m;
};

const PACE_LABELS: Record<number, string> = {
  [TripPace.UNSPECIFIED]: "—",
  [TripPace.RELAXED]: "Relaxed",
  [TripPace.MODERATE]: "Moderate",
  [TripPace.PACKED]: "Packed",
};

export default function TripEditor() {
  const params = useParams();
  const tripQuery = useTrip(() => params.id!);
  const subscriptionQuery = useUserSubscription();
  const isPro = () => isProPlan(subscriptionQuery.data?.plan);

  const reorder = useReorderStops();
  const rename = useRenameStop();
  const editDur = useEditStopDuration();
  const setConstraint = useSetConstraint();
  const share = useShareTrip();

  const [shareUrl, setShareUrl] = createSignal<string | null>(null);
  const [conflict, setConflict] = createSignal(false);

  const trip = () => tripQuery.data as Trip | undefined;
  const version = () => trip()?.version ?? 0n;

  createEffect(() => {
    const t = trip();
    if (t?.id) cacheTripOffline(t);
  });

  const onMutationError = (err: unknown) => {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.toLowerCase().includes("version") || msg.toLowerCase().includes("precondition")) {
      setConflict(true);
      tripQuery.refetch();
    }
  };

  const moveStop = (day: TripDay, index: number, dir: -1 | 1) => {
    const ids = day.stops.map((s) => s.id);
    const j = index + dir;
    if (j < 0 || j >= ids.length) return;
    [ids[index], ids[j]] = [ids[j], ids[index]];
    reorder.mutate(
      { tripId: params.id!, dayId: day.id, orderedStopIds: ids, baseVersion: version() },
      { onError: onMutationError },
    );
  };

  const renameStop = (stop: TripStop, name: string) => {
    if (name === stop.name || !name.trim()) return;
    rename.mutate(
      { tripId: params.id!, stopId: stop.id, name, baseVersion: version() },
      { onError: onMutationError },
    );
  };

  const retimeStop = (stop: TripStop, startMinute?: number, durationMinutes?: number) => {
    editDur.mutate(
      {
        tripId: params.id!,
        stopId: stop.id,
        startMinute,
        durationMinutes: durationMinutes ?? stop.durationMinutes ?? 0,
        baseVersion: version(),
      },
      { onError: onMutationError },
    );
  };

  const updateConstraints = (patch: Partial<TripConstraint>) => {
    const t = trip();
    if (!t) return;
    setConstraint.mutate(
      { tripId: params.id!, constraints: { ...t.constraints, ...patch }, baseVersion: version() },
      { onError: onMutationError },
    );
  };

  const doShare = () =>
    share.mutate(
      { tripId: params.id!, isPublic: true },
      { onSuccess: (r) => setShareUrl(r.shareUrl) },
    );

  return (
    <main class="mx-auto max-w-3xl px-4 py-8">
      <Show when={tripQuery.isLoading}>
        <p class="text-muted-foreground">Loading trip…</p>
      </Show>
      <Show when={tripQuery.isError}>
        <p class="text-destructive">Couldn't load this trip.</p>
      </Show>

      <Show when={trip()} keyed>
        {(t) => (
          <>
            <header class="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 class="text-2xl font-semibold">{t.title}</h1>
                <p class="text-sm text-muted-foreground">
                  {t.cityName} · {t.days.length} day{t.days.length === 1 ? "" : "s"} · v
                  {t.version.toString()}
                </p>
              </div>
              <div class="flex flex-wrap items-center gap-2">
                <TripExportMenu
                  tripId={params.id!}
                  dayCount={t.days.length}
                  isPro={isPro()}
                  trip={t}
                />
                <button
                  class="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:opacity-90"
                  onClick={doShare}
                >
                  Share
                </button>
              </div>
            </header>

            <Show when={conflict()}>
              <div class="mb-4 rounded-md border border-amber-400 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                This trip changed on another device — reloaded the latest version. Re-apply your
                edit.
              </div>
            </Show>

            <Show when={shareUrl()}>
              <div class="mb-4 rounded-md border bg-muted px-3 py-2 text-sm">
                Share link:{" "}
                <a class="underline" href={shareUrl()!} target="_blank" rel="noreferrer">
                  {shareUrl()}
                </a>
              </div>
            </Show>

            <section class="mb-6 rounded-lg border p-4">
              <h2 class="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Trip preferences
              </h2>
              <div class="flex flex-wrap gap-4">
                <label class="flex flex-col text-sm">
                  Pace
                  <select
                    class="mt-1 rounded-md border px-2 py-1"
                    value={t.constraints.pace}
                    onChange={(e) => updateConstraints({ pace: Number(e.currentTarget.value) })}
                  >
                    <For each={Object.entries(PACE_LABELS)}>
                      {([val, label]) => <option value={val}>{label}</option>}
                    </For>
                  </select>
                </label>
                <label class="flex flex-col text-sm">
                  Budget (1–4)
                  <input
                    type="number"
                    min="1"
                    max="4"
                    class="mt-1 w-24 rounded-md border px-2 py-1"
                    value={t.constraints.budgetLevel ?? ""}
                    onChange={(e) =>
                      updateConstraints({
                        budgetLevel: e.currentTarget.value
                          ? Number(e.currentTarget.value)
                          : undefined,
                      })
                    }
                  />
                </label>
                <label class="flex flex-col text-sm">
                  Mobility
                  <input
                    type="text"
                    class="mt-1 w-40 rounded-md border px-2 py-1"
                    value={t.constraints.mobility ?? ""}
                    placeholder="walking, transit…"
                    onChange={(e) => updateConstraints({ mobility: e.currentTarget.value })}
                  />
                </label>
                <label class="flex flex-col text-sm">
                  Day starts
                  <input
                    type="time"
                    class="mt-1 rounded-md border px-2 py-1"
                    value={minutesToHHMM(t.constraints.dayStartMinute)}
                    onChange={(e) =>
                      updateConstraints({ dayStartMinute: hhmmToMinutes(e.currentTarget.value) })
                    }
                  />
                </label>
                <label class="flex flex-col text-sm">
                  Day ends
                  <input
                    type="time"
                    class="mt-1 rounded-md border px-2 py-1"
                    value={minutesToHHMM(t.constraints.dayEndMinute)}
                    onChange={(e) =>
                      updateConstraints({ dayEndMinute: hhmmToMinutes(e.currentTarget.value) })
                    }
                  />
                </label>
              </div>
            </section>

            <For each={t.days}>
              {(day) => (
                <section class="mb-6">
                  <h2 class="mb-2 text-lg font-medium">
                    Day {day.dayNumber}
                    <Show when={day.date}>
                      <span class="ml-2 text-sm text-muted-foreground">
                        {new Date(day.date!).toLocaleDateString()}
                      </span>
                    </Show>
                  </h2>
                  <ol class="space-y-2">
                    <For each={day.stops}>
                      {(stop, i) => (
                        <li class="rounded-md border p-3">
                          <div class="flex items-center gap-2">
                            <div class="flex flex-col">
                              <button
                                class="text-xs text-muted-foreground hover:text-foreground disabled:opacity-30"
                                disabled={i() === 0}
                                onClick={() => moveStop(day, i(), -1)}
                                aria-label="Move up"
                              >
                                ▲
                              </button>
                              <button
                                class="text-xs text-muted-foreground hover:text-foreground disabled:opacity-30"
                                disabled={i() === day.stops.length - 1}
                                onClick={() => moveStop(day, i(), 1)}
                                aria-label="Move down"
                              >
                                ▼
                              </button>
                            </div>
                            <input
                              class="flex-1 rounded-md border-transparent bg-transparent px-1 py-0.5 font-medium hover:border-input focus:border-input"
                              value={stop.name}
                              onChange={(e) => renameStop(stop, e.currentTarget.value)}
                            />
                            <input
                              type="time"
                              class="rounded-md border px-2 py-1 text-sm"
                              value={minutesToHHMM(stop.startMinute)}
                              onChange={(e) =>
                                retimeStop(
                                  stop,
                                  hhmmToMinutes(e.currentTarget.value),
                                  stop.durationMinutes,
                                )
                              }
                            />
                            <input
                              type="number"
                              min="0"
                              step="15"
                              class="w-20 rounded-md border px-2 py-1 text-sm"
                              title="Duration (minutes)"
                              value={stop.durationMinutes ?? ""}
                              onChange={(e) =>
                                retimeStop(
                                  stop,
                                  stop.startMinute,
                                  e.currentTarget.value ? Number(e.currentTarget.value) : 0,
                                )
                              }
                            />
                            <span class="text-xs text-muted-foreground">min</span>
                          </div>
                          <div class="mt-1 pl-8">
                            <WhyThisStop reason={stop.notes} />
                          </div>
                        </li>
                      )}
                    </For>
                  </ol>
                </section>
              )}
            </For>
          </>
        )}
      </Show>
    </main>
  );
}
