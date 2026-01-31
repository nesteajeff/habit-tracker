import { NextFunction, Request, Response } from "express";

export default function requireUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = req.header("x-user-id") ?? req.cookies?.user_id;

  if (!userId) {
    return res.status(401).json({ error: "Missing user id." });
  }

  req.userId = userId;
  return next();
}
