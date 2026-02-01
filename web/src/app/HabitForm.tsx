"use client";

import { useState } from "react";
import styles from "./page.module.css";

const getApiBaseUrl = () =>
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

export default function HabitForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (
    event: React.SyntheticEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${getApiBaseUrl()}/habits`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create habit.");
      }

      setName("");
      setDescription("");
      window.dispatchEvent(new Event("habits:updated"));
    } catch (submitError) {
      setError((submitError as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="habit-name">
          Habit name
        </label>
        <input
          id="habit-name"
          className={styles.input}
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Drink water"
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="habit-description">
          Description (optional)
        </label>
        <input
          id="habit-description"
          className={styles.input}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="At least 8 cups"
        />
      </div>

      {error ? <p className={styles.error}>{error}</p> : null}

      <button className={styles.button} type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create habit"}
      </button>
    </form>
  );
}
