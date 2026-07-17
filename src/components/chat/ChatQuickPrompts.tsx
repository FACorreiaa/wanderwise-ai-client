import { For, Component } from "solid-js";

export interface QuickPrompt {
  id: string;
  text: string;
  description: string;
  icon: string;
  domain: "accommodation" | "dining" | "activities" | "itinerary" | "general";
}

export interface ChatQuickPromptsProps {
  prompts: QuickPrompt[];
  onSelect: (prompt: QuickPrompt) => void;
}

const ChatQuickPrompts: Component<ChatQuickPromptsProps> = (props) => {
  return (
    <div class="max-w-4xl mx-auto">
      <h3 class="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">
        Try asking about:
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <For each={props.prompts}>
          {(prompt) => (
            <button
              onClick={() => props.onSelect(prompt)}
              class="glass-panel rounded-xl hover:shadow-lg hover:border-primary/30 transition-all duration-300 p-3 sm:p-4 text-left group"
            >
              <div class="flex items-start gap-2 sm:gap-3">
                <span class="text-xl sm:text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
                  {prompt.icon}
                </span>
                <div class="min-w-0 flex-1">
                  <h4 class="font-medium text-foreground mb-1 text-sm sm:text-base group-hover:text-primary transition-colors">
                    {prompt.text}
                  </h4>
                  <p class="text-xs sm:text-sm text-muted-foreground">{prompt.description}</p>
                </div>
              </div>
            </button>
          )}
        </For>
      </div>
    </div>
  );
};

export default ChatQuickPrompts;
