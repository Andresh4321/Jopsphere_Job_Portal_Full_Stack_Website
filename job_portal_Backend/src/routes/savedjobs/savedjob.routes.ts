import { Router } from "express";
import { savedJobController } from "../../controllers/savedjob/savedjob.controllers";
import { requireAuth, requireRole } from "../../middleware/auth.middleware";
import { UserRole } from "../../types/Auth/auth.type";

const router = Router();

// POST /api/jobs/:jobId/save
router.post("/jobs/:jobId/save", requireAuth, requireRole(UserRole.JOB_SEEKER), savedJobController.saveJob);

// DELETE /api/jobs/:jobId/save
router.delete("/jobs/:jobId/save", requireAuth, requireRole(UserRole.JOB_SEEKER), savedJobController.unsaveJob);

// GET /api/jobs/:jobId/save-status
router.get("/jobs/:jobId/save-status", requireAuth, requireRole(UserRole.JOB_SEEKER), savedJobController.isJobSaved);

// GET /api/saved-jobs/me
router.get("/saved-jobs/me", requireAuth, requireRole(UserRole.JOB_SEEKER), savedJobController.getMySavedJobs);

export default router;