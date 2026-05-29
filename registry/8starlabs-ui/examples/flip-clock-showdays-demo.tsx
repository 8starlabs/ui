"use client";

import { useEffect, useState } from "react";
import FlipClock from "@/registry/8starlabs-ui/blocks/flip-clock";

const DAY = 1000 * 60 * 60 * 24;

export default function FlipClockShowDaysDemo() {
  const [targets, setTargets] = useState<{
    oneDay: Date;
    fiveHundredDays: Date;
  }>();

  useEffect(() => {
    const now = Date.now();

    setTargets({
      oneDay: new Date(now + DAY),
      fiveHundredDays: new Date(now + DAY * 500)
    });
  }, []);

  return (
    <div className="flex flex-col gap-8">
      {/* Always show days, even if zero */}
      <FlipClock
        countdown={true}
        showDays="always"
        targetDate={targets?.oneDay}
        size={"md"}
      />
      {/* Show days only if non-zero */}
      <FlipClock
        countdown={true}
        showDays="auto"
        targetDate={targets?.oneDay}
        size={"md"}
      />
      {/* Never show days, even if 1 or more */}
      <FlipClock
        countdown={true}
        showDays="never"
        targetDate={targets?.fiveHundredDays}
        size={"md"}
      />
    </div>
  );
}
