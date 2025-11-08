import Link from "next/link";
import React from "react";

import { Button } from "@/registry/8starlabs-ui/ui/button";
import { Metadata } from "next";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "404"
};

export default function NotFound() {
  return (
    <div className="size-full px-6 sm:px-16 max-w-screen-xl mx-auto">
      <div className="flex flex-col justify-center h-full items-center min-h-[calc(100vh-80px)]">
        <h1 className="text-2xl font-bold">404</h1>
        <p className="mb-4 text-sm text-gray-500">
          This page could not be found.
        </p>
        <Button asChild>
          <Link href="/">Go home</Link>
        </Button>
      </div>
    </div>
  );
}
