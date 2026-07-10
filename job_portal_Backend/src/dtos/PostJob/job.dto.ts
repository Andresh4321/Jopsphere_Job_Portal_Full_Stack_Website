import { WorkType, ListingType, JobStatus, SalaryRange } from "../../types/PostJob/job.type";

// Request body for POST /jobs. companyId is sent by the client, but the
// service double-checks it belongs to the authenticated employer.
export interface CreateJobDto {
  companyId: string;
  jobTitle: string;
  department: string;
  workType: WorkType;
  location: string;
  hoursPerWeek?: number;
  applicationDeadline: string; // ISO date string from client, cast to Date in service
  salary: SalaryRange;
  aboutRole: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
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
  skills?: string[];
  listingType?: ListingType;
  status?: JobStatus;
}

export interface JobResponseDto {
  id: string;
  companyId: string;
  company: {
    companyId: string;
    companyName: string;
    companyVerified: boolean;
  };
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
  skills: string[];
  listingType: ListingType;
  status: JobStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Lighter shape for the public jobs list — enriched with companyName and
// companyVerified via a $lookup, so the frontend doesn't need one request
// per card just to show the company name and verified badge.
export interface JobListItemDto {
  id: string;
  companyId: string;
  companyName: string;
  companyVerified: boolean;
  jobTitle: string;
  department: string;
  workType: WorkType;
  location: string;
  hoursPerWeek?: number;
  applicationDeadline: Date;
  salary: SalaryRange;
  skills: string[];
  listingType: ListingType;
  status: JobStatus;
  createdAt: Date;
}