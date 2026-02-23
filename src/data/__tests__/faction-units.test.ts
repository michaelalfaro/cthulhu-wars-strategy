import { describe, it, expect } from "vitest";
import { FACTION_UNITS } from "../faction-units";
import { FACTIONS } from "../faction-data";

describe("FACTION_UNITS", () => {
  it("has an entry for every faction", () => {
    for (const faction of FACTIONS) {
      expect(FACTION_UNITS[faction.id]).toBeDefined();
      expect(FACTION_UNITS[faction.id].length).toBeGreaterThan(0);
    }
  });

  it("every unit has required fields", () => {
    for (const [factionId, units] of Object.entries(FACTION_UNITS)) {
      for (const unit of units) {
        expect(unit.id).toBeTruthy();
        expect(unit.name).toBeTruthy();
        expect(unit.max).toBeGreaterThan(0);
        expect(typeof unit.cost).toBe("number");
        expect(typeof unit.combat).toBe("number");
      }
    }
  });

  it("every faction has exactly one GOO except Ancients", () => {
    for (const [factionId, units] of Object.entries(FACTION_UNITS)) {
      const goos = units.filter((u) => u.isGOO);
      if (factionId === "ancients") {
        expect(goos.length).toBe(0);
      } else {
        expect(goos.length).toBeGreaterThanOrEqual(1);
      }
    }
  });
});
