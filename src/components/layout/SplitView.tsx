import { createSignal, JSX } from "solid-js";
import { Map, List, Sidebar } from "lucide-solid";

interface SplitViewProps {
  listContent: JSX.Element;
  mapContent: JSX.Element;
  initialMode?: "split" | "list" | "map";
}

const toggleActive = "bg-primary text-primary-foreground shadow-sm";
const toggleIdle = "text-muted-foreground hover:bg-muted hover:text-foreground";

export default function SplitView(props: SplitViewProps) {
  const [mode, setMode] = createSignal<"split" | "list" | "map">(props.initialMode || "split");

  return (
    <div class="flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-background">
      {/* Mobile Toggle Controls */}
      <div class="flex items-center justify-center p-2 gap-2 md:hidden island-panel border-b border-border z-10 sticky top-0">
        <button
          onClick={() => setMode("list")}
          class={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium motion-settle min-h-[44px] ${
            mode() === "list" ? toggleActive : toggleIdle
          }`}
        >
          <List class="w-4 h-4" />
          List
        </button>
        <button
          onClick={() => setMode("map")}
          class={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium motion-settle min-h-[44px] ${
            mode() === "map" ? toggleActive : toggleIdle
          }`}
        >
          <Map class="w-4 h-4" />
          Map
        </button>
      </div>

      {/* Desktop Toggle Controls (Top Right Overlay) */}
      <div class="hidden md:flex absolute top-20 right-4 z-20 island-panel rounded-lg p-1">
        <button
          onClick={() => setMode("list")}
          class={`p-2 rounded-md motion-settle min-h-[44px] min-w-[44px] flex items-center justify-center ${
            mode() === "list" ? "bg-secondary text-foreground" : toggleIdle
          }`}
          title="List Only"
        >
          <List class="w-5 h-5" />
        </button>
        <button
          onClick={() => setMode("split")}
          class={`p-2 rounded-md motion-settle min-h-[44px] min-w-[44px] flex items-center justify-center ${
            mode() === "split" ? "bg-secondary text-foreground" : toggleIdle
          }`}
          title="Split View"
        >
          <Sidebar class="w-5 h-5" />
        </button>
        <button
          onClick={() => setMode("map")}
          class={`p-2 rounded-md motion-settle min-h-[44px] min-w-[44px] flex items-center justify-center ${
            mode() === "map" ? "bg-secondary text-foreground" : toggleIdle
          }`}
          title="Map Only"
        >
          <Map class="w-5 h-5" />
        </button>
      </div>

      <div class="flex-1 flex overflow-hidden relative">
        {/* List Panel */}
        <div
          class={`flex-1 h-full overflow-y-auto motion-settle ${
            mode() === "map"
              ? "hidden w-0"
              : mode() === "split"
                ? "w-1/2 md:max-w-[600px] border-r border-border"
                : "w-full"
          } bg-background`}
        >
          <div class="h-full relative z-0">{props.listContent}</div>
        </div>

        {/* Map Panel */}
        <div
          class={`flex-1 h-full motion-settle relative z-0 ${
            mode() === "list" ? "hidden w-0" : mode() === "split" ? "w-1/2" : "w-full"
          }`}
        >
          {props.mapContent}
        </div>
      </div>
    </div>
  );
}
