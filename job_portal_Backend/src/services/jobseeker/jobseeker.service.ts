import { JobSeekerModel } from "../../models/auth/jobseeker.model";
import { UserModel } from "../../models/auth/user.model";
import { VerificationStatus } from "../../types/Auth/auth.type";
import { HttpError } from "../../errors/http_error";
import { UpdateJobSeekerProfileDto } from "../../dtos/auth/jobseeker.dto";

const toResponse = (profile: any, accountVerified: boolean) => ({
  fullName: profile.fullName,
  topSkills: profile.topSkills,
  aboutYourself: profile.aboutYourself,
  qualificationImages: profile.qualificationImages,
  preferredLocation: profile.preferredLocation,
  preferredWorkType: profile.preferredWorkType,
  profileImage: profile.profileImage,
  experienceYears: profile.experienceYears,
  expectedSalary: profile.expectedSalary,
  noticePeriodDays: profile.noticePeriodDays,
  education: profile.education,
  linkedinUrl: profile.linkedinUrl,
  accountVerified,
});

export const jobSeekerService = {
  async getMyProfile(userId: string) {
    const [profile, user] = await Promise.all([
      JobSeekerModel.findOne({ userId }),
      UserModel.findById(userId),
    ]);

    if (!profile || !user) {
      throw new HttpError(404, "Job seeker profile not found.");
    }

    return toResponse(profile, user.status === VerificationStatus.VERIFIED);
  },

  async updateMyProfile(
    userId: string,
    dto: UpdateJobSeekerProfileDto,
    newProfileImagePath: string | null,
    newQualificationImagePaths: string[]
  ) {
    const [profile, user] = await Promise.all([
      JobSeekerModel.findOne({ userId }),
      UserModel.findById(userId),
    ]);

    if (!profile || !user) {
      throw new HttpError(404, "Job seeker profile not found.");
    }

    if (dto.fullName !== undefined) profile.fullName = dto.fullName.trim();
    if (dto.aboutYourself !== undefined) profile.aboutYourself = dto.aboutYourself.trim();
    if (dto.preferredLocation !== undefined) profile.preferredLocation = dto.preferredLocation.trim();
    if (dto.preferredWorkType !== undefined) profile.preferredWorkType = dto.preferredWorkType as any;
    if (dto.education !== undefined) profile.education = dto.education.trim();
    if (dto.linkedinUrl !== undefined) profile.linkedinUrl = dto.linkedinUrl.trim();

    if (dto.experienceYears !== undefined) {
      const val = Number(dto.experienceYears);
      if (!Number.isNaN(val) && val >= 0) profile.experienceYears = val;
    }
    if (dto.expectedSalary !== undefined) {
      const val = Number(dto.expectedSalary);
      if (!Number.isNaN(val) && val >= 0) profile.expectedSalary = val;
    }
    if (dto.noticePeriodDays !== undefined) {
      const val = Number(dto.noticePeriodDays);
      if (!Number.isNaN(val) && val >= 0) profile.noticePeriodDays = val;
    }

    if (dto.topSkills !== undefined) {
      const skills = Array.isArray(dto.topSkills)
        ? dto.topSkills
        : (() => {
            try {
              const parsed = JSON.parse(dto.topSkills as unknown as string);
              return Array.isArray(parsed) ? parsed : [];
            } catch {
              return String(dto.topSkills).split(",").map((s) => s.trim());
            }
          })();

      const cleaned = skills.map((s: string) => s.trim()).filter(Boolean);
      if (cleaned.length !== 3) {
        throw new HttpError(400, "Please provide exactly 3 top skills.");
      }
      profile.topSkills = cleaned;
    }

    if (newProfileImagePath) {
      profile.profileImage = newProfileImagePath;
    }

    if (newQualificationImagePaths.length > 0) {
      // Append new uploads to the existing set rather than replacing them.
      profile.qualificationImages = [...profile.qualificationImages, ...newQualificationImagePaths];
    }

    await profile.save();

    return toResponse(profile, user.status === VerificationStatus.VERIFIED);
  },
};