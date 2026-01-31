import { cookies } from "next/headers";
import styles from "../page.module.css";
import GoalForm from "./GoalForm";
import GoalStatusSelect from "./GoalStatusSelect";
import LogoutButton from "../LogoutButton";

type Goal = {
  id: string;
  userId: string;
  title: string;
  targetDate: string | null;
  status: string;
  createdAt: string;
};

const formatRelativeDateTime = (value: string) => {
  const date = new Date(value);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  const formatter = new Intl.RelativeTimeFormat(undefined, {
    numeric: "auto",
  });

  if (Math.abs(diffDays) >= 1) {
    return formatter.format(diffDays, "day");
  }

  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  if (Math.abs(diffHours) >= 1) {
    return formatter.format(diffHours, "hour");
  }

  const diffMinutes = Math.round(diffMs / (1000 * 60));
  if (Math.abs(diffMinutes) >= 1) {
    return formatter.format(diffMinutes, "minute");
  }

  return "just now";
};

const formatRelativeDateOnly = (value: string) => {
  const dateOnly = value.includes("T") ? value.slice(0, 10) : value;
  const [year, month, day] = dateOnly.split("-").map(Number);
  if (!year || !month || !day) {
    return "unknown";
  }
  const date = new Date(year, month - 1, day);
  const now = new Date();

  const dateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const nowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffMs = dateStart.getTime() - nowStart.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  const formatter = new Intl.RelativeTimeFormat(undefined, {
    numeric: "auto",
  });

  if (!Number.isFinite(diffDays)) {
    return "unknown";
  }

  return formatter.format(diffDays, "day");
};

const fetchGoals = async (cookieHeader: string): Promise<Goal[]> => {
  const baseUrl = process.env.API_BASE_URL ?? "http://localhost:3001";
  const response = await fetch(`${baseUrl}/goals`, {
    cache: "no-store",
    headers: cookieHeader ? { cookie: cookieHeader } : undefined,
  });

  if (!response.ok) {
    throw new Error("Failed to load goals.");
  }

  return response.json();
};

export default async function GoalsPage() {
  let goals: Goal[] = [];
  let errorMessage: string | null = null;

  try {
    const cookieHeader = (await cookies()).toString();
    goals = await fetchGoals(cookieHeader);
  } catch (error) {
    errorMessage = (error as Error).message;
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerRow}>
            <div>
              <h1 className={styles.title}>Goals</h1>
              <p className={styles.subtitle}>
                This page loads goals from the Express API.
              </p>
            </div>
            <div className={styles.nav}>
              <a className={styles.navLink} href="/">
                Habits
              </a>
              <a className={styles.navLink} href="/goals">
                Goals
              </a>
              <LogoutButton />
            </div>
          </div>
        </header>

        <GoalForm />

        {errorMessage ? (
          <p className={styles.error}>
            {errorMessage} <a className={styles.link} href="/login">Log in</a>
          </p>
        ) : (
          <ul className={styles.list}>
            {goals.map((goal) => (
              <li key={goal.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardTitle}>{goal.title}</span>
                  <span className={styles.badge}>{goal.status}</span>
                </div>
                <p className={styles.cardMeta}>
                  Created {formatRelativeDateTime(goal.createdAt)}
                </p>
                <p className={styles.cardMeta}>
                  Target{" "}
                  {goal.targetDate
                    ? formatRelativeDateOnly(goal.targetDate)
                    : "No target date"}
                </p>
                <GoalStatusSelect
                  goalId={goal.id}
                  currentStatus={goal.status}
                />
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
