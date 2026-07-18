import { Response, NextFunction } from "express";
import { jobService } from "../../services/PostJob/job.service";
import { HttpError } from "../../errors/http_error";
import { CreateJobDto, UpdateJobDto } from "../../dtos/PostJob/job.dto";
import { AuthenticatedRequest } from "../../types/Auth/auth.type";
import { JobStatus } from "../../types/PostJob/job.type";


export const jobController = {
  async createJob(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.body || Object.keys(req.body).length === 0) {
        throw new HttpError(400, "Request body is empty. Send JSON with Content-Type: application/json.");
      }
      if (!req.user) {
        throw new HttpError(401, "Not authenticated.");
      }

      const dto: CreateJobDto = req.body;
      const job = await jobService.createJob(dto, req.user.userId);

      return res.status(201).json({
        success: true,
        message: "Job posted successfully.",
        data: job,
      });
    } catch (error) {
      next(error);
    }
  },

  async getJobById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const jobId = String(req.params.jobId);
      const job = await jobService.getJobById(jobId);
      return res.status(200).json({ success: true, data: job });
    } catch (error) {
      next(error);
    }
  },

  async getJobsByCompany(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const companyId = String(req.params.companyId);
      const jobs = await jobService.getJobsByCompany(companyId);
      return res.status(200).json({ success: true, data: jobs });
    } catch (error) {
      next(error);
    }
  },

  async listAllJobs(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { status, workType, minSalary, verifiedOnly, sort } = req.query;
      const jobs = await jobService.listAllJobs({
        status: status as JobStatus | undefined,
        workType: workType as string | undefined,
        minSalary: minSalary ? Number(minSalary) : undefined,
        verifiedOnly: verifiedOnly === 'true' || undefined,
        sort: (sort as 'newest' | 'salary_desc') || undefined,
      });
      return res.status(200).json({ success: true, data: jobs });
    } catch (error) {
      next(error);
    }
  },

  async updateJob(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new HttpError(401, "Not authenticated.");
      }
      const jobId = String(req.params.jobId);
      const dto: UpdateJobDto = req.body;
      const job = await jobService.updateJob(jobId, dto, req.user.userId);
      return res.status(200).json({ success: true, message: "Job updated.", data: job });
    } catch (error) {
      next(error);
    }
  },

  async closeJob(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new HttpError(401, "Not authenticated.");
      }
      const jobId = String(req.params.jobId);
      const job = await jobService.closeJob(jobId, req.user.userId);
      return res.status(200).json({ success: true, message: "Job closed.", data: job });
    } catch (error) {
      next(error);
    }
  },

  async deleteJob(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new HttpError(401, "Not authenticated.");
      }
      const jobId = String(req.params.jobId);
      await jobService.deleteJob(jobId, req.user.userId);
      return res.status(200).json({ success: true, message: "Job deleted." });
    } catch (error) {
      next(error);
    }
  },
};