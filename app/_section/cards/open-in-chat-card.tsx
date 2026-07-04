import Link from "next/link";
import OpenInChat from "@/registry/8starlabs-ui/blocks/open-in-chat";
import { Card } from "@/registry/8starlabs-ui/ui/card";

const prompt = `
Explain what 8StarLabs UI is about.

Use https://ui.8starlabs.com and https://ui.8starlabs.com/llms.txt as context if you can browse.

Cover what the library is for, the kinds of components it offers, how developers install components, and when someone might choose it over a standard UI kit.
`;

const OpenInChatCard = () => {
  return (
    <Card className="group relative flex size-full flex-col overflow-hidden px-6 transition-colors hover:bg-muted/20">
      <Link
        prefetch={false}
        href="/docs/components/open-in-chat"
        className="absolute inset-0 z-10"
        aria-label="Open In Chat documentation"
      />

      <div className="relative z-20 flex flex-1 flex-col gap-4">
        <div className="pointer-events-none flex flex-col gap-2">
          <h3 className="text-lg font-semibold">Open In Chat</h3>
          <p className="text-sm text-muted-foreground">
            A dropdown component that opens AI chat tools with a pre-filled
            prompt.
          </p>
        </div>

        <div className="scroll-fade-x my-3 flex flex-1 items-center justify-center overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <OpenInChat prompt={prompt} />
        </div>
      </div>

      <div className="pointer-events-none absolute top-4 right-4 z-20 opacity-0 transition-opacity group-hover:opacity-100">
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            d="M7 17L17 7"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7 7h10v10"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </Card>
  );
};

export default OpenInChatCard;
