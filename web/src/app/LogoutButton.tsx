"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

const getApiBaseUrl = () =>
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

export default function LogoutButton() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(`${getApiBaseUrl()}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Logout failed.");
      }

      router.push("/login");
      router.refresh();
    } catch (submitError) {
      setError((submitError as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.logout}>
      <button
        className={styles.logoutButton}
        type="button"
        onClick={handleLogout}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Logging out..." : "Log Out"}
      </button>
      {error ? <span className={styles.logoutError}>{error}</span> : null}
    </div>
  );
}
