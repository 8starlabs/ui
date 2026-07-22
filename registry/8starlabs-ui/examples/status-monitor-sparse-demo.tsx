import StatusMonitor, {
  type AppStatusData
} from "@/registry/8starlabs-ui/blocks/status-monitor";

const statuses: AppStatusData[] = [
  {
    status: "normal",
    timestamp: "Jul 06, 2026",
    info: "Monitoring started for the service."
  },
  {
    status: "warning",
    timestamp: "Jul 07, 2026",
    info: "A new deployment caused slower health checks."
  },
  {
    status: "normal",
    timestamp: "Jul 08, 2026",
    info: "Health checks returned to the expected baseline."
  },
  {
    status: "empty",
    timestamp: "Jul 09, 2026",
    info: "No synthetic check data was recorded."
  },
  {
    status: "error",
    timestamp: "Jul 10, 2026",
    info: "Synthetic checks failed from two regions."
  },
  {
    status: "normal",
    timestamp: "Jul 11, 2026",
    info: "Regional checks recovered."
  }
];

export default function StatusMonitorSparseDemo() {
  return <StatusMonitor statuses={statuses} title="New Service Rollout" />;
}
