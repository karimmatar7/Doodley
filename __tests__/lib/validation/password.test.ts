import { validatePassword } from "@/lib/validation/password";

describe("validatePassword", () => {
  it("rejects a password that's too short", () => {
    const result = validatePassword("Ab1!");
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Minimum 8 characters");
  });

  it("rejects a password without an uppercase letter", () => {
    const result = validatePassword("abcdefg1!");
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("At least 1 uppercase letter");
  });

  it("rejects a password without a special character", () => {
    const result = validatePassword("Abcdefgh1");
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("At least 1 special character");
  });

  it("accepts a valid password", () => {
    const result = validatePassword("Doodley1!");
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});