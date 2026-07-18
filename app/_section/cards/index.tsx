import { cn } from "@/lib/utils";
import TimelineCard from "./timeline-card";
import FlipClockCard from "./flip-clock-card";
import PartitionBarCard from "./partition-bar-card";
import HeatmapCard from "./heatmap-card";
import MarqueeCard from "./marquee-card";
import JsonViewerCard from "./json-viewer-card";
import TransportBadgeCard from "./transport-badge-card";
import StatusIndicatorCard from "./status-indicator-card";
import ShakeCard from "./shake-card";
import OpenInChatCard from "./open-in-chat-card";
import StatusMonitorCard from "./status-monitor-card";

interface CardsProps {
  className?: string;
}

const Cards = ({ className }: CardsProps) => {
  return (
    <div
      className={cn(
        "mx-auto grid w-full max-w-6xl auto-rows-[20rem] grid-cols-1 gap-4 sm:auto-rows-auto sm:grid-cols-2 xl:grid-cols-6",
        className
      )}
    >
      {/* Row 1 — tall feature tile on the LEFT, two stacked short cards on the right */}
      <div className="h-full sm:col-span-2 xl:col-start-1 xl:col-span-4 xl:row-start-1 xl:row-span-2">
        <TimelineCard />
      </div>
      <div className="h-full sm:col-span-1 xl:col-start-5 xl:col-span-2 xl:row-start-1">
        <StatusIndicatorCard />
      </div>
      <div className="h-full sm:col-span-1 xl:col-start-5 xl:col-span-2 xl:row-start-2">
        <TransportBadgeCard />
      </div>

      {/* Row 2 — reverse of row 1: two stacked short cards on the left, tall tile on the right */}
      <div className="h-full sm:col-span-1 xl:col-start-1 xl:col-span-2 xl:row-start-3">
        <FlipClockCard />
      </div>
      <div className="h-full sm:col-span-1 xl:col-start-1 xl:col-span-2 xl:row-start-4">
        <ShakeCard />
      </div>
      <div className="h-full sm:col-span-2 xl:col-start-3 xl:col-span-4 xl:row-start-3 xl:row-span-2">
        <JsonViewerCard />
      </div>

      {/* Row 3 */}
      <div className="h-full sm:col-span-2 xl:col-start-1 xl:col-span-2 xl:row-start-5">
        <MarqueeCard />
      </div>
      <div className="h-full sm:col-span-1 xl:col-start-3 xl:col-span-2 xl:row-start-5">
        <OpenInChatCard />
      </div>
      <div className="h-full sm:col-span-1 xl:col-start-5 xl:col-span-2 xl:row-start-5">
        <HeatmapCard />
      </div>

      {/* Full-width closer */}
      <div className="h-full sm:col-span-2 xl:col-start-1 xl:col-span-6 xl:row-start-6">
        <PartitionBarCard />
      </div>
      <div className="h-full sm:col-span-2 xl:col-start-1 xl:col-span-6 xl:row-start-7">
        <StatusMonitorCard />
      </div>
    </div>
  );
};

export default Cards;
