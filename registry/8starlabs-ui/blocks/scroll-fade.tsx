"use client";

import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import { cn } from "@/lib/utils";

type ScrollAxis = "horizontal" | "vertical" | "both";

interface ScrollFadeProps {
  children: React.ReactNode;
  className?: string;
  hideScrollbar?: boolean;
  axis?: ScrollAxis;
  intensity?: number;
}

export default function ScrollFade({
  children,
  className,
  hideScrollbar = true,
  axis = "horizontal",
  intensity = 1
}: ScrollFadeProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [showBottom, setShowBottom] = useState(false);

  const fadeIntensity = Math.min(Math.max(intensity, 0), 1);
  const checkScroll = () => {
    const el = containerRef.current;
    if (!el) return;

    const {
      scrollLeft,
      scrollTop,
      scrollWidth,
      scrollHeight,
      clientWidth,
      clientHeight
    } = el;

    if (axis === "horizontal" || axis === "both") {
      setShowLeft(scrollLeft > 0);
      setShowRight(
        Math.ceil(scrollLeft + clientWidth) < Math.floor(scrollWidth - 1)
      );
    }

    if (axis === "vertical" || axis === "both") {
      setShowTop(scrollTop > 0);
      setShowBottom(
        Math.ceil(scrollTop + clientHeight) < Math.floor(scrollHeight - 1)
      );
    }
  };

  useLayoutEffect(() => {
    requestAnimationFrame(checkScroll);
  }, [axis]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onScroll = () => checkScroll();
    container.addEventListener("scroll", onScroll, { passive: true });

    const ro = new ResizeObserver(() => checkScroll());
    if (contentRef.current) ro.observe(contentRef.current);
    ro.observe(container);

    const onResize = () => checkScroll();
    window.addEventListener("resize", onResize);

    const raf = requestAnimationFrame(checkScroll);

    return () => {
      container.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [axis]);

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className={cn(
          hideScrollbar &&
            "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
          axis === "horizontal" && "w-full overflow-x-auto overflow-y-hidden",
          axis === "vertical" && "h-full overflow-y-auto overflow-x-hidden",
          axis === "both" && "overflow-auto",
          className
        )}
      >
        <div
          ref={contentRef}
          className={cn(
            axis === "horizontal" && "w-fit min-w-full",
            axis === "vertical" && "h-fit min-h-full",
            axis === "both" && "min-w-full min-h-full w-fit h-fit"
          )}
        >
          {children}
        </div>
      </div>

      {(axis === "horizontal" || axis === "both") && showLeft && (
        <div
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 h-full w-10 z-10"
          style={{
            background: `linear-gradient(to right, var(--background) 0%, transparent ${fadeIntensity * 100}%)`
          }}
        />
      )}

      {(axis === "horizontal" || axis === "both") && showRight && (
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 top-0 h-full w-10 z-10"
          style={{
            background: `linear-gradient(to left, var(--background) 0%, transparent ${fadeIntensity * 100}%)`
          }}
        />
      )}

      {(axis === "vertical" || axis === "both") && showTop && (
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 left-0 w-full h-10 z-10"
          style={{
            background: `linear-gradient(to bottom, var(--background) 0%, transparent ${fadeIntensity * 100}%)`
          }}
        />
      )}

      {(axis === "vertical" || axis === "both") && showBottom && (
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 w-full h-10 z-10"
          style={{
            background: `linear-gradient(to top, var(--background) 0%, transparent ${fadeIntensity * 100}%)`
          }}
        />
      )}
    </div>
  );
}
