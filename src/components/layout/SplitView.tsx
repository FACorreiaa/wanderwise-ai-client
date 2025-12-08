import { createSignal, JSX } from "solid-js";
import { Map, List, Sidebar } from "lucide-solid";

interface SplitViewProps {
    listContent: JSX.Element;
    mapContent: JSX.Element;
    initialMode?: "split" | "list" | "map";
}

export default function SplitView(props: SplitViewProps) {
    const [mode, setMode] = createSignal<"split" | "list" | "map">(
        props.initialMode || "split"
    );

    return (
        <div class="flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-transparent">
            {/* Mobile Toggle Controls */}
            <div class="flex items-center justify-center p-2 gap-2 md:hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 z-10 sticky top-0">
                <button
                    onClick={() => setMode("list")}
                    class={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${mode() === "list"
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                >
                    <List class="w-4 h-4" />
                    List
                </button>
                <button
                    onClick={() => setMode("map")}
                    class={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${mode() === "map"
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                >
                    <Map class="w-4 h-4" />
                    Map
                </button>
            </div>

            {/* Desktop Toggle Controls (Top Right Overlay) */}
            <div class="hidden md:flex absolute top-20 right-4 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-lg p-1 shadow-lg">
                <button
                    onClick={() => setMode("list")}
                    class={`p-2 rounded-md transition-colors ${mode() === "list"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                        : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                    title="List Only"
                >
                    <List class="w-5 h-5" />
                </button>
                <button
                    onClick={() => setMode("split")}
                    class={`p-2 rounded-md transition-colors ${mode() === "split"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                        : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                    title="Split View"
                >
                    <Sidebar class="w-5 h-5" />
                </button>
                <button
                    onClick={() => setMode("map")}
                    class={`p-2 rounded-md transition-colors ${mode() === "map"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                        : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                    title="Map Only"
                >
                    <Map class="w-5 h-5" />
                </button>
            </div>

            <div class="flex-1 flex overflow-hidden relative">
                {/* List Panel */}
                <div
                    class={`flex-1 h-full overflow-y-auto transition-all duration-300 ease-in-out ${mode() === "map"
                        ? "hidden w-0"
                        : mode() === "split"
                            ? "w-1/2 md:max-w-[600px] border-r border-gray-200/50 dark:border-gray-800/50"
                            : "w-full"
                        } bg-transparent`}
                >
                    <div class="h-full relative z-0">
                        {props.listContent}
                    </div>
                </div>

                {/* Map Panel */}
                <div
                    class={`flex-1 h-full transition-all duration-300 ease-in-out relative z-0 ${mode() === "list"
                        ? "hidden w-0"
                        : mode() === "split"
                            ? "w-1/2"
                            : "w-full"
                        }`}
                >
                    {props.mapContent}
                </div>
            </div>
        </div>
    );
}
