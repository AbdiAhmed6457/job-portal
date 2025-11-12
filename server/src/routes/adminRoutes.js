import express from "express";
import {
  getAllCompanies,
  updateCompanyStatus,
  getPendingJobs,
  updateJobStatus,
  getJobStats,
  getAllApplications,
  updateApplicationStatus
} from "../controllers/adminController.js";
import { authenticate, authorizeRoles } from "../middlewares/authenticate.js";

const router = express.Router();

// Companies
router.get("/companies", authenticate, authorizeRoles("admin"), getAllCompanies);
router.put("/companies/:id/status", authenticate, authorizeRoles("admin"), updateCompanyStatus);

// Jobs
router.get("/jobs/pending", authenticate, authorizeRoles("admin"), getPendingJobs);
router.put("/jobs/:id/status", authenticate, authorizeRoles("admin"), updateJobStatus);
router.get("/jobs/status", authenticate, authorizeRoles("admin"), getJobStats);

// Applications
router.get("/applications", authenticate, authorizeRoles("admin"), getAllApplications);
router.put("/applications/:id/status", authenticate, authorizeRoles("admin"), updateApplicationStatus);

export default router;
