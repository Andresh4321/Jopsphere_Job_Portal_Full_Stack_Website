export type WorkType = "full_time" | "part_time" | "contract" | "internship" | "remote";
export type ListingType = "standard" | "walk_in";
export type JobStatusValue = "open" | "closed";

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
  applicationDeadline: string;
  salary: SalaryRange;
  aboutRole: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  listingType: ListingType;
}

// Matches backend JobListItemDto — used on the Find Jobs list page.
// Lighter than JobResponse: company name/verified are flattened in via
// a $lookup so the list doesn't need one request per card.
export interface JobListItem {
  id: string;
  companyId: string;
  companyName: string;
  companyVerified: boolean;
  jobTitle: string;
  department: string;
  workType: WorkType;
  location: string;
  hoursPerWeek?: number;
  applicationDeadline: string;
  salary: SalaryRange;
  skills: string[];
  listingType: ListingType;
  status: JobStatusValue;
  createdAt: string;
}

// Matches backend JobResponseDto — used on the Job Profile detail page.
export interface JobResponse {
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
  applicationDeadline: string;
  salary: SalaryRange;
  aboutRole: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  listingType: ListingType;
  status: JobStatusValue;
  createdAt: string;
  updatedAt: string;
}

export interface JobListFilters {
  status?: JobStatusValue;
  workType?: WorkType;
  minSalary?: number;
  verifiedOnly?: boolean;
  sort?: "newest" | "salary_desc";
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}