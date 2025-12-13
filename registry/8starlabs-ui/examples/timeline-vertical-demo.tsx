import Timeline, {
  TimelineItem,
  TimelineItemDate,
  TimelineItemTitle
} from "@/registry/8starlabs-ui/blocks/timeline";

const timelineData = [
  {
    title: "Project Kickoff",
    date: new Date("2023-01-01"),
    variant: "default" as const // Blue/Gray border (Standard)
  },
  {
    title: "Research Phase",
    date: new Date("2023-01-15"),
    variant: "info" as const // Blue (Informational)
  },
  {
    title: "Prototype Approval",
    date: new Date("2023-02-01"),
    variant: "success" as const // Green (Milestone reached)
  },
  {
    title: "Unexpected API Delays",
    date: new Date("2023-02-10"),
    variant: "warning" as const // Amber (Caution)
  },
  {
    title: "Critical Database Failure",
    date: new Date("2023-02-14"),
    variant: "destructive" as const // Red (Problem)
  },
  {
    title: "Beta Launch",
    date: new Date("2023-03-01"),
    variant: "success" as const // Green (Completion)
  }
];

export default function TimelineVerticalDemo() {
  return (
    <Timeline orientation="vertical" noCards vertItemSpacing={60}>
      {timelineData.map((item, idx) => (
        <TimelineItem key={idx} variant={item.variant}>
          <TimelineItemDate>{item.date.toDateString()}</TimelineItemDate>
          <TimelineItemTitle>{item.title}</TimelineItemTitle>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
