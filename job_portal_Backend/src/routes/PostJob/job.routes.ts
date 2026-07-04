import { Router } from "express";
import { jobController } from "../../controllers/PostJob/job.controller";
import { requireAuth, requireRole } from "../../middleware/auth.middleware";
import { UserRole } from "../../types/Auth/auth.type";

const router = Router();

// POST /api/jobs
// Auth: Bearer token required, must be an employer.
// JSON body matches the Job interface (companyId + all job fields).
router.post("/", requireAuth, requireRole(UserRole.EMPLOYER), jobController.createJob);

// GET /api/jobs?status=open&workType=full_time
router.get("/", jobController.listAllJobs);

// GET /api/jobs/company/:companyId
router.get("/company/:companyId", jobController.getJobsByCompany);

// GET /api/jobs/:jobId
router.get("/:jobId", jobController.getJobById);

// PATCH /api/jobs/:jobId
// Auth: Bearer token required, must be the employer who owns the job.
router.patch("/:jobId", requireAuth, requireRole(UserRole.EMPLOYER), jobController.updateJob);

// PATCH /api/jobs/:jobId/close
router.patch("/:jobId/close", requireAuth, requireRole(UserRole.EMPLOYER), jobController.closeJob);

// DELETE /api/jobs/:jobId
// Auth: Bearer token required, must be the employer who owns the job.
router.delete("/:jobId", requireAuth, requireRole(UserRole.EMPLOYER), jobController.deleteJob);

export default router;