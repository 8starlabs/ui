import { TimelineItemData, TimelineProps } from "./timelineTypes";
import { TimelineClient, TimelineItem } from "./timeline-client";

// Sample data structure for the timeline items (now using the defined type)
const timelineData: TimelineItemData[] = [
  {
    id: 1,
    title: "Project Start",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur consequuntur esse eum molestiae assumenda reprehenderit ullam sunt unde aspernatur totam quaerat iure sit maxime, laboriosam quod modi commodi ipsa at!",
    date: new Date("2023-01-01")
  },
  {
    id: 2,
    title: "Phase 1 Complete",
    description: "Core functionality and basic architecture established.",
    date: new Date("2023-02-01")
  },
  {
    id: 3,
    title: "Midpoint Review",
    description: "Testing, feedback integration, and risk assessment.",
    date: new Date("2023-03-01"),
    highlight: true
  },
  {
    id: 4,
    title: "Deployment",
    description: "Final release candidate pushed to production servers.",
    date: new Date("2023-04-01")
  },
  {
    id: 5,
    title: "Post-Launch Audit",
    description: "Monitoring performance and collecting user feedback.",
    date: new Date("2023-05-01")
  }
];

export function Timeline({
  children,
  title,
  titleSize = 24,
  titleColor = "#000000",
  dateDisplayFormat = "day",
  alternating = false,
  alignment = "top",
  lineColor = "#9CA3AF",
  lineThickness = 5,
  lineProtrusion = 50,
  circleSize = 24,
  circleColor = "#FFFFFF",
  circleBorderColor = "#9CA3AF",
  circleThickness = 5,
  itemFillColor = "#FFFFFF",
  itemBorderThickness = 2,
  itemBorderColor = "#9CA3AF",
  itemTextAlignment = "left",
  itemSpacing = 240,
  itemWidth = 220,
  itemGap = 8,
  shadow = false
}: TimelineProps) {
  return (
    <TimelineClient
      config={{
        title,
        titleSize,
        titleColor,
        dateDisplayFormat,
        alternating,
        alignment,
        lineColor,
        lineThickness,
        lineProtrusion,
        circleSize,
        circleColor,
        circleBorderColor,
        circleThickness,
        itemFillColor,
        itemBorderThickness,
        itemBorderColor,
        itemTextAlignment,
        itemSpacing,
        itemWidth,
        itemGap,
        shadow
      }}
    >
      {children}
    </TimelineClient>
  );
}

export default function TimelineDemo() {
  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <Timeline
        title="Project Timeline"
        titleSize={40}
        titleColor="#FF5733"
        dateDisplayFormat="day"
        alternating={true}
        alignment="bottom"
        lineColor="#EB34D2"
        lineThickness={9}
        lineProtrusion={50}
        circleSize={40}
        circleThickness={10}
        circleColor="lightGreen"
        circleBorderColor="#3492eb"
        itemFillColor="#ffffff"
        itemBorderThickness={2}
        itemBorderColor="#440000"
        itemTextAlignment="left"
        itemSpacing={220}
        itemWidth={240}
        itemGap={8}
        shadow={false}
      >
        {timelineData.map((item) => (
          <TimelineItem key={item.id} content={item} />
        ))}
      </Timeline>
    </div>
  );
}
