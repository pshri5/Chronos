import mongoose, { Schema, type CallbackWithoutResultAndOptionalError } from "mongoose";
import bcrypt from "bcrypt";
import type { IUser } from "../types/user.types.js";

const userSchema: Schema<IUser> = new Schema<IUser>({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String
    }
}, { timestamps: true });

// Hashing password before saving
userSchema.pre("save", async function (this: any, next: any) {
    try {
        if (!this.isModified("password")) return next(); // preventing rehashing of the password

        // Ensure password exists before hashing
        if (this.password) {
            this.password = await bcrypt.hash(this.password, 10);
        }
        next();
    } catch (error) {
        next(error as mongoose.CallbackError);
    }
});

// comparing saved password and input password
userSchema.methods.isPasswordCorrect = async function (inputPassword: string): Promise<boolean> {
    return await bcrypt.compare(inputPassword, this.password);
};

export const User = mongoose.model<IUser>("User", userSchema);