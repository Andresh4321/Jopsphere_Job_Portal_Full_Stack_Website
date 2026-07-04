import { Router } from "express";
import { salaryController } from "../../controllers/salaryexplorer/salary.controller";

const router = Router();

// GET /api/salary-explorer
// Public. Live aggregation over real job postings — no caching, so it
// always reflects current data the moment jobs are posted/closed/deleted.
router.get("/", salaryController.getSalaryExplorer);

export default router;