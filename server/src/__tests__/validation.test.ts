import { validateHabitName } from "../utils/validation";

describe("validateHabitName", () => {
  it("requires a non-empty name", () => {
    expect(validateHabitName("")).toBe("Name is required.");
    expect(validateHabitName("   ")).toBe("Name is required.");
    expect(validateHabitName(undefined)).toBe("Name is required.");
  });

  it("rejects very long names", () => {
    const longName = "a".repeat(101);
    expect(validateHabitName(longName)).toBe("Name is too long.");
  });

  it("accepts valid names", () => {
    expect(validateHabitName("Drink water")).toBeNull();
  });
});
