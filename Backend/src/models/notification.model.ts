import mongoose, { Schema } from "mongoose";
import { User } from "./user.model.js";
import { Job } from "./job.model.js";

const notificationSchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref: User,
        required: true,
        index: true
    },
    jobId:{
        type: Schema.Types.ObjectId,
        ref: Job,
        required: true
    },
    type:{
        type: String,
        required: true
    },
    message:{
        type: String,
        required: true
    },
    read:{
        type: Boolean,
        default: false
    }
},{timestamps:{createdAt:true,updatedAt:false}})

notificationSchema.index({ user_id: 1, createdAt: -1, read: 1 });

export const Notification = mongoose.model("Notification",notificationSchema)
