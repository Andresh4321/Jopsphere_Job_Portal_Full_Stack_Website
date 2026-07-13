import mongoose, { Schema, Document, Types } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { VerificationStatus } from "../../types/Auth/auth.type";

export interface ICompany extends Document {
  companyId: string; // human-readable public id, e.g. CMP-xxxxxxxx
  employerId: Types.ObjectId; // ref -> User._id
  companyName: string;
  industry: string;
  headquarters: string;
  companyWebsite: string;
  aboutCompany: string;
  whyChooseUs: string;
  businessRegistrationNumber: string;
  companyDocument: string; // file path / URL to uploaded registration doc
  companyLogo?: string; // file path / URL
  status: VerificationStatus;
  createdAt: Date;
  updatedAt: Date;
}

const companySchema = new Schema<ICompany>(
  {
    companyId: {
      type: String,
      required: true,
      unique: true,
      default: () => `CMP-${uuidv4().split("-")[0].toUpperCase()}`,
    },
    employerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    companyName: { type: String, required: true, trim: true },
    industry: { type: String, required: true, trim: true },
    headquarters: { type: String, required: true, trim: true },
    companyWebsite: { type: String, required: true, trim: true },
    aboutCompany: { type: String, required: true },
    whyChooseUs: { type: String, required: true },
    businessRegistrationNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    companyDocument: { type: String, required: true },
    companyLogo: { type: String },
    status: {
      type: String,
      enum: Object.values(VerificationStatus),
      default: VerificationStatus.UNVERIFIED,
    },
  },
  { timestamps: true }
);

export const CompanyModel = mongoose.model<ICompany>("Company", companySchema);