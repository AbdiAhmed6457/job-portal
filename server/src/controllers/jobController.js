import { Op } from "sequelize";
import Job from "../models/Job.js";
import Company from "../models/Company.js";
import AuditLog from "../models/AuditLog.js";

/* ====================================
   Recruiter: Create Job
==================================== */

export const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements, // frontend sends array
      gpaMin,
      location,
      salary,
      category,
      jobType,
      expiresAt,
    } = req.body;

    // 1️⃣ Find the company for the logged-in recruiter
    // Assuming req.user.id is the recruiter/user ID
    const company = await Company.findOne({ where: { recruiterUserId: req.user.id } });

    if (!company) {
      return res.status(400).json({ message: "Company not found for this recruiter." });
    }

    // 2️⃣ Convert requirements array to JSON string
    const requirementsString = JSON.stringify(requirements);

    // 3️⃣ Create the job
    const job = await Job.create({
      title,
      description,
      requirements: requirementsString, // store as string
      gpaMin,
      location,
      salary,
      category,
      jobType,
      expiresAt,
      status: "pending",
      companyId: company.id, // assign correct companyId
    });

    res.status(201).json(job);
  } catch (error) {
    console.error("createJob error:", error);
    res.status(500).json({ message: "Failed to create job", error: error.message });
  }
};

/* ====================================
   Recruiter: Update Job
==================================== */
export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, requirements, gpaMin, location, salary, jobType, category, expiresAt } = req.body;

    const job = await Job.findOne({ where: { id }, include: Company });
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.Company.recruiterUserId !== req.user.id && req.user.role !== "admin")
      return res.status(403).json({ message: "Unauthorized" });

    const newStatus = req.user.role === "admin" ? job.status : "pending";

    await job.update({
      title,
      description,
      requirements,
      gpaMin,
      location,
      salary,
      jobType,
      category,
      expiresAt,
      status: newStatus,
    });

    res.json({ message: "Job updated", job });
  } catch (err) {
    console.error("❌ updateJob error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


/* ====================================
   Public: Get Jobs (Filters + Pagination)
==================================== */
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

    if (search) {
      filters[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { "$Company.name$": { [Op.like]: `%${search}%` } },
      ];
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const jobs = await Job.findAndCountAll({
      where: filters,
      include: [
        {
          model: Company,
          attributes: ["id", "name", "logoUrl"],
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


/* ====================================
   Public: Get Job by ID
==================================== */
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id, {
      include: [{ model: Company }],
    });
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ job });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


/* ====================================
   Recruiter: Get My Jobs
==================================== */
export const getMyJobs = async (req, res) => {
  try {
    const company = await Company.findOne({
      where: { recruiterUserId: req.user.id },
    });

    if (!company) return res.status(404).json({ message: "You don't have a company yet" });

    const jobs = await Job.findAll({
      where: { companyId: company.id },
      include: [{ model: Company, attributes: ["id", "name", "logoUrl", "status"] }],
      order: [["createdAt", "DESC"]],
    });

    res.json({ count: jobs.length, jobs });
  } catch (err) {
    console.error("❌ getMyJobs error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


/* ====================================
   Delete Job (Soft Delete + Audit)
==================================== */
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id, { include: Company });
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (req.user.role === "recruiter" && job.Company.recruiterUserId !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    await job.update({ status: "deleted" });

    await AuditLog.create({
      action: "delete",
      entity: "job",
      entityId: job.id,
      performedBy: req.user.id,
      performedAt: new Date(),
      details: `Job "${job.title}" deleted by ${req.user.role}`,
    });

    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    console.error("❌ deleteJob error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
