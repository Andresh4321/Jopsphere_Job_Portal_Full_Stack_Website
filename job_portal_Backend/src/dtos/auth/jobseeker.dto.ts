export interface UpdateJobSeekerProfileDto {
  fullName?: string;
  topSkills?: string[] | string;
  aboutYourself?: string;
  preferredLocation?: string;
  preferredWorkType?: string;
  experienceYears?: number | string;
  expectedSalary?: number | string;
  noticePeriodDays?: number | string;
  education?: string;
  linkedinUrl?: string;
}