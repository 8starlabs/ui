"use client";

import * as React from "react";
import { FileText, Plus } from "lucide-react";

import EmptyState from "@/registry/8starlabs-ui/blocks/empty-state";
import { Button } from "@/registry/8starlabs-ui/blocks/button";

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
    <div className="flex min-h-96 w-full items-center justify-center rounded-xl border">
      {matches.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No files found"
          description={
            <>
              Your search for “{query}” didn’t match any files. Try another term
              or create a document.
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
  );
}
