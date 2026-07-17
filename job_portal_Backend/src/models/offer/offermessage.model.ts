import mongoose, { Schema, Document, Types } from "mongoose";

export type AttachmentType = "resume" | "image" | "file";

export interface IOfferMessage extends Document {
  offerId: Types.ObjectId;
  senderId: Types.ObjectId;
  senderRole: "job_seeker" | "employer";
  message: string; // can be empty if this message is attachment-only
  attachmentPath?: string;
  attachmentName?: string;
  attachmentType?: AttachmentType;
  createdAt: Date;
}

const offerMessageSchema = new Schema<IOfferMessage>(
  {
    offerId: { type: Schema.Types.ObjectId, ref: "Offer", required: true },
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    senderRole: { type: String, enum: ["job_seeker", "employer"], required: true },
    message: { type: String, default: "", trim: true },
    attachmentPath: { type: String },
    attachmentName: { type: String },
    attachmentType: { type: String, enum: ["resume", "image", "file"] },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

offerMessageSchema.index({ offerId: 1, createdAt: 1 });

export const OfferMessageModel = mongoose.model<IOfferMessage>("OfferMessage", offerMessageSchema);