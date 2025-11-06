import app from "./app.js";
import { initDb } from "./models/index.js";
import { startExpireJobsTask } from "./utils/expireJobs.js";

const PORT = process.env.PORT || 5000;

(async () => {
  // Initialize DB and sync models
  await initDb();

  // Start the expire jobs cron task
  startExpireJobsTask();

  // Start server
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
})();
