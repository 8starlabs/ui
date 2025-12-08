import { TimelineItemProps, Timeline, TimelineItem } from "../blocks/timeline";

const timelineData: TimelineItemProps[] = [
  {
    title: "Project Kickoff",
    description:
      "Initial meeting with all stakeholders to define project scope.",
    date: new Date("2023-01-05"),
    variant: "info"
  },
  {
    title: "Requirements Gathering",
    description:
      "Collected requirements from the client, covering both functional and non-functional aspects. This took several sessions over multiple weeks and included detailed analysis.",
    date: new Date("2023-01-12"),
    variant: "success"
  },
  {
    title: "Design Phase",
    description: "Created wireframes, mockups, and system design diagrams.",
    date: new Date("2023-01-20")
  },
  {
    title:
      "Database Setup Extravaganza with Lots of Unnecessary Complexity for Testing Purposes Only",
    description:
      "Configured databases, tables, and initial seed data for testing. This included hundreds of tables, dozens of indexes, and a complicated schema that will never be used in production.",
    date: new Date("2023-02-01"),
    variant: "destructive"
  }
];

export default function TimelineDemo() {
  return (
    <Timeline orientation="horizontal">
      {timelineData.map((item, idx) => (
        <TimelineItem key={idx} {...item} />
      ))}
    </Timeline>
  );
}
