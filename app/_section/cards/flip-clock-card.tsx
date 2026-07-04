import FlipClock from "@/registry/8starlabs-ui/blocks/flip-clock";
import HomepageDemoCard from "./homepage-demo-card";

const FlipClockCard = () => {
  return (
    <HomepageDemoCard
      href="/docs/components/flip-clock"
      title="Flip Clock"
      description={
        <p className="text-sm text-muted-foreground">
          A retro flip clock component to display time with a vintage feel.
        </p>
      }
      demo={
        <div className="scroll-fade-x my-3 w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <FlipClock size="md" variant="secondary" />
        </div>
      }
    />
  );
};

export default FlipClockCard;
