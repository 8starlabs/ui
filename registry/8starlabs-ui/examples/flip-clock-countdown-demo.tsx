"use client";

import { useEffect, useState } from "react";
import FlipClock from "@/registry/8starlabs-ui/blocks/flip-clock";

const DAY = 1000 * 60 * 60 * 24;

export default function FlipClockCountdownDemo() {
  const [targets, setTargets] = useState<{
    oneDay: Date;
    tenDays: Date;
    fiveHundredDays: Date;
  }>();

  useEffect(() => {
    const now = Date.now();

    setTargets({
      oneDay: new Date(now + DAY),
      tenDays: new Date(now + DAY * 10),
      fiveHundredDays: new Date(now + DAY * 500)
    });
  }, []);

  return (
    <div className="flex flex-col gap-8">
      {/* 1 day ahead */}
      <FlipClock countdown={true} targetDate={targets?.oneDay} size={"md"} />

      {/* 10 days ahead */}
      <FlipClock
        variant="secondary"
        countdown={true}
        targetDate={targets?.tenDays}
        size={"md"}
      />

      {/* 500 days ahead */}
      <FlipClock
        variant="muted"
        countdown={true}
        targetDate={targets?.fiveHundredDays}
        size={"md"}
      />
    </div>
  );
}
