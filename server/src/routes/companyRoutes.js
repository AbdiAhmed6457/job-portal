import express from "express";
import { 
  createCompany, 
  getCompanies, 
  updateCompanyStatus 
} from "../controllers/companyController.js";

import { authenticate, authorizeRoles } from "../middlewares/authenticate.js";

const router = express.Router();

// Recruiter or Admin creates a company
router.post("/", authenticate, authorizeRoles("recruiter", "admin"), createCompany);

// Admin gets all companies
router.get("/", authenticate, authorizeRoles("admin"), getCompanies);

// Admin approves/rejects/revokes company
router.put("/:id/status", authenticate, authorizeRoles("admin"), updateCompanyStatus);

export default router;
