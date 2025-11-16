import { authenticate, authorizeRoles } from "../middlewares/authenticate.js";
import express from "express";
import {
  createJob,
  updateJob,
  getJobs,
  getJobById,
  getMyJobs,
  deleteJob
} from "../controllers/jobController.js";

const router = express.Router();

// Recruiter: Get their own jobs
router.get(
  "/myJobs",
  authenticate,
  authorizeRoles("recruiter", "admin"),
  getMyJobs
);

// Recruiter/Admin: delete job
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("admin", "recruiter"),
  deleteJob
);

// Recruiter: create + update
router.post("/", authenticate, createJob);
router.put("/:id", authenticate, updateJob);

// Public
router.get("/", getJobs);
router.get("/:id", getJobById);

export default router;
