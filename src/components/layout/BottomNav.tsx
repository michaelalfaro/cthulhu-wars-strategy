"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/guide/overview/basics", label: "Guide", icon: "📖" },
  { href: "/guide/factions/great-cthulhu", label: "Factions", icon: "🐙" },
  { href: "/tracker", label: "Tracker", icon: "🎲" },
  { href: "/", label: "Home", icon: "🏠" },
];

export function BottomNav() {
  const pathname = usePathname();

  // Don't show on tracker session pages (they have their own nav)
  if (pathname.startsWith("/tracker/") && pathname !== "/tracker") return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-void-lighter bg-void/95 backdrop-blur-sm lg:hidden">
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => {
          const isActive =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href.split("/").slice(0, 3).join("/"));

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 text-center transition-colors ${
                isActive ? "text-gold" : "text-bone-muted/60"
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
      {/* Safe area spacer for iPhone notch */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
