import { PostedJobModel } from "../../models/PostJob/postedjob.model";

export interface SalaryExplorerRow {
  role: string;
  industry: string;
  min: number;
  avg: number;
  max: number;
  jobCount: number;
}

export const salaryService = {
  async getSalaryExplorerData(): Promise<SalaryExplorerRow[]> {
    const rows = await PostedJobModel.aggregate([
      // Join each job to its company so we can read the company's industry.
      {
        $lookup: {
          from: "companies",
          localField: "companyRef",
          foreignField: "_id",
          as: "company",
        },
      },
      { $unwind: "$company" },

      // Sort oldest-first so $first below picks the industry of the
      // earliest-posted job for each title, per your requirement.
      { $sort: { createdAt: 1 } },

      {
        $group: {
          _id: { $toLower: "$jobTitle" }, // group case-insensitively
          role: { $first: "$jobTitle" }, // display title from the earliest posting
          industry: { $first: "$company.industry" },
          min: { $min: "$salary.min" },
          max: { $max: "$salary.max" },
          // Per-document midpoint, averaged across all postings with this title.
          avg: { $avg: { $avg: ["$salary.min", "$salary.max"] } },
          jobCount: { $sum: 1 },
        },
      },

      {
        $project: {
          _id: 0,
          role: 1,
          industry: 1,
          min: 1,
          max: 1,
          avg: { $round: ["$avg", 0] },
          jobCount: 1,
        },
      },

      { $sort: { role: 1 } },
    ]);

    return rows as SalaryExplorerRow[];
  },

  // Used for the "Browse jobs paying above average" CTA — overall average
  // midpoint salary across every posting, regardless of title.
  async getOverallAverageSalary(): Promise<number> {
    const result = await PostedJobModel.aggregate([
      {
        $group: {
          _id: null,
          avg: { $avg: { $avg: ["$salary.min", "$salary.max"] } },
        },
      },
    ]);

    return result[0]?.avg ? Math.round(result[0].avg) : 0;
  },
};