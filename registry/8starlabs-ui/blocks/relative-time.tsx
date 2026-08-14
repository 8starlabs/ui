import * as React from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/registry/8starlabs-ui/ui/tooltip";
import { cn } from "@/lib/utils";

type RelativeTimeUnit = Intl.RelativeTimeFormatUnit;

export interface RelativeTimeProps
  extends Omit<React.ComponentPropsWithoutRef<"time">, "dateTime"> {
  /** The date to describe. Accepts a Date, an ISO date string, or a Unix timestamp in milliseconds. */
  date: Date | string | number;
  /** Locale passed to Intl.RelativeTimeFormat. */
  locale?: string | string[];
  /** Whether zero should display as "now" or "0 seconds ago". */
  numeric?: Intl.RelativeTimeFormatOptions["numeric"];
  /** Shows the exact UTC/GMT date on hover and keyboard focus. */
  showTooltip?: boolean;
}

const TIME_UNITS: Array<{ unit: RelativeTimeUnit; milliseconds: number }> = [
  { unit: "year", milliseconds: 365.25 * 24 * 60 * 60 * 1000 },
  { unit: "month", milliseconds: 30.44 * 24 * 60 * 60 * 1000 },
  { unit: "week", milliseconds: 7 * 24 * 60 * 60 * 1000 },
  { unit: "day", milliseconds: 24 * 60 * 60 * 1000 },
  { unit: "hour", milliseconds: 60 * 60 * 1000 },
  { unit: "minute", milliseconds: 60 * 1000 },
  { unit: "second", milliseconds: 1000 }
];

function toDate(value: RelativeTimeProps["date"]) {
  return value instanceof Date ? value : new Date(value);
}

function getRelativeValue(date: Date) {
  const difference = date.getTime() - Date.now();
  const timeUnit = TIME_UNITS.find(
    ({ milliseconds }) => Math.abs(difference) >= milliseconds
  );

  if (!timeUnit) {
    return { value: 0, unit: "second" as const };
  }

  return {
    value: Math.round(difference / timeUnit.milliseconds),
    unit: timeUnit.unit
  };
}

export default function RelativeTime({
  date: dateValue,
  locale = "en",
  numeric = "auto",
  showTooltip = true,
  className,
  children,
  ...props
}: RelativeTimeProps) {
  const date = toDate(dateValue);
  const isValidDate = !Number.isNaN(date.getTime());

  if (!isValidDate) {
    return (
      <time className={cn("text-muted-foreground", className)} {...props}>
        Invalid date
      </time>
    );
  }

  const { value, unit } = getRelativeValue(date);
  const relativeLabel = new Intl.RelativeTimeFormat(locale, { numeric }).format(
    value,
    unit
  );
  const absoluteLabel = date.toUTCString();
  const time = (
    <time
      dateTime={date.toISOString()}
      className={cn("text-muted-foreground", className)}
      tabIndex={showTooltip ? 0 : undefined}
      {...props}
    >
      {children ?? relativeLabel}
    </time>
  );

  if (!showTooltip) {
    return time;
  }

  return (
    <Tooltip>
      <TooltipTrigger nativeButton={false} render={time} />
      <TooltipContent side="top" sideOffset={6} hideArrow>
        {absoluteLabel}
      </TooltipContent>
    </Tooltip>
  );
}
