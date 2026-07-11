"use client";

import React, { useEffect, useMemo, useState } from "react";
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

type AppStatusStatus = "normal" | "warning" | "error" | "empty";

export type AppStatusData = {
  status: AppStatusStatus;
  timestamp?: string | Date;
  info?: string;
};

interface StatusMonitorProps {
  statuses: AppStatusData[];
  unit?: "days" | "hours";
}

interface AppStatusConfigData {
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
} satisfies Record<AppStatusStatus, AppStatusConfigData>;

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
  unit = "days"
}: StatusMonitorProps) {
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

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col space-y-3 font-sans">
      {/* Header: Title and Uptime Percentage */}
      <div className="flex justify-between items-center text-sm">
        <span className="font-semibold text-gray-800">Application Status</span>
        <span className="font-medium text-gray-500">
          {uptimePercentage}% uptime
        </span>
      </div>

      {/* Status Bars Container */}
      <TooltipProvider>
        <div className="flex items-center gap-0.5 h-8">
          {paddedStatuses.map((item, index) => {
            // 3. Responsive Hiding Logic (Tailwind Breakpoints)
            // index 0-29 (Oldest 30): Hidden on mobile/tablet, shown on desktop (md)
            // index 30-59 (Middle 30): Hidden on mobile, shown on tablet (sm) and desktop
            let displayClass = "block";
            if (index < 30) {
              displayClass = "hidden md:block";
            } else if (index < 60) {
              displayClass = "hidden sm:block";
            }

            const config = statusConfig[item.status];
            const Icon = config.Icon;
            const timestamp = formatTimestamp(item.timestamp);
            const label = timestamp
              ? `${timestamp}: ${config.label}`
              : config.label;
            const edgeClassName = [
              index === 0 ? "md:rounded-l-sm" : "",
              index === 30 ? "sm:rounded-l-sm md:rounded-none" : "",
              index === 60 ? "rounded-l-sm sm:rounded-none" : "",
              index === paddedStatuses.length - 1 ? "rounded-r-sm" : ""
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <Tooltip key={index}>
                <TooltipTrigger
                  render={
                    <div
                      className={`flex-1 h-full ${edgeClassName} ${config.barClassName} ${displayClass} hover:opacity-80 transition-opacity`}
                      aria-label={label}
                    />
                  }
                />
                <TooltipContent side="bottom" sideOffset={8}>
                  <div className="text-sm min-w-44 space-y-1 p-1">
                    <div className="flex items-center gap-2">
                      <Icon
                        className={`size-4 shrink-0 ${config.textClassName}`}
                        aria-hidden="true"
                      />
                      <span className={`font-medium ${config.textClassName}`}>
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
        {/* Dynamic "Ago" text based on viewport width */}
        <span className="block sm:hidden">30 {unit} ago</span>
        <span className="hidden sm:block md:hidden">60 {unit} ago</span>
        <span className="hidden md:block">90 {unit} ago</span>
        <span>Current</span>
      </div>
    </div>
  );
}
