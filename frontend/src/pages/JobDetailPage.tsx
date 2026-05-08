import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getJob, updateJob, deleteJob, executeJob, cancelJob } from '../services/jobService';
import { JobDetail } from '../components/JobDetail';
import { JobFormModal } from '../components/JobFormModal';
import { Spinner } from '../components/Spinner';
import { Link } from 'react-router-dom';

const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Fetch job details when the component mounts or when id changes
  useEffect(() => {
    const fetchJob = async () => {
      if (!id) {
        navigate('/jobs');
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await getJob(id);
        setJob(response.data || response.job || response); // Adjust based on actual response structure
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load job details');
        // If job not found, redirect to list
        if (err.response?.status === 404) {
          navigate('/jobs');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, navigate]);

  const handleUpdateJob = async (jobData: any) => {
    try {
      await updateJob(id, jobData);
      setShowEditModal(false);
      setLoading(true);
      const response = await getJob(id);
      setJob(response.data || response.job || response);
    } catch (err: any) {
      setError(err.message || 'Failed to update job');
    }
  };

  const handleDeleteJob = async () => {
    try {
      await deleteJob(id);
      navigate('/jobs');
    } catch (err: any) {
      setError(err.message || 'Failed to delete job');
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  const handleExecuteJob = async () => {
    try {
      await executeJob(id);
      setLoading(true);
      const response = await getJob(id);
      setJob(response.data || response.job || response);
    } catch (err: any) {
      setError(err.message || 'Failed to execute job');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelJob = async () => {
    try {
      await cancelJob(id);
      setLoading(true);
      const response = await getJob(id);
      setJob(response.data || response.job || response);
    } catch (err: any) {
      setError(err.message || 'Failed to cancel job');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        {error}
        <button className="btn btn-outline-secondary btn-sm mt-2" onClick={() => navigate('/jobs')}>
          Go to Jobs List
        </button>
      </div>
    );
  }

  if (!job) {
    return <div className="alert alert-info">No job data available.</div>;
  }

  return (
    <div className="job-detail-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Job Details: {job.name}</h2>
        <div>
          <Link to={`/jobs/${job._id}/logs`} className="btn btn-outline-primary me-2">
            View Logs
          </Link>
          <button
            className="btn btn-outline-secondary me-2"
            onClick={() => setShowEditModal(true)}
          >
            Edit Job
          </button>
          <button
            className="btn btn-danger"
            onClick={() => setShowDeleteConfirm(true)}
          >
            Delete Job
          </button>
        </div>
      </div>

      <JobDetail job={job} />

      <div className="mt-4">
        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
          {/* Only show execute button if job is pending or failed (and not running/completed) */}
          {!['running', 'completed'].includes(job.status) && (
            <button
              className="btn btn-success me-2"
              onClick={handleExecuteJob}
              disabled={job.status === 'running'}
            >
              Execute Job
            </button>
          )}
          {/* Only show cancel button if job is pending or running (not already completed/failed/cancelled) */}
          {!['completed', 'failed', 'cancelled'].includes(job.status) && (
            <button
              className="btn btn-warning"
              onClick={handleCancelJob}
              disabled={job.status === 'running'}
            >
              Cancel Job
            </button>
          )}
        </div>
      </div>

      {/* Edit Job Modal */}
      <JobFormModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        onSubmit={handleUpdateJob}
        job={job}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal fade show" style={{ display: 'block' }} aria-hidden="false">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button type="button" className="btn-close" onClick={() => setShowDeleteConfirm(false)} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete the job "<strong>{job.name}</strong>"? This action cannot be undone.
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteConfirm(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={handleDeleteJob}>
                  Delete Job
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

export default JobDetailPage;