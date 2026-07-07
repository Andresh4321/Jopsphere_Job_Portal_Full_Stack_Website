export interface MyJobSeekerProfile {
  fullName: string;
  topSkills: string[];
  aboutYourself: string;
  qualificationImages: string[];
  preferredLocation?: string;
  preferredWorkType?: string;
  accountVerified: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}