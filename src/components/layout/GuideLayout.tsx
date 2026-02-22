"use client";

import { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

function PrintButton() {
  return (
    <button
      data-no-print
      onClick={() => window.print()}
      className="flex items-center gap-1.5 rounded border border-void-lighter px-3 py-1.5 text-xs text-bone-muted transition-colors hover:border-eldritch/40 hover:text-bone"
      title="Print / Save as PDF"
    >
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
        />
      </svg>
      Print / PDF
    </button>
  );
}

export function GuideLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-void">
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 min-w-0 px-6 py-8 lg:px-12 lg:py-10">
          {/* Toolbar */}
          <div className="mx-auto mb-6 flex max-w-4xl justify-end" data-no-print>
            <PrintButton />
          </div>
          <div className="prose prose-invert mx-auto max-w-4xl
            prose-headings:font-heading prose-headings:text-bone
            prose-p:text-bone-muted
            prose-a:text-gold prose-a:no-underline hover:prose-a:underline
            prose-strong:text-bone
            prose-code:text-eldritch-light
            prose-li:text-bone-muted
            prose-blockquote:border-eldritch/40 prose-blockquote:text-bone-muted
            prose-table:text-bone-muted
            prose-thead:text-bone prose-thead:border-eldritch/40
            prose-hr:border-eldritch/20">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
