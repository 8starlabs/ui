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
  timestamp?: string;
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
    barClassName: "bg-green-500",
    textClassName: "text-green-400",
    Icon: CheckCircle2Icon
  },
  warning: {
    label: "Warning",
    defaultInfo:
      "Systems are operating with elevated risk or degraded service.",
    barClassName: "bg-amber-500",
    textClassName: "text-amber-300",
    Icon: AlertTriangleIcon
  },
  error: {
    label: "Error",
    defaultInfo: "A service-impacting incident is active.",
    barClassName: "bg-red-500",
    textClassName: "text-red-400",
    Icon: XCircleIcon
  },
  empty: {
    label: "No data",
    defaultInfo: "No status data was recorded for this period.",
    barClassName: "bg-gray-200",
    textClassName: "text-gray-300",
    Icon: CircleOffIcon
  }
} satisfies Record<AppStatusStatus, AppStatusConfigData>;

export default function StatusMonitor({
  statuses,
  unit = "days"
}: StatusMonitorProps) {
  // 1. Calculate overall uptime percentage
  const uptimePercentage = useMemo(() => {
    // Only count actual recorded statuses (ignore empty padding)
    const validStatuses = statuses.filter((s) => s.status !== "empty");
    if (validStatuses.length === 0) return 100;

    const normalCount = validStatuses.filter(
      (s) => s.status === "normal"
    ).length;
    // Calculate and round to 2 decimal places, then drop trailing zeros
    return parseFloat(((normalCount / validStatuses.length) * 100).toFixed(2));
  }, [statuses]);

  // 2. Ensure exactly 90 items for rendering, pad the front with 'empty' if necessary
  const paddedStatuses = useMemo(() => {
    const padCount = 90 - statuses.length;
    const padding: AppStatusData[] = Array(padCount > 0 ? padCount : 0).fill({
      status: "empty"
    });
    // Combine and ensure we only ever take the latest 90 if more are provided
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
        <div className="flex items-center gap-[2px] h-8">
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
            const label = item.timestamp
              ? `${item.timestamp}: ${config.label}`
              : config.label;

            return (
              <Tooltip key={index}>
                <TooltipTrigger
                  render={
                    <button
                      type="button"
                      className={`flex-1 h-full rounded-sm ${config.barClassName} ${displayClass} hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 transition-opacity cursor-pointer`}
                      aria-label={label}
                    />
                  }
                />
                <TooltipContent side="top" sideOffset={8}>
                  <div className="min-w-44 space-y-1">
                    <div className="flex items-center gap-2">
                      <Icon
                        className={`size-4 shrink-0 ${config.textClassName}`}
                        aria-hidden="true"
                      />
                      <span className={`font-medium ${config.textClassName}`}>
                        {config.label}
                      </span>
                    </div>
                    {item.timestamp ? (
                      <div className="text-[11px] text-background/70">
                        {item.timestamp}
                      </div>
                    ) : null}
                    <div className="text-[11px] leading-snug text-background/80">
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
