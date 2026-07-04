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

  async getCompanyByPublicId(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const companyId = String(req.params.companyId);
      const company = await companyService.getCompanyByPublicId(companyId);
      return res.status(200).json({ success: true, data: company });
    } catch (error) {
      next(error);
    }
  },
};