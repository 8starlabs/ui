import StatusIndicator from "@/registry/8starlabs-ui/blocks/status-indicator";
import Hero from "@/app/_section/hero";
import { TransportBadge } from "@/registry/8starlabs-ui/blocks/transport-badge";
import Cards from "./_section/cards";

export default function Home() {
  return (
    <div className="max-w-10xl  px-6 md:px-16  mx-auto flex flex-col min-h-svh py-8 gap-8">
      <Hero />
      <Cards className="mt-4" />
    </div>
  );
}
