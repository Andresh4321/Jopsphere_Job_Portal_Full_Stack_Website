import { Router } from "express";
import { applicationController } from "../../controllers/application/application.controller";
import { requireAuth, requireRole } from "../../middleware/auth.middleware";
import { UserRole } from "../../types/Auth/auth.type";

const router = Router();

// POST /api/jobs/:jobId/apply — job seeker applies to a job
router.post(
  "/jobs/:jobId/apply",
  requireAuth,
  requireRole(UserRole.JOB_SEEKER),
  applicationController.applyToJob
);

// GET /api/applications/me — seeker's own "My Applications" page
router.get(
  "/applications/me",
  requireAuth,
  requireRole(UserRole.JOB_SEEKER),
  applicationController.getMyApplications
);

// GET /api/jobs/:jobId/applicants — employer viewing applicants for one job
router.get(
  "/jobs/:jobId/applicants",
  requireAuth,
  requireRole(UserRole.EMPLOYER),
  applicationController.getApplicantsForJob
);

// GET /api/applicants/me — employer's applicants across all their jobs (dashboard)
router.get(
  "/applicants/me",
  requireAuth,
  requireRole(UserRole.EMPLOYER),
  applicationController.getApplicantsForEmployer
);

// GET /api/applicants/stats — stage counts for employer dashboard/pipeline
router.get(
  "/applicants/stats",
  requireAuth,
  requireRole(UserRole.EMPLOYER),
  applicationController.getStageCounts
);

// PATCH /api/applications/:applicationId/stage — employer moves an applicant's stage
router.patch(
  "/applications/:applicationId/stage",
  requireAuth,
  requireRole(UserRole.EMPLOYER),
  applicationController.updateStage
);

export default router;