"use client";

import * as React from "react";
import { FileText, Plus, Search } from "lucide-react";

import EmptyState from "@/registry/8starlabs-ui/blocks/empty-state";
import { Button } from "@/registry/8starlabs-ui/blocks/button";
import { Input } from "@/registry/8starlabs-ui/ui/input";

export default function EmptyStateDemo() {
  const [query, setQuery] = React.useState("wireframe kit");
  const [documents, setDocuments] = React.useState([
    "Brand guidelines",
    "Product brief",
    "Launch checklist"
  ]);
  const matches = documents.filter((name) =>
    name.toLowerCase().includes(query.trim().toLowerCase())
  );

  function createDocument() {
    setDocuments((current) => [
      ...current,
      `Untitled document ${current.length + 1}`
    ]);
    setQuery("");
  }

  return (
    <div className="w-full rounded-xl border p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-sm font-medium">All files</h3>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <Search
            aria-hidden="true"
            className="text-muted-foreground size-4 shrink-0"
          />
          <Input
            aria-label="Search files"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full sm:w-48"
          />
        </div>
      </div>
      <div className="mt-6 flex min-h-96 items-center justify-center rounded-lg border">
        {matches.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No files found"
            description={
              <>
                Your search for “{query}” didn’t match any files. Try another
                term or create a document.
              </>
            }
            secondaryAction={{
              label: "Clear search",
              onClick: () => setQuery("")
            }}
            primaryAction={{
              label: "New document",
              icon: Plus,
              onClick: createDocument
            }}
          />
        ) : (
          <div className="flex w-full flex-col items-start gap-4 p-6">
            <ul
              className="flex w-full flex-col gap-3"
              aria-label="Matching files"
              aria-live="polite"
            >
              {matches.map((name) => (
                <li key={name} className="flex items-center gap-2 text-sm">
                  <FileText
                    aria-hidden="true"
                    className="text-muted-foreground size-4"
                  />
                  {name}
                </li>
              ))}
            </ul>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQuery("wireframe kit")}
            >
              Reset demo
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
