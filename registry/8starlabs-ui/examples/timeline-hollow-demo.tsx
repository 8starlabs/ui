import Timeline, {
  TimelineItem,
  TimelineItemDate,
  TimelineItemTitle
} from "@/registry/8starlabs-ui/blocks/timeline";

const timelineData = [
  {
    title: "Project Kickoff",
    date: new Date("2023-01-01"),
    variant: "default" as const,
    hollow: true
  },
  {
    title: "Research Phase",
    date: new Date("2023-01-15"),
    variant: "secondary" as const,
    hollow: true
  },
  {
    title: "Prototype Approval",
    date: new Date("2023-02-01"),
    variant: "outline" as const,
    hollow: true
  },
  {
    title: "Unexpected API Delays",
    date: new Date("2023-02-10"),
    variant: "destructive" as const,
    hollow: true
  },
  {
    title: "Critical Database Failure",
    date: new Date("2023-02-14"),
    variant: "destructive" as const,
    hollow: true
  },
  {
    title: "Beta Launch",
    date: new Date("2023-03-01"),
    variant: "default" as const,
    hollow: true
  }
];

export default function TimelineVerticalDemo() {
  return (
    <Timeline orientation="vertical" noCards vertItemSpacing={60}>
      {timelineData.map((item, idx) => (
        <TimelineItem key={idx} variant={item.variant} hollow={item.hollow}>
          <TimelineItemDate>{item.date.toDateString()}</TimelineItemDate>
          <TimelineItemTitle>{item.title}</TimelineItemTitle>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
