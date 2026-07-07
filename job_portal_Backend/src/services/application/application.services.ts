import { ApplicationModel, IApplication } from "../../models/application/application.model";
import { PostedJobModel } from "../../models/PostJob/postedjob.model";
import { JobSeekerModel } from "../../models/auth/jobseeker.model";
import { UserModel } from "../../models/auth/user.model";
import { CreateApplicationDto, UpdateApplicationStageDto, SeekerApplicationDto, EmployerApplicantDto } from "../../dtos/application/application.dto";
import { ApplicationStage, StageCounts } from "../../types/application/application.types";
import { VerificationStatus } from "../../types/Auth/auth.type";
import { JobStatus } from "../../types/PostJob/job.type";
import { HttpError } from "../../errors/http_error";
import { Types } from "mongoose";
// Weighted fit-score formula:
//   - Location match:   20 points (case-insensitive match against seeker's preferredLocation)
//   - Skills match:     scaled so each matched-required-skill ratio contributes
//                        proportionally, e.g. 2/4 skills matched = 40 points
//   - Work type match:  10 points
//   - If ALL required skills are matched (ratio >= 1), the total is forced to
//     94 regardless of the raw sum, per spec ("never quite a perfect 100").
//   - Hard ceiling: the result is never allowed to exceed 95.
// Note: locationScore/workTypeScore need the seeker's preferredLocation/
// preferredWorkType — these are optional profile fields, so an incomplete
// seeker profile will simply score 0 on those two components rather than error.
interface FitScoreJobSeeker {
  topSkills: string[];
  preferredLocation?: string;
  preferredWorkType?: string;
}
interface FitScoreJob {
  skills: string[];
  requirements: string[];
  responsibilities: string[];
  location: string;
  workType: string;
}

const computeFitScore = (jobSeeker: FitScoreJobSeeker, job: FitScoreJob): number => {
  const locationScore =
    jobSeeker.preferredLocation &&
    jobSeeker.preferredLocation.trim().toLowerCase() === job.location.trim().toLowerCase()
      ? 20
      : 0;

  const workTypeScore =
    jobSeeker.preferredWorkType && jobSeeker.preferredWorkType === job.workType ? 10 : 0;

  let skillsRatio = 0;
  if (jobSeeker.topSkills.length > 0) {
    const targetText =
      job.skills.length > 0
        ? job.skills.join(" ").toLowerCase()
        : [...job.requirements, ...job.responsibilities].join(" ").toLowerCase();

    const matched = jobSeeker.topSkills.filter((skill) => targetText.includes(skill.toLowerCase()));
    skillsRatio = matched.length / jobSeeker.topSkills.length; // can reach but not exceed 1
  }

  // Full (or effectively full) skill match is force-set to 94 total, per spec.
  if (skillsRatio >= 1) {
    return 94;
  }

  const skillsScore = Math.round(skillsRatio * 80);
  const total = locationScore + skillsScore + workTypeScore;

  return Math.min(total, 95);
};

export const applicationService = {
  async applyToJob(jobSeekerUserId: string, dto: CreateApplicationDto): Promise<SeekerApplicationDto> {
    if (!dto.jobId) {
      throw new HttpError(400, "jobId is required.");
    }

    const job = await PostedJobModel.findById(dto.jobId).populate("companyRef", "companyId companyName status");
    if (!job) {
      throw new HttpError(404, "Job not found.");
    }
    if (job.status !== JobStatus.OPEN) {
      throw new HttpError(400, "This job is no longer accepting applications.");
    }

    const jobSeekerProfile = await JobSeekerModel.findOne({ userId: jobSeekerUserId });
    if (!jobSeekerProfile) {
      throw new HttpError(404, "Complete your job seeker profile before applying.");
    }

    const existing = await ApplicationModel.findOne({ jobId: job._id, jobSeekerId: jobSeekerUserId });
    if (existing) {
      throw new HttpError(409, "You have already applied to this job.");
    }

    const fitScore = computeFitScore(
      {
        topSkills: jobSeekerProfile.topSkills,
        preferredLocation: jobSeekerProfile.preferredLocation,
        preferredWorkType: jobSeekerProfile.preferredWorkType,
      },
      {
        skills: job.skills,
        requirements: job.requirements,
        responsibilities: job.responsibilities,
        location: job.location,
        workType: job.workType,
      }
    );

    const application = await ApplicationModel.create({
      jobId: job._id,
      jobSeekerId: new Types.ObjectId(jobSeekerUserId),
      employerId: job.employerId,
      companyId: job.companyId,
      fitScore,
      stage: ApplicationStage.APPLIED,
    });

    const company = job.companyRef as unknown as { companyId: string; companyName: string; status: string };

    return {
      id: application._id.toString(),
      jobId: job._id.toString(),
      jobTitle: job.jobTitle,
      companyName: company.companyName,
      companyVerified: company.status === VerificationStatus.VERIFIED,
      location: job.location,
      stage: application.stage,
      fitScore: application.fitScore,
      appliedAt: application.createdAt,
      updatedAt: application.updatedAt,
    };
  },

  async getMyApplications(jobSeekerUserId: string): Promise<SeekerApplicationDto[]> {
    const applications = await ApplicationModel.find({ jobSeekerId: jobSeekerUserId })
      .populate({
        path: "jobId",
        populate: { path: "companyRef", select: "companyId companyName status" },
      })
      .sort({ createdAt: -1 });

    return applications
      .filter((app) => app.jobId) // guard against a deleted job
      .map((app) => {
        const job = app.jobId as any;
        const company = job.companyRef as { companyName: string; status: string };
        return {
          id: app._id.toString(),
          jobId: job._id.toString(),
          jobTitle: job.jobTitle,
          companyName: company.companyName,
          companyVerified: company.status === VerificationStatus.VERIFIED,
          location: job.location,
          stage: app.stage,
          fitScore: app.fitScore,
          appliedAt: app.createdAt,
          updatedAt: app.updatedAt,
        };
      });
  },

  async getApplicantsForJob(jobId: string, employerId: string): Promise<EmployerApplicantDto[]> {
    const job = await PostedJobModel.findById(jobId);
    if (!job) throw new HttpError(404, "Job not found.");
    if (job.employerId.toString() !== employerId) {
      throw new HttpError(403, "You are not authorized to view applicants for this job.");
    }

    return this.buildApplicantList({ jobId: job._id });
  },

  async getApplicantsForEmployer(employerId: string): Promise<EmployerApplicantDto[]> {
    const jobIds = await PostedJobModel.find({ employerId }).distinct("_id");
    return this.buildApplicantList({ jobId: { $in: jobIds } });
  },

  async buildApplicantList(match: Record<string, unknown>): Promise<EmployerApplicantDto[]> {
    const applications = await ApplicationModel.find(match)
      .populate("jobId", "jobTitle")
      .sort({ createdAt: -1 });

    const jobSeekerIds = applications.map((a) => a.jobSeekerId);
    const [profiles, users] = await Promise.all([
      JobSeekerModel.find({ userId: { $in: jobSeekerIds } }),
      UserModel.find({ _id: { $in: jobSeekerIds } }),
    ]);

    const profileMap = new Map(profiles.map((p) => [p.userId.toString(), p]));
    const userMap = new Map(users.map((u) => [u._id.toString(), u]));

    return applications
      .filter((app) => app.jobId)
      .map((app) => {
        const job = app.jobId as any;
        const profile = profileMap.get(app.jobSeekerId.toString());
        const user = userMap.get(app.jobSeekerId.toString());

        return {
          applicationId: app._id.toString(),
          jobId: job._id.toString(),
          jobTitle: job.jobTitle,
          jobSeekerId: app.jobSeekerId.toString(),
          fullName: profile?.fullName ?? "Unknown applicant",
          headline: profile?.aboutYourself ?? "",
          topSkills: profile?.topSkills ?? [],
          verified: user?.status === VerificationStatus.VERIFIED,
          fitScore: app.fitScore,
          stage: app.stage,
          appliedAt: app.createdAt,
          updatedAt: app.updatedAt,
        };
      });
  },

  async getStageCountsForEmployer(employerId: string): Promise<StageCounts> {
    const jobIds = await PostedJobModel.find({ employerId }).distinct("_id");

    const counts = await ApplicationModel.aggregate([
      { $match: { jobId: { $in: jobIds } } },
      { $group: { _id: "$stage", count: { $sum: 1 } } },
    ]);

    const result: StageCounts = {
      all: 0,
      applied: 0,
      viewed: 0,
      shortlisted: 0,
      interview: 0,
      offer: 0,
      hired: 0,
      rejected: 0,
    };

    for (const row of counts) {
      const stage = row._id as keyof Omit<StageCounts, "all">;
      if (stage in result) {
        result[stage] = row.count;
        result.all += row.count;
      }
    }

    return result;
  },

  async updateStage(applicationId: string, employerId: string, dto: UpdateApplicationStageDto): Promise<EmployerApplicantDto> {
    const application = await ApplicationModel.findById(applicationId);
    if (!application) throw new HttpError(404, "Application not found.");
    if (application.employerId.toString() !== employerId) {
      throw new HttpError(403, "You are not authorized to update this application.");
    }

    application.stage = dto.stage;
    await application.save();

    const list = await this.buildApplicantList({ _id: application._id });
    return list[0];
  },
};