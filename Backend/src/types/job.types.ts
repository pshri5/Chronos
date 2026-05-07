import { Types } from "mongoose";

export interface IJob {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  jobType: "one-time" | "recurring";
  status: "pending" | "running" | "completed" | "failed" | "cancelled";
  payload: Record<string, any>;
  scheduledAt: Date;
  cronExpression: string | null;
  retryCount: number;
  maxRetries: number;
  lastError: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IJobRequest extends Request {
  job?: IJob | null;
}