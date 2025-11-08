import React from "react";
import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  state: "active" | "down" | "fixing" | "idle";
  color?: string;
  label?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  labelClassName?: string;
}

const getStateColors = (state: StatusIndicatorProps["state"]) => {
  switch (state) {
    case "active":
      return { dot: "#22c55e", ping: "#4ade80" };
    case "down":
      return { dot: "#dc2626", ping: "#f87171" };
    case "fixing":
      return { dot: "#ca8a04", ping: "#facc15" };
    case "idle":
    default:
      return { dot: "#334155", ping: "#64748b" };
  }
};

const getSizeClasses = (size: StatusIndicatorProps["size"]) => {
  switch (size) {
    case "sm":
      return { dot: "h-2 w-2", ping: "h-2 w-2" };
    case "lg":
      return { dot: "h-4 w-4", ping: "h-4 w-4" };
    case "md":
    default:
      return { dot: "h-3 w-3", ping: "h-3 w-3" };
  }
};

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  state = "idle",
  color,
  label,
  className,
  size = "md",
  labelClassName
}) => {
  const shouldAnimate = state === "active" || state === "fixing";
  const colors = getStateColors(state);
  const sizeClasses = getSizeClasses(size);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative flex items-center">
        {shouldAnimate && (
          <span
            className={cn(
              "absolute inline-flex rounded-full opacity-75 animate-ping",
              sizeClasses.ping
            )}
            style={{ backgroundColor: color || colors.ping }}
          />
        )}
        <span
          className={cn("relative inline-flex rounded-full", sizeClasses.dot)}
          style={{ backgroundColor: color || colors.dot }}
        />
      </div>
      {label && (
        <p
          className={cn(
            "text-sm text-slate-700 dark:text-slate-300",
            labelClassName
          )}
        >
          {label}
        </p>
      )}
    </div>
  );
};

export default StatusIndicator;
