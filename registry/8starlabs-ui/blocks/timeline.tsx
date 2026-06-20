"use client";

import {
  Children,
  cloneElement,
  createContext,
  CSSProperties,
  HTMLAttributes,
  ReactElement,
  useContext,
  useLayoutEffect,
  useRef,
  useState
} from "react";
import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";

// CSS VARIANTS

// Dot in the center of the timeline item
const timelineDotVariants = cva(
  "relative h-4 w-4 rounded-full z-10 flex items-center justify-center",
  {
    variants: {
      variant: {
        default: "border-primary",
        secondary: "border-secondary",
        destructive: "border-destructive",
        outline: ""
      },
      hollow: {
        true: "border-2 bg-card",
        false: "border-2"
      }
    },
    compoundVariants: [
      {
        hollow: false,
        variant: "default",
        class: "bg-primary"
      },
      {
        hollow: false,
        variant: "secondary",
        class: "bg-secondary"
      },
      {
        hollow: false,
        variant: "destructive",
        class: "bg-destructive"
      },
      {
        hollow: false,
        variant: "outline",
        class: "bg-background"
      }
    ],
    defaultVariants: {
      variant: "default",
      hollow: false
    }
  }
);

// Card container
const timelineItemVariants = cva(
  "flex flex-col rounded-md transition-all p-4 shrink-0",
  {
    variants: {
      variant: {
        default: "bg-card border text-card-foreground shadow-sm",
        secondary: "bg-secondary text-secondary-foreground shadow-sm",
        destructive:
          "bg-destructive/10 border border-destructive/20 text-destructive-foreground shadow-sm",
        outline: "bg-transparent border shadow-sm"
      },
      noCards: {
        true: "border-none shadow-none bg-transparent",
        false: ""
      }
    },
    defaultVariants: {
      variant: "default",
      noCards: false
    }
  }
);

// Branch connecting dot to card
const timelineBranchVariants = cva("absolute z-0", {
  variants: {
    variant: {
      default: "bg-primary",
      secondary: "bg-secondary",
      destructive: "bg-destructive",
      outline: "bg-border"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

// Timeline layout container
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

// Timeline item container (card + dot + line + branch)
const timelineItemContainerVariants = cva("flex relative snap-center", {
  variants: {
    orientation: {
      horizontal: "w-full justify-center",
      vertical: "h-full items-center"
    },
    side: {
      before: "",
      after: ""
    }
  },
  compoundVariants: [
    { orientation: "horizontal", side: "before", class: "items-end" },
    { orientation: "horizontal", side: "after", class: "items-start" },
    { orientation: "vertical", side: "before", class: "justify-end" },
    { orientation: "vertical", side: "after", class: "justify-start" }
  ]
});

// EXPORTED INTERFACES AND COMPONENTS
export interface TimelineItemProps
  extends HTMLAttributes<HTMLLIElement>,
    VariantProps<typeof timelineItemVariants> {
  hollow?: boolean;
}

type _timelineItemProps = TimelineItemProps & {
  index?: number | null;
};

export interface TimelineProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof timelineLayoutVariants> {
  children?: React.ReactNode;

  alternating?: boolean;
  alignment?: "top/left" | "bottom/right";

  horizItemSpacing?: number;
  horizItemWidth?: number;

  vertItemSpacing?: number;
  vertItemMaxWidth?: number;

  orientation?: "horizontal" | "vertical";

  noCards?: boolean;
}

export interface TimelineItemDateProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  children: Date | string;
}

export interface TimelineItemTitleProps
  extends HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export interface TimelineItemDescriptionProps
  extends HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

type TimelineContextType = {
  orientation: "horizontal" | "vertical";
  total: number;
  cardWidth: number;
  maxCardWidth: number;
  alternating: boolean;
  alignment: "top/left" | "bottom/right";
  noCards: boolean;
};

const TlCtxt = createContext<TimelineContextType | null>(null);

function useTimelineContext() {
  const context = useContext(TlCtxt);
  if (context === null) {
    throw new Error(
      "Timeline components must be used within a Timeline component."
    );
  }
  return context;
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
  noCards = false,
  ...props
}: TimelineProps) {
  const isVertical = orientation === "vertical";

  const safePadding = Math.max(0, (horizItemWidth - horizItemSpacing) / 2);

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

  const contextVal: TimelineContextType = {
    orientation,
    total: Children.count(children),
    cardWidth: horizItemWidth,
    maxCardWidth: vertItemMaxWidth,
    alternating,
    alignment,
    noCards
  };

  return (
    <div
      id="timeline-container"
      className={cn(
        "flex h-full w-full p-4",
        isVertical ? "flex-col" : "flex-row",
        className
      )}
      role="list"
      aria-orientation={orientation}
      aria-label="Timeline"
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
        <TlCtxt.Provider value={contextVal}>
          {Children.map(children, (child, index) =>
            cloneElement(child as ReactElement<any>, { index })
          )}
        </TlCtxt.Provider>
      </ul>
    </div>
  );
}

function getGridAndLineStyles(
  side: "before" | "after",
  index: number,
  isVertical: boolean,
  alternating: boolean
): { gridStyle: CSSProperties; lineStyle: CSSProperties } {
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

  return { gridStyle, lineStyle };
}

function getCardStyle(
  isVertical: boolean,
  cardWidth: number,
  maxCardWidth: number
): CSSProperties {
  return isVertical
    ? {
        maxWidth: `${maxCardWidth}px`
      }
    : {
        width: `${cardWidth}px`,
        minWidth: `${cardWidth}px`,
        maxWidth: `${cardWidth}px`
      };
}

function getBranchStyle(
  isVertical: boolean,
  isEven: boolean,
  alternating: boolean,
  alignment: "top/left" | "bottom/right"
): string {
  return isVertical
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
        : "w-px h-4 bottom-0";
}

export function TimelineItem({
  children,
  className,
  variant,
  hollow = false,
  index = null,
  ...props
}: _timelineItemProps) {
  if (index == null) {
    throw new Error("TimelineItem must be used as a direct child of Timeline.");
  }

  const {
    orientation,
    total,
    cardWidth,
    maxCardWidth,
    alternating,
    alignment,
    noCards
  } = useTimelineContext();

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

  const { gridStyle, lineStyle } = getGridAndLineStyles(
    side,
    index,
    isVertical,
    alternating
  );

  return (
    <>
      <li
        id={`timeline-item-${index}-container`}
        className={cn(timelineItemContainerVariants({ orientation, side }))}
        style={gridStyle}
        role="listitem"
        aria-posinset={index + 1}
        aria-setsize={total}
        {...props}
      >
        <div
          id={`timeline-item-${index}`}
          style={getCardStyle(isVertical, cardWidth, maxCardWidth)}
          className={cn(timelineItemVariants({ variant, noCards }), className)}
          data-timeline-card={true}
        >
          {children}
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
          aria-hidden="true"
        />

        <div
          className={cn(
            timelineBranchVariants({ variant }),
            getBranchStyle(isVertical, isEven, alternating, alignment)
          )}
          id={`timeline-item-${index}-branch`}
          aria-hidden="true"
        />

        <div
          className={cn(timelineDotVariants({ variant, hollow }))}
          id={`timeline-item-${index}-dot`}
          aria-hidden="true"
        />
      </li>
    </>
  );
}

export function TimelineItemDate({
  children,
  className,
  ...props
}: TimelineItemDateProps) {
  return (
    <span
      className={cn("text-xs text-muted-foreground mb-1", className)}
      {...props}
    >
      {children instanceof Date ? (
        <time dateTime={children.toISOString()}>
          {dateFormatter.format(children)}
        </time>
      ) : (
        children
      )}
    </span>
  );
}

export function TimelineItemTitle({
  children,
  className,
  ...props
}: TimelineItemTitleProps) {
  return (
    <h3 className={cn("font-semibold", className)} {...props}>
      {children}
    </h3>
  );
}

export function TimelineItemDescription({
  children,
  className,
  ...props
}: TimelineItemDescriptionProps) {
  return (
    <p
      className={cn("text-sm text-muted-foreground mt-2", className)}
      {...props}
    >
      {children}
    </p>
  );
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  year: "numeric"
});
