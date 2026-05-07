import { Types } from "mongoose";

export interface IJobLog {
  _id: Types.ObjectId;
  jobId: Types.ObjectId;
  status: "started" | "completed" | "failed" | "retrying";
  message: string;
  duration: number | null;
  executedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IJobLogRequest extends Request {
  jobLog?: IJobLog | null;
}