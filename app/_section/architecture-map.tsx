"use client";

import { useTheme } from "@/providers/ThemeProvider";
import { useEffect, useState } from "react";

interface ArchitectureMapProps {
  className?: string;
}

const ArchitectureMap = ({ className }: ArchitectureMapProps) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => setMounted(true), []);

  const embedTheme = mounted ? resolvedTheme : "light";

  useEffect(() => {
    setIsLoaded(false);
  }, [embedTheme]);

  return (
    <section
      aria-label="Canopy architecture map"
      className={`flex w-full min-w-0 flex-col items-center gap-2 ${className || ""}`}
    >
      <h2 className="text-lg font-bold text-muted-foreground">
        Our tech stack
      </h2>
      <div
        className={`t-skel relative h-[460px] w-full overflow-hidden rounded-xl border border-border/70 bg-muted/20 ${
          isLoaded ? "is-revealed" : ""
        }`}
        aria-busy={!isLoaded}
      >
        <div className="t-skel-skeleton is-pulsing" aria-hidden="true">
          <div className="relative h-full w-full overflow-hidden rounded-xl bg-muted/20">
            <div className="absolute inset-0 bg-[radial-gradient(circle,_color-mix(in_srgb,var(--muted-foreground)_20%,transparent)_1px,_transparent_1px)] bg-[length:18px_18px]" />
            <div className="absolute left-[14%] top-[24%] h-12 w-28 rounded-lg border border-border/60 bg-background/80" />
            <div className="absolute right-[14%] top-[24%] h-12 w-28 rounded-lg border border-border/60 bg-background/80" />
            <div className="absolute left-1/2 top-1/2 h-14 w-32 -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border/60 bg-background/90" />
            <div className="absolute bottom-[24%] left-[22%] h-12 w-28 rounded-lg border border-border/60 bg-background/80" />
            <div className="absolute bottom-[24%] right-[22%] h-12 w-28 rounded-lg border border-border/60 bg-background/80" />
            <div className="absolute left-[29%] top-[35%] h-px w-[22%] rotate-[22deg] bg-border/70" />
            <div className="absolute right-[29%] top-[35%] h-px w-[22%] -rotate-[22deg] bg-border/70" />
            <div className="absolute bottom-[35%] left-[30%] h-px w-[20%] -rotate-[22deg] bg-border/70" />
            <div className="absolute bottom-[35%] right-[30%] h-px w-[20%] rotate-[22deg] bg-border/70" />
          </div>
        </div>
        <div className="t-skel-content">
          <iframe
            key={embedTheme}
            src={`https://embed.canopy.8starlabs.com/embed/map/42f03943-4b94-4c04-91cc-c8c7fd8f555e?theme=${embedTheme}`}
            width="100%"
            height={460}
            loading="lazy"
            allow="fullscreen"
            className="block h-full w-full"
            style={{ border: 0, borderRadius: "12px" }}
            title="Canopy architecture map"
            onLoad={() => setIsLoaded(true)}
          />
        </div>
      </div>
    </section>
  );
};

export default ArchitectureMap;
