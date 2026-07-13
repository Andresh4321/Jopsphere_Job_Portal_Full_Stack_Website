import { Router } from "express";
import { jobSeekerController } from "../../controllers/auth/jobseeker.controller";
import { requireAuth, requireRole } from "../../middleware/auth.middleware";
import { UserRole } from "../../types/Auth/auth.type";
import { jobSeekerUpdateUpload } from "../../middleware/upload.middleware";

const router = Router();

// GET /api/job-seekers/me
router.get("/me", requireAuth, requireRole(UserRole.JOB_SEEKER), jobSeekerController.getMyProfile);

// PATCH /api/job-seekers/me
// multipart/form-data: any subset of profile fields, plus optional
// profileImage (single) and qualificationImages (up to 5, appended).
router.patch(
  "/me",
  requireAuth,
  requireRole(UserRole.JOB_SEEKER),
  jobSeekerUpdateUpload,
  jobSeekerController.updateMyProfile
);

export default router;