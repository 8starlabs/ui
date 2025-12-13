import Timeline, {
  TimelineItem,
  TimelineItemTitle
} from "@/registry/8starlabs-ui/blocks/timeline";

const timelineData = [
  {
    title: "Project Kickoff",
    variant: "default" as const // Blue/Gray border (Standard)
  },
  {
    title: "Research Phase",
    variant: "info" as const // Blue (Informational)
  },
  {
    title: "Prototype Approval",
    variant: "success" as const // Green (Milestone reached)
  },
  {
    title: "Unexpected API Delays",
    variant: "warning" as const // Amber (Caution)
  },
  {
    title: "Critical Database Failure",
    variant: "destructive" as const // Red (Problem)
  },
  {
    title: "Beta Launch",
    variant: "success" as const // Green (Completion)
  }
];

export default function TimelineNoCardsDemo() {
  return (
    <Timeline
      orientation="horizontal"
      alternating={false}
      alignment="bottom/right"
      horizItemSpacing={180}
      horizItemWidth={150}
    >
      {timelineData.map((item, idx) => (
        <TimelineItem key={idx} variant={item.variant} className="text-center">
          <TimelineItemTitle>{item.title}</TimelineItemTitle>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
