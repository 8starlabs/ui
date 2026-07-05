import Heatmap, { HeatmapData } from "@/registry/8starlabs-ui/blocks/heatmap";
import { useMemo } from "react";
import HomepageDemoCard from "./homepage-demo-card";

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
    <HomepageDemoCard
      href="/docs/components/heatmap"
      title="Heatmap"
      description={
        <p className="text-sm text-muted-foreground">
          A graphical representation of data over time, where individual values
          are represented as colored cells in a table.
        </p>
      }
      demo={
        <div className="scroll-fade-e my-3 w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Heatmap
            data={data}
            startDate={new Date("2025-01-01")}
            endDate={new Date("2025-06-30")}
            colorMode="interpolate"
            className="justify-start"
          />
        </div>
      }
    />
  );
};

export default HeatmapCard;
