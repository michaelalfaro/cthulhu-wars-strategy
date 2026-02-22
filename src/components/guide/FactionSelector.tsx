"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { theme, type FactionId } from "@/lib/theme";

interface FactionData {
  id: FactionId;
  type: "base" | "expansion";
  difficulty: "Beginner" | "Intermediate" | "Hard";
  tagline: string;
  strengths: string[];
  glyph: string;
}

const factions: FactionData[] = [
  {
    id: "great-cthulhu",
    type: "base",
    difficulty: "Beginner",
    tagline: "The enforcer. Punish whoever is winning and dominate the seas.",
    strengths: ["Devastating combat", "Global mobility via Submerge", "Free Elder Signs"],
    glyph: "\u2693", // anchor
  },
  {
    id: "black-goat",
    type: "base",
    difficulty: "Hard",
    tagline: "The swarm. Breed endlessly, sacrifice ruthlessly, overwhelm with numbers.",
    strengths: ["Unlimited monster summoning", "Economic engine", "Necrophagy map control"],
    glyph: "\u2620", // skull
  },
  {
    id: "crawling-chaos",
    type: "base",
    difficulty: "Intermediate",
    tagline: "The trickster. Redirect pain, fly across the map, and profit from chaos.",
    strengths: ["Flight mobility", "Madness disruption", "Battle profiteering"],
    glyph: "\u2727", // star
  },
  {
    id: "yellow-sign",
    type: "base",
    difficulty: "Intermediate",
    tagline: "The spreader. Desecrate the map and raise the dead to overwhelm.",
    strengths: ["Desecration doom engine", "Undead recursion", "Double actions"],
    glyph: "\u2641", // sign
  },
  {
    id: "opener-of-the-way",
    type: "expansion",
    difficulty: "Hard",
    tagline: "The gatekeeper. Yog-Sothoth IS a gate. Control space itself.",
    strengths: ["Gate manipulation", "Dragon Ascending burst", "Beyond One expansion"],
    glyph: "\u2609", // sun
  },
  {
    id: "sleeper",
    type: "expansion",
    difficulty: "Intermediate",
    tagline: "The thief. Steal abilities, curse gates, and let others do the work.",
    strengths: ["Ability theft via Ancient Sorcery", "Cursed Slumber denial", "Demand Sacrifice"],
    glyph: "\u263E", // moon
  },
  {
    id: "windwalker",
    type: "expansion",
    difficulty: "Beginner",
    tagline: "The predator. Hibernate to bank power, then strike with arctic fury.",
    strengths: ["Hibernate tempo advantage", "Gnoph-Keh combat snowball", "Cannibalism recursion"],
    glyph: "\u2744", // snowflake
  },
  {
    id: "tcho-tcho",
    type: "expansion",
    difficulty: "Hard",
    tagline: "The cult. Sacrifice your own to fuel devastating tribal abilities.",
    strengths: ["Martyrdom economy", "High Priest synergy", "Terror recruitment"],
    glyph: "\u2628", // cross
  },
  {
    id: "ancients",
    type: "expansion",
    difficulty: "Intermediate",
    tagline: "The brawler. No Great Old One needed \u2014 raw combat and Cathedral power.",
    strengths: ["Cheap powerful units", "Cathedral doom engine", "Combat superiority"],
    glyph: "\u2618", // clover
  },
  {
    id: "daemon-sultan",
    type: "expansion",
    difficulty: "Hard",
    tagline: "The shapeshifter. Your Avatars become other factions' Great Old Ones.",
    strengths: ["Avatar identity theft", "Unique Doom Phase", "Diplomatic flexibility"],
    glyph: "\u2605", // star
  },
  {
    id: "bubastis",
    type: "expansion",
    difficulty: "Intermediate",
    tagline: "The voyager. Command cats from the Moon and strike from the beyond.",
    strengths: ["Bastet teleportation", "Cat combat stacking", "Lunar sanctuary"],
    glyph: "\u2BCC", // cat-like
  },
];

export function FactionSelector() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = 280;
    el.scrollBy({
      left: direction === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
  };

  return (
    <div className="not-prose my-8">
      <div className="relative">
        {/* Left arrow */}
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute top-1/2 -left-2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-bone-muted/30 bg-void-light/90 text-bone-muted backdrop-blur-sm transition-all hover:border-gold/50 hover:text-gold sm:-left-4"
            aria-label="Scroll left"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}

        {/* Right arrow */}
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute top-1/2 -right-2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-bone-muted/30 bg-void-light/90 text-bone-muted backdrop-blur-sm transition-all hover:border-gold/50 hover:text-gold sm:-right-4"
            aria-label="Scroll right"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        )}

        {/* Scroll container */}
        <div
          ref={scrollRef}
          className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 py-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {factions.map((faction) => (
            <FactionCard key={faction.id} faction={faction} />
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-6 text-xs text-bone-muted">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-eldritch-light" />
          Base Game
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-tentacle-light" />
          Expansion
        </span>
        <span className="opacity-60">Scroll or use arrows to browse</span>
      </div>
    </div>
  );
}

function FactionCard({ faction }: { faction: FactionData }) {
  const factionTheme = theme.factions[faction.id];
  const color = factionTheme.color;
  const href = `/guide/factions/${faction.id}`;

  const difficultyColor =
    faction.difficulty === "Beginner"
      ? "#2a6b44"
      : faction.difficulty === "Intermediate"
        ? "#c4a84d"
        : "#b52a2a";

  return (
    <a
      href={href}
      className="group relative flex w-64 shrink-0 snap-start flex-col overflow-hidden rounded-lg border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:w-72"
      style={{
        borderColor: `${color}35`,
        background: `linear-gradient(180deg, ${color}12 0%, #0a0a0f 40%, #0a0a0f 100%)`,
        boxShadow: `0 0 0 0 ${color}00`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${color}70`;
        e.currentTarget.style.boxShadow = `0 4px 24px ${color}25, inset 0 1px 0 ${color}20`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = `${color}35`;
        e.currentTarget.style.boxShadow = `0 0 0 0 ${color}00`;
      }}
    >
      {/* Top color bar */}
      <div
        className="h-1 w-full transition-all duration-300 group-hover:h-1.5"
        style={{ backgroundColor: color }}
      />

      {/* Card body */}
      <div className="flex flex-1 flex-col p-5">
        {/* Header row */}
        <div className="mb-3 flex items-start justify-between">
          <div>
            <h3
              className="font-heading text-lg leading-tight font-bold"
              style={{ color }}
            >
              {factionTheme.name}
            </h3>
            <div className="mt-1 flex items-center gap-2">
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                style={{
                  backgroundColor: `${difficultyColor}20`,
                  color: difficultyColor,
                  border: `1px solid ${difficultyColor}40`,
                }}
              >
                {faction.difficulty}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-bone-muted/60">
                {faction.type}
              </span>
            </div>
          </div>
          <span
            className="text-2xl opacity-30 transition-opacity duration-300 group-hover:opacity-60"
            style={{ color }}
          >
            {faction.glyph}
          </span>
        </div>

        {/* Divider */}
        <div
          className="mb-3 h-px w-full"
          style={{ background: `linear-gradient(90deg, ${color}40, transparent)` }}
        />

        {/* Tagline */}
        <p className="mb-4 text-sm leading-relaxed text-bone-muted">
          {faction.tagline}
        </p>

        {/* Strengths */}
        <div className="mt-auto space-y-1.5">
          {faction.strengths.map((strength) => (
            <div key={strength} className="flex items-start gap-2 text-xs">
              <span
                className="mt-1 inline-block h-1 w-1 shrink-0 rounded-full"
                style={{ backgroundColor: `${color}80` }}
              />
              <span className="text-bone-muted/80">{strength}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          className="mt-4 flex items-center justify-between rounded-md px-3 py-2 text-xs font-medium transition-all duration-300"
          style={{
            backgroundColor: `${color}10`,
            color: `${color}cc`,
            border: `1px solid ${color}20`,
          }}
        >
          <span>Read full guide</span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="transition-transform duration-300 group-hover:translate-x-1"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </a>
  );
}
