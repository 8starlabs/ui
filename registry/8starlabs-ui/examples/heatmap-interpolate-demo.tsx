import Heatmap, {
  type HeatmapData
} from "@/registry/8starlabs-ui/blocks/heatmap";

const data: HeatmapData = [
  { date: "2025-12-01", value: 5 },
  { date: "2025-12-02", value: 0 },
  { date: "2025-12-03", value: 120 },
  { date: "2025-12-04", value: 10 },
  { date: "2025-12-05", value: 45 },
  { date: "2025-12-06", value: 80 },
  { date: "2025-12-07", value: 15 },
  { date: "2025-12-08", value: 0 },
  { date: "2025-12-09", value: 200 },
  { date: "2025-12-10", value: 350 },
  { date: "2025-12-11", value: 25 },
  { date: "2025-12-12", value: 8 },
  { date: "2025-12-13", value: 150 },
  { date: "2025-12-14", value: 0 },
  { date: "2025-12-15", value: 30 },
  { date: "2025-12-16", value: 180 },
  { date: "2025-12-17", value: 95 },
  { date: "2025-12-18", value: 220 },
  { date: "2025-12-19", value: 0 },
  { date: "2025-12-20", value: 12 },
  { date: "2025-12-21", value: 60 },
  { date: "2025-12-22", value: 140 },
  { date: "2025-12-23", value: 0 },
  { date: "2025-12-24", value: 20 },
  { date: "2025-12-25", value: 280 },
  { date: "2025-12-26", value: 35 },
  { date: "2025-12-27", value: 0 },
  { date: "2025-12-28", value: 110 },
  { date: "2025-12-29", value: 240 },
  { date: "2025-12-30", value: 50 },
  { date: "2025-12-31", value: 18 }
];

export default function HeatmapInterpolateDemo() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-sm text-muted-foreground mb-2">
          Linear Interpolation
        </p>
        <Heatmap
          data={data}
          startDate={new Date("2025-12-01")}
          endDate={new Date("2025-12-31")}
          colorMode="interpolate"
          interpolation="linear"
          minColor="#f0fdf4"
          maxColor="#166534"
        />
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-2">
          Square Root Interpolation
        </p>
        <Heatmap
          data={data}
          startDate={new Date("2025-12-01")}
          endDate={new Date("2025-12-31")}
          colorMode="interpolate"
          interpolation="sqrt"
          minColor="#fef2f2"
          maxColor="#991b1b"
        />
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-2">
          Logarithmic Interpolation
        </p>
        <Heatmap
          data={data}
          startDate={new Date("2025-12-01")}
          endDate={new Date("2025-12-31")}
          colorMode="interpolate"
          interpolation="log"
          minColor="#eff6ff"
          maxColor="#1e3a8a"
        />
      </div>
    </div>
  );
}
