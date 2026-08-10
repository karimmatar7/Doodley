import { formatTime } from "@/lib/utils/formatTime";

describe("formatTime", () => {
  it("formats seconds as m:ss", () => {
    expect(formatTime(65)).toBe("1:05");
    expect(formatTime(9)).toBe("0:09");
    expect(formatTime(0)).toBe("0:00");
  });

  it("clamps negative values to 0:00", () => {
    expect(formatTime(-5)).toBe("0:00");
  });
});