// server/src/controllers/applicationController.js
import Application from "../models/Application.js";
import Job from "../models/Job.js";
import User from "../models/User.js";
import path from "path";
import fs from "fs";
import Company from "../models/Company.js"; // ✅ Add this


export const applyJob = async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;
    const studentUserId = req.user.id;

    if (!jobId) return res.status(400).json({ message: "Job ID is required" });

    const job = await Job.findByPk(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const existing = await Application.findOne({ where: { jobId, studentUserId } });
    if (existing) return res.status(400).json({ message: "You have already applied to this job" });

    // If multer processed a file, req.file exists
    const cvUrl = req.file ? `/uploads/cvs/${req.file.filename}` : null;

    const application = await Application.create({
      jobId,
      studentUserId,
      coverLetter,
      cvUrl,
      status: "pending",
    });

    // Optionally: notify recruiter (email/in-app) - omitted here
    res.status(201).json({ message: "Application submitted", application });
  } catch (err) {
    console.error("applyJob error:", err);
    // multer errors may come through as err.message -- return 400 for invalid file types/size
    if (err instanceof Error && /Only PDF|file too large/i.test(err.message)) {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: "Server error" });
  }
};



export const getApplications = async (req, res) => {
  try {
    let where = {};

    // -------------------------------
    // STUDENT: Only his applications
    // -------------------------------
    if (req.user.role === "student") {
      where.studentUserId = req.user.id;
    }

    // -------------------------------
    // RECRUITER: Must fetch his company first
    // -------------------------------
    else if (req.user.role === "recruiter") {

      // 1. Get recruiter’s company
      const recruiterCompany = await Company.findOne({
        where: { recruiterUserId: req.user.id }, // recruiter owns company
        attributes: ["id"],
      });

      if (!recruiterCompany) {
        return res.json({ applications: [] });
      }

      // 2. Get all jobs under this company
      const jobs = await Job.findAll({
        where: { companyId: recruiterCompany.id },
        attributes: ["id"],
      });

      const jobIds = jobs.map(j => j.id);

      // If recruiter has no jobs → return empty
      where.jobId = jobIds.length ? jobIds : [-1];
    }

    // ---------------------------------
    // ADMIN: sees everything (no filter)
    // ---------------------------------


    // Fetch applications
    const applications = await Application.findAll({
      where,
      include: [
        {
          model: Job,
          attributes: ["id", "title", "companyId", "jobType"],
          include: [
            { model: Company, attributes: ["id", "name"] }
          ]
        },
        {
          model: User,
          attributes: ["id", "name", "email"]
        }
      ],
      order: [["createdAt", "DESC"]],
    });

    // Format response for frontend
    // const detailedApplications = applications.map(app => ({
    //   id: app.id,
    //   coverLetter: app.coverLetter,
    //   cvUrl: app.cvUrl,
    //   status: app.status,
    //   createdAt: app.createdAt,
    //   updatedAt: app.updatedAt,
    //   jobId: app.jobId,
    //   studentUserId: app.studentUserId,

    //   // Mapped values
    //   jobTitle: app.Job?.title || "Unknown Job",
    //   companyName: app.Job?.Company?.name || "Unknown Company",
    //   jobType: app.Job?.jobType || null,

    //   // Student info
    //   user: {
    //     id: app.User?.id,
    //     name: app.User?.name,
    //     email: app.User?.email,
    //   }
    // }));

    res.json({ applications });

  } catch (err) {
    console.error("getApplications error:", err);
    res.status(500).json({ message: "Server error" });
  }
};



export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!["pending", "accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const application = await Application.findByPk(id);
    if (!application) return res.status(404).json({ message: "Application not found" });

    // Authorization: recruiter must own the job
    if (req.user.role === "recruiter") {
  const job = await Job.findByPk(application.jobId);
  if (!job) return res.status(404).json({ message: "Job not found" });

  // Allow only recruiters from the same company
  // if (job.companyId !== req.user.companyId) {
  //   return res.status(403).json({ message: "Unauthorized" });
  // }
}


    application.status = status;
    await application.save();

    // Optionally notify student about status change (email/in-app)
    res.json({ message: "Application status updated", application });
  } catch (err) {
    console.error("updateApplicationStatus error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Optional helper to download CV (if you want dedicated route) — not strictly necessary if /uploads served statically
export const downloadCv = (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(process.cwd(), "uploads", "cvs", filename);
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: "File not found" });
    return res.download(filePath);
  } catch (err) {
    console.error("downloadCv error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
