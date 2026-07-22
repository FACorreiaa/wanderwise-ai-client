import { For } from "solid-js";
import { Sun, Moon, Monitor, Languages } from "lucide-solid";
import { useTheme } from "~/contexts/ThemeContext";
import { useLanguage } from "~/contexts/LanguageContext";
import { SUPPORTED_LANGUAGES } from "~/lib/language-preference";
import type { ColorTheme } from "~/lib/theme-preference";
import { Button } from "~/ui/button";
import { Label } from "~/ui/label";

const colorModeOptions: { value: ColorTheme; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

interface AppearanceSettingsProps {
  compact?: boolean;
}

export default function AppearanceSettings(props: AppearanceSettingsProps) {
  const { colorMode, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  return (
    <div class={props.compact ? "space-y-4" : "space-y-6"}>
      <div class="space-y-3">
        <div class="flex items-center gap-2">
          <Sun class="w-4 h-4 text-muted-foreground" />
          <Label>Color mode</Label>
        </div>
        <div class="grid grid-cols-3 gap-2">
          <For each={colorModeOptions}>
            {(option) => {
              const Icon = option.icon;
              const isActive = () => colorMode() === option.value;
              return (
                <Button
                  variant={isActive() ? "default" : "outline"}
                  onClick={() => setTheme(option.value)}
                  class="flex-col h-auto py-3"
                >
                  <Icon class="w-4 h-4 mb-1" />
                  <span class="text-xs font-medium">{option.label}</span>
                </Button>
              );
            }}
          </For>
        </div>
      </div>

      <div class="space-y-3">
        <div class="flex items-center gap-2">
          <Languages class="w-4 h-4 text-muted-foreground" />
          <Label>Language</Label>
        </div>
        <select
          value={language()}
          onChange={(e) => setLanguage(e.currentTarget.value)}
          class="w-full p-3 border border-border rounded-lg bg-background text-foreground text-sm focus:ring-2 focus:ring-ring focus:border-transparent"
        >
          <For each={SUPPORTED_LANGUAGES}>
            {(lang) => (
              <option value={lang.code}>
                {lang.nativeLabel} ({lang.label})
              </option>
            )}
          </For>
        </select>
      </div>
    </div>
  );
}
