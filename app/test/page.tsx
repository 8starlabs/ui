import React from "react";

export default function TestPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <video controls className="h-[30rem] w-auto max-w-full" src="/sample.mp4">
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
