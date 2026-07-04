"use client";

import * as React from "react";
import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";

import { useMetaColor } from "@/hooks/use-meta-color";
import { useTheme } from "@/providers/ThemeProvider";
import { Button } from "@/registry/8starlabs-ui/blocks/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/registry/8starlabs-ui/ui/dropdown-menu";

const THEMES = [
  { value: "light", label: "Light", Icon: SunIcon },
  { value: "dark", label: "Dark", Icon: MoonIcon },
  { value: "system", label: "System", Icon: MonitorIcon }
] as const;

export function ModeSwitcher() {
  const { theme, setTheme } = useTheme();
  const { setMetaColor, metaColor } = useMetaColor();

  React.useEffect(() => {
    setMetaColor(metaColor);
  }, [metaColor, setMetaColor]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="group/toggle extend-touch-target size-8 cursor-pointer"
            title="Toggle theme"
          >
            <SunIcon className="size-4.5 dark:hidden" />
            <MoonIcon className="hidden size-4.5 dark:block" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        {THEMES.map(({ value, label, Icon }) => (
          <DropdownMenuItem
            key={value}
            onClick={() => setTheme(value)}
            data-active={theme === value}
            className="cursor-pointer data-[active=true]:font-medium"
          >
            <Icon className="size-4" />
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
