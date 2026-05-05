import mongoose, {Schema} from "mongoose";
import { User } from "./user.model.js";


const jobSchema: Schema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref: User,
        required: true,
        index:true
    },
    name:{
        type: String,
        required: true,
    },
    jobType:{
        type: String,
        enum:["one-time","recurring"],
        default: "one-time",
        required: true
    },
    status:{
        type: String,
        required: true,
        enum: ["pending","running","completed","failed","cancelled"],
        default: "pending",
        index: true
    },
    payload:{
        type: Schema.Types.Mixed,
        default:{}
    },
    scheduledAt: {
        type: Date,
        required: true,
        index: true
    },
    cronExpression:{
        type: String,
        default: null,
    },
    retryCount:{
        type: Number,
        default: 0
    },
    maxRetries:{
        type: Number,
        default: 3,
        min:0,
        max: 10
    },
    lastError:{
        type: String,
        default: null
    }
},{timestamps:true})

jobSchema.index({status: 1 , scheduledAt: 1 })

export const Job = mongoose.model("Job",jobSchema)