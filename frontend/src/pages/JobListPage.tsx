import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getJobs, createJob, deleteJob, executeJob } from '../services/jobService';
import { JobCard } from '../components/JobCard';
import { JobFormModal } from '../components/JobFormModal';

const JobListPage: React.FC = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filters, setFilters] = useState<{
    status?: string;
    jobType?: string;
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: string;
  }>({
    status: undefined,
    jobType: undefined,
    page: 1,
    limit: 10,
    sortBy: 'scheduledAt',
    sortOrder: 'asc',
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch jobs when filters change
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getJobs(filters);
        setJobs(response.jobs || response.data || []); // Adjust based on actual response structure
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [filters]);

  const handleCreateJob = async (jobData: any) => {
    try {
      await createJob(jobData);
      setShowCreateModal(false);
      setFilters(prev => ({ ...prev, page: 1 }));
    } catch (err: any) {
      setError(err.message || 'Failed to create job');
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await deleteJob(id);
        setFilters(prev => ({ ...prev }));
      } catch (err: any) {
        setError(err.message || 'Failed to delete job');
      }
    }
  };

  const handleExecuteJob = async (id: string) => {
    try {
      await executeJob(id);
      setFilters(prev => ({ ...prev }));
    } catch (err: any) {
      setError(err.message || 'Failed to execute job');
    }
  };

  return (
    <div className="job-list-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Job Management Dashboard</h2>
        <div>
          <button
            className="btn btn-primary me-2"
            onClick={() => setShowCreateModal(true)}
          >
            Create New Job
          </button>
          <button className="btn btn-outline-secondary" onClick={() => navigate('/notifications')}>
            Notifications
          </button>
        </div>
      </div>

      {/* Filters (simplified for now, can be expanded) */}
      <div className="row mb-3">
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Filter by name"
            // We'll implement filtering by name in a real app
          />
        </div>
        <div className="col-md-3">
          <select className="form-control" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}>
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="running">Running</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="col-md-3">
          <select className="form-control" value={filters.jobType} onChange={(e) => setFilters({ ...filters, jobType: e.target.value, page: 1 })}>
            <option value="">All Types</option>
            <option value="one-time">One-time</option>
            <option value="recurring">Recurring</option>
          </select>
        </div>
        <div className="col-md-3 d-flex align-items-end">
          <button className="btn btn-outline-primary w-100" onClick={() => setFilters(prev => ({ ...prev, page: 1 }))}>
            Apply Filters
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-5">
          <p>No jobs found. Create a new job to get started.</p>
        </div>
      ) : (
        <>
          <div className="row mb-3">
            <div className="col-12">
              <nav>
                <ul className="pagination">
                  {/* Simplified pagination - in a real app we would calculate total pages */}
                  <li className="page-item">
                    <button className="page-link" onClick={() => setFilters(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))} disabled={filters.page <= 1}>
                      Previous
                    </button>
                  </li>
                  <li className="page-item active">
                    <span className="page-link">Page {filters.page}</span>
                  </li>
                  <li className="page-item">
                    <button className="page-link" onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}>
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {jobs.map((job: any) => (
              <div key={job._id} className="col">
                <JobCard
                  job={job}
                  onDelete={handleDeleteJob}
                  onExecute={handleExecuteJob}
                />
              </div>
            ))}
          </div>
        </>
      )}

      {/* Create Job Modal */}
      <JobFormModal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        onSubmit={handleCreateJob}
      />
    </div>
  );
};

export default JobListPage;