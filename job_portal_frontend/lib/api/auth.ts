import axiosClient from "../api/axois";
import { AUTH_ENDPOINTS } from "./endpoints";
import {
  RegisterJobSeekerPayload,
  RegisterJobSeekerResponse,
  RegisterEmployerPayload,
  RegisterEmployerResponse,
  LoginPayload,
  LoginResponse,
  ApiResponse,
} from "../types/auth.types";

// This file only makes HTTP calls and returns the response data.
// No localStorage, no redirects, no toasts — that belongs in auth_action.ts.

export const authApi = {
  async registerJobSeeker(
    payload: RegisterJobSeekerPayload
  ): Promise<RegisterJobSeekerResponse> {
    const formData = new FormData();
    formData.append("email", payload.email);
    formData.append("phone", payload.phone);
    formData.append("password", payload.password);
    formData.append("fullName", payload.fullName);
    formData.append("topSkills", JSON.stringify(payload.topSkills));
    formData.append("aboutYourself", payload.aboutYourself);

    payload.qualificationImages?.forEach((file) => {
      formData.append("qualificationImages", file);
    });

    const res = await axiosClient.post<ApiResponse<RegisterJobSeekerResponse>>(
      AUTH_ENDPOINTS.REGISTER_JOB_SEEKER,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return res.data.data;
  },

  async registerEmployer(
    payload: RegisterEmployerPayload
  ): Promise<RegisterEmployerResponse> {
    const formData = new FormData();
    formData.append("email", payload.email);
    formData.append("phone", payload.phone);
    formData.append("password", payload.password);
    formData.append("companyName", payload.companyName);
    formData.append("industry", payload.industry);
    formData.append("headquarters", payload.headquarters);
    formData.append("companyWebsite", payload.companyWebsite);
    formData.append("aboutCompany", payload.aboutCompany);
    formData.append("whyChooseUs", payload.whyChooseUs);
    formData.append("businessRegistrationNumber", payload.businessRegistrationNumber);
    formData.append("companyDocument", payload.companyDocument);

    const res = await axiosClient.post<ApiResponse<RegisterEmployerResponse>>(
      AUTH_ENDPOINTS.REGISTER_EMPLOYER,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return res.data.data;
  },

  async login(payload: LoginPayload): Promise<LoginResponse> {
    const res = await axiosClient.post<ApiResponse<LoginResponse>>(
      AUTH_ENDPOINTS.LOGIN,
      payload
    );

    return res.data.data;
  },

  async forgotPassword(email: string): Promise<void> {
    await axiosClient.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, { email });
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await axiosClient.post(AUTH_ENDPOINTS.RESET_PASSWORD, { token, newPassword });
  },
};