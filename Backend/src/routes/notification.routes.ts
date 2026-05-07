import { Router } from "express";
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } from "../controllers/notification.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Secure routes (require authentication)
router.route("/").get(verifyJWT, getNotifications);
router.route("/:notificationId/read").patch(verifyJWT, markNotificationAsRead);
router.route("/read-all").patch(verifyJWT, markAllNotificationsAsRead);
router.route("/:notificationId").delete(verifyJWT, deleteNotification);

export default router;