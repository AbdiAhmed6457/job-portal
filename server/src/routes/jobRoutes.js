import { authenticate } from "../middlewares/authenticate.js";
import express from "express";
import {
  createJob,
  updateJob,
  getJobs,
getJobById,
} from "../controllers/jobController.js";

const router = express.Router();

// Public route to get jobs (with pagination + filters)
router.get("/", getJobs);
router.get("/:id", getJobById);


// Recruiter routes
router.post("/", authenticate, createJob);
router.put("/:id", authenticate, updateJob);

export default router;
