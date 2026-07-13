import mongoose, { Schema, Document, Types } from "mongoose";

export interface IOfferMessage extends Document {
  offerId: Types.ObjectId;
  senderId: Types.ObjectId;
  senderRole: "job_seeker" | "employer";
  message: string;
  createdAt: Date;
}

const offerMessageSchema = new Schema<IOfferMessage>(
  {
    offerId: { type: Schema.Types.ObjectId, ref: "Offer", required: true },
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    senderRole: { type: String, enum: ["job_seeker", "employer"], required: true },
    message: { type: String, required: true, trim: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

offerMessageSchema.index({ offerId: 1, createdAt: 1 });

export const OfferMessageModel = mongoose.model<IOfferMessage>("OfferMessage", offerMessageSchema);