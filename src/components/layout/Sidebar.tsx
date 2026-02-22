"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navigation, type NavItem } from "@/lib/navigation";

function NavSection({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const isActive = pathname.startsWith(item.href);
  const [isOpen, setIsOpen] = useState(isActive);

  return (
    <div className="mb-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex w-full items-center justify-between rounded px-3 py-2 text-sm font-heading font-semibold transition-colors ${
          isActive
            ? "bg-eldritch/20 text-gold"
            : "text-bone-muted hover:bg-void-lighter hover:text-bone"
        }`}
      >
        {item.title}
        {item.children && (
          <svg
            className={`h-4 w-4 transition-transform ${isOpen ? "rotate-90" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        )}
      </button>
      {isOpen && item.children && (
        <div className="ml-3 mt-1 border-l border-eldritch/20 pl-3">
          {item.children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className={`block rounded px-3 py-1.5 text-sm transition-colors ${
                pathname === child.href
                  ? "bg-eldritch/20 text-gold"
                  : "text-bone-muted hover:bg-void-lighter hover:text-bone"
              }`}
            >
              {child.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 overflow-y-auto border-r border-eldritch/30 bg-void-light p-4 pt-20 transition-transform lg:sticky lg:top-16 lg:z-0 lg:h-[calc(100vh-4rem)] lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav>
          {navigation.map((item) => (
            <NavSection key={item.href} item={item} />
          ))}
        </nav>
      </aside>
    </>
  );
}
