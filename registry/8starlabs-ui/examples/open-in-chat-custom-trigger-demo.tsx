"use client";

import { MessageSquareText } from "lucide-react";

import OpenInChat from "@/registry/8starlabs-ui/blocks/open-in-chat";
import { Button } from "@/registry/8starlabs-ui/blocks/button";

export default function OpenInChatCustomTriggerDemo() {
  return (
    <OpenInChat
      prompt="Turn this implementation note into a concise review comment."
      trigger={
        <Button type="button" variant="secondary" className="gap-2">
          <MessageSquareText className="size-4" aria-hidden="true" />
          Ask AI
        </Button>
      }
    />
  );
}
