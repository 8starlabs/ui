import StatusMonitor, {
  type AppStatusData
} from "@/registry/8starlabs-ui/blocks/status-monitor";

const startDate = Date.UTC(2026, 3, 1);
const dayInMilliseconds = 24 * 60 * 60 * 1000;

const statuses: AppStatusData[] = Array.from({ length: 90 }, (_, index) => {
  const day = index + 1;
  const timestamp = new Date(startDate + index * dayInMilliseconds);

  if (day === 44 || day === 72) {
    return {
      status: "error",
      timestamp,
      info: "API availability dropped while failover completed."
    };
  }

  if (day % 17 === 0 || day % 29 === 0) {
    return {
      status: "warning",
      timestamp,
      info: "Latency was elevated, but requests continued to complete."
    };
  }

  return {
    status: "normal",
    timestamp,
    info: "All checks completed within the expected threshold."
  };
});

export default function StatusMonitorDemo() {
  return <StatusMonitor statuses={statuses} title="API Status" />;
}
