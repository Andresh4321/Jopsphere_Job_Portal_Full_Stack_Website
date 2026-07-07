import axiosClient from '../api/axois';
import { MyJobSeekerProfile, ApiResponse } from '../types/jobseeker.types';

export const jobSeekerApi = {
  async getMyProfile(): Promise<MyJobSeekerProfile> {
    const res = await axiosClient.get<ApiResponse<MyJobSeekerProfile>>('/api/job-seekers/me');
    return res.data.data;
  },
};