import * as React from "react";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium outline-none transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

function ButtonArrow({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      data-slot="button-arrow"
      fill="none"
      width="10"
      height="10"
      viewBox="0 0 10 10"
      className={cn(
        "ml-2 -mr-1 mt-0.5 size-2.5 overflow-visible stroke-current stroke-2",
        className
      )}
    >
      <path
        className="opacity-0 transition-opacity group-hover/button:opacity-100 group-focus-visible/button:opacity-100"
        d="M0 5h7"
      />
      <path
        className="transition-transform group-hover/button:translate-x-[3px] group-focus-visible/button:translate-x-[3px]"
        d="M1 1l4 4-4 4"
      />
    </svg>
  );
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  withArrow = false,
  arrowClassName,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    withArrow?: boolean;
    arrowClassName?: string;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      <Slottable>{children}</Slottable>
      {withArrow && <ButtonArrow className={arrowClassName} />}
    </Comp>
  );
}

export { Button, ButtonArrow, buttonVariants };
