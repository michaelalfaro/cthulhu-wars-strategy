"use client";

import { useState } from "react";

interface TranscriptReferenceProps {
  episode: number;
  title: string;
  slug: string;
}

export function TranscriptReference({
  episode,
  title,
  slug,
}: TranscriptReferenceProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="my-6 rounded-lg border border-elder-700 bg-void-light">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-void-lighter"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm text-bone-muted">Source:</span>
          <span className="text-sm font-medium text-bone">
            Episode {episode}: {title}
          </span>
        </div>
        <span className="text-bone-muted transition-transform" style={{ transform: expanded ? "rotate(180deg)" : "none" }}>
          &#9660;
        </span>
      </button>
      {expanded && (
        <div className="border-t border-elder-700 px-4 py-3">
          <a
            href={`/transcripts/${slug}`}
            className="text-sm text-elder-400 underline hover:text-elder-300"
          >
            View full transcript
          </a>
        </div>
      )}
    </div>
  );
}
