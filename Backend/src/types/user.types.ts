import { Types } from "mongoose";

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password?: string; // Exclude from responses by default
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserRequest extends Request {
  user?: IUser | null;
}