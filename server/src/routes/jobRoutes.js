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



// Recruiter gets their own jobs
router.get(
    "/myJobs",
    authenticate,
    authorizeRoles("recruiter", "admin"),
    getMyJobs
);

router.delete("/:id", authenticate, authorizeRoles("admin", "recruiter"), deleteJob);


// Recruiter routes
router.post("/", authenticate, createJob);
router.put("/:id", authenticate, updateJob);

// Public route to get jobs (with pagination + filters)
router.get("/", getJobs);
router.get("/:id", getJobById);

export default router;
