import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest, JwtPayload, UserRole } from "../types/Auth/auth.type";
import { HttpError } from "../errors/http_error";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

// Verifies the Bearer token and attaches the decoded payload to req.user.
export const requireAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new HttpError(401, "Missing or malformed Authorization header.");
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof HttpError) return next(error);
    next(new HttpError(401, "Invalid or expired token."));
  }
};

// Restricts a route to a specific role (e.g. only employers can post jobs).
export const requireRole = (role: UserRole) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new HttpError(401, "Not authenticated."));
    }
    if (req.user.role !== role) {
      return next(new HttpError(403, `Only ${role} accounts can access this resource.`));
    }
    next();
  };
};