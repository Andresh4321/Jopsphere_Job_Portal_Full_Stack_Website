import mongoose, { Schema, Document, Types } from "mongoose";

export interface IJobSeeker extends Document {
  userId: Types.ObjectId;
  fullName: string;
  topSkills: string[]; // exactly 3
  aboutYourself: string;
  qualificationImages: string[]; // file paths / URLs
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
  },
  { timestamps: true }
);

export const JobSeekerModel = mongoose.model<IJobSeeker>(
  "JobSeeker",
  jobSeekerSchema
);