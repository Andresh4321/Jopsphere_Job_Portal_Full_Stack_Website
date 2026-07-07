import { JobSeekerModel } from "../../models/auth/jobseeker.model";
import { UserModel } from "../../models/auth/user.model";
import { VerificationStatus } from "../../types/Auth/auth.type";
import { HttpError } from "../../errors/http_error";

export const jobSeekerService = {
  async getMyProfile(userId: string) {
    const [profile, user] = await Promise.all([
      JobSeekerModel.findOne({ userId }),
      UserModel.findById(userId),
    ]);

    if (!profile || !user) {
      throw new HttpError(404, "Job seeker profile not found.");
    }

    return {
      fullName: profile.fullName,
      topSkills: profile.topSkills,
      aboutYourself: profile.aboutYourself,
      qualificationImages: profile.qualificationImages,
      preferredLocation: profile.preferredLocation,
      preferredWorkType: profile.preferredWorkType,
      accountVerified: user.status === VerificationStatus.VERIFIED,
    };
  },
};