// Central place for every backend route the frontend calls.
// Keeps raw URL strings out of api/*.ts files — if a backend route
// changes, this is the only file that needs updating.

export const AUTH_ENDPOINTS = {
  REGISTER_JOB_SEEKER: "/api/auth/register/job-seeker",
  REGISTER_EMPLOYER: "/api/auth/register/employer",
  LOGIN: "/api/auth/login",
};

export const JOB_ENDPOINTS = {
  CREATE: "/api/jobs",
  LIST_ALL: "/api/jobs", // supports ?status=&workType= query params
  LIST_BY_COMPANY: (companyId: string) => `/api/jobs/company/${companyId}`,
  GET_BY_ID: (jobId: string) => `/api/jobs/${jobId}`,
  UPDATE: (jobId: string) => `/api/jobs/${jobId}`,
  CLOSE: (jobId: string) => `/api/jobs/${jobId}/close`,
};

// Not implemented on the backend yet — reserved names so the frontend
// can already reference them; wire these up once the routes exist.
export const APPLICATION_ENDPOINTS = {
  APPLY: (jobId: string) => `/api/jobs/${jobId}/applications`,
  LIST_APPLICANTS: (jobId: string) => `/api/jobs/${jobId}/applications`,
  UPDATE_STAGE: (applicationId: string) => `/api/applications/${applicationId}/stage`,
};

export const COMPANY_ENDPOINTS = {
  ME: "/api/companies/me",
  GET_BY_ID: (companyId: string) => `/api/companies/${companyId}`,
};

// Central place for every backend route the frontend calls.
// Keeps raw URL strings out of api/*.ts files — if a backend route
// changes, this is the only file that needs updating.


export const SALARY_ENDPOINTS = {
  EXPLORER: "/api/salary-explorer",
};
