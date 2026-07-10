import { AxiosError } from 'axios';
import { companyApi } from '../api/company';

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

export const companyAction = {
  async getMyCompany() {
    try {
      const data = await companyApi.getMyCompany();
      return { success: true as const, data };
    } catch (error) {
      return { success: false as const, message: extractErrorMessage(error) };
    }
  },

  async getCompanyById(companyId: string) {
    try {
      const data = await companyApi.getCompanyById(companyId);
      return { success: true as const, data };
    } catch (error) {
      return { success: false as const, message: extractErrorMessage(error) };
    }
  },
};