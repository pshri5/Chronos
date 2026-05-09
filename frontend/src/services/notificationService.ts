import api from './api';

// Types for notification
export interface Notification {
  _id: string;
  userId: string;
  jobId: string;
  type: string; // e.g., 'info', 'success', 'error', 'warning'
  message: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

const unwrap = (response: any) => response.data?.data ?? response.data;

// Fetch notifications with optional filters and pagination
export const getNotifications = async (params?: {
  type?: string;
  isRead?: string; // "true" or "false"
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
}) => {
  const response = await api.get('/notifications', { params });
<<<<<<< Updated upstream
  return unwrap(response);
=======
  return response.data.data;
>>>>>>> Stashed changes
};

// Mark a notification as read
export const markNotificationAsRead = async (id: string) => {
  const response = await api.patch(`/notifications/${id}/read`);
<<<<<<< Updated upstream
  return unwrap(response);
=======
  return response.data.data;
>>>>>>> Stashed changes
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async () => {
  const response = await api.patch('/notifications/read-all');
<<<<<<< Updated upstream
  return unwrap(response);
=======
  return response.data.data;
>>>>>>> Stashed changes
};

// Delete a notification
export const deleteNotification = async (id: string) => {
  await api.delete(`/notifications/${id}`);
};

// Get unread count (optional, for badge)
export const getUnreadCount = async () => {
  const response = await api.get('/notifications/unread-count');
<<<<<<< Updated upstream
  return unwrap(response);
=======
  return response.data.data;
>>>>>>> Stashed changes
};