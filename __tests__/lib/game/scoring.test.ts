import { calculatePoints } from "@/lib/game/scoring";

describe("calculatePoints", () => {
  it("awards max points at full time remaining", () => {
    expect(calculatePoints(80, 80)).toBe(100);
  });

  it("awards min points when time is up", () => {
    expect(calculatePoints(0, 80)).toBe(20);
  });

  it("scales linearly between min and max", () => {
    expect(calculatePoints(40, 80)).toBe(60);
  });
});