import Heatmap, {
  type HeatmapData
} from "@/registry/8starlabs-ui/blocks/heatmap";

const data: HeatmapData = [
  { date: "2025-12-01", value: 120 },
  { date: "2025-12-02", value: 0 },
  { date: "2025-12-03", value: 250 },
  { date: "2025-12-04", value: 80 },
  { date: "2025-12-05", value: 150 },
  { date: "2025-12-06", value: 200 },
  { date: "2025-12-07", value: 90 },
  { date: "2025-12-08", value: 0 },
  { date: "2025-12-09", value: 180 },
  { date: "2025-12-10", value: 300 },
  { date: "2025-12-11", value: 110 },
  { date: "2025-12-12", value: 60 },
  { date: "2025-12-13", value: 220 },
  { date: "2025-12-14", value: 0 },
  { date: "2025-12-15", value: 130 },
  { date: "2025-12-16", value: 270 },
  { date: "2025-12-17", value: 160 },
  { date: "2025-12-18", value: 210 },
  { date: "2025-12-19", value: 0 },
  { date: "2025-12-20", value: 95 },
  { date: "2025-12-21", value: 140 },
  { date: "2025-12-22", value: 190 },
  { date: "2025-12-23", value: 0 },
  { date: "2025-12-24", value: 100 },
  { date: "2025-12-25", value: 280 },
  { date: "2025-12-26", value: 75 },
  { date: "2025-12-27", value: 0 },
  { date: "2025-12-28", value: 170 },
  { date: "2025-12-29", value: 230 },
  { date: "2025-12-30", value: 120 },
  { date: "2025-12-31", value: 85 }
];

export default function HeatmapCustomDisplayDemo() {
  return (
    <Heatmap
      data={data}
      startDate={new Date("2025-12-01")}
      endDate={new Date("2025-12-31")}
      colorMode="discrete"
      dateDisplayFunction={(date) => (
        <span className="font-semibold">
          {date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
          })}
        </span>
      )}
      valueDisplayFunction={(value) => (
        <span className="text-primary">
          {value > 0 ? `${value} commits` : "No activity"}
        </span>
      )}
    />
  );
}
