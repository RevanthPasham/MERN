import express from "express";
import cors from "cors";
import routes from "./routes";
import { errorHandler } from "./utils/errors";

const app = express();
app.use(cors());
// Allow large JSON bodies for admin image upload (base64 data URIs)
app.use(express.json({ limit: "15mb" }));

/** Quick check in browser or curl — JSON, no DB query required */
app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "Backend is running",
    hint: "Data routes: GET /api/banners, /api/products, /api/collections",
    time: new Date().toISOString(),
  });
});

app.use("/api", routes);
app.use(errorHandler);

app.get("/", (_req, res) => {
  res.type("html").send(
    `<!DOCTYPE html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width"/><title>Houseof API</title></head><body style="font-family:system-ui;padding:2rem">` +
      `<h1>API is running</h1>` +
      `<p>Open <a href="/api/health"><code>/api/health</code></a> for a JSON status check.</p>` +
      `<p>API base: <code>/api/…</code> (e.g. <code>/api/banners</code>)</p>` +
      `</body></html>`
  );
});

export default app;
