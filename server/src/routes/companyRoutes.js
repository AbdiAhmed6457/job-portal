import express from "express";
import { 
  createCompany, 
  getCompanies, 
  updateCompanyStatus,
  updateCompanyProfile
} from "../controllers/companyController.js";

import { authenticate, authorizeRoles } from "../middlewares/authenticate.js";

const router = express.Router();

// Recruiter or Admin creates a company
router.post("/", authenticate, authorizeRoles("recruiter", "admin"), createCompany);

// Admin gets all companies
router.get("/", authenticate, authorizeRoles("admin"), getCompanies);

// Admin approves/rejects/revokes company
router.put("/:id/status", authenticate, authorizeRoles("admin"), updateCompanyStatus);

// Recruiter/Admin updates company profile
router.put("/:id", authenticate, authorizeRoles("recruiter", "admin"), updateCompanyProfile);

export default router;
