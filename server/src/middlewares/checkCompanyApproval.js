// src/middlewares/checkCompanyApproval.js
import Company from "../models/Company.js";

export const requireApprovedCompany = async (req, res, next) => {
  if (req.user.role !== "recruiter") return next(); // Only for recruiters

  const company = await Company.findOne({ where: { recruiterUserId: req.user.id } });
  if (!company) return res.status(404).json({ message: "Company not found" });

  if (company.status !== "approved") {
    return res.status(403).json({ message: "Your company is not approved to post or update jobs" });
  }

  req.company = company; // attach for convenience
  next();
};
