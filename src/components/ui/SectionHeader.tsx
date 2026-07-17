import { Show, type JSX } from "solid-js";
import { cn } from "@/cn";

/**
 * Editorial section header — kicker label over a tight display title,
 * with an optional trailing action. The repeating rhythm element that
 * ties Discover / Lists / Profile / Settings into one magazine system.
 */
export interface SectionHeaderProps {
  kicker?: string;
  title: string;
  subtitle?: string;
  action?: JSX.Element;
  class?: string;
  size?: "sm" | "md" | "lg";
}

export default function SectionHeader(props: SectionHeaderProps) {
  const titleSize = () =>
    props.size === "lg"
      ? "text-3xl sm:text-4xl"
      : props.size === "sm"
        ? "text-lg"
        : "text-xl sm:text-2xl";

  return (
    <div class={cn("flex items-end justify-between gap-4 mb-4", props.class)}>
      <div class="min-w-0">
        <Show when={props.kicker}>
          <p class="kicker mb-1.5">{props.kicker}</p>
        </Show>
        <h2 class={cn("editorial-title text-foreground", titleSize())}>{props.title}</h2>
        <Show when={props.subtitle}>
          <p class="editorial-lead text-sm mt-1.5">{props.subtitle}</p>
        </Show>
      </div>
      <Show when={props.action}>
        <div class="shrink-0">{props.action}</div>
      </Show>
    </div>
  );
}
