"use client";

import * as React from "react";
import {
  FileText,
  Folder,
  Grid2X2,
  Image,
  CircleCheck,
  Files,
  type LucideIcon
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/registry/8starlabs-ui/blocks/button";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia
} from "@/registry/8starlabs-ui/ui/empty";

export interface EmptyStateAction
  extends Omit<React.ComponentProps<typeof Button>, "children"> {
  /** Visible button text. Other Button props, including onClick, are forwarded. */
  label: React.ReactNode;
  /** Optional SVG icon placed before the label. */
  icon?: LucideIcon;
}

export interface EmptyStateProps
  extends Omit<React.ComponentProps<"div">, "title" | "children"> {
  /** A short explanation of what is empty. */
  title: React.ReactNode;
  /** Context and a suggested next step. */
  description?: React.ReactNode;
  /** Central SVG icon. */
  icon?: LucideIcon;
  /** Up to six decorative SVG icons; pass [] to show only the center icon and rings. */
  surroundingIcons?: LucideIcon[];
  primaryAction?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
}

const defaultSurroundingIcons = [
  Grid2X2,
  FileText,
  Grid2X2,
  Image,
  Folder,
  CircleCheck
];
const positions = [
  "left-4 top-10 -rotate-6 opacity-40",
  "left-20 top-0 -rotate-12 opacity-60",
  "right-12 top-7 rotate-6 opacity-80",
  "right-0 top-12 rotate-12 opacity-30",
  "bottom-6 left-14 -rotate-6",
  "right-4 bottom-4 -rotate-6 opacity-40"
];

function Action({
  action,
  variant
}: {
  action: EmptyStateAction;
  variant: "default" | "outline";
}) {
  const { label, icon: Icon, ...buttonProps } = action;
  return (
    <Button type="button" variant={variant} {...buttonProps}>
      {Icon && <Icon aria-hidden="true" data-icon="inline-start" />}
      {label}
    </Button>
  );
}

export default function EmptyState({
  title,
  description,
  icon: Icon = Files,
  surroundingIcons = defaultSurroundingIcons,
  primaryAction,
  secondaryAction,
  className,
  ...props
}: EmptyStateProps) {
  const id = React.useId();
  return (
    <Empty
      role="region"
      aria-labelledby={`${id}-title`}
      aria-describedby={description ? `${id}-description` : undefined}
      className={cn("gap-6 border-solid py-8", className)}
      {...props}
    >
      <EmptyHeader>
        <EmptyMedia>
          <div
            aria-hidden="true"
            className="pointer-events-none relative isolate h-44 w-64 max-w-full"
          >
            <div className="border-border absolute top-1/2 left-1/2 size-20 -translate-1/2 rounded-full border opacity-80" />
            <div className="border-border absolute top-1/2 left-1/2 size-32 -translate-1/2 rounded-full border opacity-50" />
            <div className="border-border absolute top-1/2 left-1/2 size-44 -translate-1/2 rounded-full border opacity-30" />
            <div className="bg-primary text-primary-foreground absolute top-1/2 left-1/2 flex size-11 -translate-1/2 items-center justify-center rounded-xl">
              <Icon className="size-6" strokeWidth={1.5} />
            </div>
            {surroundingIcons
              .slice(0, positions.length)
              .map((Satellite, index) => (
                <div
                  key={index}
                  className={cn(
                    "bg-background text-muted-foreground absolute flex size-7 items-center justify-center rounded-lg border shadow-xs",
                    positions[index]
                  )}
                >
                  <Satellite className="size-3.5" strokeWidth={1.5} />
                </div>
              ))}
          </div>
        </EmptyMedia>
        <EmptyTitle id={`${id}-title`} role="heading" aria-level={3}>
          {title}
        </EmptyTitle>
        {description && (
          <EmptyDescription id={`${id}-description`}>
            {description}
          </EmptyDescription>
        )}
      </EmptyHeader>
      {(primaryAction || secondaryAction) && (
        <EmptyContent>
          <div className="flex flex-wrap justify-center gap-2">
            {secondaryAction && (
              <Action action={secondaryAction} variant="outline" />
            )}
            {primaryAction && (
              <Action action={primaryAction} variant="default" />
            )}
          </div>
        </EmptyContent>
      )}
    </Empty>
  );
}
