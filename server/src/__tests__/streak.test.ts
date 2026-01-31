import { calculateCurrentStreak, toDateStringUtc } from "../utils/streak";

const dateFromToday = (daysFromToday: number) => {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + daysFromToday);
  return toDateStringUtc(date);
};

describe("calculateCurrentStreak", () => {
  it("returns 0 for empty dates", () => {
    expect(calculateCurrentStreak([])).toBe(0);
  });

  it("counts consecutive days ending today", () => {
    const dates = [
      dateFromToday(0),
      dateFromToday(-1),
      dateFromToday(-2),
    ];
    expect(calculateCurrentStreak(dates)).toBe(3);
  });

  it("stops when a day is missing", () => {
    const dates = [dateFromToday(0), dateFromToday(-2)];
    expect(calculateCurrentStreak(dates)).toBe(1);
  });
});
