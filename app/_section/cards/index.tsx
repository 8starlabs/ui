import { cn } from "@/lib/utils";
import TimelineCard from "./timeline-card";
import FlipClockCard from "./flip-clock-card";
import PartitionBarCard from "./partition-bar-card";
import HeatmapCard from "./heatmap-card";
import MarqueeCard from "./marquee-card";
import VideoPlayerCard from "./video-player-card";
import TransportBadgeCard from "./transport-badge-card";
import StatusIndicatorCard from "./status-indicator-card";
import ShakeCard from "./shake-card";

interface CardsProps {
  className?: string;
}

const Cards = ({ className }: CardsProps) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 xl:grid-cols-6 sm:grid-cols-2 grid-rows-1 gap-4",
        className
      )}
    >
      <div className="xl:col-start-2 xl:col-span-2">
        <StatusIndicatorCard />
      </div>
      <div className="xl:col-start-4 xl:col-span-2">
        <TransportBadgeCard />
      </div>
      <div className="sm:col-span-2 xl:col-span-4 xl:col-start-2">
        <TimelineCard />
      </div>
      <div className="sm:col-span-2 xl:col-span-4 xl:col-start-2">
        <FlipClockCard />
      </div>
      <div className="sm:col-span-2 xl:col-span-4 xl:col-start-2">
        <PartitionBarCard />
      </div>
      <div className="sm:col-span-2 xl:col-span-2 xl:col-start-2">
        <HeatmapCard />
      </div>
      <div className="sm:col-span-2 xl:col-span-2 xl:col-start-4">
        <MarqueeCard />
      </div>
      <div className="sm:col-span-2 xl:col-span-4 xl:col-start-2">
        <VideoPlayerCard />
      </div>
      <div className="sm:col-span-2 xl:col-span-4 xl:col-start-2">
        <ShakeCard />
      </div>
    </div>
  );
};

export default Cards;
