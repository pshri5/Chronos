import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Notification } from "../models/notification.model.js";
import mongoose from "mongoose";
import { executeJobService, cancelJobService } from "../services/jobExecutionService.js";

// Create a new job
export const createJob = asyncHandler(async (req: Request, res: Response) => {
  const {
    name,
    jobType,
    payload,
    scheduledAt,
    cronExpression,
    maxRetries
  } = req.body;

  // Validation
  if (!name || !scheduledAt) {
    return res.status(400).json(new apiResponse(400, null, "Name and scheduledAt are required"));
  }

  // Validate jobType
  if (jobType && !["one-time", "recurring"].includes(jobType)) {
    return res.status(400).json(new apiResponse(400, null, "Invalid jobType. Must be 'one-time' or 'recurring'"));
  }

  // For recurring jobs, cronExpression is required
  if (jobType === "recurring" && !cronExpression) {
    return res.status(400).json(new apiResponse(400, null, "cronExpression is required for recurring jobs"));
  }

  // Create job
  const job = await Job.create({
    userId: req.user?._id,
    name,
    jobType: jobType || "one-time",
    payload: payload || {},
    scheduledAt: new Date(scheduledAt),
    cronExpression: jobType === "recurring" ? cronExpression : null,
    maxRetries: maxRetries || 3,
    status: "pending"
  });

  // Create notification for job creation
  await Notification.create({
    userId: req.user?._id,
    jobId: job._id,
    type: "info",
    message: `Job "${name}" has been created successfully.`,
    read: false
  });

  const createdJob = await Job.findById(job._id).populate("userId", "name email");

  return res
    .status(201)
    .json(new apiResponse(201, createdJob, "Job created successfully"));
});

// Get all jobs for the current user with filtering and pagination
export const getJobs = asyncHandler(async (req: Request, res: Response) => {
  const {
    status,
    jobType,
    page = 1,
    limit = 10,
    sortBy = "scheduledAt",
    sortOrder = "asc"
  } = req.query;

  // Build filter
  const filter: any = { userId: req.user?._id };

  if (status) filter.status = status;
  if (jobType) filter.jobType = jobType;

  // Build sort
  const sortOptions: any = {};
  sortOptions[sortBy as string] = sortOrder === "desc" ? -1 : 1;

  // Calculate skip
  const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

  // Get jobs
  const jobs = await Job.find(filter)
    .populate("userId", "name email")
    .sort(sortOptions)
    .skip(skip)
    .limit(parseInt(limit as string));

  // Get total count
  const total = await Job.countDocuments(filter);

  return res
    .status(200)
    .json(new apiResponse(200, {
      jobs,
      pagination: {
        total,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        pages: Math.ceil(total / parseInt(limit as string))
      }
    }, "Jobs fetched successfully"));
});

// Get a specific job by ID
export const getJobById = asyncHandler(async (req: Request, res: Response) => {
  const { jobId } = req.params;

  // Validate jobId
  if (!mongoose.Types.ObjectId.isValid(jobId as string)) {
    return res.status(400).json(new apiResponse(400, null, "Invalid job ID"));
  }

  const job = await Job.findOne({
    _id: jobId,
    userId: req.user?._id
  }).populate("userId", "name email");

  if (!job) {
    return res.status(404).json(new apiResponse(404, null, "Job not found"));
  }

  return res
    .status(200)
    .json(new apiResponse(200, job, "Job fetched successfully"));
});

// Update a job
export const updateJob = asyncHandler(async (req: Request, res: Response) => {
  const { jobId } = req.params;
  const updates = req.body;

  // Validate jobId
  if (!mongoose.Types.ObjectId.isValid(jobId as string)) {
    return res.status(400).json(new apiResponse(400, null, "Invalid job ID"));
  }

  // Find job
  const job = await Job.findOne({
    _id: jobId,
    userId: req.user?._id
  });

  if (!job) {
    return res.status(404).json(new apiResponse(404, null, "Job not found"));
  }

  // Prevent updates to running/completed jobs (except for cancellation)
  if (job.status === "running" || job.status === "completed") {
    if (updates.status && updates.status !== "cancelled") {
      return res.status(400).json(new apiResponse(400, null, "Cannot modify running or completed job"));
    }
  }

  // Validate jobType if being updated
  if (updates.jobType && !["one-time", "recurring"].includes(updates.jobType)) {
    return res.status(400).json(new apiResponse(400, null, "Invalid jobType. Must be 'one-time' or 'recurring'"));
  }

  // If changing to recurring, cronExpression is required
  if (updates.jobType === "recurring" && !updates.cronExpression && !job.cronExpression) {
    return res.status(400).json(new apiResponse(400, null, "cronExpression is required for recurring jobs"));
  }

  // If changing from recurring to one-time, clear cronExpression
  if (updates.jobType === "one-time" && job.jobType === "recurring") {
    updates.cronExpression = null;
  }

  const updatedJob = await Job.findByIdAndUpdate(
    jobId,
    { ...updates, updatedAt: new Date() },
    { new: true, runValidators: true }
  ).populate("userId", "name email");

  if (!updatedJob) {
    return res.status(500).json(new apiResponse(500, null, "Failed to update job"));
  }

  // Create notification for job update
  await Notification.create({
    userId: req.user?._id,
    jobId: updatedJob._id,
    type: "info",
    message: `Job "${updatedJob.name}" has been updated successfully.`,
    read: false
  });

  return res
    .status(200)
    .json(new apiResponse(200, updatedJob, "Job updated successfully"));
});

// Delete a job
export const deleteJob = asyncHandler(async (req: Request, res: Response) => {
  const { jobId } = req.params;

  // Validate jobId
  if (!mongoose.Types.ObjectId.isValid(jobId as string)) {
    return res.status(400).json(new apiResponse(400, null, "Invalid job ID"));
  }

  // Find job
  const job = await Job.findOneAndDelete({
    _id: jobId,
    userId: req.user?._id
  });

  if (!job) {
    return res.status(404).json(new apiResponse(404, null, "Job not found"));
  }

  // Create notification for job deletion
  await Notification.create({
    userId: req.user?._id,
    jobId: job._id,
    type: "warning",
    message: `Job "${job.name}" has been deleted successfully.`,
    read: false
  });

  return res
    .status(200)
    .json(new apiResponse(200, null, "Job deleted successfully"));
});

// Execute a job manually (for testing or immediate execution)
export const executeJob = asyncHandler(async (req: Request, res: Response) => {
  const { jobId } = req.params;

  try {
    const result = await executeJobService(
      jobId as string,
      new mongoose.Types.ObjectId(req.user?._id)
    );
    
    return res
      .status(200)
      .json(new apiResponse(200, result.job, result.message));
  } catch (error: any) {
    return res
      .status(error.message.includes("not found") ? 404 : 400)
      .json(new apiResponse(error.message.includes("not found") ? 404 : 400, null, error.message));
  }
});

// Cancel a job
export const cancelJob = asyncHandler(async (req: Request, res: Response) => {
  const { jobId } = req.params;

  try {
    const result = await cancelJobService(
      jobId as string,
      new mongoose.Types.ObjectId(req.user?._id)
    );
    
    return res
      .status(200)
      .json(new apiResponse(200, result.job, result.message));
  } catch (error: any) {
    return res
      .status(error.message.includes("not found") ? 404 : 400)
      .json(new apiResponse(error.message.includes("not found") ? 404 : 400, null, error.message));
  }
});