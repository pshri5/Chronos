import { Job } from "../models/job.model.js";
import { executeJobService } from "./jobExecutionService.js";
import { JobLog } from "../models/jobLog.model.js";
import mongoose from "mongoose";

//Job Queue Service - Background worker for processing pending jobs
 
export class JobQueueService {
  private static instance: JobQueueService;
  private isRunning: boolean = false;
  private workerInterval: NodeJS.Timeout | null = null;
  private readonly POLL_INTERVAL = 5000; // 5 seconds

  private constructor() {}

  //Get singleton instance

  public static getInstance(): JobQueueService {
    if (!JobQueueService.instance) {
      JobQueueService.instance = new JobQueueService();
    }
    return JobQueueService.instance;
  }

  /**
   * Start the job queue worker
   */
  public start(): void {
    if (this.isRunning) {
      console.log("Job queue worker is already running");
      return;
    }

    this.isRunning = true;
    console.log("Starting job queue worker...");

    // Process jobs immediately on start
    this.processPendingJobs().catch(console.error);

    // Set up interval to process jobs periodically
    this.workerInterval = setInterval(() => {
      this.processPendingJobs().catch(console.error);
    }, this.POLL_INTERVAL);

    console.log(`Job queue worker started with ${this.POLL_INTERVAL}ms polling interval`);
  }

  /**
   * Stop the job queue worker
   */
  public stop(): void {
    if (!this.isRunning) {
      console.log("Job queue worker is not running");
      return;
    }

    this.isRunning = false;
    if (this.workerInterval) {
      clearInterval(this.workerInterval);
      this.workerInterval = null;
    }
    console.log("Job queue worker stopped");
  }

  /**
   * Process pending jobs
   */
  private async processPendingJobs(): Promise<void> {
    try {
      // Find pending jobs that are scheduled to run now or in the past
      const now = new Date();
      const pendingJobs = await Job.find({
        status: "pending",
        scheduledAt: { $lte: now }
      }).limit(10); // Process in batches to avoid overwhelming the system

      if (pendingJobs.length === 0) {
        return; // No pending jobs to process
      }

      console.log(`Processing ${pendingJobs.length} pending job(s)...`);

      // Process each job
      for (const job of pendingJobs) {
        try {
          // Skip if job is no longer pending (might have been updated by another process)
          if (job.status !== "pending") {
            continue;
          }

          // Execute the job using the shared service
          const result = await executeJobService(
            job._id.toString(),
            job.userId
          );

          // If the job executed successfully and is recurring, reschedule for next run
          if (result.success && job.jobType === "recurring" && job.cronExpression) {
            // Use the job object returned from the service (which has been updated with execution results)
            const jobDoc = result.job;

            // Simplified rescheduling: add 1 day to the current scheduledAt
            // In a real app, use a cron-expression library to get next run time
            const nextRun = new Date(jobDoc.scheduledAt);
            nextRun.setDate(nextRun.getDate() + 1); // Add 1 day

            jobDoc.scheduledAt = nextRun;
            jobDoc.status = "pending"; // Set back to pending for next run
            await jobDoc.save();

            console.log(`Rescheduled recurring job ${job._id} for next run at ${nextRun}`);
          }
        } catch (error) {
          console.error(`Error processing job ${job._id}:`, error);
          // Continue with other jobs even if one fails
        }
      }
    } catch (error) {
      console.error("Error in job queue processing:", error);
    }
  }
}

// Export the singleton instance
export const jobQueueService = JobQueueService.getInstance();