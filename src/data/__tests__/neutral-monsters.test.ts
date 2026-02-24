import { NEUTRAL_MONSTERS } from "@/data/neutral-monsters";

describe("NEUTRAL_MONSTERS", () => {
  it("should have at least 15 neutral monster types", () => {
    expect(NEUTRAL_MONSTERS.length).toBeGreaterThanOrEqual(15);
  });

  it("should have unique ids", () => {
    const ids = NEUTRAL_MONSTERS.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("should have required fields on every entry", () => {
    for (const monster of NEUTRAL_MONSTERS) {
      expect(monster.id).toBeTruthy();
      expect(monster.name).toBeTruthy();
      expect(monster.expansion).toBeTruthy();
      expect(typeof monster.maxCount).toBe("number");
      expect(typeof monster.combat).toBe("number");
      expect(monster.abilitySummary).toBeTruthy();
      expect(Array.isArray(monster.tags)).toBe(true);
    }
  });

  it("should include dreamlands monsters", () => {
    const dreamlands = NEUTRAL_MONSTERS.filter(
      (m) => m.expansion === "dreamlands"
    );
    expect(dreamlands.length).toBeGreaterThanOrEqual(6);
  });
});
