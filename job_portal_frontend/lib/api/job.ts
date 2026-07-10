import axiosClient from '../api/axois';
import {
  CreateJobPayload,
  JobListItem,
  JobResponse,
  JobListFilters,
  ApiResponse,
} from '../types/job.types';

// If you have a central endpoints.ts, move these strings there instead —
// kept local here so this file doesn't depend on a path I can't confirm.
const JOB_ENDPOINTS = {
  CREATE: '/api/jobs',
  LIST_ALL: '/api/jobs',
  GET_BY_ID: (jobId: string) => `/api/jobs/${jobId}`,
  LIST_BY_COMPANY: (companyId: string) => `/api/jobs/company/${companyId}`,
  CLOSE: (jobId: string) => `/api/jobs/${jobId}/close`,
  DELETE: (jobId: string) => `/api/jobs/${jobId}`,
};

export const jobApi = {
  async createJob(payload: CreateJobPayload): Promise<JobResponse> {
    const res = await axiosClient.post<ApiResponse<JobResponse>>(JOB_ENDPOINTS.CREATE, payload);
    return res.data.data;
  },

  async listAllJobs(filters?: JobListFilters): Promise<JobListItem[]> {
    const res = await axiosClient.get<ApiResponse<JobListItem[]>>(JOB_ENDPOINTS.LIST_ALL, {
      params: filters,
    });
    return res.data.data;
  },

  async getJobById(jobId: string): Promise<JobResponse> {
    const res = await axiosClient.get<ApiResponse<JobResponse>>(JOB_ENDPOINTS.GET_BY_ID(jobId));
    return res.data.data;
  },

  async listByCompany(companyId: string): Promise<JobResponse[]> {
    const res = await axiosClient.get<ApiResponse<JobResponse[]>>(
      JOB_ENDPOINTS.LIST_BY_COMPANY(companyId)
    );
    return res.data.data;
  },

  async closeJob(jobId: string): Promise<JobResponse> {
    const res = await axiosClient.patch<ApiResponse<JobResponse>>(JOB_ENDPOINTS.CLOSE(jobId));
    return res.data.data;
  },

  async deleteJob(jobId: string): Promise<void> {
    await axiosClient.delete(JOB_ENDPOINTS.DELETE(jobId));
  },
};