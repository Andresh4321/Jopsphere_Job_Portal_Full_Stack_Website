import axiosClient from '../api/axois';
import { PublicCompanyProfile, MyCompany, ApiResponse } from '../types/company.types';

const COMPANY_ME_ENDPOINT = '/api/companies/me';
const COMPANY_GET_BY_ID = (companyId: string) => `/api/companies/${companyId}`;

export const companyApi = {
  // Employer-only, requires auth. Resolves the logged-in employer's own
  // companyId — used by the Post Job page to know which company to post under.
  async getMyCompany(): Promise<MyCompany> {
    const res = await axiosClient.get<ApiResponse<MyCompany>>(COMPANY_ME_ENDPOINT);
    return res.data.data;
  },

  async getCompanyById(companyId: string): Promise<PublicCompanyProfile> {
    const res = await axiosClient.get<ApiResponse<PublicCompanyProfile>>(
      COMPANY_GET_BY_ID(companyId)
    );
    return res.data.data;
  },
};