import express from "express";
import { createJob, updateJob, getJobs } from "../controllers/jobController.js";
import { authenticate, authorizeRoles } from "../middlewares/authenticate.js";

const router = express.Router();

// Recruiter actions
router.post("/", authenticate, authorizeRoles("recruiter"), createJob);
router.put("/:id", authenticate, authorizeRoles("recruiter"), updateJob);

// Public actions
router.get("/", getJobs);

export default router;
