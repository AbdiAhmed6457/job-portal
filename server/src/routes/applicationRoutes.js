// server/src/routes/applicationRoutes.js
import express from "express";
import {
  applyJob,
  getApplications,
  updateApplicationStatus,
  downloadCv,
} from "../controllers/applicationController.js";
import { authenticate, authorizeRoles } from "../middlewares/authenticate.js";
import { uploadCv } from "../middlewares/uploadCv.js";

const router = express.Router();

// Student applies (with optional file field 'cv')
router.post(
  "/",
  authenticate,
  authorizeRoles("student"),
  uploadCv.single("cv"),
  applyJob
);

// Get applications (student/recruiter/admin)
router.get("/", authenticate, authorizeRoles("student", "recruiter", "admin"), getApplications);

// Update status (recruiter/admin)
router.put("/:id/status", authenticate, authorizeRoles("recruiter", "admin"), updateApplicationStatus);

// (optional) download CV (but we serve /uploads statically by default)
router.get("/download/:filename", authenticate, authorizeRoles("recruiter", "admin"), downloadCv);

export default router;
