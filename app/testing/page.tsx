import StatusMonitor, {
  type AppStatusData
} from "@/registry/8starlabs-ui/blocks/status-monitor";

const dummyStatuses: AppStatusData[] = Array.from(
  { length: 90 },
  (_, index) => {
    const day = index + 1;

    if (day % 29 === 0 || day % 43 === 0) {
      return {
        status: "error",
        timestamp: `Day ${day}`,
        info: "Incident detected. Response team is investigating."
      };
    }

    if (day % 11 === 0 || day % 17 === 0) {
      return {
        status: "warning",
        timestamp: `Day ${day}`,
        info: "Elevated latency detected. Core services remain available."
      };
    }

    return {
      status: "normal",
      timestamp: `Day ${day}`,
      info: "All monitored checks passed."
    };
  }
);

export default function TestingPage() {
  const counts = dummyStatuses.reduce(
    (acc, item) => {
      acc[item.status] += 1;
      return acc;
    },
    {
      normal: 0,
      warning: 0,
      error: 0,
      empty: 0
    } satisfies Record<AppStatusData["status"], number>
  );

  return (
    <div className="mx-auto flex min-h-[calc(100svh-var(--header-height)-var(--footer-height))] w-full max-w-4xl flex-col justify-center gap-8 px-6 py-16">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-normal text-foreground">
          Status Monitor Test
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Ninety deterministic status data points with normal, warning, and
          error states.
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <StatusMonitor statuses={dummyStatuses} unit="days" />
      </div>

      <div className="grid grid-cols-3 gap-3 text-sm">
        <div className="rounded-md border border-green-200 bg-green-50 p-3 text-green-900">
          <div className="text-xs font-medium uppercase text-green-700">
            Normal
          </div>
          <div className="text-2xl font-semibold">{counts.normal}</div>
        </div>
        <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-amber-900">
          <div className="text-xs font-medium uppercase text-amber-700">
            Warning
          </div>
          <div className="text-2xl font-semibold">{counts.warning}</div>
        </div>
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-red-900">
          <div className="text-xs font-medium uppercase text-red-700">
            Error
          </div>
          <div className="text-2xl font-semibold">{counts.error}</div>
        </div>
      </div>
    </div>
  );
}
