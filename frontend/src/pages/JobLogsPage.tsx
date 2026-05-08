import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getJobLogs, getRecentJobLogs } from '../services/jobLogService';
import { JobLogEntry } from '../components/JobLogEntry';
import { Spinner } from '../components/Spinner';

const JobLogsPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const { user } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isJobSpecific, setIsJobSpecific] = useState(!!jobId);

  // Fetch logs when the component mounts or when jobId changes
  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      setError(null);
      try {
        let response;
        if (jobId) {
          // Fetch logs for a specific job
          response = await getJobLogs(jobId);
        } else {
          // Fetch recent logs for the current user
          response = await getRecentJobLogs();
        }
        setLogs(response.jobLogs || response.data || []); // Adjust based on actual response structure
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load job logs');
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [jobId]);

  return (
    <div className="job-logs-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          {jobId ? 'Job Execution Logs' : 'Recent Job Logs'}
        </h2>
        <div>
          <a href={jobId ? `/jobs/${jobId}` : '/jobs'} className="btn btn-outline-secondary">
            Back to Jobs
          </a>
        </div>
      </div>

      {loading ? (
        <Spinner />
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : logs.length === 0 ? (
        <div className="text-center py-5">
          <p>{jobId ? 'No logs found for this job.' : 'No recent job logs found.'}</p>
        </div>
      ) : (
        <div className="list-group">
          {logs.map((log: any) => (
            <JobLogEntry key={log._id} log={log} />
          ))}
        </div>
      )}
    </div>
  );
};

export default JobLogsPage;