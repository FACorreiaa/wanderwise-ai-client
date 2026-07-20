import { Show } from "solid-js";
import { Sparkles } from "lucide-solid";

export interface WhyThisStopProps {
  /** Short rationale text. Hidden when empty. */
  reason?: string | null;
  class?: string;
}

/** Compact transparency chip — "Why this stop". */
export default function WhyThisStop(props: WhyThisStopProps) {
  const text = () => props.reason?.trim() ?? "";
  return (
    <Show when={text()}>
      <p
        class={`mt-1.5 inline-flex max-w-full items-start gap-1.5 rounded-md border border-primary/20 bg-primary/5 px-2 py-1 text-xs text-foreground/80 ${props.class ?? ""}`}
        title="Why Loci suggested this"
      >
        <Sparkles class="mt-0.5 h-3 w-3 shrink-0 text-primary" aria-hidden="true" />
        <span class="min-w-0">
          <span class="font-medium text-primary">Why this: </span>
          {text()}
        </span>
      </p>
    </Show>
  );
}
