"use client";

import * as React from "react";
import { ChevronDown, ExternalLink } from "lucide-react";

import {
  ClaudeIcon,
  GeminiIcon,
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

type AiLinkName = "ChatGPT" | "Claude" | "Perplexity" | "Gemini" | "Grok";

type AiLink = {
  baseUrl: string;
  paramName?: string;
  icon: React.ElementType<{ className?: string }>;
};

type OpenInChatContextValue = {
  prompt: string;
};

type OpenInChatProps = React.ComponentProps<typeof DropdownMenu> & {
  prompt: string;
  children?: React.ReactNode;
  triggerLabel?: React.ReactNode;
  triggerClassName?: string;
  contentClassName?: string;
  align?: React.ComponentProps<typeof DropdownMenuContent>["align"];
  side?: React.ComponentProps<typeof DropdownMenuContent>["side"];
};

type OpenInChatLinkProps = {
  prompt?: string;
  className?: string;
};

const OpenInChatContext = React.createContext<OpenInChatContextValue | null>(
  null
);

const aiLinks: Record<AiLinkName, AiLink> = {
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
  Gemini: {
    baseUrl: "https://gemini.google.com/app",
    paramName: "prompt",
    icon: GeminiIcon
  },
  Grok: {
    baseUrl: "https://grok.com/",
    icon: GrokIcon
  }
};

function getPromptUrl(baseUrl: string, prompt: string, paramName = "q") {
  const url = new URL(baseUrl);

  url.searchParams.set(paramName, prompt);

  return url.toString();
}

function useOpenInChat() {
  const context = React.useContext(OpenInChatContext);

  if (!context) {
    throw new Error("OpenInChat links must be used inside OpenInChat.");
  }

  return context;
}

function OpenInChat({
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
      : (Object.keys(aiLinks) as AiLinkName[]).map((name) => (
          <OpenInChatLink key={name} name={name} />
        ));

  return (
    <OpenInChatContext.Provider value={contextValue}>
      <DropdownMenu {...props}>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn("gap-2", triggerClassName)}
          >
            {triggerLabel}
            <ChevronDown className="size-4 opacity-70" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
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

function OpenInChatLink({
  name,
  prompt,
  className
}: OpenInChatLinkProps & {
  name: AiLinkName;
}) {
  const { prompt: contextPrompt } = useOpenInChat();
  const link = aiLinks[name];

  const Icon = link.icon;
  const href = getPromptUrl(
    link.baseUrl,
    prompt ?? contextPrompt,
    link.paramName
  );

  return (
    <DropdownMenuItem asChild className={cn("cursor-pointer", className)}>
      <a href={href} target="_blank" rel="noreferrer">
        <Icon className="size-4" aria-hidden="true" />
        <span className="flex-1">Open in {name}</span>
        <ExternalLink className="size-4 opacity-60" aria-hidden="true" />
      </a>
    </DropdownMenuItem>
  );
}

function OpenInChatGPT(props: OpenInChatLinkProps) {
  return <OpenInChatLink name="ChatGPT" {...props} />;
}

function OpenInClaude(props: OpenInChatLinkProps) {
  return <OpenInChatLink name="Claude" {...props} />;
}

function OpenInPerplexity(props: OpenInChatLinkProps) {
  return <OpenInChatLink name="Perplexity" {...props} />;
}

function OpenInGemini(props: OpenInChatLinkProps) {
  return <OpenInChatLink name="Gemini" {...props} />;
}

function OpenInGrok(props: OpenInChatLinkProps) {
  return <OpenInChatLink name="Grok" {...props} />;
}

export {
  OpenInChatGPT,
  OpenInClaude,
  OpenInPerplexity,
  OpenInGemini,
  OpenInGrok,
  aiLinks
};

export default OpenInChat;

export type {
  AiLinkName,
  AiLink,
  OpenInChatContextValue,
  OpenInChatProps,
  OpenInChatLinkProps
};
