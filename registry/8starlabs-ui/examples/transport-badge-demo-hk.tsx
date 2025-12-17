import { TransportBadge } from "@/registry/8starlabs-ui/blocks/transport-badge";

export default function TransportBadgeDemoHK() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <TransportBadge
          system="HK"
          stationCode={["TW", "TM"]}
          stationName="Mei Foo"
        />
        <TransportBadge
          system="HK"
          stationCode="AE"
          stationName="Airport"
          showStationName
        />
      </div>
      <div className="flex items-center gap-2">
        <TransportBadge system="HK" stationCode={["KT", "TM"]} />
        <TransportBadge system="HK" stationCode="AE" size="lg" />
      </div>
    </div>
  );
}
