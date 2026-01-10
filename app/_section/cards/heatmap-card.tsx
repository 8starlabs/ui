import Link from "next/link";
import { Card } from "@/registry/8starlabs-ui/ui/card";
import ScrollFade from "@/registry/8starlabs-ui/blocks/scroll-fade";
import Heatmap, { HeatmapData } from "@/registry/8starlabs-ui/blocks/heatmap";
import { useMemo } from "react";

function generateRandomHeatmapData(
  startDate: Date,
  endDate: Date,
  minValue: number = 0,
  maxValue: number = 30
): HeatmapData {
  const data: HeatmapData = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    const dateString = current.toISOString().slice(0, 10);
    const value =
      Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
    data.push({ date: dateString, value });
    current.setDate(current.getDate() + 1);
  }

  return data;
}

const HeatmapCard = () => {
  const data = useMemo(
    () =>
      generateRandomHeatmapData(
        new Date("2025-01-01"),
        new Date("2025-06-30"),
        0,
        30
      ),
    []
  );

  return (
    <Link prefetch={false} href="/docs/components/heatmap">
      <Card className="size-full px-6 group relative overflow-hidden hover:bg-muted/20 transition-colors">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-lg">Heatmap</h3>
            <p className="text-sm text-muted-foreground">
              A graphical representation of data over time, where individual
              values are represented as colored cells in a table.
            </p>
          </div>

          <ScrollFade axis="horizontal" className="my-3">
            <Heatmap
              data={data}
              startDate={new Date("2025-01-01")}
              endDate={new Date("2025-06-30")}
              colorMode="interpolate"
            />
          </ScrollFade>
        </div>

        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              d="M7 17L17 7"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7 7h10v10"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </Card>
    </Link>
  );
};

export default HeatmapCard;
