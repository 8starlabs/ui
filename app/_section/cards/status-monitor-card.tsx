import StatusMonitor, {
  type AppStatusData
} from "@/registry/8starlabs-ui/blocks/status-monitor";
import HomepageDemoCard from "./homepage-demo-card";

const startDate = Date.UTC(2026, 3, 1);
const dayInMilliseconds = 24 * 60 * 60 * 1000;

const statuses: AppStatusData[] = Array.from({ length: 90 }, (_, index) => {
  const day = index + 1;

  if (day === 44 || day === 72) {
    return {
      status: "error",
      timestamp: new Date(startDate + index * dayInMilliseconds),
      info: "API availability dropped while failover completed."
    };
  }

  if (day % 17 === 0 || day % 29 === 0) {
    return {
      status: "warning",
      timestamp: new Date(startDate + index * dayInMilliseconds),
      info: "Latency was elevated, but requests continued to complete."
    };
  }

  return {
    status: "normal",
    timestamp: new Date(startDate + index * dayInMilliseconds),
    info: "All checks completed within the expected threshold."
  };
});

const StatusMonitorCard = () => {
  return (
    <HomepageDemoCard
      href="/docs/components/status-monitor"
      title="Status Monitor"
      description={
        <p className="text-sm text-muted-foreground">
          A compact service-health history with incident details for every day.
        </p>
      }
      demo={
        <div className="flex flex-1 items-center py-3">
          <StatusMonitor
            statuses={statuses}
            title="API Status"
            className="max-w-none"
          />
        </div>
      }
    />
  );
};

export default StatusMonitorCard;
