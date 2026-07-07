import mongoose, { Schema, Document, Types } from "mongoose";
import { ApplicationStage } from "../../types/application/application.types";

export interface IApplication extends Document {
  jobId: Types.ObjectId; // ref -> PostedJob._id
  jobSeekerId: Types.ObjectId; // ref -> User._id
  employerId: Types.ObjectId; // ref -> User._id (denormalized for fast ownership checks)
  companyId: string; // denormalized for employer-side queries
  fitScore: number; // 0-100, computed at apply time
  stage: ApplicationStage;
  createdAt: Date; // = "applied at"
  updatedAt: Date; // bumps on every stage change
}

const applicationSchema = new Schema<IApplication>(
  {
    jobId: { type: Schema.Types.ObjectId, ref: "PostedJob", required: true },
    jobSeekerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    employerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    companyId: { type: String, required: true },
    fitScore: { type: Number, required: true, min: 0, max: 100 },
    stage: {
      type: String,
      enum: Object.values(ApplicationStage),
      default: ApplicationStage.APPLIED,
    },
  },
  { timestamps: true }
);

// A job seeker can only apply once per job.
applicationSchema.index({ jobId: 1, jobSeekerId: 1 }, { unique: true });

export const ApplicationModel = mongoose.model<IApplication>("Application", applicationSchema);