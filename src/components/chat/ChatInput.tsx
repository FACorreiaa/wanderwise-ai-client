import { Component } from "solid-js";
import { Send } from "lucide-solid";
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
}

const ChatInput: Component<ChatInputProps> = (props) => {
  return (
    <div class="bg-popover/80 backdrop-blur-xl border-t border-border p-3 sm:p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div class="max-w-4xl mx-auto">
        <div class="flex items-end gap-2 sm:gap-3">
          <TextFieldRoot class="flex-1">
            <TextArea
              value={props.value}
              onInput={(e) => props.onInput(e.currentTarget.value)}
              onKeyPress={props.onKeyPress}
              placeholder={
                props.placeholder ||
                "Ask me about destinations, activities, or let me create an itinerary for you..."
              }
              class="min-h-[56px] resize-none"
              disabled={props.isLoading}
            />
          </TextFieldRoot>
          <Button
            onClick={props.onSend}
            disabled={!props.value.trim() || props.isLoading}
            class="gap-1 sm:gap-2"
          >
            <Send class="w-4 h-4" />
            <span class="hidden sm:inline">Send</span>
          </Button>
        </div>
        <p class="text-xs text-muted-foreground mt-2 text-center">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};

export default ChatInput;
