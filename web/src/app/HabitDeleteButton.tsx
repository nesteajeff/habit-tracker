"use client";

import { useState } from "react";
import styles from "./page.module.css";

type Props = {
  habitId: string;
  inline?: boolean;
};

const getApiBaseUrl = () =>
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

export default function HabitDeleteButton({ habitId, inline = false }: Props) {
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
    <div
      className={`${styles.deleteRow} ${inline ? styles.deleteRowInline : ""}`}
    >
      <button
        className={`${styles.deleteButton} ${
          isSubmitting ? styles.deleteButtonActive : ""
        }`}
        type="button"
        onClick={handleDelete}
        disabled={isSubmitting}
        aria-label="Delete habit"
      >
        {isSubmitting ? "…" : "×"}
      </button>
      {error ? <span className={styles.deleteError}>{error}</span> : null}
    </div>
  );
}
