// src/lib/hooks/useStreamedRpc.ts
import { createStore } from "solid-js/store";
import { onCleanup } from "solid-js";
import { streamChatEvents } from "@/lib/streaming/chatStream";
import { AiCityResponse } from "~/lib/api/types";

type StreamedRpcOptions = {
  onData?: (_: AiCityResponse) => void;
  onComplete?: (meta?: { tripId?: string }) => void;
  onError?: (_: Error) => void;
};

export function useStreamedRpc(
  message: () => string,
  cityName: () => string,
  profileId: () => string,
  opts: StreamedRpcOptions = {},
) {
  const [store, setStore] = createStore<{
    data: AiCityResponse | null;
    error: Error | null;
    isLoading: boolean;
    tripId: string | null;
  }>({
    data: null,
    error: null,
    isLoading: false,
    tripId: null,
  });

  // Abort the in-flight stream on cleanup so navigating away cancels the RPC.
  const controller = new AbortController();

  const connect = async () => {
    if (!message() || !cityName()) {
      return;
    }

    setStore("isLoading", true);
    setStore("error", null);
    setStore("tripId", null);

    let completedTripId: string | undefined;

    try {
      // Single canonical reader. profileId is now threaded (was dropped before).
      for await (const event of streamChatEvents(
        {
          message: message(),
          cityName: cityName(),
          profileId: profileId() || undefined,
        },
        controller.signal,
      )) {
        switch (event.kind) {
          case "itinerary":
            setStore("data", event.cityResponse);
            opts.onData?.(event.cityResponse);
            break;
          case "complete":
            if (event.result) {
              setStore("data", event.result);
              opts.onData?.(event.result);
            }
            if (event.tripId) {
              completedTripId = event.tripId;
              setStore("tripId", event.tripId);
            }
            break;
          case "error": {
            const err = new Error(event.userMessage);
            setStore("error", err);
            opts.onError?.(err);
            break;
          }
        }
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      setStore("error", err);
      opts.onError?.(err);
    } finally {
      setStore("isLoading", false);
      opts.onComplete?.(completedTripId ? { tripId: completedTripId } : undefined);
    }
  };

  onCleanup(() => {
    controller.abort();
  });

  return { store, connect, setStore };
}
