import Job from "../models/Job.js";
import Company from "../models/Company.js";
import { Op } from "sequelize";

// Recruiter creates a job (auto pending)
export const createJob = async (req, res) => {
  try {
    const { title, description, requirements, gpaMin, expiresAt, location } = req.body;

    const company = await Company.findOne({ where: { recruiterUserId: req.user.id } });
    if (!company) return res.status(404).json({ message: "Company not found for this recruiter" });

    const job = await Job.create({
      title,
      description,
      requirements,
      gpaMin,
      expiresAt,
      location,
      companyId: company.id,
      status: "pending",
    });

    res.status(201).json({ message: "Job created and pending admin approval", job });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin approves or rejects job
export const updateJobStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'approved' | 'rejected'
    const { id } = req.params;

    const job = await Job.findByPk(id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    job.status = status;
    await job.save();

    res.json({ message: `Job ${status}`, job });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Recruiter updates a job (only their own)
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id, { include: Company });
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.Company.recruiterUserId !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (job.status === "expired" || job.status === "rejected") {
      return res.status(400).json({ message: "Cannot edit expired/rejected jobs" });
    }

    await job.update(req.body);
    res.json({ message: "Job updated successfully", job });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Public: Get all active jobs (filter + search)
export const getJobs = async (req, res) => {
  try {
    const { search, minGpa, location } = req.query;

    const jobs = await Job.findAll({
      where: {
        status: "approved",
        expiresAt: { [Op.gt]: new Date() },
        ...(search && {
          [Op.or]: [
            { title: { [Op.like]: `%${search}%` } },
            { description: { [Op.like]: `%${search}%` } },
          ],
        }),
        ...(minGpa && { gpaMin: { [Op.lte]: minGpa } }),
        ...(location && { location: { [Op.like]: `%${location}%` } }),
      },
      include: [{ model: Company, attributes: ["name", "logoUrl"] }],
      order: [["createdAt", "DESC"]],
    });

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Admin: See how many jobs each company posted
export const getCompanyJobStats = async (req, res) => {
  try {
    const companies = await Company.findAll({
      include: [{ model: Job, attributes: [] }],
      attributes: [
        "id",
        "name",
        [sequelize.fn("COUNT", sequelize.col("Jobs.id")), "totalJobs"],
      ],
      group: ["Company.id"],
    });

    res.json(companies);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
