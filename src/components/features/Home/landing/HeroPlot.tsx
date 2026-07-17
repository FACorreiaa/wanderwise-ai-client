import { createSignal, onMount, For } from "solid-js";
import { prefersReducedMotion } from "~/lib/hooks/useInView";

/**
 * HeroPlot renders the signature graphic: an itinerary drawn as a route
 * through five plotted stops on a coordinate grid. It renders its final
 * state on the server; the draw-in only runs on the client when motion is
 * allowed.
 */
const stops: {
  x: number;
  y: number;
  label: string;
  anchor: "start" | "end";
  lx: number;
  ly: number;
}[] = [
  { x: 60, y: 320, label: "Café da Praça", anchor: "start", lx: 74, ly: 324 },
  { x: 150, y: 210, label: "Miradouro", anchor: "start", lx: 164, ly: 214 },
  { x: 240, y: 160, label: "Tram 28 stop", anchor: "end", lx: 226, ly: 152 },
  { x: 210, y: 70, label: "Time Out Market", anchor: "start", lx: 224, ly: 74 },
  { x: 300, y: 60, label: "Sunset bar", anchor: "end", lx: 286, ly: 48 },
];

const routePath =
  "M60 320 C 120 300, 90 220, 150 210 S 250 250, 240 160 S 150 120, 210 70 S 300 90, 300 60";

export default function HeroPlot() {
  const [drawn, setDrawn] = createSignal(false);

  onMount(() => {
    if (prefersReducedMotion()) {
      setDrawn(true);
      return;
    }
    // Defer a frame so the initial (undrawn) state paints before animating.
    requestAnimationFrame(() => setDrawn(true));
  });

  return (
    <div
      class="plot-grid relative aspect-[5/5.4] overflow-hidden rounded-2xl border border-border bg-card"
      aria-label="An itinerary plotted as a route through five places"
    >
      <span class="font-coord absolute left-4 top-3 text-[0.66rem] uppercase tracking-[0.12em] text-muted-foreground">
        itinerary · day 1
      </span>
      <span class="font-coord absolute right-4 top-3 text-[0.66rem] uppercase tracking-[0.12em] text-accent">
        5 stops
      </span>
      <svg
        viewBox="0 0 360 400"
        preserveAspectRatio="xMidYMid meet"
        class="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <path
          d={routePath}
          fill="none"
          stroke="hsl(var(--accent))"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="route-draw"
          classList={{ "is-drawn": drawn() }}
        />
        <For each={stops}>
          {(s, i) => (
            <g class={`plot-point d${i() + 1}`} classList={{ "is-drawn": drawn() }}>
              <circle cx={s.x} cy={s.y} r="13" fill="hsl(var(--accent) / 0.14)" />
              <circle cx={s.x} cy={s.y} r="5" fill="hsl(var(--accent))" />
              <text
                x={s.lx}
                y={s.ly}
                text-anchor={s.anchor}
                class="font-coord"
                font-size="9"
                fill="hsl(var(--muted-foreground))"
              >
                {s.label}
              </text>
            </g>
          )}
        </For>
      </svg>
    </div>
  );
}
