export interface SalaryExplorerRow {
  role: string;
  industry: string;
  min: number;
  avg: number;
  max: number;
  jobCount: number;
}

export interface SalaryExplorerData {
  rows: SalaryExplorerRow[];
  overallAverage: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}