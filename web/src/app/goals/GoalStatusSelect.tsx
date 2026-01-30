"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../page.module.css";

type Props = {
  goalId: string;
  currentStatus: string;
};

const getApiBaseUrl = () =>
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";
const getDemoUserId = () =>
  process.env.NEXT_PUBLIC_DEMO_USER_ID ??
  "00000000-0000-0000-0000-000000000000";

const statuses = ["active", "paused", "completed"] as const;

export default function GoalStatusSelect({ goalId, currentStatus }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = async (nextStatus: string) => {
    setError(null);
    setStatus(nextStatus);
    setIsSubmitting(true);

    try {
      const response = await fetch(`${getApiBaseUrl()}/goals/${goalId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": getDemoUserId(),
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status.");
      }

      router.refresh();
    } catch (submitError) {
      setError((submitError as Error).message);
      setStatus(currentStatus);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.statusRow}>
      <select
        className={styles.select}
        value={status}
        onChange={(event) => handleChange(event.target.value)}
        disabled={isSubmitting}
      >
        {statuses.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error ? <span className={styles.statusError}>{error}</span> : null}
    </div>
  );
}
