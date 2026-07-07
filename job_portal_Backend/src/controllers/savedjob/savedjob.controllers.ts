import { Response, NextFunction } from "express";
import { savedJobService } from "../../services/savedjobs/savedjobs.service";
import { HttpError } from "../../errors/http_error";
import { AuthenticatedRequest } from "../../types/Auth/auth.type";

export const savedJobController = {
  async saveJob(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new HttpError(401, "Not authenticated.");
      const jobId = String(req.params.jobId);
      const result = await savedJobService.saveJob(req.user.userId, jobId);
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  async unsaveJob(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new HttpError(401, "Not authenticated.");
      const jobId = String(req.params.jobId);
      const result = await savedJobService.unsaveJob(req.user.userId, jobId);
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  async isJobSaved(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new HttpError(401, "Not authenticated.");
      const jobId = String(req.params.jobId);
      const saved = await savedJobService.isJobSaved(req.user.userId, jobId);
      return res.status(200).json({ success: true, data: { saved } });
    } catch (error) {
      next(error);
    }
  },

  async getMySavedJobs(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new HttpError(401, "Not authenticated.");
      const jobs = await savedJobService.getMySavedJobs(req.user.userId);
      return res.status(200).json({ success: true, data: jobs });
    } catch (error) {
      next(error);
    }
  },
};