import { AxiosError } from 'axios';
import { applicationApi } from '../api/application';
import { ApplicationStage } from '../types/application.types';

const extractErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    return (
      error.response?.data?.message ||
      error.message ||
      'Something went wrong. Please try again.'
    );
  }
  if (error instanceof Error) return error.message;
  return 'Something went wrong. Please try again.';
};

export const applicationAction = {
  async applyToJob(jobId: string) {
    try {
      const data = await applicationApi.applyToJob(jobId);
      return { success: true as const, data };
    } catch (error) {
      return { success: false as const, message: extractErrorMessage(error) };
    }
  },

  async getMyApplications() {
    try {
      const data = await applicationApi.getMyApplications();
      return { success: true as const, data };
    } catch (error) {
      return { success: false as const, message: extractErrorMessage(error) };
    }
  },

  async getApplicantsForJob(jobId: string) {
    try {
      const data = await applicationApi.getApplicantsForJob(jobId);
      return { success: true as const, data };
    } catch (error) {
      return { success: false as const, message: extractErrorMessage(error) };
    }
  },

  async getApplicantsForEmployer() {
    try {
      const data = await applicationApi.getApplicantsForEmployer();
      return { success: true as const, data };
    } catch (error) {
      return { success: false as const, message: extractErrorMessage(error) };
    }
  },

  async getStageCounts() {
    try {
      const data = await applicationApi.getStageCounts();
      return { success: true as const, data };
    } catch (error) {
      return { success: false as const, message: extractErrorMessage(error) };
    }
  },

  async updateStage(applicationId: string, stage: ApplicationStage) {
    try {
      const data = await applicationApi.updateStage(applicationId, stage);
      return { success: true as const, data };
    } catch (error) {
      return { success: false as const, message: extractErrorMessage(error) };
    }
  },
};