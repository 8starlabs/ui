"use client";

import * as React from "react";
import { ChevronDown, ExternalLink } from "lucide-react";

import {
  ClaudeIcon,
  GrokIcon,
  OpenAIIcon,
  PerplexityIcon,
  V0Icon
} from "@/registry/8starlabs-ui/ui/ai-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/registry/8starlabs-ui/blocks/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/registry/8starlabs-ui/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/registry/8starlabs-ui/ui/tooltip";

export type AiLinkName = "ChatGPT" | "Claude" | "Perplexity" | "Grok" | "v0";
export type OpenInChatLayout = "dropdown" | "horizontal";

export type OpenInChatIcon = React.ElementType<React.ComponentProps<"svg">>;

export type AiLinkData = {
  baseUrl: string;
  paramName?: string;
  icon: OpenInChatIcon;
};

export type OpenInChatContextValue = {
  prompt: string;
  layout: OpenInChatLayout;
};

export type OpenInChatBaseProps = Omit<
  React.ComponentPropsWithoutRef<"div">,
  "align"
> & {
  prompt: string;
  triggerLabel?: React.ReactNode;
  triggerClassName?: string;
  contentClassName?: string;
  align?: React.ComponentProps<typeof DropdownMenuContent>["align"];
  side?: React.ComponentProps<typeof DropdownMenuContent>["side"];
};

export type OpenInChatDropdownProps = OpenInChatBaseProps & {
  layout?: "dropdown";
  trigger?: React.ReactElement | null;
};

export type OpenInChatHorizontalProps = OpenInChatBaseProps & {
  layout: "horizontal";
  trigger?: never;
};

export type OpenInChatProps =
  | OpenInChatDropdownProps
  | OpenInChatHorizontalProps;

export type OpenInChatLinkProps = {
  baseUrl: string;
  paramName?: string;
  icon: OpenInChatIcon;
  label: string;
  prompt?: string;
  className?: string;
};

const OpenInChatContext = React.createContext<OpenInChatContextValue | null>(
  null
);

export const aiLinksDataMap: Record<AiLinkName, AiLinkData> = {
  ChatGPT: {
    baseUrl: "https://chatgpt.com/",
    icon: OpenAIIcon
  },
  Claude: {
    baseUrl: "https://claude.ai/new",
    icon: ClaudeIcon
  },
  Perplexity: {
    baseUrl: "https://www.perplexity.ai/search/new",
    icon: PerplexityIcon
  },
  Grok: {
    baseUrl: "https://grok.com/",
    icon: GrokIcon
  },
  v0: {
    baseUrl: "https://v0.app/chat",
    icon: V0Icon
  }
};

export function getPromptUrl(
  baseUrl: string,
  prompt: string,
  paramName: string = "q"
) {
  const url = new URL(baseUrl);
  url.searchParams.set(paramName, prompt);
  return url.toString();
}

export function useOpenInChat() {
  const context = React.useContext(OpenInChatContext);

  if (!context) {
    throw new Error("OpenInChat links must be used inside OpenInChat.");
  }

  return context;
}

export default function OpenInChat({
  prompt,
  children,
  layout = "dropdown",
  trigger,
  triggerLabel = "Open in chat",
  className,
  triggerClassName,
  contentClassName,
  align = "end",
  side,
  ...props
}: OpenInChatProps) {
  const contextValue = React.useMemo(
    () => ({ prompt, layout }),
    [prompt, layout]
  );
  const items =
    React.Children.count(children) > 0
      ? children
      : (Object.entries(aiLinksDataMap) as [AiLinkName, AiLinkData][]).map(
          ([label, dat], idx) => (
            <OpenInChatLink
              label={label}
              baseUrl={dat.baseUrl}
              icon={dat.icon}
              paramName={dat.paramName}
              key={idx}
            />
          )
        );

  if (layout === "horizontal") {
    return (
      <TooltipProvider>
        <OpenInChatContext.Provider value={contextValue}>
          <div
            {...props}
            className={cn(
              "border-border bg-card text-muted-foreground inline-flex w-fit items-center justify-center gap-1.5 rounded-md border px-2 py-1 text-sm shadow-xs",
              triggerClassName,
              className
            )}
          >
            {triggerLabel ? <span>{triggerLabel}</span> : null}
            {items}
          </div>
        </OpenInChatContext.Provider>
      </TooltipProvider>
    );
  }

  return (
    <OpenInChatContext.Provider value={contextValue}>
      <div {...props} className={cn("inline-flex", className)}>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              trigger ?? (
                <Button
                  type="button"
                  variant="outline"
                  className={cn("gap-2", triggerClassName)}
                >
                  {triggerLabel}
                  <ChevronDown
                    className="size-4 opacity-70"
                    aria-hidden="true"
                  />
                </Button>
              )
            }
          />
          <DropdownMenuContent
            align={align}
            side={side}
            className={cn("w-56", contentClassName)}
          >
            {items}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </OpenInChatContext.Provider>
  );
}

export function OpenInChatLink({
  label,
  prompt,
  className,
  baseUrl,
  paramName = "q",
  icon
}: OpenInChatLinkProps) {
  const { prompt: contextPrompt, layout } = useOpenInChat();

  const href = getPromptUrl(baseUrl, prompt ?? contextPrompt, paramName);

  const Icon = icon;

  if (layout === "horizontal") {
    return (
      <Tooltip>
        <TooltipTrigger
          render={
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open in ${label}`}
              className={cn(
                "text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex size-6 shrink-0 items-center justify-center rounded-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                className
              )}
            >
              <Icon className="size-4" aria-hidden="true" />
            </a>
          }
        />
        <TooltipContent sideOffset={6}>Open in {label}</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <DropdownMenuItem
      className={cn("cursor-pointer", className)}
      render={
        <a href={href} target="_blank" rel="noreferrer">
          <Icon className="size-4" aria-hidden="true" />
          <span className="flex-1">Open in {label}</span>
          <ExternalLink className="size-4 opacity-60" aria-hidden="true" />
        </a>
      }
    />
  );
}

export type OpenInChatProviderLinkProps = Pick<
  OpenInChatLinkProps,
  "prompt" | "className"
>;

export function OpenInChatGPT(params: OpenInChatProviderLinkProps) {
  const dat = aiLinksDataMap.ChatGPT;

  return (
    <OpenInChatLink
      label="ChatGPT"
      baseUrl={dat.baseUrl}
      icon={dat.icon}
      paramName={dat.paramName}
      {...params}
    />
  );
}

export function OpenInClaude(params: OpenInChatProviderLinkProps) {
  const dat = aiLinksDataMap.Claude;

  return (
    <OpenInChatLink
      label="Claude"
      baseUrl={dat.baseUrl}
      icon={dat.icon}
      paramName={dat.paramName}
      {...params}
    />
  );
}

export function OpenInPerplexity(params: OpenInChatProviderLinkProps) {
  const dat = aiLinksDataMap.Perplexity;

  return (
    <OpenInChatLink
      label="Perplexity"
      baseUrl={dat.baseUrl}
      icon={dat.icon}
      paramName={dat.paramName}
      {...params}
    />
  );
}

export function OpenInGrok(params: OpenInChatProviderLinkProps) {
  const dat = aiLinksDataMap.Grok;

  return (
    <OpenInChatLink
      label="Grok"
      baseUrl={dat.baseUrl}
      icon={dat.icon}
      paramName={dat.paramName}
      {...params}
    />
  );
}

export function OpenInV0(params: OpenInChatProviderLinkProps) {
  const dat = aiLinksDataMap.v0;

  return (
    <OpenInChatLink
      label="v0"
      baseUrl={dat.baseUrl}
      icon={dat.icon}
      paramName={dat.paramName}
      {...params}
    />
  );
}
