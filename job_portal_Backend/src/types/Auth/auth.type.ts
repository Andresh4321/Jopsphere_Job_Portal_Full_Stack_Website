import { Request } from "express";

export enum UserRole {
  JOB_SEEKER = "job_seeker",
  EMPLOYER = "employer",
}

export enum VerificationStatus {
  UNVERIFIED = "unverified",
  VERIFIED = "verified",
}

export interface JwtPayload {
  userId: string;
  role: UserRole;
  email: string;
}

// Extend Express Request so req.user is typed after auth middleware runs
export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

// Shape returned by the multer "fields" upload for job seeker registration
export interface JobSeekerRegisterFiles {
  qualificationImages?: Express.Multer.File[];
}

// Shape returned by the multer "fields" upload for employer registration
export interface EmployerRegisterFiles {
  companyDocument?: Express.Multer.File[];
}