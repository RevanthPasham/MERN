import express from "express";
import collectionRoutes from "./routes/CollectionRoutes";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// 🔹 ADD THIS
app.use("/api", collectionRoutes);

export default app;
