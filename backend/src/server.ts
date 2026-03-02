import "dotenv/config";
import app from "./src/app";
import { initModels } from "./src/db/models";

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  await initModels();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();