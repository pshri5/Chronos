import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { JobLog } from "../models/jobLog.model.js";
import { Job } from "../models/job.model.js";
import { apiResponse } from "../utils/apiResponse.js";
import mongoose from "mongoose";

// Get job logs for a specific job with pagination
export const getJobLogs = asyncHandler(async (req: Request, res: Response) => {
  const { jobId } = req.params;
  const {
    page = 1,
    limit = 10,
    sortBy = "executedAt",
    sortOrder = "desc"
  } = req.query;

  // Validate jobId
  if (!mongoose.Types.ObjectId.isValid(jobId as string)) {
    return res.status(400).json(new apiResponse(400, null, "Invalid job ID"));
  }

  // Verify job ownership
  const job = await Job.findOne({
    _id: jobId,
    userId: req.user?._id
  });

  if (!job) {
    return res.status(404).json(new apiResponse(404, null, "Job not found"));
  }

  // Build filter
  const filter: any = { jobId: jobId };

  // Build sort
  const sortOptions: any = {};
  sortOptions[sortBy as string] = sortOrder === "desc" ? -1 : 1;

  // Calculate skip
  const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

  // Get job logs
  const jobLogs = await JobLog.find(filter)
    .sort(sortOptions)
    .skip(skip)
    .limit(parseInt(limit as string));

  // Get total count
  const total = await JobLog.countDocuments(filter);

  return res
    .status(200)
    .json(new apiResponse(200, {
      jobLogs,
      pagination: {
        total,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        pages: Math.ceil(total / parseInt(limit as string))
      }
    }, "Job logs fetched successfully"));
});

// Get recent job logs for the current user (across all jobs)
export const getRecentJobLogs = asyncHandler(async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "executedAt",
    sortOrder = "desc"
  } = req.query;

  // Find all job IDs belonging to the current user
  const userJobs = await Job.find({ userId: req.user?._id }).select("_id");
  const userJobIds = userJobs.map(job => job._id);

  if (userJobIds.length === 0) {
    return res
      .status(200)
      .json(new apiResponse(200, {
        jobLogs: [],
        pagination: {
          total: 0,
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          pages: 0
        }
      }, "No job logs found"));
  }

  // Build filter
  const filter: any = { jobId: { $in: userJobIds } };

  // Build sort
  const sortOptions: any = {};
  sortOptions[sortBy as string] = sortOrder === "desc" ? -1 : 1;

  // Calculate skip
  const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

  // Get job logs
  const jobLogs = await JobLog.find(filter)
    .sort(sortOptions)
    .skip(skip)
    .limit(parseInt(limit as string));

  // Get total count
  const total = await JobLog.countDocuments(filter);

  return res
    .status(200)
    .json(new apiResponse(200, {
      jobLogs,
      pagination: {
        total,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        pages: Math.ceil(total / parseInt(limit as string))
      }
    }, "Recent job logs fetched successfully"));
});