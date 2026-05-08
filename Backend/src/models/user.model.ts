import mongoose,{Schema} from "mongoose";



const userSchema: Schema = new Schema({
    name:{
        type: String,
        required: true,
        
    },
    email:{
        type: String,
        required: true,
        unique:true,
        lowercase: true
    },
    password:{
        type: String,
        required: true
    }
},{timestamps:true})



export const User = mongoose.model("User",userSchema)