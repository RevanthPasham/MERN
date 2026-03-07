import { Request, Response, NextFunction } from "express";
import * as adminAuthService from "../services/adminAuth.service";

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Email and password required" });
    }
    const data = await adminAuthService.adminLogin(
      String(email).trim(),
      String(password)
    );
    return res.json({ success: true, data });
  } catch (e: unknown) {
    const err = e as Error;
    if (err.message === "Invalid email or password") {
      return res.status(401).json({ success: false, error: err.message });
    }
    next(e);
  }
}
