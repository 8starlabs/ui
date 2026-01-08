import Link from "next/link";
import { TransportBadge } from "@/registry/8starlabs-ui/blocks/transport-badge";
import { Card } from "@/registry/8starlabs-ui/ui/card";

const TransportBadgeCard = () => {
  return (
    <Link prefetch={false} href="/docs/components/transport-badge">
      <Card className="size-full px-6 group relative overflow-hidden hover:bg-muted/20 transition-colors">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-lg">Transport Badge</h3>
            <p className="text-sm text-muted-foreground">
              Display metro/subway station information with proper line colors
              and codes.
            </p>
          </div>

          <div className="flex flex-col gap-3">
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
          </div>
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

export default TransportBadgeCard;
