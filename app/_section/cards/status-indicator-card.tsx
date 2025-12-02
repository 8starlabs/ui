import StatusIndicator from "@/registry/8starlabs-ui/blocks/status-indicator";
import { Card } from "@/registry/8starlabs-ui/ui/card";
import Link from "next/link";

type Props = {};

const StatusIndicatorCard = (props: Props) => {
  return (
    <Link href="/docs/components/status-indicator">
      <Card className="size-full px-6 group relative overflow-hidden hover:bg-muted/20 transition-colors">
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-lg font-semibold">System Indicators</h3>
            <p className="text-muted-foreground text-sm">
              Different states of the Status Indicator component.
            </p>
          </div>

          <StatusIndicator state="active" label="All systems operational" />
          <StatusIndicator state="down" label="Systems down" />
          <StatusIndicator state="fixing" label="Diagnosing issue, fixing" />
          <StatusIndicator state="idle" label="Systems idle" />
        </div>
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              d="M7 17L17 7"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7 7h10v10"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </Card>
    </Link>
  );
};

export default StatusIndicatorCard;
