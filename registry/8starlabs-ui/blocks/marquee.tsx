"use client";

import { cn } from "@/lib/utils";

import React from "react";

interface MarqueeProps {
  greyscale?: boolean;
  direction?: "left" | "right";
  children?: React.ReactNode;
  className?: string;
}

export default function Marquee({
  greyscale = false,
  direction = "left",
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
    <div
      className={cn(
        "group/marquee flex overflow-hidden p-2 [--gap:1rem]",
        greyscale && "grayscale",
        "mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]",
        className
      )}
    >
      <div
        className={cn(
          "flex shrink-0 min-w-full items-center gap-(--gap) pr-(--gap) group-hover/marquee:paused",
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
          "flex shrink-0 min-w-full items-center gap-(--gap) pr-(--gap) group-hover/marquee:paused",
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
  );
}
