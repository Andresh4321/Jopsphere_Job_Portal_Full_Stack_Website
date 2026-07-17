// Single source of truth for internal routes. Every header link, redirect,
// and internal <Link>/router.push should import from here instead of
// hardcoding path strings — mismatched hardcoded strings are exactly what
// caused the header/dashboard links to break repeatedly.

export const ROUTES = {
  home: '/', // TODO confirm: is this actually Features/homepage instead?
  login: '/Features/login',
  register: '/Features/Register',
  forgotPassword: '/Features/ForgotPassword',
  resetPassword: '/Features/ResetPassword',

  // Job seeker
  seekerDashboard: '/Features/seeker_dashboard',
  findJobs: '/Features/Findjob',
  myApplications: '/Features/Applications',
  savedJobs: '/Features/savedjobs',
  updateJobSeekerProfile: '/Features/UpdateProfile/jobseeker', // confirm exact folder name

  // Employer
  employerDashboard: '/Features/employer_dashboard',
  postJob: '/Features/PostJob',
  applicants: '/Features/ApplicantsList',
  updateEmployerProfile: '/Features/UpdateProfile/employer',

  // Shared
  salaryExplorer: '/Features/SalaryExplorer',
  companyList: '/Features/CompanyList',
  companyProfile: (companyId: string) => `/Features/CompanyProfile/${companyId}`,
  jobProfile: (jobId: string) => `/Features/JobProfile/${jobId}`,
  offerNegotiation: (offerId: string) => `/Features/offer/offernegotiation/${offerId}` as const,
  messages: '/Features/Messages',
} as const;