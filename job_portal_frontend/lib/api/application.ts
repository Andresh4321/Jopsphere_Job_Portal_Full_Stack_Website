import axiosClient from '../api/axois';
import {
  SeekerApplication,
  EmployerApplicant,
  StageCounts,
  ApplicationStage,
  ApiResponse,
} from '../types/application.types';

export const applicationApi = {
  async applyToJob(jobId: string): Promise<SeekerApplication> {
    const res = await axiosClient.post<ApiResponse<SeekerApplication>>(`/api/jobs/${jobId}/apply`);
    return res.data.data;
  },

  async getMyApplications(): Promise<SeekerApplication[]> {
    const res = await axiosClient.get<ApiResponse<SeekerApplication[]>>('/api/applications/me');
    return res.data.data;
  },

  async getApplicantsForJob(jobId: string): Promise<EmployerApplicant[]> {
    const res = await axiosClient.get<ApiResponse<EmployerApplicant[]>>(`/api/jobs/${jobId}/applicants`);
    return res.data.data;
  },

  async getApplicantsForEmployer(): Promise<EmployerApplicant[]> {
    const res = await axiosClient.get<ApiResponse<EmployerApplicant[]>>('/api/applicants/me');
    return res.data.data;
  },

  async getStageCounts(): Promise<StageCounts> {
    const res = await axiosClient.get<ApiResponse<StageCounts>>('/api/applicants/stats');
    return res.data.data;
  },

  async updateStage(applicationId: string, stage: ApplicationStage): Promise<EmployerApplicant> {
    const res = await axiosClient.patch<ApiResponse<EmployerApplicant>>(
      `/api/applications/${applicationId}/stage`,
      { stage }
    );
    return res.data.data;
  },
};