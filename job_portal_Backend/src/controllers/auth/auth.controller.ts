import { Request, Response, NextFunction } from "express";
import { authService } from "../../services/auth/auth.services";
import { HttpError } from "../../errors/http_error";
import {
  RegisterJobSeekerDto,
  RegisterEmployerDto,
  LoginDto,
} from "../../dtos/auth/auth.dtos";

// Build a public URL/path for a stored file. Adjust to match how you serve
// static files (e.g. app.use("/uploads", express.static(...))).
const toPublicPath = (folder: string, filename: string): string =>
  `/${folder}/${filename}`;

export const authController = {
  async registerJobSeeker(req: Request, res: Response, next: NextFunction) {
    try {
      const dto: RegisterJobSeekerDto = {
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
        fullName: req.body.fullName,
        topSkills: req.body.topSkills,
        aboutYourself: req.body.aboutYourself,
      };

      const files = req.files as { qualificationImages?: Express.Multer.File[] };
      const qualificationImagePaths =
        files?.qualificationImages?.map((file) =>
          toPublicPath("qualification_images", file.filename)
        ) ?? [];

      const result = await authService.registerJobSeeker(dto, qualificationImagePaths);

      return res.status(201).json({
        success: true,
        message: "Job seeker registered successfully. Awaiting verification.",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async registerEmployer(req: Request, res: Response, next: NextFunction) {
    try {
      const dto: RegisterEmployerDto = {
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
        companyName: req.body.companyName,
        industry: req.body.industry,
        headquarters: req.body.headquarters,
        companyWebsite: req.body.companyWebsite,
        aboutCompany: req.body.aboutCompany,
        whyChooseUs: req.body.whyChooseUs,
        businessRegistrationNumber: req.body.businessRegistrationNumber,
      };

      const files = req.files as { companyDocument?: Express.Multer.File[] };
      const companyDocFile = files?.companyDocument?.[0];

      if (!companyDocFile) {
        throw new HttpError(400, "Company document is required.");
      }

      const companyDocumentPath = toPublicPath("company_documents", companyDocFile.filename);

      const result = await authService.registerEmployer(dto, companyDocumentPath);

      return res.status(201).json({
        success: true,
        message: "Employer registered successfully. Awaiting verification.",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const dto: LoginDto = {
        email: req.body.email,
        password: req.body.password,
      };

      const result = await authService.login(dto);

      return res.status(200).json({
        success: true,
        message: "Login successful.",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      if (!email) throw new HttpError(400, "Email is required.");

      await authService.forgotPassword(email);

      // Always return success to prevent email enumeration
      return res.status(200).json({
        success: true,
        message: "If an account exists with that email, a reset link has been sent.",
      });
    } catch (error) {
      next(error);
    }
  },

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, newPassword } = req.body;
      if (!token || !newPassword) throw new HttpError(400, "Token and new password are required.");
      if (newPassword.length < 8) throw new HttpError(400, "Password must be at least 8 characters.");

      await authService.resetPassword(token, newPassword);

      return res.status(200).json({
        success: true,
        message: "Password reset successfully.",
      });
    } catch (error) {
      next(error);
    }
  },
};