import "dotenv/config";
import app from "./app";
import { initModels } from "./db/models";

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await initModels();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
