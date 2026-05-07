import { Job } from "../models/job.model.js";
import { Notification } from "../models/notification.model.js";
import { JobLog } from "../models/jobLog.model.js";
import mongoose from "mongoose";

/**
 * Execute a job with given parameters
 * This service handles the core execution logic that can be used by:
 * 1. Manual execution endpoint
 * 2. Background job worker
 */
export const executeJobService = async (
  jobId: string,
  userId: mongoose.Types.ObjectId
) => {
  // Find job and verify ownership
  const job = await Job.findOne({
    _id: jobId,
    userId: userId
  });

  if (!job) {
    throw new Error("Job not found or access denied");
  }

  // Check if job can be executed
  if (job.status === "running") {
    throw new Error("Job is already running");
  }

  if (job.status === "completed") {
    throw new Error("Job is already completed");
  }

  // Update job status to running
  job.status = "running";
  job.lastError = null;
  await job.save();

  // Create job log entry for job start
  const startTime = Date.now();
  await JobLog.create({
    jobId: job._id,
    status: "started",
    message: "Job execution started",
    executedAt: new Date()
  });

  try {
    // Simulate job execution success or failure based on simple condition
    const shouldFail = Math.random() < 0.1; // 10% chance of failure for demo
    
    if (shouldFail) {
      throw new Error("Simulated job execution failure");
    }

    // Job executed successfully
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    job.status = "completed";
    job.retryCount = 0; // Reset retry count on success
    job.lastError = null;
    
    // Save the updated job
    await job.save();

    // Create job log entry for successful completion
    await JobLog.create({
      jobId: job._id,
      status: "completed",
      message: "Job executed successfully",
      duration: duration,
      executedAt: new Date()
    });

    // Create notification for successful job execution
    await Notification.create({
      userId: userId,
      jobId: job._id,
      type: "success",
      message: `Job "${job.name}" has been executed successfully.`,
      read: false
    });

    return {
      success: true,
      job,
      message: "Job executed successfully"
    };
  } catch (error: any) {
    // Job execution failed
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    job.status = "failed";
    job.lastError = error.message;
    job.retryCount += 1;

    // If max retries not exceeded, set to pending for retry
    if (job.retryCount < (job.maxRetries || 3)) {
      job.status = "pending";
      // In a real system, we'd schedule a retry here
    }

    await job.save();

    // Create job log entry for failed execution
    await JobLog.create({
      jobId: job._id,
      status: "failed",
      message: `Job execution failed: ${error.message}`,
      duration: duration,
      executedAt: new Date()
    });

    // Create notification for failed job execution
    await Notification.create({
      userId: userId,
      jobId: job._id,
      type: "error",
      message: `Job "${job.name}" failed to execute: ${error.message}`,
      read: false
    });

    return {
      success: false,
      job,
      message: "Job execution failed",
      error: error.message
    };
  }
};

/**
 * Cancel a job
 */
export const cancelJobService = async (
  jobId: string,
  userId: mongoose.Types.ObjectId
) => {
  // Find job and verify ownership
  const job = await Job.findOne({
    _id: jobId,
    userId: userId
  });

  if (!job) {
    throw new Error("Job not found or access denied");
  }

  // Prevent cancellation of already completed/failed jobs
  if (job.status === "completed" || job.status === "failed" || job.status === "cancelled") {
    throw new Error("Cannot cancel job that is already completed, failed, or cancelled");
  }

  // Update job status to cancelled
  job.status = "cancelled";
  await job.save();

  // Create notification for job cancellation
  await Notification.create({
    userId: userId,
    jobId: job._id,
    type: "warning",
    message: `Job "${job.name}" has been cancelled.`,
    read: false
  });

  return {
    success: true,
    job,
    message: "Job cancelled successfully"
  };
};