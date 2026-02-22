"use client";

import { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export function GuideLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-void">
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 px-6 py-8 lg:px-12 lg:py-10">
          <div className="prose prose-invert mx-auto max-w-4xl prose-headings:font-heading prose-headings:text-bone prose-p:text-bone-muted prose-a:text-gold prose-strong:text-bone prose-code:text-eldritch-light">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
