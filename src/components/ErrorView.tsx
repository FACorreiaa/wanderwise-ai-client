import { Component, Show } from "solid-js";
import { friendlyError } from "../lib/connect-errors";

/**
 * Reusable error state for failed RPC calls. Renders a friendly title/message
 * derived from the ConnectRPC error code, with an optional retry action.
 *
 * Usage:
 *   <Show when={query.isError}>
 *     <ErrorView error={query.error} onRetry={() => query.refetch()} />
 *   </Show>
 */
export const ErrorView: Component<{
  error: unknown;
  onRetry?: () => void;
  class?: string;
}> = (props) => {
  const fe = () => friendlyError(props.error);
  return (
    <div
      class={
        "flex flex-col items-center justify-center gap-2 rounded-lg border border-border bg-card p-6 text-center " +
        (props.class ?? "")
      }
      role="alert"
    >
      <p class="text-base font-semibold text-foreground">{fe().title}</p>
      <p class="text-sm text-muted-foreground">{fe().message}</p>
      <Show when={props.onRetry}>
        <button
          type="button"
          class="mt-2 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted"
          onClick={() => props.onRetry?.()}
        >
          Try again
        </button>
      </Show>
    </div>
  );
};

export default ErrorView;
