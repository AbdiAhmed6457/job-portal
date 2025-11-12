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

    const recruiterId = req.user.role === "admin" ? recruiterIdFromBody : req.user.id;

    if (!recruiterId) {
      return res.status(400).json({ message: "Recruiter ID is required" });
    }

    const recruiter = await User.findByPk(recruiterId);
    if (!recruiter || recruiter.role !== "recruiter") {
      return res.status(400).json({ message: "Invalid recruiter" });
    }

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
      status: "pending",
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
    const { status } = req.body;

    if (!["approved", "rejected", "revoked"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const company = await Company.findByPk(id);
    if (!company) return res.status(404).json({ message: "Company not found" });

    await company.update({ status });

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

/* =========================
   Recruiter/Admin: Update Company Profile
========================= */
export const updateCompanyProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, logoUrl, location } = req.body;

    const company = await Company.findByPk(id);
    if (!company) return res.status(404).json({ message: "Company not found" });

    // Only the admin or the recruiter who owns the company can update
    if (req.user.role !== "admin" && req.user.id !== company.recruiterUserId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await company.update({
      name: name !== undefined ? name : company.name,
      logoUrl: logoUrl !== undefined ? logoUrl : company.logoUrl,
      location: location !== undefined ? location : company.location,
    });

    res.json({ message: "Company profile updated successfully", company });
  } catch (err) {
    console.error("❌ updateCompanyProfile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   Recruiter: Get My Company
========================= */
// export const getMyCompany = async (req, res) => {
//   try {
//     const company = await Company.findOne({
//       where: { recruiterUserId: req.user.id },
//       include: [{ model: User, attributes: ["id", "name", "email", "role"] }],
//     });

//     if (!company) {
//       return res.status(404).json({ message: "You have not created a company yet" });
//     }

//     res.status(200).json({ company });
//   } catch (err) {
//     console.error("❌ getMyCompany error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

export const getMyCompany = async (req, res) => {
  try {
    // req.user is set by authenticate middleware
    const company = await Company.findOne({ where: { recruiterUserId: req.user.id } });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.status(200).json({ company });
  } catch (err) {
    console.error("❌ getMyCompany error:", err);
    res.status(500).json({ message: "Server error" });
  }
};