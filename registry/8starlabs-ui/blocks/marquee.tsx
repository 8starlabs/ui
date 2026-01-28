"use client";

import { cn } from "@/lib/utils";

import React from "react";

interface MarqueeProps {
  greyscale?: boolean;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  fade?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export default function Marquee({
  greyscale = false,
  direction = "left",
  pauseOnHover = true,
  fade = true,
  children,
  className
}: MarqueeProps) {
  const content = React.Children.toArray(children);
  const repeat = 4;
  const duplicatedContent = React.useMemo(() => {
    if (content.length === 0) {
      return [];
    } else if (content.length < repeat) {
      return Array.from({ length: repeat }, () => content).flat();
    }
    return content;
  }, [content, repeat]);
  const animationClass =
    direction === "left" ? "animate-marquee" : "animate-marquee-reverse";

  return (
    <div className="relative">
      <div
        className={cn(
          "flex overflow-hidden p-2 [--gap:3rem]",
          pauseOnHover && "group/marquee",
          greyscale && "grayscale contrast-200",
          fade && "relative",
          className
        )}
      >
        <div
          className={cn(
            "flex shrink-0 items-center [gap:var(--gap)] [padding-right:var(--gap)]",
            pauseOnHover && "group-hover/marquee:paused",
            animationClass
          )}
        >
          {duplicatedContent.length === 0 ? (
            <>
              <div
                aria-hidden="true"
                className="bg-black rounded-xl h-20 w-40"
              ></div>
              <div className="bg-black rounded-xl h-20 w-40"></div>
              <div className="bg-black rounded-xl h-20 w-40"></div>
            </>
          ) : (
            duplicatedContent.map((item, index) => (
              <div key={`source-${index}`}>{item}</div>
            ))
          )}
        </div>

        <div
          className={cn(
            "flex shrink-0 items-center [gap:var(--gap)] [padding-right:var(--gap)]",
            pauseOnHover && "group-hover/marquee:paused",
            animationClass
          )}
        >
          {duplicatedContent.length === 0 ? (
            <>
              <div
                aria-hidden="true"
                className="bg-black rounded-xl h-20 w-40"
              ></div>
              <div className="bg-black rounded-xl h-20 w-40"></div>
              <div className="bg-black rounded-xl h-20 w-40"></div>
            </>
          ) : (
            duplicatedContent.map((item, index) => (
              <div key={`source-${index}`}>{item}</div>
            ))
          )}
        </div>
      </div>

      {fade && (
        <div
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 h-full w-10 z-10"
          style={{
            background:
              "linear-gradient(to right, var(--background) 60%, transparent 100%)"
          }}
        />
      )}

      {fade && (
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 top-0 h-full w-10 z-10"
          style={{
            background:
              "linear-gradient(to left, var(--background) 60%, transparent 100%)"
          }}
        />
      )}
    </div>
  );
}
