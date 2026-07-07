export type ApplicationStage = 'applied' | 'viewed' | 'shortlisted' | 'interview' | 'offer' | 'hired' | 'rejected';

export const APPLICATION_STAGE_ORDER: ApplicationStage[] = [
  'applied', 'viewed', 'shortlisted', 'interview', 'offer', 'hired',
];

export const STAGE_LABELS: Record<ApplicationStage, string> = {
  applied: 'Applied',
  viewed: 'Viewed',
  shortlisted: 'Shortlisted',
  interview: 'Interview',
  offer: 'Offer',
  hired: 'Hired',
  rejected: 'Rejected',
};

// What a job seeker sees on "My Applications"
export interface SeekerApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  companyVerified: boolean;
  location: string;
  stage: ApplicationStage;
  fitScore: number;
  appliedAt: string;
  updatedAt: string;
}

// What an employer sees on their applicant board
export interface EmployerApplicant {
  applicationId: string;
  jobId: string;
  jobTitle: string;
  jobSeekerId: string;
  fullName: string;
  headline: string;
  topSkills: string[];
  verified: boolean;
  fitScore: number;
  stage: ApplicationStage;
  appliedAt: string;
  updatedAt: string;
}

export interface StageCounts {
  all: number;
  applied: number;
  viewed: number;
  shortlisted: number;
  interview: number;
  offer: number;
  hired: number;
  rejected: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}