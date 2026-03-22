import "dotenv/config";
import http from "http";
import { isCloudinaryConfigured } from "./services/cloudinary.service";
import app from "./app";

const PORT = Number(process.env.PORT) || 4000;

async function start(): Promise<void> {
  if (isCloudinaryConfigured()) {
    console.log("Cloudinary configured");
  }

  const server = http.createServer(app);

  await new Promise<void>((resolve, reject) => {
    const onErr = (err: Error) => {
      server.off("error", onErr);
      reject(err);
    };
    server.once("error", onErr);
    server.listen(PORT, () => {
      server.off("error", onErr);
      resolve();
    });
  });

  console.log(`Server listening on port ${PORT}`);

  server.on("error", (err: NodeJS.ErrnoException) => {
    if (err.code === "EADDRINUSE") {
      console.error(`Port ${PORT} is already in use.`);
    } else {
      console.error("HTTP server error:", err);
    }
    process.exit(1);
  });

  const shutdown = (signal: string) => {
    console.log(`${signal} — closing…`);
    server.close(() => process.exit(0));
  };
  process.once("SIGINT", () => shutdown("SIGINT"));
  process.once("SIGTERM", () => shutdown("SIGTERM"));
}

start().catch((err) => {
  console.error("Failed to start:", err);
  process.exit(1);
});
