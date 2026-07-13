export interface MyJobSeekerProfile {
  fullName: string;
  topSkills: string[];
  aboutYourself: string;
  qualificationImages: string[];
  preferredLocation?: string;
  preferredWorkType?: string;
  profileImage?: string;
  experienceYears?: number;
  expectedSalary?: number;
  noticePeriodDays?: number;
  education?: string;
  linkedinUrl?: string;
  accountVerified: boolean;
}

export interface UpdateJobSeekerProfilePayload {
  fullName?: string;
  topSkills?: string[];
  aboutYourself?: string;
  preferredLocation?: string;
  preferredWorkType?: string;
  experienceYears?: number;
  expectedSalary?: number;
  noticePeriodDays?: number;
  education?: string;
  linkedinUrl?: string;
  profileImage?: File;
  newQualificationImages?: File[];
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}