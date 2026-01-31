import { Router } from "express";
import db from "../db";

const router = Router();

// GET /goals
router.get("/", async (req, res) => {
  const userId = req.userId!;

  try {
    const result = await db.query(
      `
      SELECT id, user_id, title, target_date, status, created_at
      FROM goals
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [userId]
    );

    const goals = result.rows.map((row) => ({
      id: row.id,
      userId: row.user_id,
      title: row.title,
      targetDate: row.target_date,
      status: row.status,
      createdAt: row.created_at,
    }));

    return res.status(200).json(goals);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("List goals failed:", error);
    return res.status(500).json({ error: "Failed to list goals." });
  }
});

// POST /goals
router.post("/", async (req, res) => {
  const { title, targetDate } = req.body as {
    title?: string;
    targetDate?: string;
  };

  if (!title || title.trim().length === 0) {
    return res.status(400).json({ error: "Title is required." });
  }

  const userId = req.userId!;
  const trimmedTargetDate = targetDate?.trim() || null;

  try {
    const result = await db.query(
      `
      INSERT INTO goals (user_id, title, target_date)
      VALUES ($1, $2, $3)
      RETURNING id, user_id, title, target_date, status, created_at
      `,
      [userId, title.trim(), trimmedTargetDate]
    );

    const row = result.rows[0];
    const goal = {
      id: row.id,
      userId: row.user_id,
      title: row.title,
      targetDate: row.target_date,
      status: row.status,
      createdAt: row.created_at,
    };

    return res.status(201).json(goal);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Create goal failed:", error);
    return res.status(500).json({ error: "Failed to create goal." });
  }
});

// PATCH /goals/:id
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body as { status?: string };
  const userId = req.userId!;

  if (!id) {
    return res.status(400).json({ error: "Goal id is required." });
  }

  if (!status || !["active", "paused", "completed"].includes(status)) {
    return res.status(400).json({ error: "Invalid status." });
  }

  try {
    const result = await db.query(
      `
      UPDATE goals
      SET status = $1
      WHERE id = $2
        AND user_id = $3
      RETURNING id, user_id, title, target_date, status, created_at
      `,
      [status, id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Goal not found." });
    }

    const row = result.rows[0];
    const goal = {
      id: row.id,
      userId: row.user_id,
      title: row.title,
      targetDate: row.target_date,
      status: row.status,
      createdAt: row.created_at,
    };

    return res.status(200).json(goal);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Update goal status failed:", error);
    return res.status(500).json({ error: "Failed to update goal." });
  }
});

// DELETE /goals/:id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const userId = req.userId!;

  if (!id) {
    return res.status(400).json({ error: "Goal id is required." });
  }

  try {
    const result = await db.query(
      `
      DELETE FROM goals
      WHERE id = $1
        AND user_id = $2
      RETURNING id
      `,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Goal not found." });
    }

    return res.status(204).send();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Delete goal failed:", error);
    return res.status(500).json({ error: "Failed to delete goal." });
  }
});

export default router;
