import express from "express";
import cors from "cors";
import routes from "./routes";
import { errorHandler } from "./utils/errors";

const app = express();
app.use(cors());
// Allow large JSON bodies for admin image upload (base64 data URIs)
app.use(express.json({ limit: "15mb" }));
app.use("/api", routes);
app.use(errorHandler);
app.get("/", (req, res) => {
  res.send("API is running");
});

export default app;
