// server/src/server.js
import app from "./app.js";
import { initDb } from "./models/index.js";

const PORT = process.env.PORT || 5000;

(async () => {
  // Initialize DB and sync models before starting server
  await initDb(); 

  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
})();
