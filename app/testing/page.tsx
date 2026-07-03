import OpenInChat, {
  OpenInChatGPT,
  OpenInClaude,
  OpenInGemini
} from "@/registry/8starlabs-ui/blocks/open-in-chat";

export default function Page() {
  return (
    <div className="flex min-h-[50svh] w-full items-center justify-center px-6 py-16">
      <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        <OpenInChat prompt="hello world">
          <OpenInChatGPT />
          <OpenInClaude prompt="hello from claude" />
          <OpenInGemini />
        </OpenInChat>
      </div>
    </div>
  );
}
