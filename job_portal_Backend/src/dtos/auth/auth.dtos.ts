import { UserRole, VerificationStatus } from "../../types/Auth/auth.type";

// ---------- Register: Job Seeker ----------
// Sent as multipart/form-data. topSkills arrives as either an array of 3
// strings or a JSON-stringified array of 3 strings (form-data quirk),
// the service layer normalizes this.
export interface RegisterJobSeekerDto {
  email: string;
  phone: string;
  password: string;
  fullName: string;
  topSkills: string[] | string; // exactly 3 skills
  aboutYourself: string;
  preferredLocation?: string;
  preferredWorkType?: string;
}

// ---------- Register: Employer ----------
export interface RegisterEmployerDto {
  email: string;
  phone: string;
  password: string;
  companyName: string;
  industry: string;
  headquarters: string;
  companyWebsite: string;
  aboutCompany: string;
  whyChooseUs: string;
  businessRegistrationNumber: string;
}

// ---------- Login ----------
export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  token: string;
  role: UserRole;
  redirectTo: "/jobseeker/home" | "/employer/home";
  user: {
    id: string;
    email: string;
    phone: string;
    status: VerificationStatus;
  };
}

// ---------- Generic register response ----------
export interface RegisterJobSeekerResponseDto {
  userId: string;
  email: string;
  phone: string;
  role: UserRole.JOB_SEEKER;
  status: VerificationStatus;
  fullName: string;
  topSkills: string[];
  aboutYourself: string;
  qualificationImages: string[];
  preferredLocation?: string;
  preferredWorkType?: string;
}

export interface RegisterEmployerResponseDto {
  userId: string;
  companyId: string;
  email: string;
  phone: string;
  role: UserRole.EMPLOYER;
  status: VerificationStatus;
  companyName: string;
  industry: string;
  headquarters: string;
  companyWebsite: string;
  aboutCompany: string;
  whyChooseUs: string;
  businessRegistrationNumber: string;
  companyDocument: string;
}