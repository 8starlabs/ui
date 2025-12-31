import Heatmap, {
  type HeatmapData
} from "@/registry/8starlabs-ui/blocks/heatmap";

const sampleData: HeatmapData = [
  // December 2025
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
  { date: "2025-12-31", value: 1 },

  // January 2026
  { date: "2026-01-01", value: 0 },
  { date: "2026-01-02", value: 3 },
  { date: "2026-01-03", value: 1 },
  { date: "2026-01-04", value: 4 },
  { date: "2026-01-05", value: 2 },
  { date: "2026-01-06", value: 5 },
  { date: "2026-01-07", value: 0 },
  { date: "2026-01-08", value: 3 },
  { date: "2026-01-09", value: 1 },
  { date: "2026-01-10", value: 2 },
  { date: "2026-01-11", value: 4 },
  { date: "2026-01-12", value: 0 },
  { date: "2026-01-13", value: 5 },
  { date: "2026-01-14", value: 2 },
  { date: "2026-01-15", value: 3 },
  { date: "2026-01-16", value: 0 },
  { date: "2026-01-17", value: 4 },
  { date: "2026-01-18", value: 1 },
  { date: "2026-01-19", value: 2 },
  { date: "2026-01-20", value: 5 },
  { date: "2026-01-21", value: 0 },
  { date: "2026-01-22", value: 3 },
  { date: "2026-01-23", value: 2 },
  { date: "2026-01-24", value: 4 },
  { date: "2026-01-25", value: 1 },
  { date: "2026-01-26", value: 0 },
  { date: "2026-01-27", value: 5 },
  { date: "2026-01-28", value: 2 },
  { date: "2026-01-29", value: 3 },
  { date: "2026-01-30", value: 0 },
  { date: "2026-01-31", value: 4 },

  // February 2026
  { date: "2026-02-01", value: 1 },
  { date: "2026-02-02", value: 0 },
  { date: "2026-02-03", value: 3 },
  { date: "2026-02-04", value: 2 },
  { date: "2026-02-05", value: 4 },
  { date: "2026-02-06", value: 0 },
  { date: "2026-02-07", value: 5 },
  { date: "2026-02-08", value: 1 },
  { date: "2026-02-09", value: 2 },
  { date: "2026-02-10", value: 0 },
  { date: "2026-02-11", value: 3 },
  { date: "2026-02-12", value: 4 },
  { date: "2026-02-13", value: 0 },
  { date: "2026-02-14", value: 5 },
  { date: "2026-02-15", value: 1 },
  { date: "2026-02-16", value: 2 },
  { date: "2026-02-17", value: 0 },
  { date: "2026-02-18", value: 3 },
  { date: "2026-02-19", value: 4 },
  { date: "2026-02-20", value: 0 },
  { date: "2026-02-21", value: 5 },
  { date: "2026-02-22", value: 1 },
  { date: "2026-02-23", value: 2 },
  { date: "2026-02-24", value: 0 },
  { date: "2026-02-25", value: 3 },
  { date: "2026-02-26", value: 4 },
  { date: "2026-02-27", value: 0 },
  { date: "2026-02-28", value: 5 }
];

const generateMonthData = (): HeatmapData => {
  const start = new Date("2025-12-01");
  const end = new Date("2025-12-31");
  const data: HeatmapData = [];

  const curr = new Date(start);
  while (curr <= end) {
    data.push({
      date: curr.toISOString().slice(0, 10),
      value: Math.floor(Math.random() * 201) // 0 to 200
    });
    curr.setDate(curr.getDate() + 1);
  }

  return data;
};

const decemberData = generateMonthData();

export default function page() {
  return (
    <Heatmap
      data={sampleData}
      startDate={new Date("2025-11-20")}
      endDate={new Date("2026-01-01")}
      cellSize={13}
      gap={4}
      daysOfTheWeek={"single letter"}
      displayStyle="squares"
      valueDisplayFunction={(value) => (
        <div>
          {value} event{value !== 1 ? "s" : ""}
        </div>
      )}
      dateDisplayFunction={(date) => date.toLocaleDateString()}
      // colorScale={rainbowColors}
      // maxColor="#ff0000"
      // zeroValueColor="#a6a6a6"
      colorMode="interpolate"
      interpolation="linear"
    />
  );
}
