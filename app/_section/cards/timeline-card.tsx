import Timeline, {
  TimelineItem,
  TimelineItemDate,
  TimelineItemDescription,
  TimelineItemTitle
} from "@/registry/8starlabs-ui/blocks/timeline";
import HomepageDemoCard from "./homepage-demo-card";

const timelineData = [
  {
    title: "Project Kickoff",
    description: "Initial meeting with stakeholders.",
    date: new Date("2023-01-01"),
    variant: "default" as const
  },
  {
    title: "Research Phase",
    description: "Conducted user interviews to refine the feature set.",
    date: new Date("2023-01-15"),
    variant: "secondary" as const
  },
  {
    title: "Prototype Approval",
    description:
      "Client signed off on the high-fidelity designs and interactive prototype.",
    date: new Date("2023-02-01"),
    variant: "default" as const
  },
  {
    title: "Unexpected API Delays",
    description: "Third-party integration taking longer than expected.",
    date: new Date("2023-02-10"),
    variant: "outline" as const
  },
  {
    title: "Critical Database Failure",
    description:
      "Data corruption occurred during migration. Rollback procedures initiated immediately.",
    date: new Date("2023-02-14"),
    variant: "destructive" as const
  },
  {
    title: "Beta Launch",
    description: "System stabilized and released to the first batch of users.",
    date: new Date("2023-03-01"),
    variant: "default" as const
  }
];

const TimelineCard = () => {
  return (
    <HomepageDemoCard
      href="/docs/components/timeline"
      title="Timeline"
      description={
        <p className="text-sm text-muted-foreground">
          A component to display chronological events.
          <br />
          Shift + Scroll to navigate horizontally (on desktop).
        </p>
      }
      demo={
        <div className="scroll-fade-x w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Timeline orientation="horizontal" className="flex justify-center">
            {timelineData.map((item, idx) => (
              <TimelineItem key={idx} variant={item.variant}>
                <TimelineItemDate>{item.date.toDateString()}</TimelineItemDate>
                <TimelineItemTitle>{item.title}</TimelineItemTitle>
                <TimelineItemDescription>
                  {item.description}
                </TimelineItemDescription>
              </TimelineItem>
            ))}
          </Timeline>
        </div>
      }
    />
  );
};

export default TimelineCard;
