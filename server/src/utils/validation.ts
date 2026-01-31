export const validateHabitName = (name?: string) => {
  if (!name || name.trim().length === 0) {
    return "Name is required.";
  }

  if (name.trim().length > 100) {
    return "Name is too long.";
  }

  return null;
};
