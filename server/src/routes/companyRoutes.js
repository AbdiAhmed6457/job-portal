import express from "express";
import { createCompany, getCompanies, updateCompanyStatus } from "../controllers/companyController.js";
import { authenticate, authorizeRoles } from "../middlewares/authenticate.js";

const router = express.Router();

router.post("/", authenticate, authorizeRoles("admin", "recruiter"), createCompany);
router.get("/", authenticate, authorizeRoles("admin"), getCompanies);
router.put("/:id/status", authenticate, authorizeRoles("admin"), updateCompanyStatus); // approve/reject

export default router;
