import { CompanyModel } from "../../models/auth/company.model";
import { HttpError } from "../../errors/http_error";

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
};