"use client";

import { useState } from "react";
import styles from "../page.module.css";

const getApiBaseUrl = () =>
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

export default function GoalForm() {
  const [title, setTitle] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (
    event: React.SyntheticEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${getApiBaseUrl()}/goals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title: title.trim(),
          targetDate: targetDate.trim() || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create goal.");
      }

      setTitle("");
      setTargetDate("");
      window.dispatchEvent(new Event("goals:updated"));
    } catch (submitError) {
      setError((submitError as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="goal-title">
          Goal Title
        </label>
        <input
          id="goal-title"
          className={styles.input}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="goal-target-date">
          Target Date (optional)
        </label>
        <input
          id="goal-target-date"
          className={styles.input}
          type="date"
          value={targetDate}
          onChange={(event) => setTargetDate(event.target.value)}
        />
      </div>

      {error ? <p className={styles.error}>{error}</p> : null}

      <button className={styles.button} type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Goal"}
      </button>
    </form>
  );
}
