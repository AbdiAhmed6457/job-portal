// src/utils/expireJobs.js
import cron from "node-cron";
import Job from "../models/Job.js";
import { Op } from "sequelize";


cron.schedule("0 0 * * *", async () => {
  await Job.update(
    { status: "expired" },
    { where: { expiresAt: { [Op.lt]: new Date() }, status: "approved" } }
  );
  console.log("✅ Expired jobs updated");
});
