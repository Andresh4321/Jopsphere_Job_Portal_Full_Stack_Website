import axiosClient from '../api/axois';
import { PublicCompanyProfile, MyCompany, ApiResponse } from '../types/company.types';
import { CompanyListItem, CompanyProfileFull,  UpdateCompanyPayload} from '../types/company.types';

const COMPANY_ME_ENDPOINT = '/api/companies/me';
const COMPANY_LIST_ENDPOINT = '/api/companies';
const COMPANY_GET_BY_ID = (companyId: string) => `/api/companies/${companyId}`;
const COMPANY_PROFILE_ENDPOINT = (companyId: string) => `/api/companies/${companyId}/profile`;

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

  async listCompanies(): Promise<CompanyListItem[]> {
    const res = await axiosClient.get<ApiResponse<CompanyListItem[]>>(COMPANY_LIST_ENDPOINT);
    return res.data.data;
  },

  async getCompanyProfile(companyId: string): Promise<CompanyProfileFull> {
    const res = await axiosClient.get<ApiResponse<CompanyProfileFull>>(
      COMPANY_PROFILE_ENDPOINT(companyId)
    );
    return res.data.data;
  },

  async updateMyCompany(payload: UpdateCompanyPayload): Promise<MyCompany> {
    const formData = new FormData();
    if (payload.companyName !== undefined) formData.append('companyName', payload.companyName);
    if (payload.industry !== undefined) formData.append('industry', payload.industry);
    if (payload.headquarters !== undefined) formData.append('headquarters', payload.headquarters);
    if (payload.companyWebsite !== undefined) formData.append('companyWebsite', payload.companyWebsite);
    if (payload.aboutCompany !== undefined) formData.append('aboutCompany', payload.aboutCompany);
    if (payload.whyChooseUs !== undefined) formData.append('whyChooseUs', payload.whyChooseUs);
    if (payload.companyLogo) formData.append('companyLogo', payload.companyLogo);

    const res = await axiosClient.patch<ApiResponse<MyCompany>>(COMPANY_ME_ENDPOINT, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },
};