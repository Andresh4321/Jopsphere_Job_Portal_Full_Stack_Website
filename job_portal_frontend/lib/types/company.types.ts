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

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}