export type WorkType = "full_time" | "part_time" | "contract" | "internship" | "remote";
export type ListingType = "standard" | "walk_in";
export type JobStatus = "open" | "closed";

export interface SalaryRange {
  min: number;
  max: number;
}

export interface CreateJobPayload {
  companyId: string;
  jobTitle: string;
  department: string;
  workType: WorkType;
  location: string;
  hoursPerWeek?: number;
  applicationDeadline: string; // ISO date string
  salary: SalaryRange;
  aboutRole: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  listingType: ListingType;
}

export interface JobResponse {
  id: string;
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
  skills: string[];
  listingType: ListingType;
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}