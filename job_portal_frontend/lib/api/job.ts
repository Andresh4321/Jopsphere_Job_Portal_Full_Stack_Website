import axiosClient from "../api/axois";
import { JOB_ENDPOINTS } from "./endpoints";
import { CreateJobPayload, JobResponse, ApiResponse } from "../types/job.types";

// Pure HTTP calls only — no side effects. See actions/job_action.ts for those.

export const jobApi = {
  async createJob(payload: CreateJobPayload): Promise<JobResponse> {
    const res = await axiosClient.post<ApiResponse<JobResponse>>(
      JOB_ENDPOINTS.CREATE,
      payload
    );
    return res.data.data;
  },

  async listAllJobs(filters?: { status?: string; workType?: string }): Promise<JobResponse[]> {
    const res = await axiosClient.get<ApiResponse<JobResponse[]>>(JOB_ENDPOINTS.LIST_ALL, {
      params: filters,
    });
    return res.data.data;
  },

  async listByCompany(companyId: string): Promise<JobResponse[]> {
    const res = await axiosClient.get<ApiResponse<JobResponse[]>>(
      JOB_ENDPOINTS.LIST_BY_COMPANY(companyId)
    );
    return res.data.data;
  },

  async getJobById(jobId: string): Promise<JobResponse> {
    const res = await axiosClient.get<ApiResponse<JobResponse>>(JOB_ENDPOINTS.GET_BY_ID(jobId));
    return res.data.data;
  },

  async closeJob(jobId: string): Promise<JobResponse> {
    const res = await axiosClient.patch<ApiResponse<JobResponse>>(JOB_ENDPOINTS.CLOSE(jobId));
    return res.data.data;
  },
};