import type { DesignTheme } from "~/lib/theme-preference";

/** Browser chrome / PWA theme-color per design + resolved color mode. */
export const THEME_COLOR_PALETTE: Record<DesignTheme, { light: string; dark: string }> = {
  loci: { light: "#1a1a1a", dark: "#0a0a0a" },
  classic: { light: "#8a6e2f", dark: "#5c4033" },
  modern: { light: "#0c7df2", dark: "#1e3a8a" },
};

export const MAPBOX_STYLES = {
  light: "mapbox://styles/mapbox/light-v11",
  dark: "mapbox://styles/mapbox/dark-v11",
} as const;

export const themeColorFor = (design: DesignTheme, isDark: boolean): string =>
  THEME_COLOR_PALETTE[design][isDark ? "dark" : "light"];

/** Reads `--theme-color` set in app.css for the active theme. */
export const readThemeColorFromDocument = (): string => {
  if (typeof document === "undefined") return THEME_COLOR_PALETTE.loci.light;

  const value = getComputedStyle(document.documentElement).getPropertyValue("--theme-color").trim();
  return value || THEME_COLOR_PALETTE.loci.light;
};

export const mapStyleForColorMode = (isDark: boolean): string =>
  isDark ? MAPBOX_STYLES.dark : MAPBOX_STYLES.light;