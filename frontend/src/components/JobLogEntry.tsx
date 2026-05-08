import React from 'react';

// Define the JobLogEntry component
const JobLogEntry: React.FC<{ log: any }> = ({ log }) => {
  // Determine badge color based on log status
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'started': return 'info';
      case 'completed': return 'success';
      case 'failed': return 'danger';
      case 'retrying': return 'warning';
      default: return 'secondary';
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Format duration for display
  const formatDuration = (duration: number | null) => {
    if (duration === null) return 'N/A';
    return `${duration} ms`;
  };

  return (
    <div className="list-group-item">
      <div className="d-flex w-100 justify-content-between">
        <h5 className="mb-1">Job Log Entry</h5>
        <small className="text-muted">
          {formatDate(log.executedAt)}
        </small>
      </div>
      <p className="mb-1">
        <strong>Status:</strong>
        <span className={`badge bg-${getStatusBadgeVariant(log.status)}`}>
          {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
        </span>
      </p>
      <p className="mb-1">
        <strong>Message:</strong> {log.message}
      </p>
      {log.duration !== null && (
        <p className="mb-1">
          <strong>Duration:</strong> {formatDuration(log.duration)}
        </p>
      )}
    </div>
  );
};

export default JobLogEntry;