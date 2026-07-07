export enum ApplicationStage {
  APPLIED = "applied",
  VIEWED = "viewed",
  SHORTLISTED = "shortlisted",
  INTERVIEW = "interview",
  OFFER = "offer",
  HIRED = "hired",
  REJECTED = "rejected",
}

// Order matters here - used to build seeker-facing progress timelines
// (a stage is "reached" if its index <= the application's current stage index).
export const APPLICATION_STAGE_ORDER: ApplicationStage[] = [
  ApplicationStage.APPLIED,
  ApplicationStage.VIEWED,
  ApplicationStage.SHORTLISTED,
  ApplicationStage.INTERVIEW,
  ApplicationStage.OFFER,
  ApplicationStage.HIRED,
];

export interface StageCounts {
  all: number;
  applied: number;
  viewed: number;
  shortlisted: number;
  interview: number;
  offer: number;
  hired: number;
  rejected: number;
}