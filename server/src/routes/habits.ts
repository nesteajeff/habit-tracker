import { Router } from "express";
import db from "../db";

const router = Router();

// GET /habits
router.get("/", async (_req, res) => {
  // TODO: replace hardcoded userId once auth is added.
  const userId = "00000000-0000-0000-0000-000000000000";

  try {
    const result = await db.query(
      `
      SELECT id, user_id, name, description, is_active, created_at
      FROM habits
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [userId]
    );

    const habits = result.rows.map((row) => ({
      id: row.id,
      userId: row.user_id,
      name: row.name,
      description: row.description,
      isActive: row.is_active,
      createdAt: row.created_at,
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

export default router;
