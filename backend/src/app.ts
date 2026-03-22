import express from "express";
import cors from "cors";
import routes from "./routes";
import { errorHandler } from "./utils/errors";
import { ensureDbMiddleware } from "./middleware/ensureDbMiddleware";

const app = express();
app.use(cors());
app.use(express.json({ limit: "15mb" }));

/** No DB — verifies serverless routing only */
app.get("/api/test", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "ok", time: new Date().toISOString() });
});

app.get("/", (_req, res) => {
  res.type("html").send(
    `<!DOCTYPE html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width"/><title>API</title></head>` +
      `<body style="font-family:system-ui;padding:2rem"><h1>API</h1>` +
      `<p><a href="/api/test">/api/test</a> · <a href="/api/health">/api/health</a></p></body></html>`
  );
});

app.use(ensureDbMiddleware);
app.use("/api", routes);
app.use(errorHandler);

export default app;
