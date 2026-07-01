import StatusIndicator from "@/registry/8starlabs-ui/blocks/status-indicator";
import HomepageDemoCard from "./homepage-demo-card";

type Props = {};

const StatusIndicatorCard = (props: Props) => {
  return (
    <HomepageDemoCard
      href="/docs/components/status-indicator"
      title="System Indicators"
      description={
        <p className="text-muted-foreground text-sm">
          Different states of the Status Indicator component.
        </p>
      }
      demo={
        <div className="flex h-full flex-col items-center justify-center">
          <div className="flex flex-col gap-2.5">
            <StatusIndicator
              size="sm"
              labelClassName="text-xs"
              state="active"
              label="All systems operational"
            />
            <StatusIndicator
              size="sm"
              labelClassName="text-xs"
              state="down"
              label="Systems down"
            />
            <StatusIndicator
              size="sm"
              labelClassName="text-xs"
              state="fixing"
              label="Diagnosing issue, fixing"
            />
            <StatusIndicator
              size="sm"
              labelClassName="text-xs"
              state="idle"
              label="Systems idle"
            />
          </div>
        </div>
      }
    />
  );
};

export default StatusIndicatorCard;
