// src/lib/hooks/useStreamedRpc.ts
import { createStore } from "solid-js/store";
import { createSignal, onCleanup } from "solid-js";
import { chatService } from "@/lib/api";
import { parseStreamError } from "../errors";
import { AiCityResponse } from "~/lib/api/types";

type StreamedRpcOptions = {
  onData?: (_: AiCityResponse) => void;
  onComplete?: () => void;
  onError?: (_: Error) => void;
};

export function useStreamedRpc(
  message: () => string,
  cityName: () => string,
  profileId: () => string,
  opts: StreamedRpcOptions = {}
) {
  const [store, setStore] = createStore<{
    data: AiCityResponse | null;
    error: Error | null;
    isLoading: boolean;
  }>({
    data: null,
    error: null,
    isLoading: false,
  });

  const [, setStream] = createSignal<AsyncIterable<any> | null>(
    null
  );

  const connect = async () => {
    if (!message() || !cityName()) {
      return;
    }

    setStore("isLoading", true);
    setStore("error", null);

    try {
      const stream = chatService.streamChat({
        message: message(),
        cityName: cityName(),
        // profileId: profileId(), // Not supported by ChatRequest schema
      });
      setStream(stream);
      await readStream(stream);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      const parsed = parseStreamError(err.message);

      const wrappedError = new Error(parsed.userMessage);
      setStore("error", wrappedError);
      opts.onError?.(wrappedError);
    } finally {
      setStore("isLoading", false);
      opts.onComplete?.();
    }
  };

  const readStream = async (stream: AsyncIterable<any>) => {
    for await (const event of stream) {
      switch (event.type) {
        case "itinerary":
          if (event.data) {
            const itinerary = JSON.parse(
              new TextDecoder().decode(event.data)
            ) as AiCityResponse;
            setStore("data", itinerary);
            opts.onData?.(itinerary);
          }
          break;
        case "error":
          if (event.error) {
            const parsed = parseStreamError(event.error);
            const err = new Error(parsed.userMessage);
            setStore("error", err);
            opts.onError?.(err);
          }
          break;
        case "complete":
          // The stream is finished
          break;
      }
    }
  };

  onCleanup(() => {
    // Abort the stream on cleanup
    // This depends on how the connect-es client handles cancellation
  });

  return { store, connect, setStore };
}
