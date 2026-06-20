import FlipClock from "@/registry/8starlabs-ui/blocks/flip-clock";
import ScrollFade from "@/registry/8starlabs-ui/blocks/scroll-fade";
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
        <ScrollFade axis="horizontal" className="my-3">
          <FlipClock size="md" variant="secondary" />
        </ScrollFade>
      }
    />
  );
};

export default FlipClockCard;
