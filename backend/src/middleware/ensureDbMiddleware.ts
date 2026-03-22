import { Request, Response, NextFunction } from "express";
import { ensureDbReady } from "../db/ensureDb";

/** Paths that must not wait on the database */
function skipsDb(path: string): boolean {
  if (path === "/" || path === "/favicon.ico") return true;
  if (path === "/api/test" || path === "/api/health") return true;
  return false;
}

/**
 * Runs before /api/* data routes. Skips instant routes (test, health, root).
 */
export function ensureDbMiddleware(req: Request, res: Response, next: NextFunction): void {
  const path = req.path || "/";
  if (skipsDb(path)) {
    next();
    return;
  }
  ensureDbReady().then(() => next()).catch(next);
}
