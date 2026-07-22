import StatusMonitor, {
  type AppStatusData
} from "@/registry/8starlabs-ui/blocks/status-monitor";

const startTime = Date.UTC(2026, 6, 10, 0, 0, 0);
const hourInMilliseconds = 60 * 60 * 1000;

const statuses: AppStatusData[] = Array.from({ length: 90 }, (_, index) => {
  const hour = index + 1;
  const timestamp = new Date(startTime + index * hourInMilliseconds);

  if (hour >= 54 && hour <= 56) {
    return {
      status: "error",
      timestamp,
      info: "Checkout requests failed during a payment provider outage."
    };
  }

  if ((hour >= 34 && hour <= 38) || hour === 76) {
    return {
      status: "warning",
      timestamp,
      info: "Queue depth increased while background jobs caught up."
    };
  }

  return {
    status: "normal",
    timestamp,
    info: "No active incidents were detected for this hour."
  };
});

export default function StatusMonitorHoursDemo() {
  return (
    <StatusMonitor statuses={statuses} unit="hours" title="Checkout Health" />
  );
}
