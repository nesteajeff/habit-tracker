import { Request, Router } from "express";
import db from "../db";

const router = Router();

const getCookieOptions = (req: Request) => {
  const origin = req.headers.origin ?? "";
  const isLocalOrigin =
    origin.includes("localhost") || origin.includes("127.0.0.1");
  const sameSite = isLocalOrigin ? "lax" : "none";

  return {
    httpOnly: true,
    sameSite,
    secure: sameSite === "none",
  } as const;
};

// POST /auth/login
router.post("/login", async (req, res) => {
  const { email } = req.body as { email?: string };

  if (!email || email.trim().length === 0) {
    return res.status(400).json({ error: "Email is required." });
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const existing = await db.query(
      `
      SELECT id, email
      FROM users
      WHERE email = $1
      `,
      [normalizedEmail]
    );

    let user = existing.rows[0];

    if (!user) {
      const created = await db.query(
        `
        INSERT INTO users (email, password_hash)
        VALUES ($1, $2)
        RETURNING id, email
        `,
        [normalizedEmail, "demo"]
      );
      user = created.rows[0];
    }

    res.cookie("user_id", user.id, getCookieOptions(req));

    return res.status(200).json({ id: user.id, email: user.email });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Login failed:", error);
    return res.status(500).json({ error: "Login failed." });
  }
});

// POST /auth/logout
router.post("/logout", (req, res) => {
  res.clearCookie("user_id", getCookieOptions(req));
  return res.status(200).json({ ok: true });
});

export default router;
