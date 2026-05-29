"use client";

import * as React from "react";
import { CheckIcon, ClipboardIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/registry/8starlabs-ui/blocks/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/registry/8starlabs-ui/ui/tooltip";

export async function copyToClipboardWithMeta(value: string) {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch (err) {
    // Fallback for older browsers or blocked clipboard permissions
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const copied = document.execCommand("copy");
    document.body.removeChild(textarea);
    return copied;
  }
}

type CopyButtonProps = React.ComponentProps<typeof Button> & {
  value: string;
  src?: string;
  event?:
    | "copy_npm_command"
    | "copy_usage_import_code"
    | "copy_usage_code"
    | "copy_primitive_code"
    | "copy_theme_code"
    | "copy_block_code"
    | "copy_chunk_code"
    | "enable_lift_mode"
    | "copy_chart_code"
    | "copy_chart_theme"
    | "copy_chart_data"
    | "copy_color"
    | "set_layout"
    | "search_query";
};

export function CopyButton({
  value,
  className,
  variant = "ghost",
  event,
  ...props
}: CopyButtonProps) {
  const [hasCopied, setHasCopied] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => {
      setHasCopied(false);
    }, 2000);
  }, []);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          data-slot="copy-button"
          size="icon"
          variant={variant}
          className={cn(
            "bg-code absolute top-3 right-2 z-10 size-7 hover:opacity-100 focus-visible:opacity-100",
            className
          )}
          onClick={async () => {
            const copied = await copyToClipboardWithMeta(value);
            setHasCopied(copied);
          }}
          {...props}
        >
          <span className="sr-only">Copy</span>
          {hasCopied ? <CheckIcon /> : <ClipboardIcon />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {hasCopied ? "Copied" : "Copy to Clipboard"}
      </TooltipContent>
    </Tooltip>
  );
}
