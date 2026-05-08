import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } from '../services/notificationService';
import { NotificationItem } from '../components/NotificationItem';
import { Spinner } from '../components/Spinner';

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMarkAllModal, setShowMarkAllModal] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch notifications when the component mounts
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getNotifications();
        setNotifications(response.notifications || response.data || []); // Adjust based on actual response structure
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      // Update the notification in the list
      setNotifications(prev =>
        prev.map(notification =>
          notification._id === id ? { ...notification, read: true } : notification
        )
      );
    } catch (err: any) {
      console.error('Failed to mark notification as read:', err);
      // Show error to user (optional)
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      // Update all notifications to read
      setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
      setShowMarkAllModal(false);
    } catch (err: any) {
      console.error('Failed to mark all notifications as read:', err);
      // Show error to user
    } finally {
      setShowMarkAllModal(false);
    }
  };

  const handleDeleteNotification = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      try {
        await deleteNotification(id);
        // Remove the notification from the list
        setNotifications(prev => prev.filter(notification => notification._id !== id));
      } catch (err: any) {
        console.error('Failed to delete notification:', err);
        // Show error to user
      }
    }
  };

  return (
    <div className="notifications-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Notifications</h2>
        <div>
          <button
            className="btn btn-outline-primary me-2"
            onClick={() => setShowMarkAllModal(true)}
          >
            Mark All as Read
          </button>
          <button className="btn btn-outline-secondary" onClick={() => navigate('/jobs')}>
            Back to Jobs
          </button>
        </div>
      </div>

      {loading ? (
        <Spinner />
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-5">
          <p>No notifications found.</p>
        </div>
      ) : (
        <div className="list-group">
          {notifications.map((notification: any) => (
            <NotificationItem
              key={notification._id}
              notification={notification}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDeleteNotification}
            />
          ))}
        </div>
      )}

      {/* Mark All as Read Modal */}
      {showMarkAllModal && (
        <div className="modal fade show" style={{ display: 'block' }} aria-hidden="false">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Mark All as Read</h5>
                <button type="button" className="btn-close" onClick={() => setShowMarkAllModal(false)} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                Are you sure you want to mark all notifications as read?
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowMarkAllModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={handleMarkAllAsRead}>
                  Mark All as Read
                </button>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;