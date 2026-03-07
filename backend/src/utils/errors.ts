import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { ValidationError as SequelizeValidationError } from "sequelize";

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError | ZodError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: "Validation error",
      details: err.errors.map((e: any) => ({
        path: e.path.join("."),
        message: e.message,
      })),
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
  }

  if (err instanceof SequelizeValidationError) {
    return res.status(400).json({
      success: false,
      error: "Validation error",
      details: err.errors.map((e) => ({
        path: e.path,
        message: e.message,
      })),
    });
  }

  const message = err instanceof Error ? err.message : String(err);
  if (
    typeof message === "string" &&
    (message.includes("does not exist") || message.includes("relation") || message.includes("column"))
  ) {
    console.error("Database schema error (run migration?):", err);
    return res.status(503).json({
      success: false,
      error:
        "Database schema is missing or outdated. Run the migration: from backend folder run 'npm run db:migrate' then restart the server.",
    });
  }

  console.error("Unexpected error:", err);
  return res.status(500).json({
    success: false,
    error: "Internal server error",
  });
};
