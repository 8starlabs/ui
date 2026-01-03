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

export default function HeatmapDaysOfWeekDemo() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-sm text-muted-foreground mb-2">All Days</p>
        <Heatmap
          data={data}
          startDate={new Date("2025-12-01")}
          endDate={new Date("2025-12-31")}
          colorMode="discrete"
          daysOfTheWeek="all"
        />
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-2">
          Mon/Wed/Fri (Default)
        </p>
        <Heatmap
          data={data}
          startDate={new Date("2025-12-01")}
          endDate={new Date("2025-12-31")}
          colorMode="discrete"
          daysOfTheWeek="MWF"
        />
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-2">Single Letter</p>
        <Heatmap
          data={data}
          startDate={new Date("2025-12-01")}
          endDate={new Date("2025-12-31")}
          colorMode="discrete"
          daysOfTheWeek="single letter"
        />
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-2">None</p>
        <Heatmap
          data={data}
          startDate={new Date("2025-12-01")}
          endDate={new Date("2025-12-31")}
          colorMode="discrete"
          daysOfTheWeek="none"
        />
      </div>
    </div>
  );
}
