import { ReactElement } from "react";

export type TimelineItemData = {
  id: number;
  title: string;
  description: string;
  date: Date;
  highlight?: boolean;
};

export type TimelineItemProps = {
  index?: number;
  content: TimelineItemData;
};

export type TimelineProps = {
  children: ReactElement<TimelineItemProps>[];

  dateDisplayFormat?: "day" | "month" | "year";

  alternating?: boolean;
  alignment?: "top" | "bottom";

  lineColor?: string;
  lineThickness?: number;
  lineProtrusion?: number;

  circleSize?: number;
  circleColor?: string;
  circleBorderColor?: string;
  circleThickness?: number;

  itemFillColor?: string;
  itemBorderThickness?: number;
  itemBorderColor?: string;
  itemTextAlignment?: "left" | "center" | "right";
  itemSpacing?: number;
  itemWidth?: number;
  itemGap?: number;

  title?: string;
  titleColor?: string;
  titleSize?: number;

  shadow?: boolean;
};

export type TimelineItemCardProps = {
  isAbove: boolean;
  content: TimelineItemData;
};

export type TimelineConfig = Omit<TimelineProps, "children">;
