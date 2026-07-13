// Single source of truth for internal routes. Every header, redirect, and
// internal <Link> should import from here instead of hardcoding path
// strings — that's what caused the header links to drift out of sync with
// the actual page folders.

export const ROUTES = {
  home: '/',
  login: '/Features/login',
  register: '/Features/register',

  // Job seeker
  seekerDashboard: '/Features/seeker_dashboard',
  findJobs: './Features/Findjob',
  myApplications: '/Features/Applications',
  savedJobs: '/Features/SavedJobs',
  updateJobSeekerProfile: '/Features/UpdateJobSeekerProfile',

  // Employer
  employerDashboard: '/Features/employer_dashboard',
  postJob: '/Features/PostJob',
  applicants: '/Features/ApplicantsList',
  updateEmployerProfile: '/Features/UpdateEmployerProfile',

  // Shared
  salaryExplorer: '/Features/SalaryExplorer',
  companyList: '/Features/CompanyList',
  companyProfile: (companyId: string) => `/Features/CompanyProfile/${companyId}`,
  jobProfile: (jobId: string) => `/Features/job_profile/${jobId}`,
} as const;