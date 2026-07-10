import OpenInChat from "@/registry/8starlabs-ui/blocks/open-in-chat";

export default function OpenInChatPositioningDemo() {
  return (
    <div className="flex min-h-52 w-full flex-wrap items-center justify-center gap-4">
      <OpenInChat
        prompt="Turn this changelog into release notes."
        triggerLabel="Bottom start"
        align="start"
        side="bottom"
      />
      <OpenInChat
        prompt="Summarize this design review for the product team."
        triggerLabel="Top end"
        align="end"
        side="top"
      />
      <OpenInChat
        prompt="List the follow-up questions for this implementation."
        triggerLabel="Right center"
        align="center"
        side="right"
      />
    </div>
  );
}
