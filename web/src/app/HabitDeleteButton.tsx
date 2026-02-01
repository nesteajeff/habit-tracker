"use client";

import { useState } from "react";
import styles from "./page.module.css";

type Props = {
  habitId: string;
};

const getApiBaseUrl = () =>
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

export default function HabitDeleteButton({ habitId }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(`${getApiBaseUrl()}/habits/${habitId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete habit.");
      }

      window.dispatchEvent(new Event("habits:updated"));
    } catch (deleteError) {
      setError((deleteError as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.deleteRow}>
      <button
        className={styles.deleteButton}
        type="button"
        onClick={handleDelete}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Deleting..." : "Delete"}
      </button>
      {error ? <span className={styles.deleteError}>{error}</span> : null}
    </div>
  );
}
