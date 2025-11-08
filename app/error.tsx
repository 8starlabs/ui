"use client";

import { useEffect } from "react";
import Link from "next/link";
import React from "react";

import { Button } from "@/registry/8starlabs-ui/ui/button";
import { cn } from "@/lib/utils";

export default function Error({
  error
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <title>500 Error | 8StarLabs UI</title>
      <div className={cn("size-full px-6 sm:px-16 max-w-screen-xl mx-auto")}>
        <div className="flex flex-col justify-center h-full items-center min-h-[calc(100vh-80px)]">
          <h1 className="text-2xl font-bold">500</h1>
          <p className="mb-4 text-sm text-gray-500">
            Oops, Something went wrong, try again later.
          </p>
          <Button asChild>
            <Link href="/">Go home</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
