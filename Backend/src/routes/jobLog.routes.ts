import { Router } from "express";
import { getJobLogs, getRecentJobLogs } from "../controllers/jobLog.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Secure routes (require authentication)
router.route("/job/:jobId").get(verifyJWT, getJobLogs);
router.route("/recent").get(verifyJWT, getRecentJobLogs);

export default router;