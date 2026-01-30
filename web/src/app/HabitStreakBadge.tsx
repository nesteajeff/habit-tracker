"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

type Props = {
  habitId: string;
};

const getApiBaseUrl = () =>
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";
const getDemoUserId = () =>
  process.env.NEXT_PUBLIC_DEMO_USER_ID ??
  "00000000-0000-0000-0000-000000000000";

export default function HabitStreakBadge({ habitId }: Props) {
  const [streak, setStreak] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadStreak = async () => {
      try {
        const response = await fetch(
          `${getApiBaseUrl()}/habits/${habitId}/streak`,
          {
            cache: "no-store",
            headers: {
              "x-user-id": getDemoUserId(),
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to load streak.");
        }

        const data = (await response.json()) as { currentStreak: number };
        if (isMounted) {
          setStreak(data.currentStreak);
          setError(null);
        }
      } catch (fetchError) {
        if (isMounted) {
          setError((fetchError as Error).message);
        }
      }
    };

    const handleCheckedIn = (event: Event) => {
      const detail = (event as CustomEvent<{ habitId: string }>).detail;
      if (detail?.habitId === habitId) {
        loadStreak();
      }
    };

    loadStreak();
    window.addEventListener("habit:checked-in", handleCheckedIn);

    return () => {
      isMounted = false;
      window.removeEventListener("habit:checked-in", handleCheckedIn);
    };
  }, [habitId]);

  if (error) {
    return <span className={styles.streakError}>Streak unavailable</span>;
  }

  if (streak === null) {
    return <span className={styles.streakLoading}>Loading streak...</span>;
  }

  return <span className={styles.streakBadge}>{streak} day streak</span>;
}
