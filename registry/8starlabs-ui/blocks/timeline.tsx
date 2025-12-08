"use client";

import {
  Children,
  cloneElement,
  CSSProperties,
  HTMLAttributes,
  ReactElement,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from "react";
import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";

const variantStyles: Record<
  string,
  { dot: string; branch: string; card: string }
> = {
  default: {
    dot: "border-primary bg-background",
    branch: "bg-primary",
    // Uses 'border-primary' to make it stand out in Dark Mode (White)
    card: "border-primary bg-card"
  },
  success: {
    dot: "border-emerald-500 bg-emerald-500",
    branch: "bg-emerald-500",
    card: "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20"
  },
  warning: {
    dot: "border-amber-500 bg-amber-500",
    branch: "bg-amber-500",
    card: "border-amber-500 bg-amber-50/50 dark:bg-amber-950/20"
  },
  destructive: {
    // Renamed from 'error' to match Shadcn
    dot: "border-destructive bg-destructive",
    branch: "bg-destructive",
    card: "border-destructive bg-destructive/10"
  },
  info: {
    dot: "border-sky-500 bg-sky-500",
    branch: "bg-sky-500",
    card: "border-sky-500 bg-sky-50/50 dark:bg-sky-950/20"
  }
};

const timelineDotVariants = cva(
  "h-4 w-4 rounded-full border-2 bg-background z-10 box-border", // Base styles
  {
    variants: {
      variant: {
        default: variantStyles.default.dot,
        success: variantStyles.success.dot,
        warning: variantStyles.warning.dot,
        destructive: variantStyles.destructive.dot,
        info: variantStyles.info.dot
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

const timelineItemVariants = cva(
  "flex flex-col border rounded-md p-4 text-card-foreground shadow-sm transition-all", // Base card styles
  {
    variants: {
      variant: {
        default: variantStyles.default.card,
        success: variantStyles.success.card,
        warning: variantStyles.warning.card,
        destructive: variantStyles.destructive.card,
        info: variantStyles.info.card
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

const timelineBranchVariants = cva("", {
  variants: {
    variant: {
      default: variantStyles.default.branch,
      success: variantStyles.success.branch,
      warning: variantStyles.warning.branch,
      destructive: variantStyles.destructive.branch,
      info: variantStyles.info.branch
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

const timelineLayoutVariants = cva("grid relative", {
  variants: {
    orientation: {
      horizontal: "grid-flow-col grid-rows-[min-content_2rem_min-content]",
      vertical: "grid-cols-[1fr_2rem_1fr] auto-rows-min"
    }
  },
  defaultVariants: {
    orientation: "horizontal"
  }
});

const timelineItemContainerVariants = cva("flex relative", {
  variants: {
    orientation: {
      horizontal: "w-full justify-center",
      vertical: "h-full items-center" // Vertical items need to center vertically
    },
    side: {
      // Logic for "Before Line" (on top / left) vs "After Line" (on bottom / right)
      before: "",
      after: ""
    }
  },
  compoundVariants: [
    // Horizontal + Top (Even)
    { orientation: "horizontal", side: "before", class: "items-end" },
    // Horizontal + Bottom (Odd)
    { orientation: "horizontal", side: "after", class: "items-start" },
    // Vertical + Left (Even)
    { orientation: "vertical", side: "before", class: "justify-end" },
    // Vertical + Right (Odd)
    { orientation: "vertical", side: "after", class: "justify-start" }
  ]
});

export interface TimelineItemProps
  extends
    HTMLAttributes<HTMLLIElement>,
    VariantProps<typeof timelineItemVariants> {
  date: Date;
  title: string;
  description?: string;
  index?: number;

  total?: number;
  cardWidth?: number;
  maxCardWidth?: number;

  alternating?: boolean;
  alignment?: "top/left" | "bottom/right";
  orientation?: "horizontal" | "vertical";
}

export interface TimelineProps
  extends
    HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof timelineLayoutVariants> {
  alternating?: boolean;
  alignment?: "top/left" | "bottom/right";

  horizItemSpacing?: number;
  horizItemWidth?: number;

  vertItemSpacing?: number;
  vertItemMaxWidth?: number;

  orientation: "horizontal" | "vertical";
}

function useHorizontalScroll() {
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = elRef.current;
    if (el) {
      const onWheel = (e: WheelEvent) => {
        if (e.deltaY === 0) return;
        // Prevent page scroll only if we can still scroll the element
        if (
          (e.deltaY > 0 && el.scrollLeft + el.clientWidth < el.scrollWidth) ||
          (e.deltaY < 0 && el.scrollLeft > 0)
        ) {
          e.preventDefault();
          el.scrollTo({
            left: el.scrollLeft + e.deltaY,
            behavior: "smooth" // Optional: makes it smoother but slower
          });
        }
      };
      el.addEventListener("wheel", onWheel);
      return () => el.removeEventListener("wheel", onWheel);
    }
  }, []);
  return elRef;
}

export default function Timeline({
  children,
  className,
  horizItemWidth = 220,
  horizItemSpacing = 130,
  vertItemSpacing = 130,
  vertItemMaxWidth = 350,
  alternating = true,
  alignment = "top/left",
  orientation = "horizontal",
  ...props
}: TimelineProps) {
  const isVertical = orientation === "vertical";

  const safePadding = Math.max(0, (horizItemWidth - horizItemSpacing) / 2);

  const scrollRef = useHorizontalScroll();

  const [verticalPadding, setVerticalPadding] = useState({ top: 0, bottom: 0 });
  const listRef = useRef<HTMLUListElement>(null);

  useLayoutEffect(() => {
    if (!isVertical || !listRef.current) {
      setVerticalPadding({ top: 0, bottom: 0 });
      return;
    }

    const computePadding = () => {
      const list = listRef.current;
      if (!list) return;

      // Find all cards
      const cards = list.querySelectorAll('[data-timeline-card="true"]');
      if (cards.length === 0) return;

      const firstCard = cards[0];
      const lastCard = cards[cards.length - 1];

      // Calculate heights
      const firstHeight = firstCard.getBoundingClientRect().height;
      const lastHeight = lastCard.getBoundingClientRect().height;

      // Formula: (CardHeight - Spacing) / 2
      // We use Math.max(0, ...) because if the card is smaller than spacing,
      // we don't want negative padding.
      const top = Math.max(0, (firstHeight - vertItemSpacing) / 2);
      const bottom = Math.max(0, (lastHeight - vertItemSpacing) / 2);

      setVerticalPadding({ top, bottom });
    };

    // Run initially
    computePadding();

    // Re-run if window resizes (content wrapping changes height)
    const observer = new ResizeObserver(() => computePadding());
    observer.observe(listRef.current);

    return () => observer.disconnect();
  }, [isVertical, vertItemSpacing, children]);

  return (
    <div
      id="timeline-container"
      className={cn(
        "flex h-full w-full p-4",
        isVertical ? "flex-col" : "flex-row overflow-x-auto",
        "snap-mandatory",
        isVertical ? "snap-y" : "snap-x",
        "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
        className
      )}
      ref={isVertical ? null : scrollRef}
      {...props}
    >
      <ul
        id="timeline-grid"
        className={timelineLayoutVariants({ orientation })}
        style={
          isVertical
            ? {
                gridAutoRows: `${vertItemSpacing}px`,
                // DYNAMIC GRID COLUMNS
                gridTemplateColumns: alternating
                  ? "1fr 2rem 1fr" // Standard centered
                  : alignment === "top/left" // "Content Left"
                    ? "1fr 2rem" // remove right column
                    : "2rem 1fr", // remove left column (Line First)
                paddingTop: `${verticalPadding.top}px`,
                paddingBottom: `${verticalPadding.bottom}px`
              }
            : {
                gridAutoColumns: `${horizItemSpacing}px`,
                // DYNAMIC GRID ROWS
                gridTemplateRows: alternating
                  ? "min-content 2rem min-content"
                  : alignment === "top/left" // "Content Top"
                    ? "min-content 2rem"
                    : "2rem min-content",
                paddingLeft: `${safePadding}px`,
                paddingRight: `${safePadding}px`
              }
        }
        ref={listRef}
      >
        {Children.map(children, (child, index) =>
          cloneElement(child as ReactElement<any>, {
            index,
            orientation,
            total: Children.count(children),
            cardWidth: horizItemWidth,
            maxCardWidth: vertItemMaxWidth,
            alternating,
            alignment
          })
        )}
      </ul>
    </div>
  );
}

export function TimelineItem({
  className,
  variant,
  date,
  title,
  description,
  index = 0,
  total = 0,
  cardWidth,
  maxCardWidth,
  alternating,
  alignment,
  orientation,
  ...props
}: TimelineItemProps) {
  const isEven = index % 2 === 0;
  const isVertical = orientation === "vertical";

  // Determine "side" based on index
  const side = alternating
    ? isEven
      ? "before"
      : "after"
    : alignment === "top/left"
      ? "before"
      : "after";

  let gridStyle: CSSProperties = {};
  let lineStyle: CSSProperties = {};

  if (isVertical) {
    // VERTICAL LOGIC
    if (alternating) {
      // 3 Columns: [Content] [Line] [Content]
      gridStyle = { gridColumn: side === "before" ? 1 : 3, gridRow: index + 1 };
      lineStyle = { gridColumn: 2, gridRow: index + 1, height: "100%" };
    } else {
      // 2 Columns
      if (side === "before") {
        // [Content] [Line]
        gridStyle = { gridColumn: 1, gridRow: index + 1 };
        lineStyle = { gridColumn: 2, gridRow: index + 1, height: "100%" };
      } else {
        // [Line] [Content]
        gridStyle = { gridColumn: 2, gridRow: index + 1 };
        lineStyle = { gridColumn: 1, gridRow: index + 1, height: "100%" };
      }
    }
  } else {
    // HORIZONTAL LOGIC
    if (alternating) {
      // 3 Rows: [Content] [Line] [Content]
      gridStyle = { gridColumn: index + 1, gridRow: side === "before" ? 1 : 3 };
      lineStyle = { gridColumn: index + 1, gridRow: 2, width: "100%" };
    } else {
      // 2 Rows
      if (side === "before") {
        // [Content]
        // [Line]
        gridStyle = { gridColumn: index + 1, gridRow: 1 };
        lineStyle = { gridColumn: index + 1, gridRow: 2, width: "100%" };
      } else {
        // [Line]
        // [Content]
        gridStyle = { gridColumn: index + 1, gridRow: 2 };
        lineStyle = { gridColumn: index + 1, gridRow: 1, width: "100%" };
      }
    }
  }

  const cardStyle: CSSProperties = isVertical
    ? {
        maxWidth: `${maxCardWidth}px`
      }
    : {
        width: `${cardWidth}px`,
        minWidth: `${cardWidth}px`,
        maxWidth: `${cardWidth}px`
      };

  return (
    <>
      <li
        id={`timeline-item-${index}-container`}
        className={cn(
          timelineItemContainerVariants({ orientation, side }),
          "snap-center",
          className
        )}
        style={gridStyle}
        {...props}
      >
        <div
          id={`timeline-item-${index}`}
          style={cardStyle}
          className={cn(timelineItemVariants({ variant }), "shrink-0")}
          data-timeline-card={true}
        >
          <span className="text-xs text-muted-foreground">
            {dateFormatter.format(date)}
          </span>
          <h3 className="font-semibold mt-1">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground mt-2">{description}</p>
          )}
        </div>
      </li>

      <li
        id={`timeline-item-${index}-middle`}
        className="relative flex items-center justify-center"
        style={lineStyle}
      >
        <div
          className={cn(
            "absolute bg-muted",
            index === 0
              ? isVertical
                ? "rounded-t-full"
                : "rounded-l-full"
              : "",
            index === total - 1
              ? isVertical
                ? "rounded-b-full"
                : "rounded-r-full"
              : "",
            isVertical ? "h-full w-1" : "w-full h-1"
          )}
          id={`timeline-item-${index}-line`}
        />

        <div
          className={cn(
            "absolute",
            timelineBranchVariants({ variant }),
            isVertical
              ? alternating
                ? isEven
                  ? "h-px w-4 left-0"
                  : "h-px w-4 right-0"
                : alignment === "top/left"
                  ? "h-px w-4 left-0"
                  : "h-px w-4 right-0"
              : alternating
                ? isEven
                  ? "w-px h-4 top-0"
                  : "w-px h-4 bottom-0"
                : alignment === "top/left"
                  ? "w-px h-4 top-0"
                  : "w-px h-4 bottom-0"
          )}
          id={`timeline-item-${index}-branch`}
        />

        <div
          className={cn(timelineDotVariants({ variant }))}
          id={`timeline-item-${index}-dot`}
        />
      </li>
    </>
  );
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  year: "numeric"
});
