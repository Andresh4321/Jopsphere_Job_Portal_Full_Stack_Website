import axiosClient from '../api/axois';
import { SavedJob, ApiResponse } from '../types/savedjobs.types';

export const savedJobApi = {
  async saveJob(jobId: string): Promise<{ saved: boolean }> {
    const res = await axiosClient.post<ApiResponse<{ saved: boolean }>>(`/api/jobs/${jobId}/save`);
    return res.data.data;
  },

  async unsaveJob(jobId: string): Promise<{ saved: boolean }> {
    const res = await axiosClient.delete<ApiResponse<{ saved: boolean }>>(`/api/jobs/${jobId}/save`);
    return res.data.data;
  },

  async isJobSaved(jobId: string): Promise<boolean> {
    const res = await axiosClient.get<ApiResponse<{ saved: boolean }>>(`/api/jobs/${jobId}/save-status`);
    return res.data.data.saved;
  },

  async getMySavedJobs(): Promise<SavedJob[]> {
    const res = await axiosClient.get<ApiResponse<SavedJob[]>>('/api/saved-jobs/me');
    return res.data.data;
  },
};