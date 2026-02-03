import { Request, Router } from "express";
import crypto from "crypto";
import db from "../db";

const router = Router();

const HASH_ALGORITHM = "sha512";
const HASH_ITERATIONS = 100_000;
const HASH_KEYLEN = 64;
const SALT_BYTES = 16;

const hashPassword = (password: string) => {
  const salt = crypto.randomBytes(SALT_BYTES).toString("hex");
  const derivedKey = crypto
    .pbkdf2Sync(password, salt, HASH_ITERATIONS, HASH_KEYLEN, HASH_ALGORITHM)
    .toString("hex");

  return `${salt}:${derivedKey}`;
};

const verifyPassword = (password: string, storedHash: string) => {
  const [salt, expectedHash] = storedHash.split(":");
  if (!salt || !expectedHash) return false;

  const derivedKey = crypto
    .pbkdf2Sync(password, salt, HASH_ITERATIONS, HASH_KEYLEN, HASH_ALGORITHM)
    .toString("hex");

  const expectedBuffer = Buffer.from(expectedHash, "hex");
  const derivedBuffer = Buffer.from(derivedKey, "hex");

  if (expectedBuffer.length !== derivedBuffer.length) return false;

  return crypto.timingSafeEqual(expectedBuffer, derivedBuffer);
};

const normalizeUsername = (username: string) => username.trim().toLowerCase();

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
  const { username, password } = req.body as {
    username?: string;
    password?: string;
  };

  if (!username || username.trim().length === 0) {
    return res.status(400).json({ error: "Username is required." });
  }

  if (!password || password.length === 0) {
    return res.status(400).json({ error: "Password is required." });
  }

  const normalizedUsername = normalizeUsername(username);

  try {
    const existing = await db.query(
      `
      SELECT id, username, password_hash
      FROM users
      WHERE username = $1
      `,
      [normalizedUsername]
    );

    const user = existing.rows[0];

    if (!user || !verifyPassword(password, user.password_hash)) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    res.cookie("user_id", user.id, getCookieOptions(req));

    return res.status(200).json({ id: user.id, username: user.username });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Login failed:", error);
    return res.status(500).json({ error: "Login failed." });
  }
});

// POST /auth/register
router.post("/register", async (req, res) => {
  const { username, password } = req.body as {
    username?: string;
    password?: string;
  };

  if (!username || username.trim().length === 0) {
    return res.status(400).json({ error: "Username is required." });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({
      error: "Password must be at least 6 characters long.",
    });
  }

  const normalizedUsername = normalizeUsername(username);

  try {
    const existing = await db.query(
      `
      SELECT id
      FROM users
      WHERE username = $1
      `,
      [normalizedUsername]
    );

    if (existing.rows[0]) {
      return res.status(409).json({ error: "Username already exists." });
    }

    const passwordHash = hashPassword(password);
    const created = await db.query(
      `
      INSERT INTO users (username, password_hash)
      VALUES ($1, $2)
      RETURNING id, username
      `,
      [normalizedUsername, passwordHash]
    );

    const user = created.rows[0];

    res.cookie("user_id", user.id, getCookieOptions(req));

    return res.status(201).json({ id: user.id, username: user.username });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Registration failed:", error);
    return res.status(500).json({ error: "Registration failed." });
  }
});

// POST /auth/logout
router.post("/logout", (req, res) => {
  res.clearCookie("user_id", getCookieOptions(req));
  return res.status(200).json({ ok: true });
});

export default router;
