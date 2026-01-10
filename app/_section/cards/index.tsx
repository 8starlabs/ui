import { cn } from "@/lib/utils";
import StatusIndicatorCard from "./status-indicator-card";
import TransportBadgeCard from "./transport-badge-card";
import TimelineCard from "./timeline-card";
import FlipClockCard from "./flip-clock-card";
import PartitionBarCard from "./partition-bar-card";
import HeatmapCard from "./heatmap-card";

interface CardsProps {
  className?: string;
}

const Cards = ({ className }: CardsProps) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 xl:grid-cols-4 sm:grid-cols-2 grid-rows-1 gap-4",
        className
      )}
    >
      <div className="xl:col-start-2">
        <StatusIndicatorCard />
      </div>
      <div className="xl:col-start-3">
        <TransportBadgeCard />
      </div>
      <div className="sm:col-span-2 xl:col-span-2 xl:col-start-2">
        <TimelineCard />
      </div>
      <div className="sm:col-span-2 xl:col-span-2 xl:col-start-2">
        <FlipClockCard />
      </div>
      <div className="sm:col-span-2 xl:col-span-2 xl:col-start-2">
        <PartitionBarCard />
      </div>
      <div className="sm:col-span-2 xl:col-span-2 xl:col-start-2">
        <HeatmapCard />
      </div>
    </div>
  );
};

export default Cards;
