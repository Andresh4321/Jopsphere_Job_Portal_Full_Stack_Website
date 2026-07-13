import mongoose, { Schema, Document, Types } from "mongoose";

export type OfferStatus = "pending" | "negotiating" | "accepted" | "declined";

export interface IOffer extends Document {
  applicationId: Types.ObjectId; // ref -> Application._id (one offer per application)
  jobId: Types.ObjectId;
  jobSeekerId: Types.ObjectId; // ref -> User._id
  employerId: Types.ObjectId; // ref -> User._id
  companyId: string;
  salary: number; // current proposed monthly salary (NPR)
  startDate: Date;
  responseWindowDays: number;
  message: string; // employer's message when the offer was created
  pdfPath: string; // generated offer letter PDF
  status: OfferStatus;
  employerAgreed: boolean;
  seekerAgreed: boolean;
  agreedSalary?: number; // set once both sides agree
  createdAt: Date;
  updatedAt: Date;
}

const offerSchema = new Schema<IOffer>(
  {
    applicationId: { type: Schema.Types.ObjectId, ref: "Application", required: true, unique: true },
    jobId: { type: Schema.Types.ObjectId, ref: "PostedJob", required: true },
    jobSeekerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    employerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    companyId: { type: String, required: true },
    salary: { type: Number, required: true, min: 0 },
    startDate: { type: Date, required: true },
    responseWindowDays: { type: Number, required: true, min: 1 },
    message: { type: String, default: "" },
    pdfPath: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "negotiating", "accepted", "declined"],
      default: "pending",
    },
    employerAgreed: { type: Boolean, default: false },
    seekerAgreed: { type: Boolean, default: false },
    agreedSalary: { type: Number },
  },
  { timestamps: true }
);

export const OfferModel = mongoose.model<IOffer>("Offer", offerSchema);