export type OfferStatus = 'pending' | 'negotiating' | 'accepted' | 'declined';

export interface Offer {
  id: string;
  applicationId: string;
  jobId: string;
  salary: number;
  startDate: string;
  responseWindowDays: number;
  message: string;
  pdfPath: string;
  status: OfferStatus;
  employerAgreed: boolean;
  seekerAgreed: boolean;
  agreedSalary?: number;
  createdAt: string;
  updatedAt: string;
}

export interface OfferMessage {
  id: string;
  senderId: string;
  senderRole: 'job_seeker' | 'employer';
  message: string;
  attachmentPath?: string;
  attachmentName?: string;
  attachmentType?: 'resume' | 'image' | 'file';
  createdAt: string;
}

export interface Conversation {
  offerId: string;
  jobTitle: string;
  counterpartName: string;
  status: OfferStatus;
  lastMessage: {
    text: string;
    hasAttachment: boolean;
    senderRole: 'job_seeker' | 'employer';
    createdAt: string;
  } | null;
  updatedAt: string;
}

export interface CreateOfferPayload {
  salary: number;
  startDate: string;
  responseWindowDays: number;
  message?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}