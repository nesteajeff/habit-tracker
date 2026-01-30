import styles from "./page.module.css";
import HabitForm from "./HabitForm";

type Habit = {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
};

const fetchHabits = async (): Promise<Habit[]> => {
  const baseUrl = process.env.API_BASE_URL ?? "http://localhost:3001";
  const response = await fetch(`${baseUrl}/habits`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load habits.");
  }

  return response.json();
};

export default async function Home() {
  let habits: Habit[] = [];
  let errorMessage: string | null = null;

  try {
    habits = await fetchHabits();
  } catch (error) {
    errorMessage = (error as Error).message;
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>Habit Tracker</h1>
          <p className={styles.subtitle}>
            This page loads habits from the Express API.
          </p>
        </header>

        <HabitForm />

        {errorMessage ? (
          <p className={styles.error}>{errorMessage}</p>
        ) : (
          <ul className={styles.list}>
            {habits.map((habit) => (
              <li key={habit.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardTitle}>{habit.name}</span>
                  <span className={styles.badge}>
                    {habit.isActive ? "Active" : "Paused"}
                  </span>
                </div>
                {habit.description ? (
                  <p className={styles.cardDescription}>
                    {habit.description}
                  </p>
                ) : (
                  <p className={styles.cardDescription}>No description</p>
                )}
                <p className={styles.cardMeta}>
                  Created {new Date(habit.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
