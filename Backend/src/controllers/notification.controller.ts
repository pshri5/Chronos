import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Notification } from "../models/notification.model.js";
import { apiResponse } from "../utils/apiResponse.js";
import mongoose from "mongoose";

// Get notifications for the current user with filtering and pagination
export const getNotifications = asyncHandler(async (req: Request, res: Response) => {
  const {
    type,
    isRead,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc"
  } = req.query;

  // Build filter
  const filter: any = { userId: req.user?._id };

  if (type) filter.type = type;
  if (isRead !== undefined) filter.read = isRead === "true";

  // Build sort
  const sortOptions: any = {};
  sortOptions[sortBy as string] = sortOrder === "desc" ? -1 : 1;

  // Calculate skip
  const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

  // Get notifications
  const notifications = await Notification.find(filter)
    .populate("jobId", "name")
    .sort(sortOptions)
    .skip(skip)
    .limit(parseInt(limit as string));

  // Get total count
  const total = await Notification.countDocuments(filter);

  return res
    .status(200)
    .json(new apiResponse(200, {
      notifications,
      pagination: {
        total,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        pages: Math.ceil(total / parseInt(limit as string))
      }
    }, "Notifications fetched successfully"));
});

// Mark a notification as read
export const markNotificationAsRead = asyncHandler(async (req: Request, res: Response) => {
  const { notificationId } = req.params;

  // Validate notificationId
  if (!mongoose.Types.ObjectId.isValid(notificationId as string)) {
    return res.status(400).json(new apiResponse(400, null, "Invalid notification ID"));
  }

  // Find notification and verify ownership
  const notification = await Notification.findOne({
    _id: notificationId,
    userId: req.user?._id
  });

  if (!notification) {
    return res.status(404).json(new apiResponse(404, null, "Notification not found"));
  }

  // Update notification
  notification.read = true;
  await notification.save();

  return res
    .status(200)
    .json(new apiResponse(200, notification, "Notification marked as read"));
});

// Mark all notifications as read for the current user
export const markAllNotificationsAsRead = asyncHandler(async (req: Request, res: Response) => {
  const result = await Notification.updateMany(
    { userId: req.user?._id, read: false },
    { $set: { read: true } }
  );

  return res
    .status(200)
    .json(new apiResponse(200, { modifiedCount: result.modifiedCount }, "All notifications marked as read"));
});

// Delete a notification
export const deleteNotification = asyncHandler(async (req: Request, res: Response) => {
  const { notificationId } = req.params;

  // Validate notificationId
  if (!mongoose.Types.ObjectId.isValid(notificationId as string)) {
    return res.status(400).json(new apiResponse(400, null, "Invalid notification ID"));
  }

  // Find notification and delete it
  const notification = await Notification.findOneAndDelete({
    _id: notificationId,
    userId: req.user?._id
  });

  if (!notification) {
    return res.status(404).json(new apiResponse(404, null, "Notification not found"));
  }

  return res
    .status(200)
    .json(new apiResponse(200, null, "Notification deleted successfully"));
});