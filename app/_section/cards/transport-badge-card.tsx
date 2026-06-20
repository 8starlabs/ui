import { TransportBadge } from "@/registry/8starlabs-ui/blocks/transport-badge";
import HomepageDemoCard from "./homepage-demo-card";

const TransportBadgeCard = () => {
  return (
    <HomepageDemoCard
      href="/docs/components/transport-badge"
      title="Transport Badge"
      description={
        <p className="text-sm text-muted-foreground">
          Display metro/subway station information with proper line colors and
          codes.
        </p>
      }
      demo={
        <>
          <TransportBadge system="SG" stationCode={["CE19", "DT9"]} />
          <TransportBadge
            system="SG"
            stationCode="EW5"
            stationName="Bedok"
            showStationName
          />
          <TransportBadge
            system="HK"
            stationCode={["TW", "TM"]}
            stationName="Mei Foo"
            showStationName
          />
          <TransportBadge
            system="HK"
            stationCode="AE"
            stationName="Airport"
            showStationName
          />
        </>
      }
    />
  );
};

export default TransportBadgeCard;
