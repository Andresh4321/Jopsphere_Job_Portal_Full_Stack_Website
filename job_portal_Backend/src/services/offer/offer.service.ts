import { OfferModel, IOffer } from "../../models/offer/offer.model";
import { OfferMessageModel } from "../../models/offer/offermessage.model";
import { ApplicationModel } from "../../models/application/application.model";
import { PostedJobModel } from "../../models/PostJob/postedjob.model";
import { JobSeekerModel } from "../../models/auth/jobseeker.model";
import { CompanyModel } from "../../models/auth/company.model";
import { ApplicationStage } from "../../types/application/application.types";
import { HttpError } from "../../errors/http_error";
import { CreateOfferDto, ProposeSalaryDto, SendOfferMessageDto } from "../../dtos/offer/offer.dto";
import { generateOfferLetterPdf } from "../../utils/offerLetterPdf";
import { emitToOffer } from "../../services/socket.service";

const toOfferResponse = (offer: IOffer) => ({
  id: offer._id.toString(),
  applicationId: offer.applicationId.toString(),
  jobId: offer.jobId.toString(),
  salary: offer.salary,
  startDate: offer.startDate,
  responseWindowDays: offer.responseWindowDays,
  message: offer.message,
  pdfPath: offer.pdfPath,
  status: offer.status,
  employerAgreed: offer.employerAgreed,
  seekerAgreed: offer.seekerAgreed,
  agreedSalary: offer.agreedSalary,
  createdAt: offer.createdAt,
  updatedAt: offer.updatedAt,
});

// Verifies the requesting user is either the employer or job seeker on this
// offer, and returns which role they are.
const authorizeOfferAccess = (offer: IOffer, userId: string): "employer" | "job_seeker" => {
  if (offer.employerId.toString() === userId) return "employer";
  if (offer.jobSeekerId.toString() === userId) return "job_seeker";
  throw new HttpError(403, "You are not authorized to access this offer.");
};

export const offerService = {
  async createOffer(applicationId: string, employerId: string, dto: CreateOfferDto) {
    const application = await ApplicationModel.findById(applicationId);
    if (!application) throw new HttpError(404, "Application not found.");
    if (application.employerId.toString() !== employerId) {
      throw new HttpError(403, "You are not authorized to make an offer for this application.");
    }

    const existing = await OfferModel.findOne({ applicationId });
    if (existing) {
      throw new HttpError(409, "An offer already exists for this application.");
    }

    const salary = Number(dto.salary);
    const responseWindowDays = Number(dto.responseWindowDays);
    const startDate = new Date(dto.startDate);

    if (Number.isNaN(salary) || salary <= 0) throw new HttpError(400, "Please provide a valid salary.");
    if (Number.isNaN(responseWindowDays) || responseWindowDays < 1) {
      throw new HttpError(400, "Response window must be at least 1 day.");
    }
    if (Number.isNaN(startDate.getTime())) throw new HttpError(400, "Please provide a valid start date.");

    const [job, jobSeekerProfile] = await Promise.all([
      PostedJobModel.findById(application.jobId),
      JobSeekerModel.findOne({ userId: application.jobSeekerId }),
    ]);
    if (!job) throw new HttpError(404, "Job not found.");

    const company = await CompanyModel.findOne({ companyId: job.companyId });
    if (!company) throw new HttpError(404, "Company not found.");

    const pdfPath = await generateOfferLetterPdf({
      candidateName: jobSeekerProfile?.fullName ?? "Candidate",
      jobTitle: job.jobTitle,
      companyName: company.companyName,
      salary,
      startDate,
      responseWindowDays,
      message: dto.message ?? "",
    });

    const offer = await OfferModel.create({
      applicationId: application._id,
      jobId: job._id,
      jobSeekerId: application.jobSeekerId,
      employerId: application.employerId,
      companyId: job.companyId,
      salary,
      startDate,
      responseWindowDays,
      message: dto.message ?? "",
      pdfPath,
      status: "pending",
    });

    // Making an offer is itself a stage change on the application.
    application.stage = ApplicationStage.OFFER;
    await application.save();

    return toOfferResponse(offer);
  },

  async getOfferById(offerId: string, userId: string) {
    const offer = await OfferModel.findById(offerId);
    if (!offer) throw new HttpError(404, "Offer not found.");
    authorizeOfferAccess(offer, userId);
    return toOfferResponse(offer);
  },

  async getOfferByApplication(applicationId: string, userId: string) {
    const offer = await OfferModel.findOne({ applicationId });
    if (!offer) throw new HttpError(404, "No offer found for this application.");
    authorizeOfferAccess(offer, userId);
    return toOfferResponse(offer);
  },

  async getMessages(offerId: string, userId: string) {
    const offer = await OfferModel.findById(offerId);
    if (!offer) throw new HttpError(404, "Offer not found.");
    authorizeOfferAccess(offer, userId);

    const messages = await OfferMessageModel.find({ offerId }).sort({ createdAt: 1 });
    return messages.map((m) => ({
      id: m._id.toString(),
      senderId: m.senderId.toString(),
      senderRole: m.senderRole,
      message: m.message,
      createdAt: m.createdAt,
    }));
  },

  async sendMessage(offerId: string, userId: string, dto: SendOfferMessageDto) {
    const offer = await OfferModel.findById(offerId);
    if (!offer) throw new HttpError(404, "Offer not found.");
    const role = authorizeOfferAccess(offer, userId);

    if (!dto.message?.trim()) throw new HttpError(400, "Message cannot be empty.");

    const created = await OfferMessageModel.create({
      offerId,
      senderId: userId,
      senderRole: role,
      message: dto.message.trim(),
    });

    const payload = {
      id: created._id.toString(),
      senderId: created.senderId.toString(),
      senderRole: created.senderRole,
      message: created.message,
      createdAt: created.createdAt,
    };

    emitToOffer(offerId, "message:new", payload);

    return payload;
  },

  async proposeSalary(offerId: string, userId: string, dto: ProposeSalaryDto) {
    const offer = await OfferModel.findById(offerId);
    if (!offer) throw new HttpError(404, "Offer not found.");
    authorizeOfferAccess(offer, userId);

    const salary = Number(dto.salary);
    if (Number.isNaN(salary) || salary <= 0) throw new HttpError(400, "Please provide a valid salary.");

    offer.salary = salary;
    offer.status = "negotiating";
    // A new proposal invalidates any prior agreement — both sides must
    // re-confirm the new number.
    offer.employerAgreed = false;
    offer.seekerAgreed = false;
    await offer.save();

    const payload = toOfferResponse(offer);
    emitToOffer(offerId, "offer:updated", payload);

    return payload;
  },

  async setAgreement(offerId: string, userId: string) {
    const offer = await OfferModel.findById(offerId);
    if (!offer) throw new HttpError(404, "Offer not found.");
    const role = authorizeOfferAccess(offer, userId);

    if (role === "employer") offer.employerAgreed = true;
    else offer.seekerAgreed = true;

    let justHired = false;

    if (offer.employerAgreed && offer.seekerAgreed) {
      offer.status = "accepted";
      offer.agreedSalary = offer.salary;
      justHired = true;

      const application = await ApplicationModel.findById(offer.applicationId);
      if (application) {
        application.stage = ApplicationStage.HIRED;
        await application.save();
      }
    }

    await offer.save();

    const payload = { ...toOfferResponse(offer), justHired };
    emitToOffer(offerId, "agreement:updated", payload);

    return payload;
  },
};