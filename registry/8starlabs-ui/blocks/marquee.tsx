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
  const repeat = 4;

  const duplicatedContent = React.useMemo(() => {
    if (content.length === 0) return [];
    if (content.length < repeat) {
      return Array.from({ length: repeat }, () => content).flat();
    }
    return content;
  }, [content, repeat]);

  const animationClass =
    direction === "left" ? "marquee-inner" : "marquee-inner-reverse";

  return (
    <div className="relative">
      <style jsx global>{`
        .marquee-inner {
          animation: marquee-anim 25s linear infinite;
        }
        .marquee-inner-reverse {
          animation: marquee-anim-reverse 25s linear infinite;
        }

        .marquee-container:hover .marquee-inner,
        .marquee-container:hover .marquee-inner-reverse {
          animation-play-state: paused !important;
        }

        @keyframes marquee-anim {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-100%);
          }
        }

        @keyframes marquee-anim-reverse {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>

      <div
        className={cn(
          "flex overflow-hidden p-2 [--gap:3rem]",
          pauseOnHover && "marquee-container",
          grayscale && "grayscale contrast-200 dark:invert",
          className
        )}
        style={{
          maskImage: fade
            ? "linear-gradient(to right, transparent, black 5%, black 95%, transparent)"
            : "none",
          WebkitMaskImage: fade
            ? "linear-gradient(to right, transparent, black 5%, black 95%, transparent)"
            : "none"
        }}
      >
        {[0, 1].map((i) => (
          <div
            key={i}
            className={cn(
              "flex shrink-0 items-center [gap:var(--gap)] [padding-right:var(--gap)]",
              animationClass
            )}
          >
            {duplicatedContent.length === 0 ? (
              <>
                <div
                  aria-hidden="true"
                  className="bg-black rounded-xl h-20 w-40"
                />
                <div
                  aria-hidden="true"
                  className="bg-black rounded-xl h-20 w-40"
                />
                <div
                  aria-hidden="true"
                  className="bg-black rounded-xl h-20 w-40"
                />
              </>
            ) : (
              duplicatedContent.map((item, index) => (
                <div key={`${i}-${index}`}>{item}</div>
              ))
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
