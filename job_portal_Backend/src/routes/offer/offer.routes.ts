import { Router } from "express";
import { offerController } from "../../controllers/offer/offer.controller";
import { requireAuth } from "../../middleware/auth.middleware";

const router = Router();

// All offer routes just require auth — ownership (employer vs job seeker on
// THIS specific offer) is checked inside the service, not by role, since
// both roles legitimately access the same offer from different sides.

// POST /api/applications/:applicationId/offer — employer creates an offer
router.post("/applications/:applicationId/offer", requireAuth, offerController.createOffer);

// GET /api/applications/:applicationId/offer — either side looks up the offer for an application
router.get("/applications/:applicationId/offer", requireAuth, offerController.getOfferByApplication);

// GET /api/offers/:offerId
router.get("/offers/:offerId", requireAuth, offerController.getOfferById);

// GET /api/offers/:offerId/messages
router.get("/offers/:offerId/messages", requireAuth, offerController.getMessages);

// POST /api/offers/:offerId/messages
router.post("/offers/:offerId/messages", requireAuth, offerController.sendMessage);

// PATCH /api/offers/:offerId/salary — propose a new salary (resets both agreement flags)
router.patch("/offers/:offerId/salary", requireAuth, offerController.proposeSalary);

// POST /api/offers/:offerId/agree — mark my agreement; auto-hires when both sides have agreed
router.post("/offers/:offerId/agree", requireAuth, offerController.agree);

export default router;