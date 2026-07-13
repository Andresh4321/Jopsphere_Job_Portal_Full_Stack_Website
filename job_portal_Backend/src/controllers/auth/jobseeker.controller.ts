import { Response, NextFunction } from "express";
import { jobSeekerService } from "../../services/jobseeker/jobseeker.service";
import { HttpError } from "../../errors/http_error";
import { AuthenticatedRequest } from "../../types/Auth/auth.type";
import { UpdateJobSeekerProfileDto } from "../../dtos/auth/jobseeker.dto";

const toPublicPath = (folder: string, filename: string): string => `/${folder}/${filename}`;

export const jobSeekerController = {
  async getMyProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new HttpError(401, "Not authenticated.");
      const profile = await jobSeekerService.getMyProfile(req.user.userId);
      return res.status(200).json({ success: true, data: profile });
    } catch (error) {
      next(error);
    }
  },

  async updateMyProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new HttpError(401, "Not authenticated.");

      const dto: UpdateJobSeekerProfileDto = {
        fullName: req.body.fullName,
        topSkills: req.body.topSkills,
        aboutYourself: req.body.aboutYourself,
        preferredLocation: req.body.preferredLocation,
        preferredWorkType: req.body.preferredWorkType,
        experienceYears: req.body.experienceYears,
        expectedSalary: req.body.expectedSalary,
        noticePeriodDays: req.body.noticePeriodDays,
        education: req.body.education,
        linkedinUrl: req.body.linkedinUrl,
      };

      const files = req.files as {
        profileImage?: Express.Multer.File[];
        qualificationImages?: Express.Multer.File[];
      };

      const newProfileImagePath = files?.profileImage?.[0]
        ? toPublicPath("profile_images", files.profileImage[0].filename)
        : null;

      const newQualificationImagePaths =
        files?.qualificationImages?.map((f) => toPublicPath("qualification_images", f.filename)) ?? [];

      const profile = await jobSeekerService.updateMyProfile(
        req.user.userId,
        dto,
        newProfileImagePath,
        newQualificationImagePaths
      );

      return res.status(200).json({ success: true, message: "Profile updated.", data: profile });
    } catch (error) {
      next(error);
    }
  },
};