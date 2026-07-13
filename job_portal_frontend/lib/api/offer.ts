import axiosClient from '../api/axois';
import { Offer, OfferMessage, CreateOfferPayload, ApiResponse } from '../types/offer.types';

export const offerApi = {
  async createOffer(applicationId: string, payload: CreateOfferPayload): Promise<Offer> {
    const res = await axiosClient.post<ApiResponse<Offer>>(
      `/api/applications/${applicationId}/offer`,
      payload
    );
    return res.data.data;
  },

  async getOfferByApplication(applicationId: string): Promise<Offer> {
    const res = await axiosClient.get<ApiResponse<Offer>>(`/api/applications/${applicationId}/offer`);
    return res.data.data;
  },

  async getOfferById(offerId: string): Promise<Offer> {
    const res = await axiosClient.get<ApiResponse<Offer>>(`/api/offers/${offerId}`);
    return res.data.data;
  },

  async getMessages(offerId: string): Promise<OfferMessage[]> {
    const res = await axiosClient.get<ApiResponse<OfferMessage[]>>(`/api/offers/${offerId}/messages`);
    return res.data.data;
  },

  async sendMessage(offerId: string, message: string): Promise<OfferMessage> {
    const res = await axiosClient.post<ApiResponse<OfferMessage>>(`/api/offers/${offerId}/messages`, { message });
    return res.data.data;
  },

  async proposeSalary(offerId: string, salary: number): Promise<Offer> {
    const res = await axiosClient.patch<ApiResponse<Offer>>(`/api/offers/${offerId}/salary`, { salary });
    return res.data.data;
  },

  async agree(offerId: string): Promise<Offer & { justHired: boolean }> {
    const res = await axiosClient.post<ApiResponse<Offer & { justHired: boolean }>>(`/api/offers/${offerId}/agree`);
    return res.data.data;
  },
};