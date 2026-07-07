import { AxiosError } from 'axios';
import { savedJobApi } from '../api/savedjobs';

const extractErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || error.message || 'Something went wrong. Please try again.';
  }
  if (error instanceof Error) return error.message;
  return 'Something went wrong. Please try again.';
};

export const savedJobAction = {
  async saveJob(jobId: string) {
    try {
      const data = await savedJobApi.saveJob(jobId);
      return { success: true as const, data };
    } catch (error) {
      return { success: false as const, message: extractErrorMessage(error) };
    }
  },

  async unsaveJob(jobId: string) {
    try {
      const data = await savedJobApi.unsaveJob(jobId);
      return { success: true as const, data };
    } catch (error) {
      return { success: false as const, message: extractErrorMessage(error) };
    }
  },

  async isJobSaved(jobId: string) {
    try {
      const data = await savedJobApi.isJobSaved(jobId);
      return { success: true as const, data };
    } catch (error) {
      return { success: false as const, message: extractErrorMessage(error) };
    }
  },

  async getMySavedJobs() {
    try {
      const data = await savedJobApi.getMySavedJobs();
      return { success: true as const, data };
    } catch (error) {
      return { success: false as const, message: extractErrorMessage(error) };
    }
  },
};