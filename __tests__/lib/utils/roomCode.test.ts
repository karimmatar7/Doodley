import { generateRoomCode } from "@/lib/utils/roomCode";

describe("generateRoomCode", () => {
  it("generates a code of the requested length", () => {
    expect(generateRoomCode(5)).toHaveLength(5);
    expect(generateRoomCode(8)).toHaveLength(8);
  });

  it("only uses unambiguous uppercase characters and digits", () => {
    const code = generateRoomCode(20);
    expect(code).toMatch(/^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]+$/);
  });
});