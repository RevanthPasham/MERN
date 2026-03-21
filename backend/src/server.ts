import "dotenv/config";
import { initModels } from "./db/models";
import { isCloudinaryConfigured } from "./services/cloudinary.service";
import app from "./app";

const PORT = Number(process.env.PORT) || 4000;

const startServer = async () => {
  await initModels();

  if (isCloudinaryConfigured()) {
    console.log("Cloudinary configured – image uploads will use CLOUDINARY_* from .env");
  } else {
    console.warn("Cloudinary NOT configured – set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in .env");
  }

  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log("Press Ctrl+C to stop.");
  });

  server.on("error", (err: NodeJS.ErrnoException) => {
    if (err.code === "EADDRINUSE") {
      console.error(`Port ${PORT} is already in use. Stop the other process or set PORT in .env.`);
    } else {
      console.error("HTTP server error:", err);
    }
    process.exit(1);
  });

  const shutdown = (signal: string) => {
    console.log(`\n${signal} received — closing server…`);
    server.close((closeErr) => {
      if (closeErr) console.error("Error while closing server:", closeErr);
      process.exit(closeErr ? 1 : 0);
    });
  };

  process.once("SIGINT", () => shutdown("SIGINT"));
  process.once("SIGTERM", () => shutdown("SIGTERM"));
};

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled promise rejection:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
});