import { onMount, onCleanup } from "solid-js";
import { getAuthToken } from "~/lib/api";
import { createItineraryStream } from "@/lib/itinerary/createItineraryStream";
import ItineraryStreamView from "@/components/itinerary/ItineraryStreamView";

/**
 * StreamingResponse — fetches a text/event-stream itinerary and renders it
 * through the editorial 3-phase pipeline (skeleton → enrichment → done).
 *
 * Previously this dumped raw JSON into a <pre>. It now drives
 * createItineraryStream().consumeSSE and renders ItineraryStreamView, so any
 * caller gets progressive images, blur-up, and jank-free per-item patching.
 *
 * Backwards-compatible props kept: url, requestBody, onComplete, onError.
 */
export interface StreamingResponseProps {
  url: string;
  requestBody: object;
  onComplete?: (response: unknown) => void;
  onError?: (error: string) => void;
  className?: string;
  skeletonCount?: number;
}

export function StreamingResponse(props: StreamingResponseProps) {
  const stream = createItineraryStream();
  let abort: AbortController | null = null;

  const run = async () => {
    abort = new AbortController();
    try {
      const token = getAuthToken();
      const res = await fetch(props.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
          "Cache-Control": "no-cache",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include",
        body: JSON.stringify(props.requestBody),
        signal: abort.signal,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      await stream.consumeSSE(res, abort.signal);

      if (stream.state.phase === "error") {
        props.onError?.(stream.state.error || "Stream error");
      } else {
        props.onComplete?.(stream.state);
      }
    } catch (err: any) {
      if (err?.name === "AbortError") return;
      const msg = err?.message || "Failed to load the response";
      stream.fail(msg);
      props.onError?.(msg);
    }
  };

  onMount(run);
  onCleanup(() => abort?.abort());

  return (
    <div class={props.className}>
      <ItineraryStreamView
        phase={stream.state.phase}
        title={stream.state.title}
        summary={stream.state.summary}
        stops={stream.state.stops}
        enrichedCount={stream.state.enrichedCount}
        error={stream.state.error}
        skeletonCount={props.skeletonCount}
      />
    </div>
  );
}
