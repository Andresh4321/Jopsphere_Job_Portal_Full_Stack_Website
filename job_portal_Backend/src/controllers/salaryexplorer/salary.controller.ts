import { Request, Response, NextFunction } from "express";
import { salaryService } from "../../services/salaryexplorer/salary.service";

export const salaryController = {
  async getSalaryExplorer(req: Request, res: Response, next: NextFunction) {
    try {
      const [rows, overallAverage] = await Promise.all([
        salaryService.getSalaryExplorerData(),
        salaryService.getOverallAverageSalary(),
      ]);

      return res.status(200).json({
        success: true,
        data: { rows, overallAverage },
      });
    } catch (error) {
      next(error);
    }
  },
};