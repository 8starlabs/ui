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
        "mx-auto grid w-full max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6",
        className
      )}
    >
      {/* Row 1 — three columns */}
      <div className="sm:col-span-1 xl:col-span-2">
        <StatusIndicatorCard />
      </div>
      <div className="sm:col-span-1 xl:col-span-2">
        <TransportBadgeCard />
      </div>
      <div className="sm:col-span-2 xl:col-span-2">
        <ShakeCard />
      </div>

      {/* Row 2 — asymmetric two columns (wide + narrow) */}
      <div className="sm:col-span-2 xl:col-span-4">
        <TimelineCard />
      </div>
      <div className="sm:col-span-2 xl:col-span-2">
        <FlipClockCard />
      </div>

      {/* Row 3 — asymmetric two columns (narrow + wide) */}
      <div className="sm:col-span-1 xl:col-span-2">
        <HeatmapCard />
      </div>
      <div className="sm:col-span-2 xl:col-span-4">
        <MarqueeCard />
      </div>

      {/* Row 4 — asymmetric two columns (wide + narrow) */}
      <div className="sm:col-span-2 xl:col-span-4">
        <VideoPlayerCard />
      </div>
      <div className="sm:col-span-2 xl:col-span-2">
        <PartitionBarCard />
      </div>
    </div>
  );
};

export default Cards;
