import { useLocation } from "@solidjs/router";
import { createMemo } from "solid-js";

type DomainTheme = {
  key: string;
  match: (path: string) => boolean;
  glows: [string, string, string];
  grid: string;
  halo: string;
};

const domainThemes: DomainTheme[] = [
  {
    key: "home",
    match: (path) => path === "/" || path === "/index",
    glows: ["rgba(10, 119, 255, 0.28)", "rgba(34, 211, 238, 0.22)", "rgba(14, 165, 233, 0.18)"],
    grid: "rgba(12, 74, 110, 0.14)",
    halo: "rgba(10, 119, 255, 0.16)",
  },
  {
    key: "hospitality",
    match: (path) => path.startsWith("/hotels") || path.startsWith("/pricing"),
    glows: ["rgba(6, 148, 200, 0.24)", "rgba(99, 102, 241, 0.18)", "rgba(13, 148, 136, 0.18)"],
    grid: "rgba(37, 99, 235, 0.12)",
    halo: "rgba(59, 130, 246, 0.16)",
  },
  {
    key: "culinary",
    match: (path) => path.startsWith("/restaurants"),
    glows: ["rgba(251, 191, 36, 0.26)", "rgba(244, 115, 33, 0.18)", "rgba(14, 165, 233, 0.14)"],
    grid: "rgba(234, 88, 12, 0.14)",
    halo: "rgba(253, 186, 116, 0.14)",
  },
  {
    key: "activities",
    match: (path) =>
      path.startsWith("/activities") || path.startsWith("/discover") || path.startsWith("/near"),
    glows: ["rgba(16, 185, 129, 0.22)", "rgba(59, 130, 246, 0.18)", "rgba(96, 165, 250, 0.16)"],
    grid: "rgba(14, 116, 144, 0.14)",
    halo: "rgba(16, 185, 129, 0.16)",
  },
  {
    key: "social",
    match: (path) =>
      path.startsWith("/favorites") ||
      path.startsWith("/lists") ||
      path.startsWith("/recents") ||
      path.startsWith("/reviews"),
    glows: ["rgba(14, 165, 233, 0.2)", "rgba(120, 53, 255, 0.16)", "rgba(56, 189, 248, 0.16)"],
    grid: "rgba(14, 116, 144, 0.12)",
    halo: "rgba(99, 102, 241, 0.14)",
  },
  {
    key: "conversation",
    match: (path) => path.startsWith("/chat") || path.startsWith("/itinerary"),
    glows: ["rgba(59, 130, 246, 0.22)", "rgba(29, 78, 216, 0.18)", "rgba(14, 165, 233, 0.16)"],
    grid: "rgba(8, 47, 73, 0.16)",
    halo: "rgba(59, 130, 246, 0.16)",
  },
  {
    key: "profile",
    match: (path) =>
      path.startsWith("/profile") ||
      path.startsWith("/settings") ||
      path.startsWith("/admin") ||
      path.startsWith("/auth") ||
      path.startsWith("/forgot-password") ||
      path.startsWith("/profiles"),
    glows: ["rgba(8, 47, 73, 0.26)", "rgba(37, 99, 235, 0.16)", "rgba(14, 165, 233, 0.14)"],
    grid: "rgba(30, 41, 59, 0.14)",
    halo: "rgba(12, 74, 110, 0.18)",
  },
  {
    key: "support",
    match: (path) =>
      path.startsWith("/about") ||
      path.startsWith("/features") ||
      path.startsWith("/server-down") ||
      path.startsWith("/offline"),
    glows: ["rgba(59, 130, 246, 0.2)", "rgba(34, 211, 238, 0.18)", "rgba(236, 72, 153, 0.12)"],
    grid: "rgba(12, 74, 110, 0.12)",
    halo: "rgba(8, 145, 178, 0.14)",
  },
];

const defaultTheme = domainThemes[0];

export default function PageBackground() {
  const location = useLocation();

  const theme = createMemo(() => {
    const path = location.pathname;
    return domainThemes.find((item) => item.match(path)) || defaultTheme;
  });

  return (
    <div
      class="absolute inset-0 -z-10 overflow-hidden"
      data-domain={theme().key}
      aria-hidden="true"
    >
      <div
        class="domain-veil opacity-90"
        style={{
          "--glow-a": theme().glows[0],
          "--glow-b": theme().glows[1],
          "--glow-c": theme().glows[2],
        }}
      />
      <div class="domain-grid" style={{ "--grid-accent": theme().grid }} />
      <div class="domain-halo" style={{ "--halo": theme().halo }} />
      <div class="absolute inset-0 bg-gradient-to-b from-white/80 via-white/60 to-white/90 dark:from-slate-950/75 dark:via-slate-950/55 dark:to-slate-950/85 backdrop-blur" />
      <div class="domain-noise opacity-70" />
    </div>
  );
}
