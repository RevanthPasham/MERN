import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-change-in-production";

export interface AuthRequest extends Request {
  userId?: string;
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    req.userId = payload.userId;
    next();
  } catch {
    return res.status(401).json({ success: false, error: "Invalid or expired token" });
  }
}

/** Optional auth: sets req.userId if valid token, does not block if missing */
export function optionalAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) {
    next();
    return;
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    req.userId = payload.userId;
  } catch {
    // ignore invalid token
  }
  next();
}

/** Admin auth: JWT must contain role and adminId (from admin login) */
export type AdminRole = "super_admin" | "sub_admin" | "admin";

export interface AdminRequest extends Request {
  adminId?: string;
  adminRole?: AdminRole;
}

export function requireAdmin(req: AdminRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { adminId?: string; role?: string };
    const adminRoles: AdminRole[] = ["super_admin", "admin", "sub_admin"];
    if (!payload.adminId || !payload.role || !adminRoles.includes(payload.role as AdminRole)) {
      return res.status(403).json({ success: false, error: "Admin access required" });
    }
    req.adminId = payload.adminId;
    req.adminRole = payload.role as AdminRole;
    next();
  } catch {
    return res.status(401).json({ success: false, error: "Invalid or expired token" });
  }
}

/** Require one of the given roles. Must be used after requireAdmin. */
export function requireRole(allowed: AdminRole[]) {
  return (req: AdminRequest, res: Response, next: NextFunction) => {
    if (!req.adminRole || !allowed.includes(req.adminRole)) {
      return res.status(403).json({ success: false, error: "Insufficient permissions" });
    }
    next();
  };
}
