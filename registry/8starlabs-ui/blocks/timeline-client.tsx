"use client";

import React, {
  cloneElement,
  createContext,
  useContext,
  useRef,
  useLayoutEffect,
  useState
} from "react";
import { clsx } from "clsx";
import {
  TimelineItemData,
  TimelineItemProps,
  TimelineProps,
  TimelineItemCardProps,
  TimelineConfig
} from "./timelineTypes";

const TimelineContext = createContext<TimelineConfig | null>(null);

export function useTimelineContext() {
  const context = useContext(TimelineContext);
  if (!context) {
    throw new Error(
      "useTimelineContext must be used within a TimelineProvider"
    );
  }
  return context;
}

export function TimelineClient({
  config,
  children
}: {
  config: TimelineConfig;
  children: any;
}) {
  const {
    title,
    titleColor,
    titleSize,
    lineColor,
    lineThickness,
    shadow,
    itemSpacing
  } = config;
  const timelineRef = useRef<HTMLDivElement>(null);
  const [titleMarginBottom, setTitleMarginBottom] = useState<number>(40);

  useLayoutEffect(() => {
    if (timelineRef.current) {
      const cards = timelineRef.current.querySelectorAll(
        '[data-timeline-card="top"]'
      );
      let maxHeight = 0;

      cards.forEach((card) => {
        const height = (card as HTMLElement).offsetHeight;
        if (height > maxHeight) {
          maxHeight = height;
        }
      });

      setTitleMarginBottom(maxHeight + 32);
    }
  }, [children]);

  return (
    <TimelineContext.Provider value={config}>
      <div id="timeline" ref={timelineRef} className="my-8">
        <div
          className={`font-bold text-center`}
          style={{
            fontSize: `${titleSize}px`,
            color: titleColor,
            marginBottom: `${titleMarginBottom}px`
          }}
        >
          {title}
        </div>

        <div
          className="flex flex-row justify-between items-center px-20 rounded"
          style={{
            height: `${lineThickness}px`,
            backgroundColor: lineColor,
            boxShadow: shadow ? "0 4px 6px rgba(0, 0, 0, 0.1)" : "none",
            gap: `${itemSpacing}px`
          }}
        >
          {children.map((child: any, index: number) =>
            cloneElement(child, { index })
          )}
        </div>
      </div>
    </TimelineContext.Provider>
  );
}

function getDateString(date: Date, format: "day" | "month" | "year") {
  let dateStr = "";
  switch (format) {
    case "day":
      let day = date.getDate().toString().padStart(2, "0");
      let month = date.toLocaleString("default", { month: "short" });
      let year = date.getFullYear();
      dateStr = `${day} ${month} ${year}`;
      break;
    case "month":
      dateStr = date.toLocaleString("default", {
        month: "short",
        year: "numeric"
      });
      break;
    case "year":
      dateStr = date.getFullYear().toString();
      break;
  }
  return dateStr;
}

export function TimelineItemCard({ isAbove, content }: TimelineItemCardProps) {
  const {
    dateDisplayFormat,
    itemFillColor,
    itemBorderThickness,
    itemBorderColor,
    shadow,
    itemTextAlignment,
    itemWidth,
    itemGap
  } = useTimelineContext();

  return (
    <div
      data-timeline-card={isAbove ? "top" : "bottom"}
      className={clsx(
        "absolute p-2 rounded-sm gap-2 flex flex-col items-start",
        isAbove ? "bottom-full" : "top-full"
      )}
      style={{
        backgroundColor: itemFillColor,
        borderWidth: `${itemBorderThickness}px`,
        borderColor: content.highlight ? "red" : itemBorderColor,
        boxShadow: shadow ? "0 4px 6px rgba(0, 0, 0, 0.1)" : "none",
        textAlign: itemTextAlignment,
        width: `${itemWidth}px`,
        marginTop: isAbove ? "0px" : `${itemGap}px`,
        marginBottom: isAbove ? `${itemGap}px` : "0px"
      }}
    >
      <div className="text-xs text-gray-500 w-full">
        {getDateString(content.date, dateDisplayFormat || "day")}
      </div>
      <div className="font-semibold w-full">{content.title}</div>
      <div className="text-sm w-full">{content.description}</div>
    </div>
  );
}

export function TimelineItem({ index, content }: TimelineItemProps) {
  const {
    alternating,
    alignment,
    circleSize = 24,
    circleColor = "#FFFFFF",
    circleBorderColor = "#9CA3AF",
    circleThickness = 5
  } = useTimelineContext();

  const isAbove = alternating ? index! % 2 === 0 : alignment === "top";

  return (
    <div className={`relative flex flex-col items-center`}>
      <TimelineItemCard isAbove={isAbove} content={content} />
      <div
        className="rounded-full"
        style={{
          width: `${circleSize}px`,
          height: `${circleSize}px`,
          backgroundColor: circleColor,
          borderColor: content.highlight ? "red" : circleBorderColor,
          borderWidth: `${circleThickness}px`
        }}
      />
    </div>
  );
}
