import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { User } from "../models/user.model.js";

declare global {
  namespace Express {
    interface Request {
      user?: User | null;
    }
  }
}

export const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ success: false, message: "Access denied. No token provided." });
    }

    const decoded = verify(token, process.env.ACCESS_TOKEN_SECRET as string) as any;
    
    // Find the user in DB to ensure the user exists and we have the full User document (with _id)
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found." });
    }
    
    req.user = user;
    next();

  } catch (error) {
    return res.status(400).json({ success: false, message: "Invalid token." });
  }
};