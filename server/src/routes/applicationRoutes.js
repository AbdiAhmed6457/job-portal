import express from "express";
import { applyJob, getApplications } from "../controllers/applicationController.js";
import { authenticate, authorizeRoles } from "../middlewares/authenticate.js";

const router = express.Router();

// Student applies for job
router.post("/", authenticate, authorizeRoles("student"), applyJob);

// Admin or recruiter views applications
router.get("/", authenticate, authorizeRoles("admin", "recruiter"), getApplications);

export default router;
