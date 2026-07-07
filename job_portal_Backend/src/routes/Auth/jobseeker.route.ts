import { Router } from "express";
import { jobSeekerController } from "../../controllers/auth/jobseeker.controller";
import { requireAuth, requireRole } from "../../middleware/auth.middleware";
import { UserRole } from "../../types/Auth/auth.type";

const router = Router();

// GET /api/job-seekers/me — used by the seeker dashboard for profile
// completeness, verification status, and computing recommended-job matches.
router.get("/me", requireAuth, requireRole(UserRole.JOB_SEEKER), jobSeekerController.getMyProfile);

export default router;