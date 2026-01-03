import Heatmap, {
  type HeatmapData
} from "@/registry/8starlabs-ui/blocks/heatmap";

const data: HeatmapData = [
  { date: "2025-12-01", value: 2 },
  { date: "2025-12-02", value: 0 },
  { date: "2025-12-03", value: 5 },
  { date: "2025-12-04", value: 1 },
  { date: "2025-12-05", value: 3 },
  { date: "2025-12-06", value: 4 },
  { date: "2025-12-07", value: 2 },
  { date: "2025-12-08", value: 0 },
  { date: "2025-12-09", value: 3 },
  { date: "2025-12-10", value: 6 },
  { date: "2025-12-11", value: 2 },
  { date: "2025-12-12", value: 1 },
  { date: "2025-12-13", value: 4 },
  { date: "2025-12-14", value: 0 },
  { date: "2025-12-15", value: 2 },
  { date: "2025-12-16", value: 5 },
  { date: "2025-12-17", value: 3 },
  { date: "2025-12-18", value: 4 },
  { date: "2025-12-19", value: 0 },
  { date: "2025-12-20", value: 1 },
  { date: "2025-12-21", value: 2 },
  { date: "2025-12-22", value: 3 },
  { date: "2025-12-23", value: 0 },
  { date: "2025-12-24", value: 2 },
  { date: "2025-12-25", value: 5 },
  { date: "2025-12-26", value: 1 },
  { date: "2025-12-27", value: 0 },
  { date: "2025-12-28", value: 3 },
  { date: "2025-12-29", value: 4 },
  { date: "2025-12-30", value: 2 },
  { date: "2025-12-31", value: 1 }
];

const customPurpleScale = [
  "#faf5ff", // purple-50
  "#e9d5ff", // purple-200
  "#c084fc", // purple-400
  "#9333ea", // purple-600
  "#581c87" // purple-900
];

const redToGreenScale = [
  "#991b1b", // red-800
  "#dc2626", // red-600
  "#ea580c", // orange-600
  "#f59e0b", // amber-500
  "#eab308", // yellow-500
  "#84cc16", // lime-500
  "#22c55e", // green-500
  "#15803d" // green-700
];

export default function HeatmapCustomColorsDemo() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Purple Color Scale</p>
        <Heatmap
          data={data}
          startDate={new Date("2025-12-01")}
          endDate={new Date("2025-12-31")}
          colorMode="discrete"
          colorScale={customPurpleScale}
        />
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-2">
          Red to Green Color Scale
        </p>
        <Heatmap
          data={data}
          startDate={new Date("2025-12-01")}
          endDate={new Date("2025-12-31")}
          colorMode="discrete"
          colorScale={redToGreenScale}
        />
      </div>
    </div>
  );
}
