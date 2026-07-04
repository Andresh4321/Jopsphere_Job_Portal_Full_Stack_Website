import axiosClient from "../api/axois";
import { COMPANY_ENDPOINTS } from "./endpoints";
import { MyCompany, PublicCompanyProfile, ApiResponse } from "../types/company.types";

export const companyApi = {
  async getMyCompany(): Promise<MyCompany> {
    const res = await axiosClient.get<ApiResponse<MyCompany>>(COMPANY_ENDPOINTS.ME);
    return res.data.data;
  },

  async getCompanyById(companyId: string): Promise<PublicCompanyProfile> {
    const res = await axiosClient.get<ApiResponse<PublicCompanyProfile>>(
      COMPANY_ENDPOINTS.GET_BY_ID(companyId)
    );
    return res.data.data;
  },
};