import express from "express";
import cors from "cors";
import jobRoutes from "./routes/job.routes.js";
import userRoutes from "./routes/user.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import jobLogRoutes from "./routes/jobLog.routes.js";
import healthRoutes from "./routes/health.routes.js";

const app = express();

// Standard middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || "*",
  credentials: true
}));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.json({ limit: "16kb" }));

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/jobs", jobRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/job-logs", jobLogRoutes);
app.use("/health", healthRoutes);

export default app;
