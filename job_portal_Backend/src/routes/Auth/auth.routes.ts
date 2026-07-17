import { Router } from "express";
import { authController } from "../../controllers/auth/auth.controller";
import {
  jobSeekerRegisterUpload,
  employerRegisterUpload,
} from "../../middleware/upload.middleware";

const router = Router();

// POST /api/auth/register/job-seeker
// multipart/form-data fields: email, phone, password, fullName,
// topSkills (x3, or JSON array string), aboutYourself,
// qualificationImages (files, up to 5)
router.post(
  "/register/job-seeker",
  jobSeekerRegisterUpload,
  authController.registerJobSeeker
);

// POST /api/auth/register/employer
// multipart/form-data fields: email, phone, password, companyName,
// industry, headquarters, companyWebsite, aboutCompany, whyChooseUs,
// businessRegistrationNumber, companyDocument (file)
router.post(
  "/register/employer",
  employerRegisterUpload,
  authController.registerEmployer
);

// POST /api/auth/login
// JSON body: email, password
// Response includes `redirectTo` telling the frontend which homepage to send the user to.
router.post("/login", authController.login);

// POST /api/auth/forgot-password
// JSON body: email
// Generates a reset token (stored in DB with expiry), in production would send email.
router.post("/forgot-password", authController.forgotPassword);

// POST /api/auth/reset-password
// JSON body: token, newPassword
// Validates token, updates password hash.
router.post("/reset-password", authController.resetPassword);

export default router;