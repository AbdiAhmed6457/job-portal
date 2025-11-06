import express from "express";
import {
  createJob,
  getJobs,
  updateJobStatus,
  updateJob,
  getCompanyJobStats,
} from "../controllers/jobController.js";
import { authenticate, authorizeRoles } from "../middlewares/authenticate.js";

const router = express.Router();

router.post("/", authenticate, authorizeRoles("recruiter"), createJob);
router.get("/", getJobs);
router.put("/:id", authenticate, authorizeRoles("recruiter"), updateJob);
router.put("/:id/status", authenticate, authorizeRoles("admin"), updateJobStatus);
router.get("/stats/companies", authenticate, authorizeRoles("admin"), getCompanyJobStats);

export default router;
