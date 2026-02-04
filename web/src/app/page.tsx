"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import HabitForm from "./HabitForm";
import HabitCheckInButton from "./HabitCheckInButton";
import HabitStreakBadge from "./HabitStreakBadge";
import HabitDeleteButton from "./HabitDeleteButton";

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

const fetchHabits = async (): Promise<Habit[]> => {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";
  const response = await fetch(`${baseUrl}/habits`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to load habits.");
  }

  return response.json();
};

export default function Home() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const cardAccents = ["#1e40af"];

  useEffect(() => {
    let isMounted = true;
    const loadHabits = async () => {
      try {
        const data = await fetchHabits();
        if (isMounted) {
          setHabits(data);
          setErrorMessage(null);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage((error as Error).message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadHabits();
    window.addEventListener("habits:updated", loadHabits);

    return () => {
      isMounted = false;
      window.removeEventListener("habits:updated", loadHabits);
    };
  }, []);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>Habit Tracker</h1>
        </header>

        <HabitForm />
        <button
          className={`${styles.deleteModeButton} ${
            isDeleteMode ? styles.deleteModeButtonActive : ""
          }`}
          type="button"
          onClick={() => setIsDeleteMode((value) => !value)}
        >
          Delete Habits
        </button>

        {isLoading ? (
          <p className={styles.subtitle}>Loading habits...</p>
        ) : errorMessage ? (
          <p className={styles.error}>
            {errorMessage} <a className={styles.link} href="/login">Log in</a>
          </p>
        ) : (
          <ul className={styles.list}>
            {habits.map((habit, index) => (
              <li
                key={habit.id}
                className={styles.card}
                style={
                  {
                    "--card-accent": cardAccents[index % cardAccents.length],
                  } as React.CSSProperties
                }
              >
                <div className={styles.cardHeader}>
                  <div className={styles.cardHeaderLeft}>
                    {isDeleteMode ? (
                      <HabitDeleteButton habitId={habit.id} inline />
                    ) : null}
                    <span className={styles.cardTitle}>{habit.name}</span>
                  </div>
                  <div className={styles.cardBadges}>
                    <HabitCheckInButton
                      habitId={habit.id}
                      hasCheckedInToday={habit.hasCheckedInToday}
                    />
                    <HabitStreakBadge habitId={habit.id} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
