import { Op } from "sequelize";
import Job from "../models/Job.js";
import Company from "../models/Company.js";
import AuditLog from "../models/AuditLog.js";

/* =========================
   Recruiter: Create Job
========================= */
export const createJob = async (req, res) => {
  try {
    const { title, description, requirements, gpaMin, location, salary, jobType, category, expiresAt } = req.body;

    const company = await Company.findOne({ where: { recruiterUserId: req.user.id } });
    if (!company) return res.status(404).json({ message: "Company not found" });
    if (company.status !== "approved")
      return res.status(403).json({ message: "Company is not approved to post jobs" });

    const job = await Job.create({
      title,
      description,
      requirements,
      gpaMin,
      location,
      salary, // handle text or numeric
      jobType,
      category,
      expiresAt,
      companyId: company.id,
      status: "pending",
    });

    res.status(201).json({ message: "Job created and pending approval", job });
  } catch (err) {
    console.error("❌ createJob error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   Recruiter: Update Job
========================= */
export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, requirements, gpaMin, location, salary, jobType, category, expiresAt } = req.body;

    const job = await Job.findOne({ where: { id }, include: Company });
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.Company.recruiterUserId !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    await job.update({ title, description, requirements, gpaMin, location, salary, jobType, category, expiresAt, status: "pending" });

    res.json({ message: "Job updated and pending approval", job });
  } catch (err) {
    console.error("❌ updateJob error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


/* =========================
   Public: Get Jobs with filters (Fully Backend-Handled)
========================= */


export const getJobs = async (req, res) => {
  try {
    const {
      search,
      location,
      status = "approved",
      page = 1,
      limit = 12,
      gpa,
      salary,
      jobType,
      category,
    } = req.query;

    // Auto-expire jobs
    await Job.update(
      { status: "expired" },
      {
        where: {
          expiresAt: { [Op.lt]: new Date() },
          status: { [Op.notIn]: ["rejected", "expired", "revoked"] },
        },
      }
    );

    const filters = {};
    if (status) filters.status = status;
    if (location) filters.location = { [Op.like]: `%${location}%` };
    if (gpa) filters.gpaMin = { [Op.gte]: parseFloat(gpa) };
    if (jobType) filters.jobType = jobType;
    if (category) filters.category = category;
    if (salary && !isNaN(parseFloat(salary))) {
      filters.salary = { [Op.gte]: parseFloat(salary) };
    }

    // Search in title, description, and company name
    if (search) {
      filters[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { "$Company.name$": { [Op.like]: `%${search}%` } }, // ✅ this line fixes the issue
      ];
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const jobs = await Job.findAndCountAll({
      where: filters,
      include: [
        {
          model: Company,
          attributes: ["id", "name", "logoUrl"],
          required: false, // ✅ keeps LEFT JOIN so company always appears
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset,
    });

    res.json({
      total: jobs.count,
      totalPages: Math.ceil(jobs.count / limit),
      currentPage: parseInt(page),
      jobs: jobs.rows,
    });
  } catch (err) {
    console.error("❌ getJobs error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


/* =========================
   Public: Get job by ID
========================= */
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id, {
      include: [{ model: Company }],
    });
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.status(200).json({ job });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =========================
   Recruiter: Get My Jobs
========================= */
export const getMyJobs = async (req, res) => {
  try {
    const company = await Company.findOne({
      where: { recruiterUserId: req.user.id },
    });

    if (!company) {
      return res.status(404).json({ message: "You don't have a company yet" });
    }

    const jobs = await Job.findAll({
      where: { companyId: company.id },
      include: [
        {
          model: Company,
          attributes: ["id", "name", "logoUrl", "status"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ count: jobs.length, jobs });
  } catch (err) {
    console.error("❌ getMyJobs error:", err);
    res.status(500).json({ message: "Server error" });
  }
};



/**
 * Delete a job (soft delete) with audit logging
 * Only admin or the recruiter who owns the job can delete it
 */
export const deleteJob = async (req, res) => {
  try {
    const jobId = parseInt(req.params.id, 10);
    if (isNaN(jobId)) {
      return res.status(400).json({ message: "Invalid job ID" });
    }

    // Find job with company info
    const job = await Job.findByPk(jobId, { include: Company });
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Access control
    if (req.user.role === "recruiter" && job.Company.recruiterUserId !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to delete this job" });
    }

    // Soft delete
    await job.update({ status: "deleted" });

    // Audit log (optional but professional)
    await AuditLog.create({
      action: "delete",
      entity: "job",
      entityId: job.id,
      performedBy: req.user.id,
      performedAt: new Date(),
      details: `Job "${job.title}" deleted by ${req.user.role}`
    });

    return res.status(200).json({ message: "Job deleted successfully" });
  } catch (err) {
    console.error("❌ deleteJob error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

