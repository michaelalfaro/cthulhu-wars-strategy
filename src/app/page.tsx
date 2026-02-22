import Link from "next/link";
import { theme } from "@/lib/theme";

const factions = Object.entries(theme.factions).map(([id, data]) => ({
  id,
  ...data,
  href: `/guide/factions/${id}`,
  type: ["great-cthulhu", "black-goat", "crawling-chaos", "yellow-sign"].includes(id)
    ? "Core"
    : "Expansion",
}));

const sections = [
  {
    title: "Game Setup",
    description: "Step-by-step setup checklist. Never miss a piece again.",
    href: "/guide/overview/game-setup",
    icon: "📋",
    color: "#c4a84d",
  },
  {
    title: "The Basics",
    description: "Turn structure, Power, combat, and Doom — the fundamentals.",
    href: "/guide/overview/basics",
    icon: "📖",
    color: "#2d8a4e",
  },
  {
    title: "Advanced Tactics",
    description: "Power management, tempo, pain tricks, and Doom phase mastery.",
    href: "/guide/overview/advanced-tactics",
    icon: "⚔️",
    color: "#8b1a1a",
  },
  {
    title: "Threat Assessment",
    description: "Table politics, diplomacy, and the power of friendship.",
    href: "/guide/overview/threat-assessment",
    icon: "🎭",
    color: "#7a3b8a",
  },
  {
    title: "Faction Guides",
    description: "Deep dives into all 11 factions — openings, combos, matchups.",
    href: "/guide/factions/great-cthulhu",
    icon: "🐙",
    color: "#1a3d8b",
  },
  {
    title: "Resources & Aids",
    description: "Player aids, quick-reference cards, and community links.",
    href: "/guide/overview/resources",
    icon: "🔗",
    color: "#4a9ac7",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-void">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-eldritch/20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--color-eldritch)_0%,_transparent_60%)] opacity-20" />
        <div className="relative mx-auto max-w-5xl px-6 py-20 text-center">
          <p className="mb-4 font-heading text-sm uppercase tracking-widest text-gold">
            Opening the Way — Season 1
          </p>
          <h1 className="font-heading text-5xl font-bold text-bone sm:text-6xl lg:text-7xl">
            Cthulhu Wars
          </h1>
          <h2 className="mt-2 font-heading text-2xl text-gold sm:text-3xl">
            Strategy Guide
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-bone-muted">
            A comprehensive guide built from 35 transcribed podcast episodes.
            Faction guides, unit analysis, opening strategies, matchups, and the
            accumulated wisdom of experienced players.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/guide/overview/game-setup"
              className="rounded-lg border border-gold/60 bg-gold/10 px-6 py-3 font-heading text-sm font-semibold text-gold transition-all hover:bg-gold/20 hover:border-gold"
            >
              Game Setup Checklist
            </Link>
            <Link
              href="/guide/overview/basics"
              className="rounded-lg border border-eldritch/40 bg-eldritch/10 px-6 py-3 font-heading text-sm font-semibold text-bone transition-all hover:bg-eldritch/20"
            >
              Learn the Basics
            </Link>
            <Link
              href="/guide/factions/great-cthulhu"
              className="rounded-lg border border-bone-muted/20 bg-void-lighter px-6 py-3 font-heading text-sm font-semibold text-bone-muted transition-all hover:text-bone"
            >
              Faction Guides →
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Access Sections */}
      <div className="mx-auto max-w-5xl px-6 py-12">
        <h3 className="mb-6 font-heading text-xl text-bone-muted">
          Quick Access
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group rounded-lg border border-void-lighter bg-void-light p-5 transition-all hover:border-opacity-50"
              style={{ ["--hover-color" as string]: section.color }}
            >
              <div className="mb-2 flex items-center gap-3">
                <span className="text-2xl">{section.icon}</span>
                <h4
                  className="font-heading text-base font-semibold text-bone transition-colors group-hover:text-[var(--hover-color)]"
                  style={{ ["--hover-color" as string]: section.color }}
                >
                  {section.title}
                </h4>
              </div>
              <p className="text-sm text-bone-muted">{section.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Faction Grid */}
      <div className="mx-auto max-w-5xl px-6 pb-16">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-heading text-xl text-bone-muted">
            Faction Guides
          </h3>
          <span className="text-sm text-bone-muted">{factions.length} factions</span>
        </div>

        {/* Core Factions */}
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-bone-muted/60">
          Core Box
        </p>
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {factions
            .filter((f) => f.type === "Core")
            .map((faction) => (
              <Link
                key={faction.id}
                href={faction.href}
                className="group relative overflow-hidden rounded-lg border bg-void-light p-4 transition-all hover:scale-[1.02]"
                style={{ borderColor: `${faction.color}40` }}
              >
                <div
                  className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
                  style={{
                    background: `linear-gradient(135deg, ${faction.color}15, transparent)`,
                  }}
                />
                <div
                  className="mb-2 h-1 w-full rounded-full"
                  style={{ backgroundColor: faction.color }}
                />
                <p
                  className="font-heading text-sm font-semibold leading-tight"
                  style={{ color: faction.color }}
                >
                  {faction.name}
                </p>
              </Link>
            ))}
        </div>

        {/* Expansion Factions */}
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-bone-muted/60">
          Expansion Factions
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-4">
          {factions
            .filter((f) => f.type === "Expansion")
            .map((faction) => (
              <Link
                key={faction.id}
                href={faction.href}
                className="group relative overflow-hidden rounded-lg border bg-void-light p-4 transition-all hover:scale-[1.02]"
                style={{ borderColor: `${faction.color}40` }}
              >
                <div
                  className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
                  style={{
                    background: `linear-gradient(135deg, ${faction.color}15, transparent)`,
                  }}
                />
                <div
                  className="mb-2 h-1 w-full rounded-full"
                  style={{ backgroundColor: faction.color }}
                />
                <p
                  className="font-heading text-sm font-semibold leading-tight"
                  style={{ color: faction.color }}
                >
                  {faction.name}
                </p>
              </Link>
            ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-void-lighter py-8 text-center">
        <p className="text-sm text-bone-muted/50">
          Based on the{" "}
          <a
            href="https://openingtheway.podbean.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold/70 underline hover:text-gold"
          >
            Opening the Way
          </a>{" "}
          podcast • Cthulhu Wars is by{" "}
          <a
            href="https://petersengames.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold/70 underline hover:text-gold"
          >
            Petersen Games
          </a>
        </p>
      </footer>
    </main>
  );
}
