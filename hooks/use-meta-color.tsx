import * as React from "react";

import { useTheme } from "@/providers/ThemeProvider";

export const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#0a0a0a"
};

export function useMetaColor() {
  const { resolvedTheme } = useTheme();

  const metaColor = React.useMemo(() => {
    return resolvedTheme !== "dark"
      ? META_THEME_COLORS.light
      : META_THEME_COLORS.dark;
  }, [resolvedTheme]);

  const setMetaColor = React.useCallback((color: string) => {
    const metas = document.querySelectorAll<HTMLMetaElement>(
      'meta[name="theme-color"]'
    );

    if (!metas.length) {
      const meta = document.createElement("meta");
      meta.name = "theme-color";
      meta.content = color;
      document.head.appendChild(meta);
      return;
    }

    metas.forEach((meta) => {
      meta.content = color;
    });
  }, []);

  return {
    metaColor,
    setMetaColor
  };
}
