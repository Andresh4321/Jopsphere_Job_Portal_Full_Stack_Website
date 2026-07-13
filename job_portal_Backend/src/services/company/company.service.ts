import { CompanyModel } from "../../models/auth/company.model";
import { HttpError } from "../../errors/http_error";
import { PostedJobModel } from "../../models/PostJob/postedjob.model";
import { ApplicationModel } from "../../models/application/application.model";
import { ApplicationStage } from "../../types/application/application.types";
import { JobStatus } from "../../types/PostJob/job.type";

export const companyService = {
  async getMyCompany(employerId: string) {
    const company = await CompanyModel.findOne({ employerId });
    if (!company) {
      throw new HttpError(404, "No company found for this employer account.");
    }

    return {
      companyId: company.companyId,
      companyName: company.companyName,
      industry: company.industry,
      headquarters: company.headquarters,
      companyWebsite: company.companyWebsite,
      aboutCompany: company.aboutCompany,
      whyChooseUs: company.whyChooseUs,
      companyLogo: company.companyLogo,
      status: company.status,
    };
  },

  async updateMyCompany(
    employerId: string,
    dto: {
      companyName?: string;
      industry?: string;
      headquarters?: string;
      companyWebsite?: string;
      aboutCompany?: string;
      whyChooseUs?: string;
    },
    newLogoPath: string | null
  ) {
    const company = await CompanyModel.findOne({ employerId });
    if (!company) {
      throw new HttpError(404, "No company found for this employer account.");
    }

    if (dto.companyName !== undefined) company.companyName = dto.companyName.trim();
    if (dto.industry !== undefined) company.industry = dto.industry.trim();
    if (dto.headquarters !== undefined) company.headquarters = dto.headquarters.trim();
    if (dto.companyWebsite !== undefined) company.companyWebsite = dto.companyWebsite.trim();
    if (dto.aboutCompany !== undefined) company.aboutCompany = dto.aboutCompany.trim();
    if (dto.whyChooseUs !== undefined) company.whyChooseUs = dto.whyChooseUs.trim();
    if (newLogoPath) company.companyLogo = newLogoPath;

    await company.save();

    return {
      companyId: company.companyId,
      companyName: company.companyName,
      industry: company.industry,
      headquarters: company.headquarters,
      companyWebsite: company.companyWebsite,
      aboutCompany: company.aboutCompany,
      whyChooseUs: company.whyChooseUs,
      companyLogo: company.companyLogo,
      status: company.status,
    };
  },

  // Public lookup — used when a job seeker clicks through from a job
  // listing to view the company that posted it. No auth required, and
  // sensitive fields (businessRegistrationNumber, companyDocument) are
  // intentionally excluded from the response.
  async getCompanyByPublicId(companyId: string) {
    const company = await CompanyModel.findOne({ companyId });
    if (!company) {
      throw new HttpError(404, "Company not found.");
    }

    return {
      companyId: company.companyId,
      companyName: company.companyName,
      industry: company.industry,
      headquarters: company.headquarters,
      companyWebsite: company.companyWebsite,
      aboutCompany: company.aboutCompany,
      whyChooseUs: company.whyChooseUs,
      status: company.status,
      createdAt: company.createdAt,
    };
  },

  // Public directory — every company, with a real open-roles count per card.
  async listAllCompanies() {
    const companies = await CompanyModel.find().sort({ createdAt: -1 });

    const withOpenRoles = await Promise.all(
      companies.map(async (company) => {
        const openRolesCount = await PostedJobModel.countDocuments({
          companyId: company.companyId,
          status: JobStatus.OPEN,
        });
        return {
          companyId: company.companyId,
          companyName: company.companyName,
          industry: company.industry,
          headquarters: company.headquarters,
          status: company.status,
          openRolesCount,
        };
      })
    );

    return withOpenRoles;
  },

  // Full company profile page: company info + real open roles + real,
  // computed stats derived from actual Application records.
  //   - responseRate: % of applications that moved past "applied"
  //   - avgReplyDays: approximate — average(updatedAt - createdAt) for
  //     applications that progressed, since we don't store a timestamp for
  //     every individual stage transition, just the latest one
  //   - hiresCount: applications with stage === 'hired'
  async getCompanyProfile(companyId: string) {
    const company = await CompanyModel.findOne({ companyId });
    if (!company) {
      throw new HttpError(404, "Company not found.");
    }

    const openJobs = await PostedJobModel.find({ companyId, status: JobStatus.OPEN }).sort({
      createdAt: -1,
    });

    const openRoles = await Promise.all(
      openJobs.map(async (job) => {
        const applicantsCount = await ApplicationModel.countDocuments({ jobId: job._id });
        return {
          id: job._id.toString(),
          jobTitle: job.jobTitle,
          location: job.location,
          workType: job.workType,
          listingType: job.listingType,
          salary: job.salary,
          skills: job.skills,
          createdAt: job.createdAt,
          applicantsCount,
        };
      })
    );

    const applications = await ApplicationModel.find({ companyId });
    const total = applications.length;
    const responded = applications.filter((a) => a.stage !== ApplicationStage.APPLIED).length;
    const respondedApps = applications.filter((a) => a.stage !== ApplicationStage.APPLIED);
    const avgReplyDays =
      respondedApps.length > 0
        ? Math.round(
            (respondedApps.reduce(
              (sum, a) => sum + (a.updatedAt.getTime() - a.createdAt.getTime()),
              0
            ) /
              respondedApps.length /
              (1000 * 60 * 60 * 24)) *
              10
          ) / 10
        : null;
    const hiresCount = applications.filter((a) => a.stage === ApplicationStage.HIRED).length;

    return {
      companyId: company.companyId,
      companyName: company.companyName,
      industry: company.industry,
      headquarters: company.headquarters,
      companyWebsite: company.companyWebsite,
      aboutCompany: company.aboutCompany,
      whyChooseUs: company.whyChooseUs,
      status: company.status,
      createdAt: company.createdAt,
      openRoles,
      openRolesCount: openRoles.length,
      stats: {
        responseRate: total > 0 ? Math.round((responded / total) * 100) : null,
        avgReplyDays,
        hiresCount,
      },
    };
  },
};