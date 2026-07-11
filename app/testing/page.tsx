import StatusMonitor, {
  type AppStatusData
} from "@/registry/8starlabs-ui/blocks/status-monitor";

const startDate = Date.UTC(2026, 0, 1);
const dayInMilliseconds = 24 * 60 * 60 * 1000;

const dummyStatuses: AppStatusData[] = Array.from(
  { length: 90 },
  (_, index) => {
    const day = index + 1;
    const timestamp = new Date(startDate + index * dayInMilliseconds);

    if (day % 29 === 0 || day % 43 === 0) {
      return {
        status: "error",
        timestamp,
        info: "Incident detected. Response team is investigating."
      };
    }

    if (day % 11 === 0 || day % 17 === 0) {
      return {
        status: "warning",
        timestamp,
        info: "Elevated latency detected. Core services remain available."
      };
    }

    return {
      status: "normal",
      timestamp,
      info: "All monitored checks passed."
    };
  }
);

export default function TestingPage() {
  return (
    <div>
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <StatusMonitor statuses={dummyStatuses} unit="days" />
      </div>
    </div>
  );
}
