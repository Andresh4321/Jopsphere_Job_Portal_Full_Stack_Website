import { WorkType, ListingType, SalaryRange } from '../../types/PostJob/job.type';

export interface MyCompany {
  companyId: string;
  companyName: string;
  industry: string;
  headquarters: string;
  companyWebsite: string;
  status: 'unverified' | 'verified';
}

export interface PublicCompanyProfile {
  companyId: string;
  companyName: string;
  industry: string;
  headquarters: string;
  companyWebsite: string;
  aboutCompany: string;
  whyChooseUs: string;
  status: 'unverified' | 'verified';
  createdAt: string;
}

export interface CompanyListItem {
  companyId: string;
  companyName: string;
  industry: string;
  headquarters: string;
  status: 'unverified' | 'verified';
  openRolesCount: number;
}

export interface CompanyOpenRole {
  id: string;
  jobTitle: string;
  location: string;
  workType: WorkType;
  listingType: ListingType;
  salary: SalaryRange;
  skills: string[];
  createdAt: string;
  applicantsCount: number;
}

export interface CompanyProfileStats {
  responseRate: number | null; // null = not enough data yet
  avgReplyDays: number | null;
  hiresCount: number;
}

export interface CompanyProfileFull {
  companyId: string;
  companyName: string;
  industry: string;
  headquarters: string;
  companyWebsite: string;
  aboutCompany: string;
  whyChooseUs: string;
  status: 'unverified' | 'verified';
  createdAt: string;
  openRoles: CompanyOpenRole[];
  openRolesCount: number;
  stats: CompanyProfileStats;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}