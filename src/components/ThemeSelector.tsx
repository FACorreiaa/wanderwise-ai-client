import { Sun, Moon, Palette } from "lucide-solid";
import { useTheme } from "~/contexts/ThemeContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";

type DesignTheme = "classic" | "modern" | "loci";

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
    <div class="flex items-center gap-3 p-1.5 rounded-2xl bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
      {/* Color Mode Toggle */}
      <button
        type="button"
        onClick={toggleTheme}
        class="relative p-2.5 rounded-xl bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 border border-white/50 dark:border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.35)] hover:scale-105 active:scale-95 transition-all duration-300 ease-out group"
        title={isDark() ? "Switch to light mode" : "Switch to dark mode"}
      >
        <div class="absolute inset-0 rounded-xl bg-gradient-to-br from-amber-400/0 to-orange-400/0 dark:from-sky-400/0 dark:to-blue-500/0 group-hover:from-amber-400/20 group-hover:to-orange-400/20 dark:group-hover:from-sky-400/20 dark:group-hover:to-blue-500/20 transition-all duration-300" />
        {isDark() ? (
          <Sun class="w-4 h-4 text-amber-500 dark:text-amber-400 relative z-10 transition-transform duration-300 group-hover:rotate-45" />
        ) : (
          <Moon class="w-4 h-4 text-slate-600 dark:text-slate-400 relative z-10 transition-transform duration-300 group-hover:-rotate-12" />
        )}
      </button>

      {/* Design Theme Selector */}
      <Select<ThemeOption>
        value={currentTheme()}
        onChange={(option) => option && setDesignTheme(option.value)}
        options={themeOptions}
        optionValue="value"
        optionTextValue="label"
        itemComponent={(props) => (
          <SelectItem
            item={props.item}
            class="rounded-lg hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors duration-200"
          >
            <div class="flex flex-col py-0.5">
              <span class="font-semibold text-sm">{props.item.rawValue.label}</span>
              <span class="text-[11px] text-muted-foreground/70">
                {props.item.rawValue.description}
              </span>
            </div>
          </SelectItem>
        )}
      >
        <SelectTrigger class="w-[150px] h-10 px-3 rounded-xl bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 border border-white/50 dark:border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ease-out focus:ring-2 focus:ring-primary/30">
          <div class="flex items-center gap-2">
            <div class="p-1 rounded-md bg-gradient-to-br from-primary/10 to-primary/5">
              <Palette class="w-3.5 h-3.5 text-primary/70" />
            </div>
            <SelectValue<ThemeOption>>
              {(state) => <span class="font-medium text-sm">{state.selectedOption()?.label}</span>}
            </SelectValue>
          </div>
        </SelectTrigger>
        <SelectContent class="rounded-xl border border-white/40 dark:border-white/10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-[0_16px_48px_rgba(0,0,0,0.15)] dark:shadow-[0_16px_48px_rgba(0,0,0,0.4)] overflow-hidden" />
      </Select>
    </div>
  );
}
