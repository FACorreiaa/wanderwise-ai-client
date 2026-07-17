import { Component, Show } from "solid-js";
import { Send, Square } from "lucide-solid";
import { Button } from "~/ui/button";
import { TextArea } from "~/ui/textarea";
import { TextFieldRoot } from "~/ui/textfield";

export interface ChatInputProps {
  value: string;
  isLoading: boolean;
  placeholder?: string;
  onInput: (value: string) => void;
  onSend: () => void;
  onKeyPress: (e: KeyboardEvent) => void;
  /** When streaming, the Send button becomes a Stop button. */
  onStop?: () => void;
}

const MAX_TEXTAREA_PX = 160; // ~6 rows

const ChatInput: Component<ChatInputProps> = (props) => {
  // Auto-grow the textarea up to a cap, then scroll.
  const autoGrow = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, MAX_TEXTAREA_PX)}px`;
  };

  return (
    <div class="bg-popover/80 backdrop-blur-xl border-t border-border p-3 sm:p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div class="max-w-3xl mx-auto">
        <div class="flex items-end gap-2 sm:gap-3">
          <TextFieldRoot class="flex-1">
            <TextArea
              value={props.value}
              onInput={(e) => {
                props.onInput(e.currentTarget.value);
                autoGrow(e.currentTarget);
              }}
              onKeyPress={props.onKeyPress}
              placeholder={
                props.placeholder ||
                "Ask me about destinations, activities, or let me create an itinerary for you..."
              }
              class="min-h-[56px] max-h-[160px] resize-none"
              disabled={props.isLoading}
            />
          </TextFieldRoot>
          <Show
            when={props.isLoading && props.onStop}
            fallback={
              <Button
                onClick={props.onSend}
                disabled={!props.value.trim() || props.isLoading}
                class="gap-1 sm:gap-2"
              >
                <Send class="w-4 h-4" />
                <span class="hidden sm:inline">Send</span>
              </Button>
            }
          >
            <Button onClick={props.onStop} variant="destructive" class="gap-1 sm:gap-2">
              <Square class="w-4 h-4 fill-current" />
              <span class="hidden sm:inline">Stop</span>
            </Button>
          </Show>
        </div>
        <p class="text-xs text-muted-foreground mt-2 text-center">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};

export default ChatInput;
