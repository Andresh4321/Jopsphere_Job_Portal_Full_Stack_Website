import { Router } from "express";
import { companyController } from "../../controllers/company/company.controller";
import { requireAuth, requireRole } from "../../middleware/auth.middleware";
import { UserRole } from "../../types/Auth/auth.type";
import { employerUpdateUpload } from "../../middleware/upload.middleware";

const router = Router();

// GET /api/companies/me
// Auth: Bearer token required, employer only. Used by the Post Job page
// to resolve the logged-in employer's companyId.
router.get("/me", requireAuth, requireRole(UserRole.EMPLOYER), companyController.getMyCompany);

// PATCH /api/companies/me
// multipart/form-data: any subset of company fields, plus optional companyLogo.
router.patch(
  "/me",
  requireAuth,
  requireRole(UserRole.EMPLOYER),
  employerUpdateUpload,
  companyController.updateMyCompany
);

// GET /api/companies
// Public. Company directory listing, each with a real open-roles count.
router.get("/", companyController.listAllCompanies);

// GET /api/companies/:companyId/profile
// Public. Full company profile page: company info + real open roles +
// real stats (response rate, avg reply, hires) computed from Application records.
router.get("/:companyId/profile", companyController.getCompanyProfile);

// GET /api/companies/:companyId
// Public. Used when a job seeker clicks through from a job listing to
// view the company that posted it.
router.get("/:companyId", companyController.getCompanyByPublicId);

export default router;