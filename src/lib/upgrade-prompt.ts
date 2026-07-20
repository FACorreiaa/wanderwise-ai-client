// Tiny global store so any code path (hooks, services, error handlers) can
// trigger the upgrade prompt modal without threading props through the tree.
// The modal itself is mounted once in app.tsx (see components/UpgradePrompt).
import { createSignal } from "solid-js";

export type UpgradePromptKind = "free_quota" | "fair_use" | "entitlement";

const [activePrompt, setActivePrompt] = createSignal<UpgradePromptKind | null>(null);
const [promptMessage, setPromptMessage] = createSignal<string | null>(null);

/** Currently visible upgrade prompt variant, or null when hidden. */
export const upgradePromptKind = activePrompt;
export const upgradePromptMessage = promptMessage;

export function showUpgradePrompt(kind: UpgradePromptKind, message?: string): void {
  setPromptMessage(message ?? null);
  setActivePrompt(kind);
}

export function dismissUpgradePrompt(): void {
  setActivePrompt(null);
  setPromptMessage(null);
}
