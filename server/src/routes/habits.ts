import { Router } from "express";
import db from "../db";

const router = Router();

const toDateStringUtc = (date: Date) => date.toISOString().slice(0, 10);

const calculateCurrentStreak = (dates: string[]) => {
  if (dates.length === 0) return 0;

  const set = new Set(dates);
  let streak = 0;
  let cursor = new Date();

  while (true) {
    const key = toDateStringUtc(cursor);
    if (!set.has(key)) break;
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  return streak;
};

// GET /habits
router.get("/", async (_req, res) => {
  // TODO: replace hardcoded userId once auth is added.
  const userId = "00000000-0000-0000-0000-000000000000";
  const todayUtc = toDateStringUtc(new Date());

  try {
    const result = await db.query(
      `
      SELECT
        h.id,
        h.user_id,
        h.name,
        h.description,
        h.is_active,
        h.created_at,
        (
          SELECT MAX(he.entry_date)
          FROM habit_entries he
          WHERE he.habit_id = h.id
        ) AS last_entry_date,
        EXISTS (
          SELECT 1
          FROM habit_entries he
          WHERE he.habit_id = h.id
            AND he.entry_date = $2
        ) AS has_checked_in_today
      FROM habits h
      WHERE h.user_id = $1
      ORDER BY h.created_at DESC
      `,
      [userId, todayUtc]
    );

    const habits = result.rows.map((row) => ({
      id: row.id,
      userId: row.user_id,
      name: row.name,
      description: row.description,
      isActive: row.is_active,
      createdAt: row.created_at,
      lastEntryDate: row.last_entry_date,
      hasCheckedInToday: row.has_checked_in_today,
    }));

    return res.status(200).json(habits);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("List habits failed:", error);
    return res.status(500).json({ error: "Failed to list habits." });
  }
});

// POST /habits
router.post("/", async (req, res) => {
  const { name, description } = req.body as {
    name?: string;
    description?: string;
  };

  if (!name || name.trim().length === 0) {
    return res.status(400).json({ error: "Name is required." });
  }

  // TODO: replace hardcoded userId once auth is added.
  const userId = "00000000-0000-0000-0000-000000000000";
  const trimmedDescription = description?.trim() ?? null;

  try {
    const result = await db.query(
      `
      INSERT INTO habits (user_id, name, description)
      VALUES ($1, $2, $3)
      RETURNING id, user_id, name, description, is_active, created_at
      `,
      [userId, name.trim(), trimmedDescription]
    );

    const row = result.rows[0];
    const habit = {
      id: row.id,
      userId: row.user_id,
      name: row.name,
      description: row.description,
      isActive: row.is_active,
      createdAt: row.created_at,
    };

    return res.status(201).json(habit);
  } catch (error) {
    // Log the real error for debugging during development.
    // eslint-disable-next-line no-console
    console.error("Create habit failed:", error);
    return res.status(500).json({ error: "Failed to create habit." });
  }
});

// POST /habits/:id/check-in
router.post("/:id/check-in", async (req, res) => {
  const { id } = req.params;
  const { entryDate } = req.body as { entryDate?: string };

  if (!id) {
    return res.status(400).json({ error: "Habit id is required." });
  }

  // Default to today's date in UTC (YYYY-MM-DD).
  const todayUtc = new Date().toISOString().slice(0, 10);
  const dateToUse = entryDate ?? todayUtc;

  try {
    const result = await db.query(
      `
      INSERT INTO habit_entries (habit_id, entry_date)
      VALUES ($1, $2)
      RETURNING id, habit_id, entry_date, created_at
      `,
      [id, dateToUse]
    );

    const row = result.rows[0];
    const entry = {
      id: row.id,
      habitId: row.habit_id,
      entryDate: row.entry_date,
      createdAt: row.created_at,
    };

    return res.status(201).json(entry);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Check-in failed:", error);
    return res.status(500).json({ error: "Failed to create check-in." });
  }
});

// GET /habits/:id/entries
router.get("/:id/entries", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Habit id is required." });
  }

  try {
    const result = await db.query(
      `
      SELECT id, habit_id, entry_date, created_at
      FROM habit_entries
      WHERE habit_id = $1
      ORDER BY entry_date DESC
      `,
      [id]
    );

    const entries = result.rows.map((row) => ({
      id: row.id,
      habitId: row.habit_id,
      entryDate: row.entry_date,
      createdAt: row.created_at,
    }));

    return res.status(200).json(entries);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("List entries failed:", error);
    return res.status(500).json({ error: "Failed to list entries." });
  }
});

// GET /habits/:id/streak
router.get("/:id/streak", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Habit id is required." });
  }

  try {
    const result = await db.query(
      `
      SELECT entry_date
      FROM habit_entries
      WHERE habit_id = $1
      `,
      [id]
    );

    const dates = result.rows.map((row) =>
      typeof row.entry_date === "string"
        ? row.entry_date
        : toDateStringUtc(row.entry_date)
    );

    const currentStreak = calculateCurrentStreak(dates);

    return res.status(200).json({ habitId: id, currentStreak });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Get streak failed:", error);
    return res.status(500).json({ error: "Failed to calculate streak." });
  }
});

export default router;
