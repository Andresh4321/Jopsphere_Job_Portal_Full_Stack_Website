import { Response, NextFunction } from "express";
import { applicationService } from "../../services/application/application.services";
import { HttpError } from "../../errors/http_error";
import { AuthenticatedRequest } from "../../types/Auth/auth.type";
import { CreateApplicationDto, UpdateApplicationStageDto } from "../../dtos/application/application.dto";

export const applicationController = {
  async applyToJob(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new HttpError(401, "Not authenticated.");
      const jobId = String(req.params.jobId);
      const dto: CreateApplicationDto = { jobId };
      const application = await applicationService.applyToJob(req.user.userId, dto);
      return res.status(201).json({ success: true, message: "Application submitted.", data: application });
    } catch (error) {
      next(error);
    }
  },

  async getMyApplications(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new HttpError(401, "Not authenticated.");
      const applications = await applicationService.getMyApplications(req.user.userId);
      return res.status(200).json({ success: true, data: applications });
    } catch (error) {
      next(error);
    }
  },

  async getApplicantsForJob(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new HttpError(401, "Not authenticated.");
      const jobId = String(req.params.jobId);
      const applicants = await applicationService.getApplicantsForJob(jobId, req.user.userId);
      return res.status(200).json({ success: true, data: applicants });
    } catch (error) {
      next(error);
    }
  },

  async getApplicantsForEmployer(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new HttpError(401, "Not authenticated.");
      const applicants = await applicationService.getApplicantsForEmployer(req.user.userId);
      return res.status(200).json({ success: true, data: applicants });
    } catch (error) {
      next(error);
    }
  },

  async getStageCounts(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new HttpError(401, "Not authenticated.");
      const counts = await applicationService.getStageCountsForEmployer(req.user.userId);
      return res.status(200).json({ success: true, data: counts });
    } catch (error) {
      next(error);
    }
  },

  async updateStage(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new HttpError(401, "Not authenticated.");
      const applicationId = String(req.params.applicationId);
      const dto: UpdateApplicationStageDto = req.body;
      const application = await applicationService.updateStage(applicationId, req.user.userId, dto);
      return res.status(200).json({ success: true, message: "Stage updated.", data: application });
    } catch (error) {
      next(error);
    }
  },
};