import { AxiosError } from 'axios';
import { jobSeekerApi } from '../api/jobseeker';

const extractErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || error.message || 'Something went wrong. Please try again.';
  }
  if (error instanceof Error) return error.message;
  return 'Something went wrong. Please try again.';
};

export const jobSeekerAction = {
  async getMyProfile() {
    try {
      const data = await jobSeekerApi.getMyProfile();
      return { success: true as const, data };
    } catch (error) {
      return { success: false as const, message: extractErrorMessage(error) };
    }
  },
};