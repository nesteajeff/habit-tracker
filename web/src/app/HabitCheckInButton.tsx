"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

type Props = {
  habitId: string;
  hasCheckedInToday: boolean;
};

const getApiBaseUrl = () =>
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

export default function HabitCheckInButton({
  habitId,
  hasCheckedInToday,
}: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckIn = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${getApiBaseUrl()}/habits/${habitId}/check-in`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to check in.");
      }

      router.refresh();
      window.dispatchEvent(
        new CustomEvent("habit:checked-in", { detail: { habitId } })
      );
    } catch (submitError) {
      setError((submitError as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.checkIn}>
      <button
        className={styles.checkInButton}
        type="button"
        onClick={handleCheckIn}
        disabled={isSubmitting || hasCheckedInToday}
      >
        {hasCheckedInToday
          ? "Checked in"
          : isSubmitting
            ? "Checking in..."
            : "Check in"}
      </button>
      {error ? <span className={styles.checkInError}>{error}</span> : null}
    </div>
  );
}
