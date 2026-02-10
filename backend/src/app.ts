import express from "express";
import cors from "cors";
import routes from "./routes";
import { errorHandler } from "./utils/errors";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", routes);

app.use(errorHandler);

export default app;
