
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
  location: string;
  hoursPerWeek?: number;
  applicationDeadline: string;
  salary: SalaryRange;
  aboutRole: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];

  status: JobStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
export enum WorkType {
  FULL_TIME = "full_time",
  PART_TIME = "part_time",
  CONTRACT = "contract",
  INTERNSHIP = "internship",
  REMOTE = "remote",
}

export enum ListingType {
  STANDARD = "standard",
  WALK_IN = "walk_in",
}

export enum JobStatus {
  OPEN = "open",
  CLOSED = "closed",
}

export interface SalaryRange {
  min: number;
  max: number;
}