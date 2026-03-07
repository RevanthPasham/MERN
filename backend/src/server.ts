import "dotenv/config";
import { initModels } from "./db/models";
import { isCloudinaryConfigured } from "./services/cloudinary.service";
import app from "./app";

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  await initModels();

  if (isCloudinaryConfigured()) {
    console.log("Cloudinary configured – image uploads will use CLOUDINARY_* from .env");
  } else {
    console.warn("Cloudinary NOT configured – set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in .env");
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();