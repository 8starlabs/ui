import { cn } from "@/lib/utils";
import StatusIndicatorCard from "./status-indicator-card";
import TransportBadgeCard from "./transport-badge-card";

interface CardsProps {
  className?: string;
}

const Cards = ({ className }: CardsProps) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 xl:grid-cols-4 sm:grid-cols-2 grid-rows-1 md:grid-rows-4 gap-4 size-full",
        className
      )}
    >
      <div className="xl:col-start-2">
        <StatusIndicatorCard />
      </div>
      <div className="xl:col-start-3">
        <TransportBadgeCard />
      </div>
    </div>
  );
};

export default Cards;
