export const toDateStringUtc = (date: Date) => date.toISOString().slice(0, 10);

export const calculateCurrentStreak = (dates: string[]) => {
  if (dates.length === 0) return 0;

  const set = new Set(dates);
  let streak = 0;
  let cursor = new Date();

  while (true) {
    const key = toDateStringUtc(cursor);
    if (!set.has(key)) break;
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  return streak;
};
