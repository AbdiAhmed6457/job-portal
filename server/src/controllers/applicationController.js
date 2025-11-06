// server/src/controllers/applicationController.js
import Application from "../models/Application.js";

export const applyJob = async (req, res) => {
  try {
    const { jobId, studentUserId, coverLetter, cvUrl } = req.body;
    if (!jobId || !studentUserId) {
      return res.status(400).json({ message: "jobId and studentUserId are required" });
    }

    const application = await Application.create({
      jobId,
      studentUserId,
      coverLetter,
      cvUrl,
      status: "pending",
    });

    res.status(201).json({ message: "Application submitted", application });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getApplications = async (req, res) => {
  try {
    const applications = await Application.findAll();
    res.json({ applications });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
