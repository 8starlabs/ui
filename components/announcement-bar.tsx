"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import { ArrowRight, X } from "lucide-react";

const STORAGE_KEY = "canopy-launch-dismissed";
const CANOPY_URL =
  "https://canopy.8starlabs.com/?utm_source=ui_8starlabs&utm_medium=announcement_bar&utm_campaign=canopy_launch";

const CANOPY_MESH_STYLE = {
  backgroundColor: "#f8fbff",
  backgroundImage: [
    "radial-gradient(circle at 5% 15%, rgba(253, 186, 116, 0.95), transparent 34%)",
    "radial-gradient(circle at 22% 110%, rgba(253, 164, 175, 0.88), transparent 38%)",
    "radial-gradient(circle at 36% 12%, rgba(94, 234, 212, 0.9), transparent 34%)",
    "radial-gradient(circle at 49% 95%, rgba(134, 239, 172, 0.9), transparent 36%)",
    "radial-gradient(circle at 68% 20%, rgba(56, 189, 248, 0.92), transparent 36%)",
    "radial-gradient(circle at 80% 105%, rgba(240, 171, 252, 0.88), transparent 36%)",
    "radial-gradient(circle at 92% 18%, rgba(129, 140, 248, 0.88), transparent 34%)",
    "radial-gradient(circle at 108% 72%, rgba(34, 211, 238, 0.9), transparent 38%)",
    "linear-gradient(90deg, rgba(255, 255, 255, 0.26), rgba(255, 255, 255, 0.08))"
  ].join(", ")
} satisfies CSSProperties;

const CANOPY_GRAIN_STYLE = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='.46'/%3E%3C/svg%3E\")"
} satisfies CSSProperties;

export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setDismissed(localStorage.getItem(STORAGE_KEY) === "true");
  }, []);

  if (dismissed) return null;

  return (
    <div
      className="relative w-full overflow-hidden text-[#0E1417]"
      style={CANOPY_MESH_STYLE}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-multiply"
        style={CANOPY_GRAIN_STYLE}
      />
      <div className="pointer-events-none absolute inset-0 bg-white/10" />
      <a
        href={CANOPY_URL}
        target="_blank"
        rel="noreferrer"
        className="group relative mx-auto flex h-6 w-full max-w-10xl items-center justify-center gap-x-1 px-8 text-center text-[10px] font-medium tracking-tight"
      >
        <span className="truncate">
          <span className="font-semibold">Canopy is live</span>
          <span className="hidden text-[#2A2F33]/80 sm:inline">
            {" "}
            — the living map of your stack.
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-x-0.5 font-semibold underline-offset-4 group-hover:underline">
          Explore
          <ArrowRight className="size-2.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </a>
      <button
        type="button"
        aria-label="Dismiss announcement"
        onClick={() => {
          localStorage.setItem(STORAGE_KEY, "true");
          setDismissed(true);
        }}
        className="absolute right-2 top-1/2 flex size-4 -translate-y-1/2 items-center justify-center rounded text-[#2A2F33]/75 transition-colors hover:bg-white/35 hover:text-[#0E1417]"
      >
        <X className="size-2.5" />
      </button>
    </div>
  );
}
