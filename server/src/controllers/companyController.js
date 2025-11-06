// server/src/controllers/companyController.js
import Company from "../models/Company.js";
import User from "../models/User.js";
import Job from "../models/Job.js";
import { Op } from "sequelize";

/* =========================
   Recruiter / Admin: Create Company
========================= */
export const createCompany = async (req, res) => {
  try {
    const { name, logoUrl, location, recruiterId: recruiterIdFromBody } = req.body;

    // Determine recruiterId: if admin creates company, recruiterId can come from body;
    // if recruiter creates their own company, use req.user.id
    const recruiterId = req.user.role === "admin" ? recruiterIdFromBody : req.user.id;

    if (!recruiterId) {
      return res.status(400).json({ message: "Recruiter ID is required" });
    }

    const recruiter = await User.findByPk(recruiterId);
    if (!recruiter || recruiter.role !== "recruiter") {
      return res.status(400).json({ message: "Invalid recruiter" });
    }

    // Prevent duplicate company for same recruiter
    const existingCompany = await Company.findOne({
      where: { recruiterUserId: recruiterId },
    });
    if (existingCompany) {
      return res.status(400).json({
        message: "This recruiter already has a registered company.",
      });
    }

    const company = await Company.create({
      name,
      logoUrl: logoUrl || null,
      location: location || null,
      recruiterUserId: recruiterId,
      status: "pending", // always pending until admin approval
    });

    res.status(201).json({
      message: "Company created successfully. Pending admin approval.",
      company,
    });
  } catch (err) {
    console.error("❌ createCompany error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   Admin: Fetch all companies
========================= */
export const getCompanies = async (req, res) => {
  try {
    const companies = await Company.findAll({
      include: [{ model: User, attributes: ["id", "name", "email", "role"] }],
      order: [["createdAt", "DESC"]],
    });
    res.json({ count: companies.length, companies });
  } catch (err) {
    console.error("❌ getCompanies error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   Admin: Approve / Reject / Revoke Company
========================= */
export const updateCompanyStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // approved / rejected / revoked

    if (!["approved", "rejected", "revoked"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const company = await Company.findByPk(id);
    if (!company) return res.status(404).json({ message: "Company not found" });

    await company.update({ status });

    // If rejected or revoked, mark all associated jobs as revoked
    if (["rejected", "revoked"].includes(status)) {
      await Job.update(
        { status: "revoked" },
        {
          where: {
            companyId: company.id,
            status: { [Op.notIn]: ["expired", "rejected", "revoked"] },
          },
        }
      );
    }

    res.json({ message: `Company ${status} successfully`, company });
  } catch (err) {
    console.error("❌ updateCompanyStatus error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
