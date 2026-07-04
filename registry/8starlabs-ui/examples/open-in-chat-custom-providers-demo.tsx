import OpenInChat, {
  OpenInChatGPT,
  OpenInClaude,
  OpenInPerplexity
} from "@/registry/8starlabs-ui/blocks/open-in-chat";

export default function OpenInChatCustomProvidersDemo() {
  return (
    <OpenInChat prompt="Review this implementation for correctness and edge cases.">
      <OpenInChatGPT />
      <OpenInClaude prompt="Review this with extra attention to UX tradeoffs." />
      <OpenInPerplexity />
    </OpenInChat>
  );
}
