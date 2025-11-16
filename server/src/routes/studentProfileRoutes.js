import express from "express";
import path from "path";
import StudentProfile from "../models/StudentProfile.js";
import { uploadCv } from "../middlewares/uploadCv.js";

const router = express.Router();

// Upload CV
router.post("/upload-cv", uploadCv.single("cv"), async (req, res) => {
  try {
    const { userId } = req.body; // get userId from request body or auth middleware
    const profile = await StudentProfile.findOne({ where: { userId } });

    if (!profile) return res.status(404).json({ message: "Profile not found" });

    profile.cv = req.file.filename;
    await profile.save();

    res.json({ message: "CV uploaded successfully!", cv: req.file.filename });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve CV for recruiters
router.get("/cv/:userId", async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ where: { userId: req.params.userId } });

    if (!profile || !profile.cv) return res.status(404).send("CV not found");

    const cvPath = path.join("uploads", "cvs", profile.cv);
    res.sendFile(path.resolve(cvPath));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
