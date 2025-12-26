"use client";

import {
  Children,
  createContext,
  HTMLAttributes,
  isValidElement,
  type ReactElement,
  useContext
} from "react";
import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";

type PartitionBarContextType = {
  total: number;
  size: VariantProps<typeof partitionBarVariants>["size"];
};

const PartitionBarCtxt = createContext<PartitionBarContextType | null>(null);

function usePartitionBarContext(): PartitionBarContextType {
  const context = useContext(PartitionBarCtxt);
  if (!context) {
    throw new Error(
      "usePartitionBarContext must be used within a PartitionBarProvider"
    );
  }
  return context;
}

//////////////////////////////////////////////////////////////////////////////

const partitionBarVariants = cva("flex flex-row bg-background", {
  variants: {
    size: {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-md"
    }
  },
  defaultVariants: {
    size: "md"
  }
});

interface PartitionBar
  extends
    HTMLAttributes<HTMLUListElement>,
    VariantProps<typeof partitionBarVariants> {
  children?:
    | ReactElement<PartitionBarSegment>
    | ReactElement<PartitionBarSegment>[];
  gap?: number;
}

export function PartitionBar({
  children,
  className,
  gap = 1,
  size,
  ...props
}: PartitionBar) {
  const total = Children.toArray(children).reduce<number>(
    (sum, child) =>
      isValidElement(child)
        ? sum + ((child.props as PartitionBarSegment).num || 0)
        : sum,
    0
  );

  return (
    <PartitionBarCtxt.Provider value={{ total, size }}>
      <ul
        className={cn("w-full", partitionBarVariants({ size }), className)}
        style={{
          gap: `${gap * 4}px`
        }}
        {...props}
      >
        {children}
      </ul>
    </PartitionBarCtxt.Provider>
  );
}

////////////////////////////////////////////////////////////////////////////

const partitionBarLineVariants = cva("", {
  variants: {
    variant: {
      default: "bg-primary",
      secondary: "bg-primary/60",
      destructive: "bg-destructive",
      outline: "border border-input bg-background",
      muted: "bg-primary/40"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

const partitionBarTitleVariants = cva("", {
  variants: {
    variant: {
      default: "text-primary",
      secondary: "text-primary/60",
      destructive: "text-destructive",
      outline: "text-foreground",
      muted: "text-primary/40"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

interface PartitionBarSegment
  extends
    HTMLAttributes<HTMLLIElement>,
    VariantProps<typeof partitionBarLineVariants> {
  children?: React.ReactNode;
  num?: number;
  variant?: VariantProps<typeof partitionBarLineVariants>["variant"];
  alignment?: "left" | "center" | "right";
}

export function PartitionBarSegment({
  children,
  num = 0,
  variant = "default",
  alignment = "center",
  className,
  ...props
}: PartitionBarSegment) {
  const { total, size } = usePartitionBarContext();

  const widthPercent = total > 0 ? (num / total) * 100 : 0;

  return (
    <li
      className="flex flex-col min-w-0"
      style={{
        flexBasis: `${widthPercent}%`,
        flexGrow: 0,
        flexShrink: 0
      }}
      {...props}
    >
      <div
        className={cn(
          partitionBarLineVariants({ variant }),
          "rounded-full w-full shrink-0",
          size === "sm" ? "h-2" : size === "md" ? "h-3" : "h-4",
          className
        )}
      />
      <div
        className={cn(
          partitionBarTitleVariants({ variant }),
          "w-full whitespace-normal flex flex-col",
          size === "sm" ? "mt-2" : size === "md" ? "mt-3" : "mt-4",
          alignment === "left" && "items-start",
          alignment === "center" && "items-center",
          alignment === "right" && "items-end"
        )}
      >
        {children}
      </div>
    </li>
  );
}

/////////////////////////////////////////////////////////////////////////////

interface PartitionBarSegmentTitle extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function PartitionBarSegmentTitle({
  children,
  className
}: PartitionBarSegmentTitle) {
  return <div className={cn("w-fit font-semibold", className)}>{children}</div>;
}

interface PartitionBarSegmentValue extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function PartitionBarSegmentValue({
  children,
  className
}: PartitionBarSegmentValue) {
  return (
    <div className={cn("w-fit text-slate-500 text-[80%]", className)}>
      {children}
    </div>
  );
}
