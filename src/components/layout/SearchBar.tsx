"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import type { SearchEntry } from "@/lib/search-index";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchEntry[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [index, setIndex] = useState<SearchEntry[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Load search index on first open
  useEffect(() => {
    if (isOpen && index.length === 0) {
      fetch("/api/search")
        .then((r) => r.json())
        .then((data: SearchEntry[]) => setIndex(data))
        .catch(() => {});
    }
  }, [isOpen, index.length]);

  // Keyboard shortcut: Cmd/Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
        setQuery("");
        setResults([]);
        setSelectedIdx(-1);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const runSearch = useCallback(
    (q: string) => {
      if (!q.trim() || index.length === 0) {
        setResults([]);
        setSelectedIdx(-1);
        return;
      }
      const fuse = new Fuse(index, {
        keys: [
          { name: "title", weight: 0.5 },
          { name: "description", weight: 0.3 },
          { name: "content", weight: 0.15 },
          { name: "tags", weight: 0.05 },
        ],
        threshold: 0.4,
        minMatchCharLength: 2,
      });
      const hits = fuse.search(q, { limit: 8 });
      setResults(hits.map((h) => h.item));
      setSelectedIdx(-1);
    },
    [index]
  );

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setQuery(q);
    runSearch(q);
  };

  const navigate = (href: string) => {
    router.push(href);
    setIsOpen(false);
    setQuery("");
    setResults([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIdx((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && selectedIdx >= 0) {
      navigate(results[selectedIdx].href);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => {
          setIsOpen(true);
          setTimeout(() => inputRef.current?.focus(), 50);
        }}
        className="flex items-center gap-2 rounded-md border border-void-lighter bg-void-light px-3 py-1.5 text-sm text-bone-muted transition-colors hover:border-eldritch/40 hover:text-bone"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden rounded border border-void-lighter px-1 py-0.5 text-xs sm:inline">
          ⌘K
        </kbd>
      </button>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
        onClick={() => {
          setIsOpen(false);
          setQuery("");
          setResults([]);
        }}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-20 z-50 w-full max-w-xl -translate-x-1/2 px-4">
        <div className="overflow-hidden rounded-xl border border-eldritch/40 bg-void-light shadow-2xl shadow-black/60">
          {/* Input */}
          <div className="flex items-center gap-3 border-b border-void-lighter px-4 py-3">
            <svg className="h-4 w-4 shrink-0 text-bone-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="Search guide… (factions, tactics, spellbooks…)"
              className="flex-1 bg-transparent text-bone outline-none placeholder:text-bone-muted/50"
              autoComplete="off"
            />
            <kbd
              className="rounded border border-void-lighter px-1.5 py-0.5 text-xs text-bone-muted cursor-pointer"
              onClick={() => {
                setIsOpen(false);
                setQuery("");
                setResults([]);
              }}
            >
              Esc
            </kbd>
          </div>

          {/* Results */}
          {results.length > 0 && (
            <ul className="max-h-80 overflow-y-auto py-2">
              {results.map((result, idx) => (
                <li key={result.href}>
                  <button
                    className={`w-full px-4 py-3 text-left transition-colors ${
                      idx === selectedIdx
                        ? "bg-eldritch/20"
                        : "hover:bg-void-lighter"
                    }`}
                    onClick={() => navigate(result.href)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-heading text-sm font-semibold text-bone truncate">
                          {result.title}
                        </p>
                        {result.description && (
                          <p className="mt-0.5 text-xs text-bone-muted line-clamp-1">
                            {result.description}
                          </p>
                        )}
                      </div>
                      <span className="shrink-0 rounded px-1.5 py-0.5 text-xs text-bone-muted/60 border border-void-lighter">
                        {result.section}
                      </span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {query && results.length === 0 && (
            <p className="px-4 py-6 text-center text-sm text-bone-muted">
              No results for &ldquo;{query}&rdquo;
            </p>
          )}

          {!query && (
            <p className="px-4 py-4 text-xs text-bone-muted/50">
              Search across {index.length > 0 ? `${index.length} guide pages` : "all guide pages"}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
