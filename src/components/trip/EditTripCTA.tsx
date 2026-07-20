import { Show } from "solid-js";
import { A } from "@solidjs/router";
import { MapPinned, Pencil } from "lucide-solid";

export interface EditTripCTAProps {
  tripId: string | null | undefined;
  cityName?: string;
}

/** Banner after stream complete when server auto-persisted a TripDraft. */
export default function EditTripCTA(props: EditTripCTAProps) {
  return (
    <Show when={props.tripId}>
      {(id) => (
        <div class="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3">
          <div class="flex items-start gap-3">
            <MapPinned class="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <p class="text-sm font-medium text-foreground">
                Trip saved{props.cityName ? ` · ${props.cityName}` : ""}
              </p>
              <p class="text-xs text-muted-foreground">
                Reorder stops, tweak times, export to calendar — edit anytime.
              </p>
            </div>
          </div>
          <A
            href={`/trips/${id()}`}
            class="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            <Pencil class="h-4 w-4" />
            Edit trip
          </A>
        </div>
      )}
    </Show>
  );
}
