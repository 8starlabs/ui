import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/registry/8starlabs-ui/ui/tooltip";
import { HTMLAttributes, ReactNode } from "react";

export type HeatmapValue = {
  date: string; // YYYY-MM-DD
  value: number;
};

export type HeatmapData = HeatmapValue[];

type InterpolationModes = "linear" | "sqrt" | "log";

type ColorOptions =
  | {
      colorMode: "discrete";
      colorScale?: string[];
      customColorMap?: (
        value: number,
        max: number,
        colorCount: number
      ) => number;
    }
  | {
      colorMode: "interpolate";
      maxColor?: string;
      zeroValueColor?: string;
      interpolation?: InterpolationModes;
    };

type HeatmapProps = HTMLAttributes<HTMLDivElement> &
  ColorOptions & {
    data: HeatmapData;
    startDate: Date;
    endDate: Date;
    cellSize?: number;
    gap?: number;
    daysOfTheWeek?: "all" | "MWF" | "none" | "single letter";
    displayStyle?: "squares" | "bubbles";
    dateDisplayFunction?: (date: Date) => ReactNode;
    valueDisplayFunction?: (value: number) => ReactNode;
  };

function getAllDays(start: Date, end: Date): Date[] {
  // Generate all dates between start and end, inclusive
  const days = [];
  const curr = new Date(start);
  while (curr <= end) {
    days.push(new Date(curr));
    curr.setDate(curr.getDate() + 1);
  }
  return days;
}

function padToWeekStart(days: Date[]): (Date | null)[] {
  // Pad the beginning of the array with nulls so that the first day starts on the correct weekday
  // eg. if the first day is a Wednesday, add three nulls for Sun, Mon, Tue
  const firstDay = days[0].getDay(); // 0 = Sunday
  const padding = new Array(firstDay).fill(null);
  return [...padding, ...days];
}

function chunkByWeek(days: (Date | null)[]): (Date | null)[][] {
  // Chunk the days into weeks (arrays of 7 days)
  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  return weeks;
}

function getMonthLabel(week: (Date | null)[]) {
  // Get the month label for the week (based on the LAST day)
  const lastDay = week.slice().reverse().find(Boolean);
  return lastDay ? lastDay.toLocaleString("default", { month: "short" }) : null;
}

function defaultColourMap(value: number, max: number, colorCount: number) {
  // Map value to color index
  // default: we do a linear scale from 0 to max
  if (colorCount <= 0) return 0; // safeguard
  if (max <= 0 || value <= 0) return 0; // all zero values
  const index = Math.ceil((value / max) * (colorCount - 1));
  return Math.min(Math.max(index, 0), colorCount - 1);
}

function interpolateColor(
  value: number,
  max: number,
  maxColor: string,
  zeroValueColor: string,
  scale: InterpolationModes
): string {
  // Interpolate color from zeroValueColor to maxColor based on value/max
  if (value <= 0) return zeroValueColor;

  let ratio = value / max;
  switch (scale) {
    case "sqrt":
      ratio = Math.sqrt(ratio);
      break;
    case "log":
      ratio = Math.log10(value + 1) / Math.log10(max + 1); // log scale
      break;
  }

  const r = parseInt(maxColor.slice(1, 3), 16);
  const g = parseInt(maxColor.slice(3, 5), 16);
  const b = parseInt(maxColor.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${ratio})`;
}

const defaultIntensityColours = [
  "#f0fdf4", // green-50
  "#bbf7d0", // green-200
  "#86efac", // green-300
  "#22c55e", // green-500
  "#166534" // green-700
];

const daysOfTheWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface DaysOfTheWeekIndicatorProps extends HTMLAttributes<HTMLDivElement> {
  daysOfTheWeekOption: "all" | "MWF" | "none" | "single letter";
  cellSize: number;
  gap: number;
}

function DaysOfTheWeekIndicator({
  daysOfTheWeekOption,
  cellSize,
  gap,
  style
}: DaysOfTheWeekIndicatorProps) {
  if (daysOfTheWeekOption === "none") return null;
  const indicators = daysOfTheWeek.map((day, i) => {
    if (daysOfTheWeekOption === "MWF" && ![1, 3, 5].includes(i)) {
      return <div key={i} style={{ height: cellSize }} />;
    }
    return (
      <div
        key={i}
        className="flex items-center text-muted-foreground"
        style={{
          height: cellSize,
          fontSize: cellSize,
          lineHeight: `${cellSize}px`
        }}
      >
        {daysOfTheWeekOption === "single letter" ? day.charAt(0) : day}
      </div>
    );
  });
  return (
    <div className="flex flex-col" style={{ ...style, gap }}>
      {indicators}
    </div>
  );
}

interface ValueIndicatorProps extends HTMLAttributes<HTMLDivElement> {
  cellSize: number;
  displayStyle: "squares" | "bubbles";
  value: number; // current cell value
  maxValue: number; // maximum possible value out of all cells
  color: string;
}

function ValueIndicator({
  cellSize,
  displayStyle,
  value,
  maxValue,
  color,
  ...htmlProps
}: ValueIndicatorProps) {
  let finalSize = cellSize;

  if (displayStyle === "bubbles") {
    // Min bubble size = 0.3 * size, Max bubble size = size
    const minScale = 0.3;
    const scale = maxValue > 0 ? value / maxValue : 0;
    finalSize = cellSize * (minScale + (1 - minScale) * scale);
  }

  return displayStyle === "bubbles" ? (
    <div
      className="flex items-center justify-center"
      style={{ width: cellSize, height: cellSize }}
      {...htmlProps}
    >
      <div
        className="transition-colors rounded-full"
        style={{ width: finalSize, height: finalSize, backgroundColor: color }}
      />
    </div>
  ) : (
    <div
      className="transition-colors rounded-md"
      style={{
        width: cellSize,
        height: cellSize,
        borderRadius: 4,
        backgroundColor: color
      }}
      {...htmlProps}
    />
  );
}

export default function Heatmap(props: HeatmapProps) {
  const {
    data,
    startDate,
    endDate,
    cellSize = 20,
    daysOfTheWeek = "MWF",
    gap = 2,
    displayStyle = "squares",
    valueDisplayFunction,
    dateDisplayFunction,
    className,
    colorMode,
    ...htmlProps
  } = props;

  const valueByDate = new Map<string, number>(
    data.map(({ date, value }) => [date, value])
  );

  const days = getAllDays(startDate, endDate);
  const paddedDays = padToWeekStart(days);
  const weeks = chunkByWeek(paddedDays);

  const computedMax = Math.max(...data.map((d) => d.value), 1);

  const monthLabels = weeks.map((week, i) => {
    const label = getMonthLabel(week);
    const prevLabel = i > 0 ? getMonthLabel(weeks[i - 1]) : null;
    return label !== prevLabel ? label : null;
  });

  const getCellColor = (value: number) => {
    if (colorMode === "interpolate") {
      return interpolateColor(
        value,
        computedMax,
        props.maxColor ?? "#00ff00",
        props.zeroValueColor ?? "#212735",
        props.interpolation ?? "linear"
      );
    } else {
      const colorArray =
        props.colorScale && props.colorScale.length > 0
          ? props.colorScale
          : defaultIntensityColours;

      const map = props.customColorMap ?? defaultColourMap;

      return colorArray[map(value, computedMax, colorArray.length)];
    }
  };

  return (
    <div
      className={cn("flex", className)}
      style={{ gap }}
      {...(htmlProps as HTMLAttributes<HTMLDivElement>)}
    >
      <DaysOfTheWeekIndicator
        style={{ paddingTop: `${gap + 16}px` }}
        daysOfTheWeekOption={daysOfTheWeek}
        cellSize={cellSize}
        gap={gap}
      />

      <div className="flex flex-col" style={{ gap }}>
        <div className="flex" style={{ gap }}>
          {weeks.map((_, i) => (
            <div
              key={i}
              style={{ width: cellSize }}
              className="text-xs text-muted-foreground"
            >
              {monthLabels[i]}
            </div>
          ))}
        </div>

        <div className="flex" style={{ gap }}>
          <TooltipProvider>
            {weeks.map((week, i) => (
              <div key={i} className="flex flex-col" style={{ gap }}>
                {week.map((day, j) => {
                  if (!day) {
                    return (
                      <div
                        key={j}
                        style={{ width: cellSize, height: cellSize }}
                      />
                    );
                  }

                  const dateKey = day.toISOString().slice(0, 10);
                  const thisDateValue = valueByDate.get(dateKey) ?? 0;
                  const safeValue = Math.max(0, thisDateValue);
                  const thisColor = getCellColor(safeValue);

                  return (
                    <Tooltip key={j}>
                      <TooltipTrigger asChild>
                        <ValueIndicator
                          id={`heatmap-cell-${dateKey}`}
                          cellSize={cellSize}
                          displayStyle={displayStyle}
                          value={safeValue}
                          maxValue={computedMax}
                          color={thisColor}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-xs">
                          <div>
                            {dateDisplayFunction
                              ? dateDisplayFunction(day)
                              : day.toDateString()}
                          </div>
                          <div className="text-muted-foreground">
                            {valueDisplayFunction
                              ? valueDisplayFunction(safeValue)
                              : `${safeValue} event${safeValue !== 1 ? "s" : ""}`}
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            ))}
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}
