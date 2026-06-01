"use client";

import * as React from "react";
import { IconCheck, IconCopy } from "@tabler/icons-react";

import { cn } from "@/lib/utils";
import { Button } from "@/registry/8starlabs-ui/blocks/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/registry/8starlabs-ui/ui/tooltip";

export function CopyButton({
  value,
  className,
  variant = "ghost",
  ...props
}: React.ComponentProps<typeof Button> & {
  value: string;
  src?: string;
}) {
  const [hasCopied, setHasCopied] = React.useState(false);

  React.useEffect(() => {
    if (!hasCopied) {
      return;
    }

    const timer = setTimeout(() => setHasCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [hasCopied]);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          data-slot="copy-button"
          size="icon"
          variant={variant}
          className={cn(
            "absolute top-2 right-2 z-10 size-7 opacity-70 hover:opacity-100 focus-visible:opacity-100",
            className
          )}
          onClick={() => {
            navigator.clipboard.writeText(value);
            setHasCopied(true);
          }}
          {...props}
        >
          <span className="sr-only">Copy</span>
          {hasCopied ? <IconCheck /> : <IconCopy />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {hasCopied ? "Copied" : "Copy to Clipboard"}
      </TooltipContent>
    </Tooltip>
  );
}
