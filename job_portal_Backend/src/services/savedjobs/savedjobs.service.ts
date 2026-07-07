import { SavedJobModel } from "../../models/savedjobs/savedjob.model";
import { PostedJobModel } from "../../models/PostJob/postedjob.model";
import { HttpError } from "../../errors/http_error";
import { VerificationStatus } from "../../types/Auth/auth.type";

export const savedJobService = {
  async saveJob(jobSeekerId: string, jobId: string) {
    const job = await PostedJobModel.findById(jobId);
    if (!job) throw new HttpError(404, "Job not found.");

    const existing = await SavedJobModel.findOne({ jobSeekerId, jobId });
    if (existing) return { saved: true }; // idempotent — already saved

    await SavedJobModel.create({ jobSeekerId, jobId });
    return { saved: true };
  },

  async unsaveJob(jobSeekerId: string, jobId: string) {
    await SavedJobModel.findOneAndDelete({ jobSeekerId, jobId });
    return { saved: false };
  },

  async isJobSaved(jobSeekerId: string, jobId: string): Promise<boolean> {
    const existing = await SavedJobModel.findOne({ jobSeekerId, jobId });
    return !!existing;
  },

  async getMySavedJobs(jobSeekerId: string) {
    const saved = await SavedJobModel.find({ jobSeekerId })
      .populate({
        path: "jobId",
        populate: { path: "companyRef", select: "companyId companyName status" },
      })
      .sort({ createdAt: -1 });

    return saved
      .filter((s) => s.jobId) // guard against a deleted job
      .map((s) => {
        const job = s.jobId as any;
        const company = job.companyRef as { companyId: string; companyName: string; status: string };
        return {
          id: job._id.toString(),
          companyId: company.companyId,
          companyName: company.companyName,
          companyVerified: company.status === VerificationStatus.VERIFIED,
          jobTitle: job.jobTitle,
          location: job.location,
          workType: job.workType,
          salary: job.salary,
          skills: job.skills,
          listingType: job.listingType,
          status: job.status,
          createdAt: job.createdAt,
          savedAt: s.createdAt,
        };
      });
  },
};