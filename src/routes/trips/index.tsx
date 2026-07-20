import { For, Show } from "solid-js";
import { A } from "@solidjs/router";
import { useTrips } from "~/lib/api/trips";

export default function TripsList() {
  const trips = useTrips();

  return (
    <main class="mx-auto max-w-3xl px-4 py-8">
      <h1 class="mb-6 text-2xl font-semibold">Your trips</h1>

      <Show when={trips.isLoading}>
        <p class="text-muted-foreground">Loading…</p>
      </Show>

      <Show when={trips.data && trips.data.length === 0}>
        <p class="text-muted-foreground">
          No saved trips yet. Generate an itinerary and save it to start planning.
        </p>
      </Show>

      <ul class="space-y-3">
        <For each={trips.data}>
          {(t) => (
            <li>
              <A
                href={`/trips/${t.id}`}
                class="block rounded-lg border p-4 transition hover:bg-accent"
              >
                <div class="flex items-center justify-between">
                  <span class="font-medium">{t.title}</span>
                  <span class="text-sm text-muted-foreground">
                    {t.days.length} day{t.days.length === 1 ? "" : "s"}
                  </span>
                </div>
                <p class="text-sm text-muted-foreground">
                  {t.cityName || "Unknown city"} · updated{" "}
                  {new Date(t.updatedAt).toLocaleDateString()}
                </p>
              </A>
            </li>
          )}
        </For>
      </ul>
    </main>
  );
}
