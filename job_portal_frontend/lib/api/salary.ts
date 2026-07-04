import axiosClient from '../api/axois';
import { SalaryExplorerData, ApiResponse } from '../types/salary.types';

// If you have a central endpoints.ts, move this string there and import it
// instead — kept local here so this file has no dependency on a path I
// can't confirm exists in your project.
const SALARY_EXPLORER_ENDPOINT = '/api/salary-explorer';

export const salaryApi = {
  async getSalaryExplorerData(): Promise<SalaryExplorerData> {
    const res = await axiosClient.get<ApiResponse<SalaryExplorerData>>(SALARY_EXPLORER_ENDPOINT);
    return res.data.data;
  },
};