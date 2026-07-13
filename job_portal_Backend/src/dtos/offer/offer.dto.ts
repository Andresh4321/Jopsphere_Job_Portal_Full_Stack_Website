export interface CreateOfferDto {
  salary: number | string;
  startDate: string; // ISO date
  responseWindowDays: number | string;
  message?: string;
}

export interface ProposeSalaryDto {
  salary: number | string;
}

export interface SendOfferMessageDto {
  message: string;
}