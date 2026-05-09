import mongoose, { Schema } from "mongoose";
import { Job } from "./job.model.js";
import { IJobLog } from "../types/jobLog.types.js";

const jobLogSchema: Schema<IJobLog> = new Schema<IJobLog>({
    jobId: {
        type: Schema.Types.ObjectId,
        ref: Job,
        required: true,
        index: true
    },
    status: {
        type: String,
        required: true,
        enum: ["started", "completed", "failed", "retrying"],
    },
    message: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        default: null
    },
    executedAt: {
        type: Date,
        default: Date.now // Fix: Pass function, not result
    }
}, { timestamps: true });

jobLogSchema.index({ jobId: 1, executedAt: -1 });

export const JobLog = mongoose.model<IJobLog>("JobLog", jobLogSchema);