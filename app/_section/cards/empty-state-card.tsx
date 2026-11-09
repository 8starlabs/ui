import EmptyState from "@/registry/8starlabs-ui/blocks/empty-state";
import HomepageDemoCard from "./homepage-demo-card";

export default function EmptyStateCard() {
  return (
    <HomepageDemoCard
      href="/docs/components/empty-state"
      title="Empty State"
      description={
        <p className="text-muted-foreground text-sm">
          A little context and a clear next step when there’s nothing to show.
        </p>
      }
      demo={
        <EmptyState
          title="No projects yet"
          description="Your next idea starts here."
          className="py-0"
        />
      }
    />
  );
}
