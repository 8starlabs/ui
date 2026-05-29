"use client";

import * as React from "react";

type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  enableSystem?: boolean;
  storageKey?: string;
};

type ThemeContextValue = {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  themes: Theme[];
  systemTheme: ResolvedTheme;
};

const ThemeContext = React.createContext<ThemeContextValue | undefined>(
  undefined
);

function getSystemTheme(): ResolvedTheme {
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }

  return "light";
}

function getStoredTheme(storageKey: string, defaultTheme: Theme): Theme {
  if (typeof window === "undefined") return defaultTheme;

  let storedTheme: string | null = null;

  try {
    storedTheme = window.localStorage.getItem(storageKey);
  } catch {
    return defaultTheme;
  }

  if (
    storedTheme === "light" ||
    storedTheme === "dark" ||
    storedTheme === "system"
  ) {
    return storedTheme;
  }

  return defaultTheme;
}

function applyTheme(theme: Theme, systemTheme: ResolvedTheme) {
  const resolvedTheme = theme === "system" ? systemTheme : theme;
  const root = document.documentElement;

  root.classList.toggle("dark", resolvedTheme === "dark");
  root.style.colorScheme = resolvedTheme;
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  enableSystem = true,
  storageKey = "theme"
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(() =>
    getStoredTheme(storageKey, defaultTheme)
  );
  const [systemTheme, setSystemTheme] =
    React.useState<ResolvedTheme>(getSystemTheme);
  const resolvedTheme =
    theme === "system"
      ? enableSystem
        ? systemTheme
        : "light"
      : (theme as ResolvedTheme);

  React.useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => setSystemTheme(media.matches ? "dark" : "light");

    handleChange();
    media.addEventListener("change", handleChange);

    return () => media.removeEventListener("change", handleChange);
  }, []);

  React.useEffect(() => {
    applyTheme(enableSystem ? theme : resolvedTheme, systemTheme);
  }, [enableSystem, resolvedTheme, systemTheme, theme]);

  React.useEffect(() => {
    let layout: string | null = null;

    try {
      layout = window.localStorage.getItem("layout");
    } catch {
      return;
    }

    if (layout) {
      document.documentElement.classList.add(`layout-${layout}`);
    }
  }, []);

  const setTheme = React.useCallback(
    (nextTheme: Theme) => {
      setThemeState(nextTheme);

      try {
        window.localStorage.setItem(storageKey, nextTheme);
      } catch {}
    },
    [storageKey]
  );

  const value = React.useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      themes: enableSystem
        ? (["light", "dark", "system"] as Theme[])
        : (["light", "dark"] as Theme[]),
      systemTheme
    }),
    [enableSystem, resolvedTheme, setTheme, systemTheme, theme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}
