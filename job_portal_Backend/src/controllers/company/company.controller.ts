import { Response, NextFunction } from "express";
import { companyService } from "../../services/company/company.service";
import { HttpError } from "../../errors/http_error";
import { AuthenticatedRequest } from "../../types/Auth/auth.type";

export const companyController = {
  async getMyCompany(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new HttpError(401, "Not authenticated.");
      }
      const company = await companyService.getMyCompany(req.user.userId);
      return res.status(200).json({ success: true, data: company });
    } catch (error) {
      next(error);
    }
  },

  async updateMyCompany(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new HttpError(401, "Not authenticated.");

      const dto = {
        companyName: req.body.companyName,
        industry: req.body.industry,
        headquarters: req.body.headquarters,
        companyWebsite: req.body.companyWebsite,
        aboutCompany: req.body.aboutCompany,
        whyChooseUs: req.body.whyChooseUs,
      };

      const files = req.files as { companyLogo?: Express.Multer.File[] };
      const newLogoPath = files?.companyLogo?.[0]
        ? `/company_logos/${files.companyLogo[0].filename}`
        : null;

      const company = await companyService.updateMyCompany(req.user.userId, dto, newLogoPath);
      return res.status(200).json({ success: true, message: "Company profile updated.", data: company });
    } catch (error) {
      next(error);
    }
  },

  async getCompanyByPublicId(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const companyId = String(req.params.companyId);
      const company = await companyService.getCompanyByPublicId(companyId);
      return res.status(200).json({ success: true, data: company });
    } catch (error) {
      next(error);
    }
  },

  async listAllCompanies(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const companies = await companyService.listAllCompanies();
      return res.status(200).json({ success: true, data: companies });
    } catch (error) {
      next(error);
    }
  },

  async getCompanyProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const companyId = String(req.params.companyId);
      const profile = await companyService.getCompanyProfile(companyId);
      return res.status(200).json({ success: true, data: profile });
    } catch (error) {
      next(error);
    }
  },
};