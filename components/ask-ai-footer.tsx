"use client";

import type { ElementType } from "react";

import {
  ClaudeIcon,
  GeminiIcon,
  GrokIcon,
  OpenAIIcon,
  PerplexityIcon
} from "@/components/icons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/registry/8starlabs-ui/ui/tooltip";
import { siteConfig } from "@/lib/config";

function getPrompt() {
  return `Explain what 8StarLabs UI is about.

Use ${siteConfig.url} and ${siteConfig.url}/llms.txt as context if you can browse.

Cover what the library is for, the kinds of components it offers, how developers install components, and when someone might choose it over a standard UI kit.`;
}

function getPromptUrl(baseUrl: string, paramName = "q") {
  const url = new URL(baseUrl);

  url.searchParams.set(paramName, getPrompt());

  return url.toString();
}

const aiLinks: {
  name: string;
  href: string;
  icon: ElementType;
}[] = [
  {
    name: "ChatGPT",
    href: getPromptUrl("https://chatgpt.com/"),
    icon: OpenAIIcon
  },
  {
    name: "Claude",
    href: getPromptUrl("https://claude.ai/new"),
    icon: ClaudeIcon
  },
  {
    name: "Perplexity",
    href: getPromptUrl("https://www.perplexity.ai/search/new"),
    icon: PerplexityIcon
  },
  {
    name: "Gemini",
    href: getPromptUrl("https://gemini.google.com/app", "prompt"),
    icon: GeminiIcon
  },
  {
    name: "Grok",
    href: getPromptUrl("https://grok.com/"),
    icon: GrokIcon
  }
];

function copyPrompt() {
  void navigator.clipboard?.writeText(getPrompt()).catch(() => undefined);
}

export function AskAiFooter() {
  return (
    <div className="text-muted-foreground bg-background/80 mx-auto inline-flex w-fit items-center justify-center gap-1.5 rounded-md border px-2.5 py-1 mt-2 text-xs leading-loose shadow-sm sm:text-sm dark:bg-background/40">
      <span>Ask AI:</span>
      {aiLinks.map(({ name, href, icon: Icon }) => (
        <Tooltip key={name}>
          <TooltipTrigger asChild>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Ask ${name} about 8StarLabs UI`}
              onClick={copyPrompt}
              className="text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex size-6 shrink-0 items-center justify-center rounded-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <Icon aria-hidden="true" className="size-4" />
            </a>
          </TooltipTrigger>
          <TooltipContent sideOffset={6}>
            Ask {name} about 8StarLabs UI
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
