import { INDEPENDENT_GOOS, type IndependentGOO } from "@/data/independent-goos";

describe("INDEPENDENT_GOOS", () => {
  it("should contain all 19 independent GOOs", () => {
    expect(INDEPENDENT_GOOS).toHaveLength(19);
  });

  it("should have unique ids", () => {
    const ids = INDEPENDENT_GOOS.map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("should have required fields on every entry", () => {
    for (const goo of INDEPENDENT_GOOS) {
      expect(goo.id).toBeTruthy();
      expect(goo.name).toBeTruthy();
      expect(goo.pack).toBeTruthy();
      expect(typeof goo.cost).toBe("number");
      expect(goo.abilitySummary).toBeTruthy();
      expect(Array.isArray(goo.tags)).toBe(true);
    }
  });

  it("should have correct pack distribution", () => {
    const byPack = (pack: string) =>
      INDEPENDENT_GOOS.filter((g) => g.pack === pack).length;
    expect(byPack("goo-pack-1")).toBe(5);
    expect(byPack("goo-pack-2")).toBe(4);
    expect(byPack("goo-pack-3")).toBe(1);
    expect(byPack("goo-pack-4")).toBe(3);
    expect(byPack("ramsey-campbell-1")).toBe(2);
    expect(byPack("ramsey-campbell-2")).toBe(2);
    expect(byPack("masks-nyarlathotep")).toBe(2);
  });
});
