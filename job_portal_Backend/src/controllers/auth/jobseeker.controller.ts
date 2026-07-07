import { Response, NextFunction } from "express";
import { jobSeekerService } from "../../services/jobseeker/jobseeker.service";
import { HttpError } from "../../errors/http_error";
import { AuthenticatedRequest } from "../../types/Auth/auth.type";

export const jobSeekerController = {
  async getMyProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new HttpError(401, "Not authenticated.");
      const profile = await jobSeekerService.getMyProfile(req.user.userId);
      return res.status(200).json({ success: true, data: profile });
    } catch (error) {
      next(error);
    }
  },
};