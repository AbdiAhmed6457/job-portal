import Company from "../models/Company.js";
import User from "../models/User.js";

// Admin or recruiter creates a company
export const createCompany = async (req, res) => {
  try {
    const { name, logoUrl, recruiterId, location } = req.body;

    const recruiter = await User.findByPk(recruiterId);
    if (!recruiter || recruiter.role !== "recruiter") {
      return res.status(400).json({ message: "Invalid recruiter" });
    }

    // New company will be created as "pending"
    const company = await Company.create({
      name,
      logoUrl,
      location: location || null, // optional
      recruiterUserId: recruiterId,
      status: "pending", // default
    });

    res.status(201).json({
      message: "Company created successfully. Pending admin approval.",
      company,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin fetch all companies
export const getCompanies = async (req, res) => {
  try {
    const companies = await Company.findAll({
      include: [{ model: User, attributes: ["id", "email", "role"] }],
    });
    res.json(companies);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Admin approves or rejects a company
export const updateCompanyStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // "approved" or "rejected"

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const company = await Company.findByPk(id);
    if (!company) return res.status(404).json({ message: "Company not found" });

    company.status = status;
    await company.save();

    res.json({ message: `Company ${status} successfully`, company });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
