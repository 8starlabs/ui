import { Sparkles } from "lucide-react";

import OpenInChat, {
  OpenInChatGPT,
  OpenInChatLink
} from "@/registry/8starlabs-ui/blocks/open-in-chat";

export default function OpenInChatCustomLinkDemo() {
  return (
    <OpenInChat prompt="Rewrite this draft in a concise support tone.">
      <OpenInChatGPT />
      <OpenInChatLink
        label="Internal AI"
        baseUrl="https://example.com/chat"
        paramName="message"
        icon={Sparkles}
      />
    </OpenInChat>
  );
}
