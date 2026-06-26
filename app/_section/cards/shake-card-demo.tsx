"use client";

import { useEffect, useState } from "react";
import Shake from "@/registry/8starlabs-ui/blocks/shake";

export default function ShakeCardDemo() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex h-32 items-center justify-center">
      <Shake signal={tick} className="flex flex-col items-center gap-2">
        <div className="flex h-10 w-44 items-center justify-center rounded-md border border-destructive/50 bg-destructive/5">
          <span className="text-lg leading-none tracking-[0.4em] text-destructive">
            ••••
          </span>
        </div>
        <span className="text-xs text-destructive">Incorrect code</span>
      </Shake>
    </div>
  );
}
