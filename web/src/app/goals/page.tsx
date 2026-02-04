"use client";

import { useEffect, useState } from "react";
import styles from "../page.module.css";
import GoalForm from "./GoalForm";
import GoalDeleteButton from "./GoalDeleteButton";
import GoalCheckInButton from "./GoalCheckInButton";

type Goal = {
  id: string;
  userId: string;
  title: string;
  targetDate: string | null;
  status: string;
  createdAt: string;
};

const formatDateOnly = (value: string) => {
  const dateOnly = value.includes("T") ? value.slice(0, 10) : value;
  const [year, month, day] = dateOnly.split("-").map(Number);
  if (!year || !month || !day) {
    return "unknown";
  }

  const date = new Date(Date.UTC(year, month - 1, day));
  return new Intl.DateTimeFormat(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
};

const fetchGoals = async (): Promise<Goal[]> => {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";
  const response = await fetch(`${baseUrl}/goals`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to load goals.");
  }

  return response.json();
};

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteMode, setIsDeleteMode] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadGoals = async () => {
      try {
        const data = await fetchGoals();
        if (isMounted) {
          setGoals(data);
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

    loadGoals();
    window.addEventListener("goals:updated", loadGoals);

    return () => {
      isMounted = false;
      window.removeEventListener("goals:updated", loadGoals);
    };
  }, []);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>Goal Tracker</h1>
        </header>

        <GoalForm />
        <button
          className={`${styles.deleteModeButton} ${
            isDeleteMode ? styles.deleteModeButtonActive : ""
          }`}
          type="button"
          onClick={() => setIsDeleteMode((value) => !value)}
        >
          Delete Goals
        </button>

        {isLoading ? (
          <p className={styles.subtitle}>Loading goals...</p>
        ) : errorMessage ? (
          <p className={styles.error}>
            {errorMessage} <a className={styles.link} href="/login">Log in</a>
          </p>
        ) : (
          <ul className={styles.list}>
            {goals.map((goal) => (
              <li key={goal.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardHeaderLeft}>
                    {isDeleteMode ? (
                      <GoalDeleteButton goalId={goal.id} inline />
                    ) : null}
                    <span className={styles.cardTitle}>{goal.title}</span>
                  </div>
                  <div className={styles.cardBadges}>
                    <GoalCheckInButton
                      goalId={goal.id}
                      isCompleted={goal.status === "completed"}
                    />
                  </div>
                </div>
                <p className={styles.cardMeta}>
                  Target Date:{" "}
                  {goal.targetDate
                    ? formatDateOnly(goal.targetDate)
                    : "None"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
