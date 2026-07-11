"use client";

import { siteConfig } from "@/lib/config";
import OpenInChat from "@/registry/8starlabs-ui/blocks/open-in-chat";

function getPrompt() {
  return `Explain what 8StarLabs UI is about.

Use ${siteConfig.url} and ${siteConfig.url}/llms.txt as context if you can browse.

Cover what the library is for, the kinds of components it offers, how developers install components, and when someone might choose it over a standard UI kit.`;
}

export function AskAiFooter() {
  return (
    <OpenInChat
      prompt={getPrompt()}
      layout="horizontal"
      triggerLabel="Ask AI:"
      className="mx-auto mt-2 bg-background/80 px-2.5 text-xs leading-loose shadow-sm sm:text-sm dark:bg-background/40"
    />
  );
}
