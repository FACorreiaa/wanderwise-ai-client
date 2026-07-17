import { Sun, Moon, Palette } from "lucide-solid";
import { useTheme } from "~/contexts/ThemeContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import type { DesignTheme } from "~/lib/theme-preference";

interface ThemeOption {
  value: DesignTheme;
  label: string;
  description: string;
}

const themeOptions: ThemeOption[] = [
  { value: "loci", label: "Loci", description: "Bold structural design" },
  { value: "classic", label: "Classic", description: "Editorial luxury" },
  { value: "modern", label: "Modern", description: "Clean functional" },
];

export default function ThemeSelector() {
  const { isDark, toggleTheme, designTheme, setDesignTheme } = useTheme();

  const currentTheme = () => themeOptions.find((t) => t.value === designTheme()) || themeOptions[0];

  return (
    <div class="flex items-center gap-3 p-1.5 rounded-2xl bg-card/80 backdrop-blur-xl border border-border shadow-sm">
      <button
        type="button"
        onClick={toggleTheme}
        class="relative p-2.5 rounded-xl bg-muted/60 border border-border hover:bg-muted transition-all duration-200 hover:scale-105 active:scale-95 group"
        title={isDark() ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDark() ? (
          <Sun class="w-4 h-4 text-accent relative z-10" />
        ) : (
          <Moon class="w-4 h-4 text-muted-foreground relative z-10" />
        )}
      </button>

      <Select<ThemeOption>
        value={currentTheme()}
        onChange={(option) => option && setDesignTheme(option.value)}
        options={themeOptions}
        optionValue="value"
        optionTextValue="label"
        itemComponent={(props) => (
          <SelectItem item={props.item} class="rounded-lg hover:bg-muted/60 transition-colors">
            <div class="flex flex-col py-0.5">
              <span class="font-semibold text-sm">{props.item.rawValue.label}</span>
              <span class="text-[11px] text-muted-foreground">{props.item.rawValue.description}</span>
            </div>
          </SelectItem>
        )}
      >
        <SelectTrigger class="w-[150px] h-10 px-3 rounded-xl bg-muted/60 border border-border hover:bg-muted transition-all focus:ring-2 focus:ring-ring/30">
          <div class="flex items-center gap-2">
            <div class="p-1 rounded-md bg-primary/10">
              <Palette class="w-3.5 h-3.5 text-primary" />
            </div>
            <SelectValue<ThemeOption>>
              {(state) => <span class="font-medium text-sm">{state.selectedOption()?.label}</span>}
            </SelectValue>
          </div>
        </SelectTrigger>
        <SelectContent class="rounded-xl border border-border bg-popover/95 backdrop-blur-xl shadow-lg overflow-hidden" />
      </Select>
    </div>
  );
}