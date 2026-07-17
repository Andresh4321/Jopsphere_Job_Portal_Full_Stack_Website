import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel, IUser } from "../../models/auth/user.model";
import { JobSeekerModel } from "../../models/auth/jobseeker.model";
import { CompanyModel } from "../../models/auth/company.model";
import {
  RegisterJobSeekerDto,
  RegisterEmployerDto,
  RegisterJobSeekerResponseDto,
  RegisterEmployerResponseDto,
  LoginDto,
  LoginResponseDto,
} from "../../dtos/auth/auth.dtos";
import { UserRole, VerificationStatus, JwtPayload } from "../../types/Auth/auth.type";
import { HttpError } from "../../errors/http_error";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const JWT_EXPIRES_IN = "7d";
const SALT_ROUNDS = 10;

// Normalizes topSkills whether it arrives as a real array or a
// JSON-stringified array (common with multipart/form-data clients).
const normalizeTopSkills = (value: string[] | string): string[] => {
  if (Array.isArray(value)) return value.map((s) => s.trim()).filter(Boolean);
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.map((s) => String(s).trim()).filter(Boolean);
  } catch {
    // not JSON, fall back to comma-separated string
    return value.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return [];
};

const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

const ensureEmailAndPhoneAreFree = async (email: string, phone: string) => {
  const existing = await UserModel.findOne({
    $or: [{ email: email.toLowerCase().trim() }, { phone: phone.trim() }],
  });
  if (existing) {
    if (existing.email === email.toLowerCase().trim()) {
      throw new HttpError(409, "Email is already registered.");
    }
    throw new HttpError(409, "Phone number is already registered.");
  }
};

export const authService = {
  async registerJobSeeker(
    dto: RegisterJobSeekerDto,
    qualificationImagePaths: string[]
  ): Promise<RegisterJobSeekerResponseDto> {
    const { email, phone, password, fullName, aboutYourself } = dto;

    if (!email || !phone || !password || !fullName || !aboutYourself) {
      throw new HttpError(400, "Missing required fields.");
    }

    const topSkills = normalizeTopSkills(dto.topSkills);
    if (topSkills.length !== 3) {
      throw new HttpError(400, "Please provide exactly 3 top skills.");
    }

    await ensureEmailAndPhoneAreFree(email, phone);

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user: IUser = await UserModel.create({
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      password: hashedPassword,
      role: UserRole.JOB_SEEKER,
      status: VerificationStatus.UNVERIFIED,
    });

    try {
      const jobSeeker = await JobSeekerModel.create({
        userId: user._id,
        fullName: fullName.trim(),
        topSkills,
        aboutYourself: aboutYourself.trim(),
        qualificationImages: qualificationImagePaths,
      });

      return {
        userId: user._id.toString(),
        email: user.email,
        phone: user.phone,
        role: UserRole.JOB_SEEKER,
        status: user.status,
        fullName: jobSeeker.fullName,
        topSkills: jobSeeker.topSkills,
        aboutYourself: jobSeeker.aboutYourself,
        qualificationImages: jobSeeker.qualificationImages,
      };
    } catch (err) {
      // rollback the user if profile creation fails, keeps data consistent
      await UserModel.findByIdAndDelete(user._id);
      throw err;
    }
  },

  async registerEmployer(
    dto: RegisterEmployerDto,
    companyDocumentPath: string
  ): Promise<RegisterEmployerResponseDto> {
    const {
      email,
      phone,
      password,
      companyName,
      industry,
      headquarters,
      companyWebsite,
      aboutCompany,
      whyChooseUs,
      businessRegistrationNumber,
    } = dto;

    if (
      !email ||
      !phone ||
      !password ||
      !companyName ||
      !industry ||
      !headquarters ||
      !companyWebsite ||
      !aboutCompany ||
      !whyChooseUs ||
      !businessRegistrationNumber
    ) {
      throw new HttpError(400, "Missing required fields.");
    }

    if (!companyDocumentPath) {
      throw new HttpError(400, "Company document (business registration proof) is required.");
    }

    await ensureEmailAndPhoneAreFree(email, phone);

    const existingCompany = await CompanyModel.findOne({ businessRegistrationNumber });
    if (existingCompany) {
      throw new HttpError(409, "Business registration number is already in use.");
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user: IUser = await UserModel.create({
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      password: hashedPassword,
      role: UserRole.EMPLOYER,
      status: VerificationStatus.UNVERIFIED,
    });

    try {
      const company = await CompanyModel.create({
        employerId: user._id,
        companyName: companyName.trim(),
        industry: industry.trim(),
        headquarters: headquarters.trim(),
        companyWebsite: companyWebsite.trim(),
        aboutCompany: aboutCompany.trim(),
        whyChooseUs: whyChooseUs.trim(),
        businessRegistrationNumber: businessRegistrationNumber.trim(),
        companyDocument: companyDocumentPath,
        status: VerificationStatus.UNVERIFIED,
      });

      return {
        userId: user._id.toString(),
        companyId: company.companyId,
        email: user.email,
        phone: user.phone,
        role: UserRole.EMPLOYER,
        status: user.status,
        companyName: company.companyName,
        industry: company.industry,
        headquarters: company.headquarters,
        companyWebsite: company.companyWebsite,
        aboutCompany: company.aboutCompany,
        whyChooseUs: company.whyChooseUs,
        businessRegistrationNumber: company.businessRegistrationNumber,
        companyDocument: company.companyDocument,
      };
    } catch (err) {
      await UserModel.findByIdAndDelete(user._id);
      throw err;
    }
  },

  async login(dto: LoginDto): Promise<LoginResponseDto> {
    const { email, password } = dto;
    if (!email || !password) {
      throw new HttpError(400, "Email and password are required.");
    }

    const user = await UserModel.findOne({ email: email.toLowerCase().trim() }).select("+password");
    if (!user) {
      throw new HttpError(401, "Invalid email or password.");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new HttpError(401, "Invalid email or password.");
    }

    const token = generateToken({
      userId: user._id.toString(),
      role: user.role,
      email: user.email,
    });

    const redirectTo =
      user.role === UserRole.JOB_SEEKER ? "/jobseeker/home" : "/employer/home";

    return {
      token,
      role: user.role,
      redirectTo,
      user: {
        id: user._id.toString(),
        email: user.email,
        phone: user.phone,
        status: user.status,
      },
    };
  },

  async forgotPassword(email: string): Promise<void> {
    const user = await UserModel.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      // Silently return to prevent email enumeration
      return;
    }

    // Generate a random reset token with 1-hour expiry
    const crypto = require("crypto");
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // In production, send email with reset link containing token
    // For now, the token is stored and can be used via the reset-password endpoint
    console.log(`[DEV] Password reset token for ${email}: ${resetToken}`);
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await UserModel.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() },
    }).select("+password");

    if (!user) {
      throw new HttpError(400, "Invalid or expired reset token.");
    }

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();
  },
};