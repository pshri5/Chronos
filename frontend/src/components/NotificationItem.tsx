import React from 'react';
import { Link } from 'react-router-dom';

// Define the NotificationItem component
const NotificationItem: React.FC<{
  notification: any;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ notification, onMarkAsRead, onDelete }) => {
  // Determine icon and variant based on notification type
  const getIconAndVariant = (type: string) => {
    switch (type) {
      case 'success': return { icon: 'check-circle', variant: 'success' };
      case 'error': return { icon: 'exclamation-triangle', variant: 'danger' };
      case 'warning': return { icon: 'exclamation-circle', variant: 'warning' };
      case 'info':
      default: return { icon: 'info-circle', variant: 'info' };
    }
  };

  const { icon, variant } = getIconAndVariant(notification.type);

  return (
    <div className={`list-group-item ${notification.read ? '' : 'fw-bold'}`}>
      <div className="d-flex w-100 justify-content-between">
        <h5 className="mb-1">
          {/* We can't use actual icons without an icon library, so we'll use text for now */}
          {[icon]}{' '}
          {notification.message}
        </h5>
        <small className="text-muted">
          {/* Format the date */}
          {new Date(notification.createdAt).toLocaleString()}
        </small>
      </div>
      <p className="mb-1">
        {/* We can show related job info if available */}
        {notification.jobId && (
          <Link to={`/jobs/${notification.jobId}`} className="text-decoration-none">
            View related job
          </Link>
        )}
      </p>
      <div className="d-flex justify-content-between align-items-center">
        {!notification.read && (
          <button
            type="button"
            className="btn btn-sm btn-outline-primary"
            onClick={() => onMarkAsRead(notification._id)}
          >
            Mark as Read
          </button>
        )}
        <button
          type="button"
          className="btn btn-sm btn-outline-danger"
          onClick={() => onDelete(notification._id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default NotificationItem;