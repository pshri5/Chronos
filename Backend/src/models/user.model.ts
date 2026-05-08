import type { NextFunction } from "express";
import mongoose,{Schema, type CallbackWithoutResultAndOptionalError} from "mongoose";
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



export const User = mongoose.model("User",userSchema)

//Hashing password before saving
userSchema.pre("save",async function (next:CallbackWithoutResultAndOptionalError) {
   try {
     if(!this.isModified("password")) return next() //preventing rehashing of the password
    
    this.password = await bcrypt.hash(this.password, 10)
    next()
   } catch (error) {
    next(error as mongoose.CallbackError)
   }
})

//comparing saved password and input password
userSchema.methods.isPasswordCorrect = async function(inputPassword){
   return await bcrypt.compare(inputPassword, this.password)
}