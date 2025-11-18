import express from "express";
import {
  getAllCompanies,
  updateCompanyStatus,
  getPendingJobs,
  updateJobStatus,
  getJobStats,
  getAllApplications,
  updateApplicationStatus,
  getAllAdminJobs,
  toggleCompanyBan,
  getAdminStats
} from "../controllers/adminController.js";
import {
  createJob,
  updateJob,
  getJobs,
  getJobById,
  getMyJobs,
  deleteJob
} from "../controllers/jobController.js";
import { authenticate, authorizeRoles } from "../middlewares/authenticate.js";

const router = express.Router();

// Companies
router.put("/companies/:id/ban", authenticate, authorizeRoles("admin"), toggleCompanyBan);
router.get("/stats", authenticate, authorizeRoles("admin"), getAdminStats);

router.get("/companies", authenticate, authorizeRoles("admin"), getAllCompanies);
router.put("/companies/:id/status", authenticate, authorizeRoles("admin"), updateCompanyStatus);

// Jobs
router.get("/jobs/pending", authenticate, authorizeRoles("admin"), getPendingJobs);
router.put("/jobs/:id/status", authenticate, authorizeRoles("admin"), updateJobStatus);
router.get("/jobs/status", authenticate, authorizeRoles("admin"), getJobStats);

router.get("/jobs/all", authenticate, authorizeRoles("admin"), getAllAdminJobs);

router.get("/jobs/:id", authenticate, authorizeRoles("admin"), getJobById);

// Applications
router.get("/applications", authenticate, authorizeRoles("admin"), getAllApplications);
router.put("/applications/:id/status", authenticate, authorizeRoles("admin"), updateApplicationStatus);

export default router;
