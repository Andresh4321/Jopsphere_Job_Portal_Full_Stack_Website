// Central place for every backend route the frontend calls.
// If a backend route changes, this is the only file that needs updating.

export const AUTH_ENDPOINTS = {
  REGISTER_JOB_SEEKER: "/api/auth/register/job-seeker",
  REGISTER_EMPLOYER: "/api/auth/register/employer",
  LOGIN: "/api/auth/login",
  FORGOT_PASSWORD: "/api/auth/forgot-password",
  RESET_PASSWORD: "/api/auth/reset-password",
};

export const JOB_ENDPOINTS = {
  CREATE: "/api/jobs",
  LIST_ALL: "/api/jobs", // supports ?status=&workType=&minSalary=&verifiedOnly=&sort= query params
  LIST_BY_COMPANY: (companyId: string) => `/api/jobs/company/${companyId}`,
  GET_BY_ID: (jobId: string) => `/api/jobs/${jobId}`,
  UPDATE: (jobId: string) => `/api/jobs/${jobId}`,
  CLOSE: (jobId: string) => `/api/jobs/${jobId}/close`,
  DELETE: (jobId: string) => `/api/jobs/${jobId}`,
};

export const COMPANY_ENDPOINTS = {
  ME: "/api/companies/me", // employer-only, requires auth
  GET_BY_ID: (companyId: string) => `/api/companies/${companyId}`, // public
};

export const SALARY_ENDPOINTS = {
  EXPLORER: "/api/salary-explorer", // public
};

export const APPLICATION_ENDPOINTS = {
  APPLY: (jobId: string) => `/api/jobs/${jobId}/apply`, // job_seeker-only
  MY_APPLICATIONS: "/api/applications/me", // job_seeker-only
  APPLICANTS_FOR_JOB: (jobId: string) => `/api/jobs/${jobId}/applicants`, // employer-only, must own the job
  APPLICANTS_FOR_EMPLOYER: "/api/applicants/me", // employer-only, across all their jobs
  STAGE_COUNTS: "/api/applicants/stats", // employer-only
  UPDATE_STAGE: (applicationId: string) => `/api/applications/${applicationId}/stage`, // employer-only, must own the job
};