import { Request, Response, NextFunction } from "express";
import { HttpError } from "../errors/http_error";
import { MulterError } from "multer";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ success: false, message: err.message });
  }

  if (err instanceof MulterError) {
    return res.status(400).json({ success: false, message: err.message });
  }

  // Mongoose duplicate key error
  if (typeof err === "object" && err !== null && (err as any).code === 11000) {
    return res.status(409).json({ success: false, message: "Duplicate value violates a unique field." });
  }

  console.error(err);
  return res.status(500).json({ success: false, message: "Internal server error." });
};