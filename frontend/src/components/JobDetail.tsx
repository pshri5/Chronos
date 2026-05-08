import React from 'react';

// Define the JobDetail component
const JobDetail: React.FC<{ job: any }> = ({ job }) => {
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

  // Format payload as JSON string for display
  const formatPayload = (payload: any) => {
    try {
      return JSON.stringify(payload, null, 2);
    } catch (e) {
      return String(payload);
    }
  };

  return (
    <div>
      <div className="row mb-4">
        <div className="col-md-6">
          <h5 className="mb-3">Job Information</h5>
          <dl className="row">
            <dt className="col-sm-3">Name:</dt>
            <dd className="col-sm-9">{job.name}</dd>

            <dt className="col-sm-3">Type:</dt>
            <dd className="col-sm-9">
              {job.jobType === 'one-time' ? 'One-time' : 'Recurring'}
            </dd>

            <dt className="col-sm-3">Status:</dt>
            <dd className="col-sm-9">
              <span className={`badge bg-${getStatusBadgeVariant(job.status)}`}>
                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
              </span>
            </dd>

            <dt className="col-sm-3">Scheduled At:</dt>
            <dd className="col-sm-9">{formatDate(job.scheduledAt)}</dd>

            {job.jobType === 'recurring' && (
              <>
                <dt className="col-sm-3">Cron Expression:</dt>
                <dd className="col-sm-9">{job.cronExpression}</dd>
              </>
            )}
          </dl>
        </div>

        <div className="col-md-6">
          <h5 className="mb-3">Job Payload</h5>
          <div className="bg-light p-3 rounded" style={{ maxHeight: '300px', overflowY: 'auto' }}>
            <pre>{formatPayload(job.payload)}</pre>
          </div>
        </div>
      </div>

      {job.lastError && (
        <div className="alert alert-danger mb-4">
          <h5>Last Error</h5>
          <p>{job.lastError}</p>
        </div>
      )}

      <div className="mb-4">
        <h5>Timestamps</h5>
        <dl className="row">
          <dt className="col-sm-3">Created At:</dt>
          <dd className="col-sm-9">{formatDate(job.createdAt)}</dd>

          <dt className="col-sm-3">Updated At:</dt>
          <dd className="col-sm-9">{formatDate(job.updatedAt)}</dd>
        </dl>
      </div>
    </div>
  );
};

export default JobDetail;