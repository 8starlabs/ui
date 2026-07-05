"use client";

import * as React from "react";
import { ChevronDown, ExternalLink } from "lucide-react";

import {
  ClaudeIcon,
  GrokIcon,
  OpenAIIcon,
  PerplexityIcon
} from "@/registry/8starlabs-ui/ui/ai-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/registry/8starlabs-ui/blocks/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/registry/8starlabs-ui/ui/dropdown-menu";

export type AiLinkName = "ChatGPT" | "Claude" | "Perplexity" | "Grok";

export type OpenInChatIcon = React.ElementType<React.ComponentProps<"svg">>;

export type AiLinkData = {
  baseUrl: string;
  paramName?: string;
  icon: OpenInChatIcon;
};

export type OpenInChatContextValue = {
  prompt: string;
};

export type OpenInChatProps = React.ComponentProps<typeof DropdownMenu> & {
  prompt: string;
  children?: React.ReactNode;
  triggerLabel?: React.ReactNode;
  triggerClassName?: string;
  contentClassName?: string;
  align?: React.ComponentProps<typeof DropdownMenuContent>["align"];
  side?: React.ComponentProps<typeof DropdownMenuContent>["side"];
};

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
  triggerLabel = "Open in chat",
  triggerClassName,
  contentClassName,
  align = "end",
  side,
  ...props
}: OpenInChatProps) {
  const contextValue = React.useMemo(() => ({ prompt }), [prompt]);
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

  return (
    <OpenInChatContext.Provider value={contextValue}>
      <DropdownMenu {...props}>
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              variant="outline"
              className={cn("gap-2", triggerClassName)}
            >
              {triggerLabel}
              <ChevronDown className="size-4 opacity-70" aria-hidden="true" />
            </Button>
          }
        ></DropdownMenuTrigger>
        <DropdownMenuContent
          align={align}
          side={side}
          className={cn("w-56", contentClassName)}
        >
          {items}
        </DropdownMenuContent>
      </DropdownMenu>
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
  const { prompt: contextPrompt } = useOpenInChat();

  const href = getPromptUrl(baseUrl, prompt ?? contextPrompt, paramName);

  const Icon = icon;

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
