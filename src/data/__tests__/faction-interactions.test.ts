import { describe, it, expect } from "vitest";
import { INTERACTION_TIPS } from "../faction-interactions";

describe("faction-interactions accuracy", () => {
  it("Ghroth tip mentions d6 roll mechanic, not 'sacrifices all'", () => {
    const ghroth = INTERACTION_TIPS.find((t) => t.id === "bg-ghroth");
    expect(ghroth).toBeDefined();
    expect(ghroth!.text).toContain("d6");
    expect(ghroth!.text).not.toContain("sacrifices all");
  });

  it("Yellow Sign tip does not say 'Gift Doom via spellbook'", () => {
    const ys = INTERACTION_TIPS.find((t) => t.id === "ys-gift");
    expect(ys).toBeDefined();
    expect(ys!.text).not.toContain("Gift Doom via spellbook");
  });

  it("all tips have required fields", () => {
    for (const tip of INTERACTION_TIPS) {
      expect(tip.id).toBeTruthy();
      expect(tip.factions.length).toBeGreaterThan(0);
      expect(tip.text.length).toBeGreaterThan(10);
      expect(["info", "warning", "critical"]).toContain(tip.severity);
    }
  });

  it("pairwise tips reference exactly 2 factions", () => {
    const pairwise = INTERACTION_TIPS.filter((t) => t.factions.length === 2);
    expect(pairwise.length).toBeGreaterThan(0);
    for (const tip of pairwise) {
      expect(tip.factions.length).toBe(2);
    }
  });
});
