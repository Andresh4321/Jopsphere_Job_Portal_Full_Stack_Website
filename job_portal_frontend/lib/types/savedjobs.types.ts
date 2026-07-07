import { WorkType, ListingType, JobStatusValue, SalaryRange } from './job.types';

export interface SavedJob {
  id: string; // jobId
  companyId: string;
  companyName: string;
  companyVerified: boolean;
  jobTitle: string;
  location: string;
  workType: WorkType;
  salary: SalaryRange;
  skills: string[];
  listingType: ListingType;
  status: JobStatusValue;
  createdAt: string;
  savedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}