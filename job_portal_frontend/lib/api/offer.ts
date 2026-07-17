import axiosClient from '../api/axois';
import { Offer, OfferMessage, CreateOfferPayload, Conversation, ApiResponse } from '../types/offer.types';

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

  async sendMessage(offerId: string, message: string, attachment?: File): Promise<OfferMessage> {
    const formData = new FormData();
    if (message) formData.append('message', message);
    if (attachment) formData.append('attachment', attachment);

    const res = await axiosClient.post<ApiResponse<OfferMessage>>(
      `/api/offers/${offerId}/messages`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
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

  async getMyConversations(): Promise<Conversation[]> {
    const res = await axiosClient.get<ApiResponse<Conversation[]>>('/api/offers/me');
    return res.data.data;
  },
};