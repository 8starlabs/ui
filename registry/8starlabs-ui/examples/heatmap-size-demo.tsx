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

export default function HeatmapSizeDemo() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-sm text-muted-foreground mb-2">
          Small (cellSize: 12, gap: 2)
        </p>
        <Heatmap
          data={data}
          startDate={new Date("2025-12-01")}
          endDate={new Date("2025-12-31")}
          colorMode="discrete"
          cellSize={12}
          gap={2}
        />
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-2">
          Medium (cellSize: 20, gap: 4) - Default
        </p>
        <Heatmap
          data={data}
          startDate={new Date("2025-12-01")}
          endDate={new Date("2025-12-31")}
          colorMode="discrete"
          cellSize={20}
          gap={4}
        />
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-2">
          Large (cellSize: 28, gap: 6)
        </p>
        <Heatmap
          data={data}
          startDate={new Date("2025-12-01")}
          endDate={new Date("2025-12-31")}
          colorMode="discrete"
          cellSize={28}
          gap={6}
        />
      </div>
    </div>
  );
}
