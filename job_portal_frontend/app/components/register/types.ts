export type RegisterRole = 'job_seeker' | 'employer';

export interface RegisterFormState {
  // Step 1
  email: string;
  phone: string;
  password: string;

  // Step 2
  role: RegisterRole | null;

  // Step 3 — job seeker
  fullName: string;
  topSkillsRaw: string; // comma-separated, e.g. "React, Node.js, SQL"
  aboutYourself: string;
  qualificationImages: File[];

  // Step 3 — employer
  companyName: string;
  industry: string;
  headquarters: string;
  companyWebsite: string;
  aboutCompany: string;
  whyChooseUs: string;
  businessRegistrationNumber: string;
  companyDocument: File | null;
}

export const initialRegisterFormState: RegisterFormState = {
  email: '',
  phone: '',
  password: '',
  role: null,
  fullName: '',
  topSkillsRaw: '',
  aboutYourself: '',
  qualificationImages: [],
  companyName: '',
  industry: 'Sales',
  headquarters: '',
  companyWebsite: '',
  aboutCompany: '',
  whyChooseUs: '',
  businessRegistrationNumber: '',
  companyDocument: null,
};

// Splits "React, Node.js, SQL" into ["React","Node.js","SQL"], trimmed, empties removed.
export const parseTopSkills = (raw: string): string[] =>
  raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);