import { createEffect } from "solid-js";
import { useTheme } from "~/contexts/ThemeContext";
import { readThemeColorFromDocument } from "~/lib/theme-colors";

const setMetaContent = (name: string, content: string) => {
  let meta = document.querySelector(`meta[name="${name}"]`);
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", name);
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", content);
};

/** Keeps browser chrome theme-color in sync with the active design theme. */
export default function ThemeMetaSync() {
  const theme = useTheme();

  createEffect(() => {
    // Re-run when design or resolved darkness changes.
    theme.designTheme();
    theme.isDark();

    const color = readThemeColorFromDocument();
    setMetaContent("theme-color", color);
    setMetaContent("apple-mobile-web-app-status-bar-style", theme.isDark() ? "black-translucent" : "default");
  });

  return null;
}