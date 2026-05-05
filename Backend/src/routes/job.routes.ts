import { Router } from "express";
import { createJob, getJobs, getJobById, updateJob, deleteJob } from "../controllers/job.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Secure routes (require authentication)
router.route("/").post(verifyJWT, createJob).get(verifyJWT, getJobs);
router.route("/:jobId").get(verifyJWT, getJobById).patch(verifyJWT, updateJob).delete(verifyJWT, deleteJob);

export default router;