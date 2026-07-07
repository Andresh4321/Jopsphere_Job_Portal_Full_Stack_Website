import { ApplicationStage } from "../../types/application/application.types";

export interface CreateApplicationDto {
  jobId: string;
}

export interface UpdateApplicationStageDto {
  stage: ApplicationStage;
}

// What a job seeker sees on "My Applications" - job-centric.
export interface SeekerApplicationDto {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  companyVerified: boolean;
  location: string;
  stage: ApplicationStage;
  fitScore: number;
  appliedAt: Date;
  updatedAt: Date;
}

// What an employer sees on their applicant board - candidate-centric.
export interface EmployerApplicantDto {
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
  appliedAt: Date;
  updatedAt: Date;
}