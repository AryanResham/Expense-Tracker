import type { Request, Response, NextFunction } from "express";
import { firebaseAdmin } from "../services/firebaseAdmin.js"

export async function verifySession(req: Request, res: Response, next: NextFunction) {
  try {
    const cookie = req.cookies?.session
    const userId = req.cookies?.userId
    if (!cookie) return res.status(401).json({ error: "No session" })
    const decoded = await firebaseAdmin.auth().verifySessionCookie(cookie, true); // checks revocation
    (req as any).user = { ...decoded, id: userId }; // uid, email, custom claims
    (req as any).userId = userId;
    next()
  } catch (e) {
    res.status(401).json({ error: "Invalid session" })
  }
}