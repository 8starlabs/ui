"use client";

import { useTheme } from "@/providers/ThemeProvider";
import { useEffect, useState } from "react";

interface ArchitectureMapProps {
  className?: string;
}

const ArchitectureMap = ({ className }: ArchitectureMapProps) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const embedTheme = mounted ? resolvedTheme : "light";

  return (
    <section
      aria-label="Canopy architecture map"
      className={`flex w-full min-w-0 flex-col items-center gap-2 ${className || ""}`}
    >
      <h2 className="text-lg font-bold text-muted-foreground">
        Our tech stack
      </h2>
      <iframe
        src={`https://embed.canopy.8starlabs.com/embed/map/42f03943-4b94-4c04-91cc-c8c7fd8f555e?theme=${embedTheme}`}
        width="100%"
        height={460}
        loading="lazy"
        allow="fullscreen"
        style={{
          border: `1px solid ${embedTheme === "dark" ? "#27272a" : "#e5e7eb"}`,
          borderRadius: "12px"
        }}
        title="Canopy architecture map"
      />
    </section>
  );
};

export default ArchitectureMap;
