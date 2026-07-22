import { For, Component, type Component as SolidComponent } from "solid-js";
import { Bed, Compass, Map, Sparkles, Utensils } from "lucide-solid";

export interface QuickPrompt {
  id: string;
  text: string;
  description: string;
  /** Legacy emoji field — ignored when domain icon is used. */
  icon?: string;
  domain: "accommodation" | "dining" | "activities" | "itinerary" | "general";
}

export interface ChatQuickPromptsProps {
  prompts: QuickPrompt[];
  onSelect: (prompt: QuickPrompt) => void;
}

const domainIcon = (domain: QuickPrompt["domain"]): SolidComponent<{ class?: string }> => {
  switch (domain) {
    case "accommodation":
      return Bed;
    case "dining":
      return Utensils;
    case "itinerary":
      return Map;
    case "activities":
      return Sparkles;
    default:
      return Compass;
  }
};

const ChatQuickPrompts: Component<ChatQuickPromptsProps> = (props) => {
  return (
    <div class="max-w-4xl mx-auto">
      <h3 class="font-serif text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">
        Try asking about
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <For each={props.prompts}>
          {(prompt) => {
            const Icon = domainIcon(prompt.domain);
            return (
              <button
                onClick={() => props.onSelect(prompt)}
                class="loci-card-interactive rounded-xl p-3 sm:p-4 text-left group min-h-[44px]"
              >
                <div class="flex items-start gap-2 sm:gap-3">
                  <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary text-primary motion-settle group-hover:border-primary/30">
                    <Icon class="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div class="min-w-0 flex-1">
                    <h4 class="font-medium text-foreground mb-1 text-sm sm:text-base group-hover:text-primary transition-colors">
                      {prompt.text}
                    </h4>
                    <p class="text-xs sm:text-sm text-muted-foreground">{prompt.description}</p>
                  </div>
                </div>
              </button>
            );
          }}
        </For>
      </div>
    </div>
  );
};

export default ChatQuickPrompts;
