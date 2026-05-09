import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { IUser } from "../types/user.types.js";

declare global {
  namespace Express {
    interface Request {
      user?: IUser | null;
    }
  }
}

export const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ success: false, message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as any;
    
    // Find the user in DB to ensure the user exists
    // Fix: use decoded._id (matching user.controller.ts)
    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found." });
    }
    
    req.user = user;
    next();

  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token." });
  }
};