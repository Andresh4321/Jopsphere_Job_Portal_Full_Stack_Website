import { AxiosError } from 'axios';
import { offerApi } from '../api/offer';
import { CreateOfferPayload } from '../types/offer.types';

const extractErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || error.message || 'Something went wrong. Please try again.';
  }
  if (error instanceof Error) return error.message;
  return 'Something went wrong. Please try again.';
};

export const offerAction = {
  async createOffer(applicationId: string, payload: CreateOfferPayload) {
    try {
      const data = await offerApi.createOffer(applicationId, payload);
      return { success: true as const, data };
    } catch (error) {
      return { success: false as const, message: extractErrorMessage(error) };
    }
  },

  async getOfferByApplication(applicationId: string) {
    try {
      const data = await offerApi.getOfferByApplication(applicationId);
      return { success: true as const, data };
    } catch (error) {
      return { success: false as const, message: extractErrorMessage(error) };
    }
  },

  async getOfferById(offerId: string) {
    try {
      const data = await offerApi.getOfferById(offerId);
      return { success: true as const, data };
    } catch (error) {
      return { success: false as const, message: extractErrorMessage(error) };
    }
  },

  async getMessages(offerId: string) {
    try {
      const data = await offerApi.getMessages(offerId);
      return { success: true as const, data };
    } catch (error) {
      return { success: false as const, message: extractErrorMessage(error) };
    }
  },

  async sendMessage(offerId: string, message: string) {
    try {
      const data = await offerApi.sendMessage(offerId, message);
      return { success: true as const, data };
    } catch (error) {
      return { success: false as const, message: extractErrorMessage(error) };
    }
  },

  async proposeSalary(offerId: string, salary: number) {
    try {
      const data = await offerApi.proposeSalary(offerId, salary);
      return { success: true as const, data };
    } catch (error) {
      return { success: false as const, message: extractErrorMessage(error) };
    }
  },

  async agree(offerId: string) {
    try {
      const data = await offerApi.agree(offerId);
      return { success: true as const, data };
    } catch (error) {
      return { success: false as const, message: extractErrorMessage(error) };
    }
  },
};