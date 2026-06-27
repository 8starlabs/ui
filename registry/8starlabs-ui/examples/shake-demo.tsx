"use client";

import { useState } from "react";
import Shake from "../blocks/shake";

export default function ShakeDemo() {
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState(0);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (code !== "1234") {
          setErrors((n) => n + 1);
          setCode("");
        }
      }}
    >
      <Shake signal={errors} className="flex flex-col items-center gap-3">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          inputMode="numeric"
          placeholder="Enter 1234"
          className="h-10 w-40 rounded-md border bg-background px-3 text-center text-sm tracking-[0.3em] outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <button
          type="submit"
          className="h-9 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Verify
        </button>
      </Shake>
    </form>
  );
}
