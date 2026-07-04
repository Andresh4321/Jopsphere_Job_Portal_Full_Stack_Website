import { PostedJobModel, IPostedJob } from "../../models/PostJob/postedjob.model";
import { CompanyModel } from "../../models/auth/company.model";
import { CreateJobDto, UpdateJobDto, JobResponseDto } from "../../dtos/PostJob/job.dto";
import { HttpError } from "../../errors/http_error";
import { JobStatus } from "../../types/PostJob/job.type";
import { Types } from "mongoose";

const toResponseDto = (job: IPostedJob): JobResponseDto => ({
  id: job._id.toString(),
  companyId: job.companyId,
  jobTitle: job.jobTitle,
  department: job.department,
  workType: job.workType,
  location: job.location,
  hoursPerWeek: job.hoursPerWeek,
  applicationDeadline: job.applicationDeadline,
  salary: job.salary,
  aboutRole: job.aboutRole,
  responsibilities: job.responsibilities,
  requirements: job.requirements,
  skills: job.skills,
  listingType: job.listingType,
  status: job.status,
  createdAt: job.createdAt,
  updatedAt: job.updatedAt,
});

const validateRequiredFields = (dto: CreateJobDto) => {
  const requiredStringFields: (keyof CreateJobDto)[] = [
    "companyId",
    "jobTitle",
    "department",
    "workType",
    "location",
    "applicationDeadline",
    "aboutRole",
    "listingType",
  ];

  for (const field of requiredStringFields) {
    if (!dto[field]) {
      throw new HttpError(400, `Field "${field}" is required.`);
    }
  }

  if (!dto.salary || dto.salary.min == null || dto.salary.max == null) {
    throw new HttpError(400, "salary.min and salary.max are required.");
  }
  if (dto.salary.min < 0 || dto.salary.max < 0) {
    throw new HttpError(400, "Salary values cannot be negative.");
  }
  if (dto.salary.max < dto.salary.min) {
    throw new HttpError(400, "salary.max must be greater than or equal to salary.min.");
  }

  if (!Array.isArray(dto.responsibilities) || dto.responsibilities.length === 0) {
    throw new HttpError(400, "At least one responsibility is required.");
  }
  if (!Array.isArray(dto.requirements) || dto.requirements.length === 0) {
    throw new HttpError(400, "At least one requirement is required.");
  }
  if (!Array.isArray(dto.skills) || dto.skills.length === 0) {
    throw new HttpError(400, "At least one skill is required.");
  }

  const deadline = new Date(dto.applicationDeadline);
  if (isNaN(deadline.getTime())) {
    throw new HttpError(400, "applicationDeadline must be a valid date.");
  }
  if (deadline.getTime() < Date.now()) {
    throw new HttpError(400, "applicationDeadline cannot be in the past.");
  }
};

export const jobService = {
  async createJob(dto: CreateJobDto, employerId: string): Promise<JobResponseDto> {
    validateRequiredFields(dto);

    // Confirm the companyId exists AND belongs to the authenticated employer.
    // Prevents an employer from posting a job under someone else's company.
    const company = await CompanyModel.findOne({ companyId: dto.companyId });
    if (!company) {
      throw new HttpError(404, "Company not found for the given companyId.");
    }
    if (company.employerId.toString() !== employerId) {
      throw new HttpError(403, "You are not authorized to post jobs for this company.");
    }

    const job = await PostedJobModel.create({
      companyId: dto.companyId,
      companyRef: company._id,
      employerId: new Types.ObjectId(employerId),
      jobTitle: dto.jobTitle.trim(),
      department: dto.department.trim(),
      workType: dto.workType,
      location: dto.location.trim(),
      hoursPerWeek: dto.hoursPerWeek,
      applicationDeadline: new Date(dto.applicationDeadline),
      salary: dto.salary,
      aboutRole: dto.aboutRole.trim(),
      responsibilities: dto.responsibilities.map((r) => r.trim()).filter(Boolean),
      requirements: dto.requirements.map((r) => r.trim()).filter(Boolean),
      skills: dto.skills.map((s) => s.trim()).filter(Boolean),
      listingType: dto.listingType,
      status: JobStatus.OPEN,
    });

    return toResponseDto(job);
  },

  async getJobById(jobId: string): Promise<JobResponseDto> {
    const job = await PostedJobModel.findById(jobId);
    if (!job) {
      throw new HttpError(404, "Job not found.");
    }
    return toResponseDto(job);
  },

  async getJobsByCompany(companyId: string): Promise<JobResponseDto[]> {
    const jobs = await PostedJobModel.find({ companyId }).sort({ createdAt: -1 });
    return jobs.map(toResponseDto);
  },

  async listAllJobs(filters: { status?: JobStatus; workType?: string } = {}): Promise<JobResponseDto[]> {
    const query: Record<string, unknown> = {};
    if (filters.status) query.status = filters.status;
    if (filters.workType) query.workType = filters.workType;

    const jobs = await PostedJobModel.find(query).sort({ createdAt: -1 });
    return jobs.map(toResponseDto);
  },

  async updateJob(jobId: string, dto: UpdateJobDto, employerId: string): Promise<JobResponseDto> {
    const job = await PostedJobModel.findById(jobId);
    if (!job) {
      throw new HttpError(404, "Job not found.");
    }
    if (job.employerId.toString() !== employerId) {
      throw new HttpError(403, "You are not authorized to edit this job.");
    }

    if (dto.salary) {
      if (dto.salary.max < dto.salary.min) {
        throw new HttpError(400, "salary.max must be greater than or equal to salary.min.");
      }
      job.salary = dto.salary;
    }
    if (dto.jobTitle) job.jobTitle = dto.jobTitle.trim();
    if (dto.department) job.department = dto.department.trim();
    if (dto.workType) job.workType = dto.workType;
    if (dto.location) job.location = dto.location.trim();
    if (dto.hoursPerWeek !== undefined) job.hoursPerWeek = dto.hoursPerWeek;
    if (dto.applicationDeadline) job.applicationDeadline = new Date(dto.applicationDeadline);
    if (dto.aboutRole) job.aboutRole = dto.aboutRole.trim();
    if (dto.responsibilities) job.responsibilities = dto.responsibilities;
    if (dto.requirements) job.requirements = dto.requirements;
    if (dto.skills) job.skills = dto.skills;
    if (dto.listingType) job.listingType = dto.listingType;
    if (dto.status) job.status = dto.status;

    await job.save();
    return toResponseDto(job);
  },

  async closeJob(jobId: string, employerId: string): Promise<JobResponseDto> {
    return this.updateJob(jobId, { status: JobStatus.CLOSED }, employerId);
  },

  async deleteJob(jobId: string, employerId: string): Promise<void> {
    const job = await PostedJobModel.findById(jobId);
    if (!job) {
      throw new HttpError(404, "Job not found.");
    }
    if (job.employerId.toString() !== employerId) {
      throw new HttpError(403, "You are not authorized to delete this job.");
    }
    await PostedJobModel.findByIdAndDelete(jobId);
  },
};