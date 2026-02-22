import { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service";
import { registerBodySchema, loginBodySchema } from "../utils/validation";

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = registerBodySchema.parse(req.body);
    const data = await authService.register(body.email, body.password, body.name);
    res.status(201).json({ success: true, data });
  } catch (e: unknown) {
    const err = e as Error;
    if (err.message === "Email already registered") {
      res.status(400).json({ success: false, error: err.message });
      return;
    }
    next(e);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = loginBodySchema.parse(req.body);
    const data = await authService.login(body.email, body.password);
    res.json({ success: true, data });
  } catch (e: unknown) {
    const err = e as Error;
    if (err.message === "Invalid email or password") {
      res.status(401).json({ success: false, error: err.message });
      return;
    }
    next(e);
  }
};
