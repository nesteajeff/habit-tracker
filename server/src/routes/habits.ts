import { Router } from "express";

const router = Router();

// POST /habits
router.post("/", (req, res) => {
  const { name, description } = req.body as {
    name?: string;
    description?: string;
  };

  if (!name || name.trim().length === 0) {
    return res.status(400).json({ error: "Name is required." });
  }

  // Placeholder: database insert will go here.
  const habit = {
    id: "uuid",
    userId: "uuid",
    name: name.trim(),
    description: description?.trim() ?? null,
    isActive: true,
    createdAt: new Date().toISOString(),
  };

  return res.status(201).json(habit);
});

export default router;
