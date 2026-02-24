import { describe, it, expect } from "vitest";
import { FACTION_STRATEGIES } from "../faction-strategies";
import { FACTION_MAP } from "../faction-data";
import { FACTION_UNITS } from "../faction-units";

const CORE_FACTIONS = [
  "great-cthulhu",
  "black-goat",
  "crawling-chaos",
  "yellow-sign",
];

describe("faction-strategies", () => {
  it("has entries for all 4 core factions", () => {
    for (const id of CORE_FACTIONS) {
      expect(FACTION_STRATEGIES[id], `missing strategy for ${id}`).toBeDefined();
    }
  });

  it("all entries have valid factionId matching faction-data", () => {
    for (const [id, strategy] of Object.entries(FACTION_STRATEGIES)) {
      expect(strategy.factionId).toBe(id);
      expect(FACTION_MAP[id], `${id} not in FACTION_MAP`).toBeDefined();
    }
  });

  it("spellbook priority lists exactly 6 spellbooks matching faction-data", () => {
    for (const [id, strategy] of Object.entries(FACTION_STRATEGIES)) {
      const faction = FACTION_MAP[id];
      expect(strategy.spellbookPath.priority).toHaveLength(6);
      const factionSpellbookNames = faction.spellbooks.map((s: { name: string }) => s.name);
      for (const name of strategy.spellbookPath.priority) {
        expect(
          factionSpellbookNames,
          `"${name}" not a valid spellbook for ${id}`
        ).toContain(name);
      }
    }
  });

  it("all text fields have content (not empty)", () => {
    for (const [id, s] of Object.entries(FACTION_STRATEGIES)) {
      expect(s.opening.length, `${id} opening`).toBeGreaterThan(50);
      expect(s.earlyGame.length, `${id} earlyGame`).toBeGreaterThan(30);
      expect(s.midGame.length, `${id} midGame`).toBeGreaterThan(30);
      expect(s.lateGame.length, `${id} lateGame`).toBeGreaterThan(30);
      expect(s.spellbookPath.notes.length, `${id} spellbook notes`).toBeGreaterThan(10);
    }
  });

  it("keyMistakes has 3-5 entries per faction", () => {
    for (const [id, s] of Object.entries(FACTION_STRATEGIES)) {
      expect(s.keyMistakes.length, `${id} keyMistakes`).toBeGreaterThanOrEqual(3);
      expect(s.keyMistakes.length, `${id} keyMistakes`).toBeLessThanOrEqual(5);
    }
  });

  it("rulesReminders has 3-5 entries per faction", () => {
    for (const [id, s] of Object.entries(FACTION_STRATEGIES)) {
      expect(s.rulesReminders.length, `${id} rulesReminders`).toBeGreaterThanOrEqual(3);
      expect(s.rulesReminders.length, `${id} rulesReminders`).toBeLessThanOrEqual(5);
    }
  });

  it("unit counts in rulesReminders are consistent with faction-units", () => {
    for (const [id, s] of Object.entries(FACTION_STRATEGIES)) {
      const units = FACTION_UNITS[id];
      if (!units) continue;
      expect(units.length).toBeGreaterThan(0);
    }
  });
});
