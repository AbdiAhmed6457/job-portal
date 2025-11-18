// server/src/controllers/adminController.js
import Company from "../models/Company.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import User from "../models/User.js";
import { sequelize } from "../models/index.js";
import { Op } from "sequelize";

/* =========================
   Companies
========================= */

// Get all companies with recruiter info
export const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.findAll({
      include: [{ model: User, attributes: ["id", "name", "email", "role"] }],
      order: [["createdAt", "DESC"]],
    });
    res.json({ count: companies.length, companies });
  } catch (err) {
    console.error("❌ getAllCompanies error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Approve or reject a company
export const updateCompanyStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const company = await Company.findByPk(id);
    if (!company) return res.status(404).json({ message: "Company not found" });

    await company.update({ status });

    // Optional: revoke all jobs if company is rejected
    if (status === "rejected") {
      await Job.update({ status: "rejected" }, { where: { companyId: id } });
    }

    res.json({ message: `Company ${status}`, company });
  } catch (err) {
    console.error("❌ updateCompanyStatus error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   Jobs
========================= */

// Get all pending jobs
export const getPendingJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll({
      where: { status: "pending" },
      include: [{ model: Company, attributes: ["id", "name"] }],
      order: [["createdAt", "ASC"]],
    });
    res.json({ count: jobs.length, jobs });
  } catch (err) {
    console.error("❌ getPendingJobs error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Approve or reject a job
export const updateJobStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const job = await Job.findByPk(id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    await job.update({ status });
    res.json({ message: `Job ${status}`, job });
  } catch (err) {
    console.error("❌ updateJobStatus error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Job statistics per company
export const getJobStats = async (req, res) => {
  try {
    const stats = await Job.findAll({
      attributes: [
        "companyId",
        [sequelize.fn("COUNT", sequelize.col("Job.id")), "jobCount"],
      ],
      group: ["companyId"],
      include: [{ model: Company, attributes: ["name"] }],
    });
    res.json(stats);
  } catch (err) {
    console.error("❌ getJobStats error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   Applications
========================= */

// View all applications
export const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.findAll({
      include: [
        { model: Job, attributes: ["id", "title"] },
        { model: User, attributes: ["id", "name", "email"] },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json({ count: applications.length, applications });
  } catch (err) {
    console.error("❌ getAllApplications error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update application status
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "shortlisted", "accepted", "rejected"].includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const application = await Application.findByPk(id);
    if (!application) return res.status(404).json({ message: "Application not found" });

    await application.update({ status });
    res.json({ message: `Application ${status}`, application });
  } catch (err) {
    console.error("❌ updateApplicationStatus error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// controllers/admin/jobController.js
export const getAllAdminJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll({
      include: [
        {
          model: Company,
          attributes: ["id", "name", "logoUrl"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({ jobs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};