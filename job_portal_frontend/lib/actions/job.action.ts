import { AxiosError } from "axios";
import { jobApi } from "../api/job";
import { CreateJobPayload, JobResponse } from "../types/job.types";

const extractErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    return (
      error.response?.data?.message ||
      error.message ||
      "Something went wrong. Please try again."
    );
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
};

export const jobAction = {
  async createJob(payload: CreateJobPayload) {
    try {
      const data: JobResponse = await jobApi.createJob(payload);
      return { success: true as const, data };
    } catch (error) {
      return { success: false as const, message: extractErrorMessage(error) };
    }
  },

  async listAllJobs(filters?: { status?: string; workType?: string }) {
    try {
      const data = await jobApi.listAllJobs(filters);
      return { success: true as const, data };
    } catch (error) {
      return { success: false as const, message: extractErrorMessage(error) };
    }
  },

  async listByCompany(companyId: string) {
    try {
      const data = await jobApi.listByCompany(companyId);
      return { success: true as const, data };
    } catch (error) {
      return { success: false as const, message: extractErrorMessage(error) };
    }
  },

  async closeJob(jobId: string) {
    try {
      const data = await jobApi.closeJob(jobId);
      return { success: true as const, data };
    } catch (error) {
      return { success: false as const, message: extractErrorMessage(error) };
    }
  },
};