"use client";

import { useState } from "react";
import styles from "../page.module.css";

type Props = {
  goalId: string;
  isCompleted: boolean;
};

const getApiBaseUrl = () =>
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

export default function GoalCheckInButton({ goalId, isCompleted }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleComplete = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(`${getApiBaseUrl()}/goals/${goalId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ status: "completed" }),
      });

      if (!response.ok) {
        throw new Error("Failed to update goal.");
      }

      window.dispatchEvent(new Event("goals:updated"));
    } catch (submitError) {
      setError((submitError as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.checkIn}>
      <button
        className={`${styles.checkInButton} ${
          isCompleted ? styles.checkInButtonChecked : ""
        }`}
        type="button"
        onClick={handleComplete}
        disabled={isSubmitting || isCompleted}
        aria-label={isCompleted ? "Goal completed" : "Mark goal completed"}
      >
        {isSubmitting ? "…" : "✓"}
      </button>
      {error ? <span className={styles.checkInError}>{error}</span> : null}
    </div>
  );
}
