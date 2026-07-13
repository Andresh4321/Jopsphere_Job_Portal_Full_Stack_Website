import { Response, NextFunction } from "express";
import { offerService } from "../../services/offer/offer.service";
import { HttpError } from "../../errors/http_error";
import { AuthenticatedRequest } from "../../types/Auth/auth.type";
import { CreateOfferDto, ProposeSalaryDto, SendOfferMessageDto } from "../../dtos/offer/offer.dto";

export const offerController = {
  async createOffer(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new HttpError(401, "Not authenticated.");
      const applicationId = String(req.params.applicationId);
      const dto: CreateOfferDto = req.body;
      const offer = await offerService.createOffer(applicationId, req.user.userId, dto);
      return res.status(201).json({ success: true, message: "Offer sent.", data: offer });
    } catch (error) {
      next(error);
    }
  },

  async getOfferById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new HttpError(401, "Not authenticated.");
      const offerId = String(req.params.offerId);
      const offer = await offerService.getOfferById(offerId, req.user.userId);
      return res.status(200).json({ success: true, data: offer });
    } catch (error) {
      next(error);
    }
  },

  async getOfferByApplication(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new HttpError(401, "Not authenticated.");
      const applicationId = String(req.params.applicationId);
      const offer = await offerService.getOfferByApplication(applicationId, req.user.userId);
      return res.status(200).json({ success: true, data: offer });
    } catch (error) {
      next(error);
    }
  },

  async getMessages(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new HttpError(401, "Not authenticated.");
      const offerId = String(req.params.offerId);
      const messages = await offerService.getMessages(offerId, req.user.userId);
      return res.status(200).json({ success: true, data: messages });
    } catch (error) {
      next(error);
    }
  },

  async sendMessage(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new HttpError(401, "Not authenticated.");
      const offerId = String(req.params.offerId);
      const dto: SendOfferMessageDto = req.body;
      const message = await offerService.sendMessage(offerId, req.user.userId, dto);
      return res.status(201).json({ success: true, data: message });
    } catch (error) {
      next(error);
    }
  },

  async proposeSalary(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new HttpError(401, "Not authenticated.");
      const offerId = String(req.params.offerId);
      const dto: ProposeSalaryDto = req.body;
      const offer = await offerService.proposeSalary(offerId, req.user.userId, dto);
      return res.status(200).json({ success: true, data: offer });
    } catch (error) {
      next(error);
    }
  },

  async agree(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new HttpError(401, "Not authenticated.");
      const offerId = String(req.params.offerId);
      const offer = await offerService.setAgreement(offerId, req.user.userId);
      return res.status(200).json({ success: true, data: offer });
    } catch (error) {
      next(error);
    }
  },
};