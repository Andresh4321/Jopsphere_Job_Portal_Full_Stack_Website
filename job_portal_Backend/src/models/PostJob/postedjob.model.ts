import mongoose, { Schema, Document, Types } from "mongoose";
import { WorkType, ListingType, JobStatus, SalaryRange } from "../../types/PostJob/job.type";

export interface IPostedJob extends Document {
  companyId: string; // Company.companyId (human-readable, e.g. CMP-4F9A2B1C)
  companyRef: Types.ObjectId; // Company._id, for fast population/joins
  employerId: Types.ObjectId; // User._id of the employer who posted it
  jobTitle: string;
  department: string;
  workType: WorkType;
  location: string;
  hoursPerWeek?: number;
  applicationDeadline: Date;
  salary: SalaryRange;
  aboutRole: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  listingType: ListingType;
  status: JobStatus;
  createdAt: Date;
  updatedAt: Date;
}

const salarySchema = new Schema<SalaryRange>(
  {
    min: { type: Number, required: true, min: 0 },
    max: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const postedJobSchema = new Schema<IPostedJob>(
  {
    companyId: { type: String, required: true, index: true },
    companyRef: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    employerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    jobTitle: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    workType: { type: String, enum: Object.values(WorkType), required: true },
    location: { type: String, required: true, trim: true },
    hoursPerWeek: { type: Number, min: 0 },
    applicationDeadline: { type: Date, required: true },
    salary: { type: salarySchema, required: true },
    aboutRole: { type: String, required: true },
    responsibilities: {
      type: [String],
      required: true,
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: "At least one responsibility is required.",
      },
    },
    requirements: {
      type: [String],
      required: true,
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: "At least one requirement is required.",
      },
    },
    skills: {
      type: [String],
      required: true,
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: "At least one skill is required.",
      },
    },
    listingType: { type: String, enum: Object.values(ListingType), required: true },
    status: {
      type: String,
      enum: Object.values(JobStatus),
      default: JobStatus.OPEN,
    },
  },
  { timestamps: true }
);

// Async pre-save hook — no next() callback needed, so there's nothing for
// Mongoose's inconsistent hook typings to break. Throwing inside an async
// hook is enough to reject the save with a validation-style error.
postedJobSchema.pre("save", async function () {
  if (this.salary && this.salary.max < this.salary.min) {
    throw new Error("salary.max must be greater than or equal to salary.min");
  }
});

export const PostedJobModel = mongoose.model<IPostedJob>("PostedJob", postedJobSchema);