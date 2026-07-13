import mongoose, { Schema, Document, Types } from "mongoose";
import { WorkType } from "../../types/PostJob/job.type";

export interface IJobSeeker extends Document {
  userId: Types.ObjectId;
  fullName: string;
  topSkills: string[]; // exactly 3
  aboutYourself: string;
  qualificationImages: string[]; // file paths / URLs
  preferredLocation?: string; // used for fit-score location matching
  preferredWorkType?: WorkType; // used for fit-score work-type matching
  profileImage?: string; // file path / URL
  experienceYears?: number;
  expectedSalary?: number; // NPR / month
  noticePeriodDays?: number;
  education?: string;
  linkedinUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const jobSeekerSchema = new Schema<IJobSeeker>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    fullName: { type: String, required: true, trim: true },
    topSkills: {
      type: [String],
      required: true,
      validate: {
        validator: (skills: string[]) => skills.length === 3,
        message: "topSkills must contain exactly 3 skills",
      },
    },
    aboutYourself: { type: String, required: true, trim: true },
    qualificationImages: { type: [String], default: [] },
    preferredLocation: { type: String, trim: true },
    preferredWorkType: { type: String, enum: Object.values(WorkType) },
    profileImage: { type: String },
    experienceYears: { type: Number, min: 0 },
    expectedSalary: { type: Number, min: 0 },
    noticePeriodDays: { type: Number, min: 0 },
    education: { type: String, trim: true },
    linkedinUrl: { type: String, trim: true },
  },
  { timestamps: true }
);

export const JobSeekerModel = mongoose.model<IJobSeeker>(
  "JobSeeker",
  jobSeekerSchema
);