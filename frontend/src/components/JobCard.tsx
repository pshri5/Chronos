import React from 'react';
import { Link } from 'react-router-dom';

// Define the JobCard component
const JobCard: React.FC<{
  job: any;
  onDelete: (id: string) => void;
  onExecute: (id: string) => void;
}> = ({ job, onDelete, onExecute }) => {
  // Determine badge color based on job status
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'running': return 'info';
      case 'completed': return 'success';
      case 'failed': return 'danger';
      case 'cancelled': return 'secondary';
      default: return 'secondary';
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="card h-100 shadow-sm">
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{job.name}</h5>
        <p className="card-text text-muted small">
          <strong>Type:</strong> {job.jobType === 'one-time' ? 'One-time' : 'Recurring'}
        </p>
        <p className="card-text text-muted small">
          <strong>Scheduled:</strong> {formatDate(job.scheduledAt)}
        </p>
        <div className="mb-2">
          <span className={`badge bg-${getStatusBadgeVariant(job.status)}`}>
            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
          </span>
        </div>
        {job.jobType === 'recurring' && job.cronExpression && (
          <p className="card-text text-muted small">
            <strong>Cron:</strong> {job.cronExpression}
          </p>
        )}
        {job.lastError && (
          <p className="card-text text-danger small">
            <strong>Last Error:</strong> {job.lastError}
          </p>
        )}
        <div className="mt-auto">
          <div className="d-grid gap-2">
            <Link to={`/jobs/${job._id}`} className="btn btn-outline-info">
              View Details
            </Link>
            <div className="d-grid gap-1 d-md-flex justify-content-md-end">
              <button
                className="btn btn-sm btn-outline-success me-1"
                onClick={() => onExecute(job._id)}
                disabled={job.status === 'running' || job.status === 'completed'}
              >
                Execute
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => onDelete(job._id)}
                disabled={job.status === 'running' || job.status === 'completed'}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;