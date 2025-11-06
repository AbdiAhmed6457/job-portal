// server/src/routes/applicationRoutes.js
import express from "express";
import { applyJob, getApplications } from "../controllers/applicationController.js";
import { authenticate, authorizeRoles } from "../middlewares/authenticate.js";

const router = express.Router();

router.post("/", authenticate, applyJob);
router.get("/", authenticate, getApplications);

export default router;
