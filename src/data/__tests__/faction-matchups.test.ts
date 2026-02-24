import { describe, it, expect } from "vitest";
import {
  FACTION_MATCHUPS,
  getMatchupsForGame,
} from "../faction-matchups";
import { FACTION_MAP } from "../faction-data";

const CORE_FACTIONS = [
  "great-cthulhu",
  "black-goat",
  "crawling-chaos",
  "yellow-sign",
];

describe("faction-matchups", () => {
  it("has 12 pairwise entries for core factions (4 x 3)", () => {
    const corePairs = FACTION_MATCHUPS.filter(
      (m) =>
        CORE_FACTIONS.includes(m.factionId) &&
        CORE_FACTIONS.includes(m.opponentId)
    );
    expect(corePairs).toHaveLength(12);
  });

  it("every matchup references valid factions", () => {
    for (const m of FACTION_MATCHUPS) {
      expect(FACTION_MAP[m.factionId], `${m.factionId} invalid`).toBeDefined();
      expect(FACTION_MAP[m.opponentId], `${m.opponentId} invalid`).toBeDefined();
    }
  });

  it("no faction is matched against itself", () => {
    for (const m of FACTION_MATCHUPS) {
      expect(m.factionId).not.toBe(m.opponentId);
    }
  });

  it("threat levels are valid", () => {
    for (const m of FACTION_MATCHUPS) {
      expect(["low", "medium", "high"]).toContain(m.threatLevel);
    }
  });

  it("attack and defend text are non-empty", () => {
    for (const m of FACTION_MATCHUPS) {
      expect(m.attack.length, `${m.factionId} vs ${m.opponentId} attack`).toBeGreaterThan(20);
      expect(m.defend.length, `${m.factionId} vs ${m.opponentId} defend`).toBeGreaterThan(20);
    }
  });

  it("getMatchupsForGame filters correctly", () => {
    const gameMatchups = getMatchupsForGame(
      "great-cthulhu",
      ["great-cthulhu", "black-goat", "yellow-sign"]
    );
    expect(gameMatchups).toHaveLength(2);
    expect(gameMatchups.every((m) => m.factionId === "great-cthulhu")).toBe(true);
    expect(gameMatchups.map((m) => m.opponentId).sort()).toEqual(
      ["black-goat", "yellow-sign"].sort()
    );
  });

  it("getMatchupsForGame returns empty for faction not in game", () => {
    const result = getMatchupsForGame("sleeper", ["great-cthulhu", "black-goat"]);
    expect(result).toHaveLength(0);
  });
});
