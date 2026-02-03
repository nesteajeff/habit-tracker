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
          <p className={styles.subtitle}>
            This page loads habits from the Express API.
          </p>
        </header>

        <HabitForm />

        {isLoading ? (
          <p className={styles.subtitle}>Loading habits...</p>
        ) : errorMessage ? (
          <p className={styles.error}>
            {errorMessage} <a className={styles.link} href="/login">Log in</a>
          </p>
        ) : (
          <ul className={styles.list}>
            {habits.map((habit) => (
              <li key={habit.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardTitle}>{habit.name}</span>
                  <div className={styles.cardBadges}>
                    <HabitStreakBadge habitId={habit.id} />
                  </div>
                </div>
                <div className={styles.checkInRow}>
                  <HabitCheckInButton
                    habitId={habit.id}
                    hasCheckedInToday={habit.hasCheckedInToday}
                  />
                </div>
                <HabitDeleteButton habitId={habit.id} />
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
