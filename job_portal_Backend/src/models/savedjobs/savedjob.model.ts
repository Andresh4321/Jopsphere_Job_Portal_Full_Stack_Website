import mongoose, { Schema, Document, Types } from "mongoose";

export interface ISavedJob extends Document {
  jobSeekerId: Types.ObjectId; // ref -> User._id
  jobId: Types.ObjectId; // ref -> PostedJob._id
  createdAt: Date;
}

const savedJobSchema = new Schema<ISavedJob>(
  {
    jobSeekerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    jobId: { type: Schema.Types.ObjectId, ref: "PostedJob", required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// A seeker can only save a given job once.
savedJobSchema.index({ jobSeekerId: 1, jobId: 1 }, { unique: true });

export const SavedJobModel = mongoose.model<ISavedJob>("SavedJob", savedJobSchema);