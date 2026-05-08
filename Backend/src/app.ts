import express from "express";
import cors from "cors";
import jobRoutes from "./routes/job.routes.js";
import userRoutes from "./routes/user.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import jobLogRoutes from "./routes/jobLog.routes.js";

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/jobs", jobRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/job-logs", jobLogRoutes);

export default app;
