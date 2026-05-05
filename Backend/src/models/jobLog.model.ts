import mongoose, { Schema } from "mongoose";
import { Job } from "./job.model.js";

const jobLogSchema = new Schema({
    jobId:{
        type: Schema.Types.ObjectId,
        ref: Job,
        required: true,
        index: true
    },
    status:{
        type: String,
        required: true,
        enum:["started", "completed","failed","retrying"],
    
    },
    message:{
        type: String,
        required: true
    },
    duration:{
        type: Number,
        default: null
    },
    executedAt:{
        type: Date,
        default: Date.now()
    }
},{timestamps:true})

jobLogSchema.index({jobId:1,executedAt:-1})

export const JobLog = mongoose.model("JobLog",jobLogSchema)