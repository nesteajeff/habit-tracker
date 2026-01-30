import styles from "./page.module.css";
import HabitForm from "./HabitForm";
import HabitCheckInButton from "./HabitCheckInButton";
import HabitStreakBadge from "./HabitStreakBadge";

type Habit = {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  isActive: boolean;
  hasCheckedInToday: boolean;
  lastEntryDate: string | null;
  createdAt: string;
};

const formatRelativeDateTime = (value: string) => {
  const date = new Date(value);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  const formatter = new Intl.RelativeTimeFormat(undefined, {
    numeric: "auto",
  });

  if (Math.abs(diffDays) >= 1) {
    return formatter.format(diffDays, "day");
  }

  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  if (Math.abs(diffHours) >= 1) {
    return formatter.format(diffHours, "hour");
  }

  const diffMinutes = Math.round(diffMs / (1000 * 60));
  if (Math.abs(diffMinutes) >= 1) {
    return formatter.format(diffMinutes, "minute");
  }

  return "just now";
};

const formatRelativeDateOnly = (value: string) => {
  const dateOnly = value.includes("T") ? value.slice(0, 10) : value;
  const [year, month, day] = dateOnly.split("-").map(Number);
  if (!year || !month || !day) {
    return "unknown";
  }
  const date = new Date(year, month - 1, day);
  const now = new Date();

  const dateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const nowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffMs = dateStart.getTime() - nowStart.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  const formatter = new Intl.RelativeTimeFormat(undefined, {
    numeric: "auto",
  });

  if (!Number.isFinite(diffDays)) {
    return "unknown";
  }

  return formatter.format(diffDays, "day");
};

const fetchHabits = async (): Promise<Habit[]> => {
  const baseUrl = process.env.API_BASE_URL ?? "http://localhost:3001";
  const response = await fetch(`${baseUrl}/habits`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load habits.");
  }

  return response.json();
};

export default async function Home() {
  let habits: Habit[] = [];
  let errorMessage: string | null = null;

  try {
    habits = await fetchHabits();
  } catch (error) {
    errorMessage = (error as Error).message;
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>Habit Tracker</h1>
          <p className={styles.subtitle}>
            This page loads habits from the Express API.
          </p>
        </header>

        <HabitForm />

        {errorMessage ? (
          <p className={styles.error}>{errorMessage}</p>
        ) : (
          <ul className={styles.list}>
            {habits.map((habit) => (
              <li key={habit.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardTitle}>{habit.name}</span>
                  <div className={styles.cardBadges}>
                    <span className={styles.badge}>
                      {habit.isActive ? "Active" : "Paused"}
                    </span>
                    <HabitStreakBadge habitId={habit.id} />
                  </div>
                </div>
                {habit.description ? (
                  <p className={styles.cardDescription}>
                    {habit.description}
                  </p>
                ) : (
                  <p className={styles.cardDescription}>No description</p>
                )}
                <p className={styles.cardMeta}>
                  Created {formatRelativeDateTime(habit.createdAt)}
                </p>
                <p className={styles.cardMeta}>
                  Last check-in{" "}
                  {habit.lastEntryDate
                    ? formatRelativeDateOnly(habit.lastEntryDate)
                    : "No check-ins yet"}
                </p>
                <div className={styles.checkInRow}>
                  <span className={styles.checkInStatus}>
                    {habit.hasCheckedInToday
                      ? "Checked in today"
                      : "Not checked in yet"}
                  </span>
                  <HabitCheckInButton
                    habitId={habit.id}
                    hasCheckedInToday={habit.hasCheckedInToday}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
