export type UserRole = "job_seeker" | "employer";
export type VerificationStatus = "unverified" | "verified";

// ---------- Register: Job Seeker ----------
export interface RegisterJobSeekerPayload {
  email: string;
  phone: string;
  password: string;
  fullName: string;
  topSkills: string[]; // must contain exactly 3
  aboutYourself: string;
  qualificationImages?: File[]; // optional
}

export interface RegisterJobSeekerResponse {
  userId: string;
  email: string;
  phone: string;
  role: "job_seeker";
  status: VerificationStatus;
  fullName: string;
  topSkills: string[];
  aboutYourself: string;
  qualificationImages: string[];
}

// ---------- Register: Employer ----------
export interface RegisterEmployerPayload {
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
  companyDocument: File; // required
}

export interface RegisterEmployerResponse {
  userId: string;
  companyId: string;
  email: string;
  phone: string;
  role: "employer";
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

// ---------- Login ----------
export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
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

// ---------- Generic API envelope ----------
// Every backend response is wrapped like { success, message, data }
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}