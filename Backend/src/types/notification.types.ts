import { Types } from "mongoose";

export interface INotification {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  jobId: Types.ObjectId;
  type: string; // Could be more specific: "info", "success", "error", "warning"
  message: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface INotificationRequest extends Request {
  notification?: INotification | null;
}