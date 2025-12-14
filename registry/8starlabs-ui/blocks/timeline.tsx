"use client";

import {
  Children,
  cloneElement,
  createContext,
  CSSProperties,
  HTMLAttributes,
  ReactElement,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from "react";
import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";

const timelineDotVariants = cva(
  "h-4 w-4 rounded-full z-10 box-border flex items-center justify-center ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary border-2 border-primary text-primary-foreground",
        secondary:
          "bg-secondary border-2 border-secondary text-secondary-foreground",
        destructive:
          "bg-destructive border-2 border-destructive text-destructive-foreground",
        outline: "bg-background border-2 border-input"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

const timelineItemVariants = cva(
  "flex flex-col rounded-md transition-all p-4",
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
        true: "border-none shadow-none bg-transparent p-0",
        false: ""
      }
    },
    defaultVariants: {
      variant: "default",
      noCards: false
    }
  }
);

// We need a specific variant for the lines because "outline"
// shouldn't make the connecting line invisible.
const timelineBranchVariants = cva("absolute z-0", {
  variants: {
    variant: {
      default: "bg-primary",
      secondary: "bg-muted-foreground/30", // Gentle gray for secondary
      destructive: "bg-destructive",
      outline: "bg-border" // Matches standard border color
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

export interface TimelineItemProps
  extends
    HTMLAttributes<HTMLLIElement>,
    VariantProps<typeof timelineItemVariants> {
  index?: number;
}

export interface TimelineProps
  extends
    HTMLAttributes<HTMLDivElement>,
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

export interface TimelineItemDateProps extends Omit<
  HTMLAttributes<HTMLSpanElement>,
  "children"
> {
  children: Date | string;
}

export interface TimelineItemTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export interface TimelineItemDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

type TimelineContextType = {
  orientation: "horizontal" | "vertical";
  total: number;
  cardWidth?: number;
  maxCardWidth?: number;
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
  noCards = false,
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
        <TlCtxt.Provider value={contextVal}>
          {Children.map(children, (child, index) =>
            cloneElement(child as ReactElement<any>, { index })
          )}
        </TlCtxt.Provider>
      </ul>
    </div>
  );
}

export function TimelineItem({
  children,
  className,
  variant,
  index = 0,
  ...props
}: TimelineItemProps) {
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
          className={cn(timelineItemVariants({ variant, noCards }), "shrink-0")}
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
      {children instanceof Date ? dateFormatter.format(children) : children}
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
