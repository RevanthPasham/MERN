import "dotenv/config";
import { initModels } from "./db/models";
import app from "./app";

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  await initModels();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();