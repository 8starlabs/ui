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
        <>
          <StatusIndicator state="active" label="All systems operational" />
          <StatusIndicator state="down" label="Systems down" />
          <StatusIndicator state="fixing" label="Diagnosing issue, fixing" />
          <StatusIndicator state="idle" label="Systems idle" />
        </>
      }
    />
  );
};

export default StatusIndicatorCard;
