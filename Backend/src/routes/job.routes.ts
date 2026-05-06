import { Router } from "express";
import { createJob, getJobs, getJobById, updateJob, deleteJob, executeJob, cancelJob } from "../controllers/job.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Secure routes (require authentication)
router.route("/").post(verifyJWT, createJob).get(verifyJWT, getJobs);
router.route("/:jobId").get(verifyJWT, getJobById).patch(verifyJWT, updateJob).delete(verifyJWT, deleteJob);
router.route("/:jobId/execute").post(verifyJWT, executeJob);
router.route("/:jobId/cancel").post(verifyJWT, cancelJob);

export default router;