import { Router } from "express";
import { companyController } from "../../controllers/company/company.controller";
import { requireAuth, requireRole } from "../../middleware/auth.middleware";
import { UserRole } from "../../types/Auth/auth.type";

const router = Router();

// GET /api/companies/me
// Auth: Bearer token required, employer only. Used by the Post Job page
// to resolve the logged-in employer's companyId.
router.get("/me", requireAuth, requireRole(UserRole.EMPLOYER), companyController.getMyCompany);

// GET /api/companies/:companyId
// Public. Used when a job seeker clicks through from a job listing to
// view the company that posted it.
router.get("/:companyId", companyController.getCompanyByPublicId);

export default router;