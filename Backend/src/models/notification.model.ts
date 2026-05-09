import mongoose, { Schema } from "mongoose";
import { User } from "./user.model.js";
import { Job } from "./job.model.js";
import { INotification } from "../types/notification.types.js";

const notificationSchema: Schema<INotification> = new Schema<INotification>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: User,
        required: true,
        index: true
    },
    jobId: {
        type: Schema.Types.ObjectId,
        ref: Job,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        default: false
    }
}, { timestamps: { createdAt: true, updatedAt: false } });

// Fix: index field name userId (was user_id)
notificationSchema.index({ userId: 1, createdAt: -1, read: 1 });

export const Notification = mongoose.model<INotification>("Notification", notificationSchema);
