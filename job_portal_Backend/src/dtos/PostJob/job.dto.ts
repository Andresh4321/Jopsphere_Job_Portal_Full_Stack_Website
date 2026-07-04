import { WorkType, ListingType, JobStatus, SalaryRange } from "../../types/PostJob/job.type";

export interface CreateJobDto {
  companyId: string;
  jobTitle: string;
  department: string;
  workType: WorkType;
  location: string;
  hoursPerWeek?: number;
  applicationDeadline: string;
  salary: SalaryRange;
  aboutRole: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];          // NEW
  listingType: ListingType;
}

export interface UpdateJobDto {
  jobTitle?: string;
  department?: string;
  workType?: WorkType;
  location?: string;
  hoursPerWeek?: number;
  applicationDeadline?: string;
  salary?: SalaryRange;
  aboutRole?: string;
  responsibilities?: string[];
  requirements?: string[];
  skills?: string[];         // NEW
  listingType?: ListingType;
  status?: JobStatus;
}

export interface JobResponseDto {
  id: string;
  companyId: string;
  jobTitle: string;
  department: string;
  workType: WorkType;
  location: string;
  hoursPerWeek?: number;
  applicationDeadline: Date;
  salary: SalaryRange;
  aboutRole: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];          // NEW
  listingType: ListingType;
  status: JobStatus;
  createdAt: Date;
  updatedAt: Date;
}