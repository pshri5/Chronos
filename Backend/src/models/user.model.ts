import type { NextFunction } from "express";
import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt"



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

userSchema.index({ email: 1 });

export const User = mongoose.model("User",userSchema)

//Hashing password before saving
userSchema.pre("save",async function (next) {
    if(!this.isModified("password")) return next() //preventing rehashing of the password
    
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

//comparing saved password and input password
userSchema.methods.isPasswordCorrect = async function(inputPassword){
   return await bcrypt.compare(inputPassword, this.password)
}