"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  CircleOffIcon,
  XCircleIcon
} from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/registry/8starlabs-ui/ui/tooltip";
import { cn } from "@/lib/utils";

type appStatusStatus = "normal" | "warning" | "error" | "empty";

export type AppStatusData = {
  status: appStatusStatus;
  timestamp?: string | Date;
  info?: string;
};

export interface StatusMonitorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  statuses: AppStatusData[];
  unit?: "days" | "hours";
  title?: string;
  showUptime?: boolean;
}

interface appStatusConfigData {
  label: string;
  defaultInfo: string;
  barClassName: string;
  textClassName: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const statusConfig = {
  normal: {
    label: "Normal",
    defaultInfo: "Systems are operating normally.",
    barClassName: "bg-green-600",
    textClassName: "text-green-600",
    Icon: CheckCircle2Icon
  },
  warning: {
    label: "Warning",
    defaultInfo:
      "Systems are operating with elevated risk or degraded service.",
    barClassName: "bg-amber-600",
    textClassName: "text-amber-600",
    Icon: AlertTriangleIcon
  },
  error: {
    label: "Error",
    defaultInfo: "A service-impacting incident is active.",
    barClassName: "bg-red-600",
    textClassName: "text-red-600",
    Icon: XCircleIcon
  },
  empty: {
    label: "No data",
    defaultInfo: "No status data was recorded for this period.",
    barClassName: "bg-gray-300",
    textClassName: "text-gray-300",
    Icon: CircleOffIcon
  }
} satisfies Record<appStatusStatus, appStatusConfigData>;

const BAR_WIDTH_PX = 5;
const BAR_GAP_PX = 2;
const MIN_VISIBLE_SLOTS = 30;
const SLOT_COUNTS = [90, 60, MIN_VISIBLE_SLOTS] as const;

function getTimelineWidth(numSlots: number) {
  return numSlots * BAR_WIDTH_PX + (numSlots - 1) * BAR_GAP_PX;
}

function calculateNumDisplayableBars(width: number) {
  return SLOT_COUNTS.find((slots) => width >= getTimelineWidth(slots)) ?? 30;
}

function formatTimestamp(timestamp: AppStatusData["timestamp"]) {
  if (!timestamp) return undefined;

  if (timestamp instanceof Date) {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric"
    }).format(timestamp);
  }

  return timestamp;
}

export default function StatusMonitor({
  statuses,
  unit = "days",
  title,
  showUptime = true,
  className,
  ...props
}: StatusMonitorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleSlots, setVisibleSlots] = useState<number>(MIN_VISIBLE_SLOTS);

  const uptimePercentage = useMemo(() => {
    const validStatuses = statuses.filter((s) => s.status !== "empty");
    if (validStatuses.length === 0) return 100;

    const normalCount = validStatuses.filter(
      (s) => s.status === "normal"
    ).length;
    return parseFloat(((normalCount / validStatuses.length) * 100).toFixed(2));
  }, [statuses]);

  const paddedStatuses = useMemo(() => {
    const padCount = 90 - statuses.length;
    const padding: AppStatusData[] = Array(padCount > 0 ? padCount : 0).fill({
      status: "empty"
    });
    return [...padding, ...statuses].slice(-90);
  }, [statuses]);

  const visibleStatuses = useMemo(
    () => paddedStatuses.slice(-visibleSlots),
    [paddedStatuses, visibleSlots]
  );
  const timelineWidth = getTimelineWidth(visibleSlots);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateVisibleSlots = () => {
      setVisibleSlots(
        calculateNumDisplayableBars(container.getBoundingClientRect().width)
      );
    };

    updateVisibleSlots();

    const resizeObserver = new ResizeObserver(updateVisibleSlots);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "mx-auto w-full max-w-3xl min-w-[208px] font-sans",
        className
      )}
      id="status-monitor"
      {...props}
    >
      <div
        className="mx-auto flex flex-col space-y-3"
        style={{ width: timelineWidth }}
      >
        {/* Header: Title and Uptime Percentage */}
        <div className="flex justify-between items-center text-sm">
          <span className="font-semibold text-gray-800">
            {title ?? "Application Status"}
          </span>
          {showUptime ? (
            <span className="font-medium text-gray-500">
              {uptimePercentage}% uptime
            </span>
          ) : null}
        </div>

        {/* Status Bars Container */}
        <TooltipProvider delay={0}>
          <div
            className="grid h-8 gap-0.5"
            style={{
              gridTemplateColumns: `repeat(${visibleSlots}, ${BAR_WIDTH_PX}px)`
            }}
          >
            {visibleStatuses.map((item, index) => {
              const config = statusConfig[item.status];
              const Icon = config.Icon;
              const timestamp = formatTimestamp(item.timestamp);
              const label = timestamp
                ? `${timestamp}: ${config.label}`
                : config.label;
              const edgeClassName = [
                index === 0 ? "rounded-l-sm" : "",
                index === visibleStatuses.length - 1 ? "rounded-r-sm" : ""
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <Tooltip key={index}>
                  <TooltipTrigger
                    delay={0}
                    render={
                      <div
                        className={`h-full w-[5px] ${edgeClassName} ${config.barClassName} hover:opacity-80 transition-opacity`}
                        aria-label={label}
                      />
                    }
                  />
                  <TooltipContent
                    side="bottom"
                    sideOffset={8}
                    className="data-[state=delayed-open]:animate-none data-open:animate-none data-closed:animate-none"
                  >
                    <div className="text-sm w-100 space-y-1 p-1">
                      <div className="flex items-center gap-2">
                        <Icon
                          className={`size-4 shrink-0 ${config.textClassName}`}
                          aria-hidden="true"
                        />
                        <span className={`font-bold ${config.textClassName}`}>
                          {config.label}
                        </span>
                      </div>
                      {timestamp ? (
                        <div className="text-background/70">{timestamp}</div>
                      ) : null}
                      <div className="leading-snug text-background/80">
                        {item.info ?? config.defaultInfo}
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </TooltipProvider>

        {/* Footer: Timeline Legend */}
        <div className="flex justify-between text-xs text-gray-400">
          <span>
            {visibleSlots} {unit} ago
          </span>
          <span>Current</span>
        </div>
      </div>
    </div>
  );
}
