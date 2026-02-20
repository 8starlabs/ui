"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface MarqueeProps {
  grayscale?: boolean;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  fade?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export default function Marquee({
  grayscale = false,
  direction = "left",
  pauseOnHover = true,
  fade = true,
  children,
  className
}: MarqueeProps) {
  const content = React.Children.toArray(children);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Prevent any scrolling
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const preventScroll = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      container.scrollLeft = 0;
    };

    container.addEventListener("scroll", preventScroll, { passive: false });
    container.addEventListener("wheel", preventScroll, { passive: false });
    container.addEventListener("touchmove", preventScroll, { passive: false });

    return () => {
      container.removeEventListener("scroll", preventScroll);
      container.removeEventListener("wheel", preventScroll);
      container.removeEventListener("touchmove", preventScroll);
    };
  }, []);

  const animationClass =
    direction === "left" ? "marquee-inner" : "marquee-inner-reverse";

  return (
    <div className="relative overflow-hidden">
      <style jsx global>{`
        .marquee-container::-webkit-scrollbar {
          display: none;
        }

        .marquee-inner {
          animation: marquee-anim 10s linear infinite;
        }
        .marquee-inner-reverse {
          animation: marquee-anim-reverse 10s linear infinite;
        }

        .marquee-container:hover .marquee-inner,
        .marquee-container:hover .marquee-inner-reverse {
          animation-play-state: paused !important;
        }

        @keyframes marquee-anim {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes marquee-anim-reverse {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
      `}</style>

      <div
        ref={containerRef}
        className={cn(
          "flex w-full p-2 [--gap:3rem] select-none cursor-default",
          pauseOnHover && "marquee-container",
          grayscale && "grayscale contrast-200 dark:invert",
          className
        )}
        style={{
          maskImage: fade
            ? "linear-gradient(90deg, transparent 0%, rgba(0,0,0,1) 8%, rgba(0,0,0,1) 92%, transparent 100%)"
            : "none",
          WebkitMaskImage: fade
            ? "linear-gradient(90deg, transparent 0%, rgba(0,0,0,1) 8%, rgba(0,0,0,1) 92%, transparent 100%)"
            : "none",
          userSelect: "none",
          WebkitUserSelect: "none",
          pointerEvents: pauseOnHover ? "auto" : "none",
          overflow: "hidden",
          scrollbarWidth: "none",
          msOverflowStyle: "none"
        }}
      >
        <div
          className={cn(
            "flex shrink-0 items-center [gap:var(--gap)] will-change-transform",
            animationClass
          )}
        >
          {content.length === 0 ? (
            <>
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  aria-hidden="true"
                  className="bg-black rounded-xl h-20 w-40"
                />
              ))}
            </>
          ) : (
            <>
              {content.map((item, index) => (
                <div key={index}>{item}</div>
              ))}
              {content.map((item, index) => (
                <div key={`duplicate-${index}`}>{item}</div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
