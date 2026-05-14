"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "@/lib/utils";

type TooltipMode = "tooltip" | "popover";

const DESKTOP_TOOLTIP_QUERY =
  "(hover: hover) and (pointer: fine) and (min-width: 1024px)";

const TooltipModeContext = React.createContext<TooltipMode>("tooltip");

function getTooltipMode(query: MediaQueryList): TooltipMode {
  return query.matches ? "tooltip" : "popover";
}

function useTooltipMode(): TooltipMode {
  const [mode, setMode] = React.useState<TooltipMode>("tooltip");

  React.useEffect(() => {
    const query = window.matchMedia(DESKTOP_TOOLTIP_QUERY);
    const updateMode = () => setMode(getTooltipMode(query));

    updateMode();
    query.addEventListener("change", updateMode);

    return () => query.removeEventListener("change", updateMode);
  }, []);

  return mode;
}

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
}

function Tooltip({
  children,
  open,
  defaultOpen,
  onOpenChange,
  delayDuration,
  disableHoverableContent,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  const mode = useTooltipMode();

  return (
    <TooltipModeContext.Provider value={mode}>
      {mode === "tooltip" ? (
        <TooltipProvider>
          <TooltipPrimitive.Root
            data-slot="tooltip"
            open={open}
            defaultOpen={defaultOpen}
            onOpenChange={onOpenChange}
            delayDuration={delayDuration}
            disableHoverableContent={disableHoverableContent}
            {...props}
          >
            {children}
          </TooltipPrimitive.Root>
        </TooltipProvider>
      ) : (
        <PopoverPrimitive.Root
          data-slot="tooltip"
          open={open}
          defaultOpen={defaultOpen}
          onOpenChange={onOpenChange}
        >
          {children}
        </PopoverPrimitive.Root>
      )}
    </TooltipModeContext.Provider>
  );
}

function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  const mode = React.useContext(TooltipModeContext);

  if (mode === "popover") {
    return <PopoverPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
  }

  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

type TooltipContentProps = Omit<
  React.ComponentProps<typeof TooltipPrimitive.Content>,
  "align"
> &
  Pick<React.ComponentProps<typeof PopoverPrimitive.Content>, "align">;

function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}: TooltipContentProps) {
  const mode = React.useContext(TooltipModeContext);

  if (mode === "popover") {
    const { align, ...contentProps } = props;

    return (
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          data-slot="tooltip-content"
          align={align ?? "center"}
          sideOffset={sideOffset}
          className={cn(
            "bg-foreground text-background animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-popover-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance",
            className
          )}
          {...contentProps}
        >
          {children}
          <PopoverPrimitive.Arrow className="bg-foreground fill-foreground z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    );
  }

  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "bg-foreground text-background animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance",
          className
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className="bg-foreground fill-foreground z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
