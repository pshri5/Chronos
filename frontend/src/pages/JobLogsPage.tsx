import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJobLogs, getRecentJobLogs } from '../services/jobLogService';
import { JobLogEntry } from '../components/JobLogEntry';
import { Spinner } from '../components/Spinner';

export const JobLogsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (id) {
        response = await getJobLogs(id);
      } else {
        response = await getRecentJobLogs();
      }
      setLogs(response.jobLogs || response.data || []); 
    } catch (err: any) {
      setError(err.message || 'Failed to load job logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [id]);

  const handleBack = () => {
    if (id) {
      navigate(`/jobs/${id}`);
    } else {
      navigate('/jobs');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors"
            aria-label="Go back"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {id ? 'Execution Logs' : 'Recent Activity'}
            </h1>
            <p className="text-sm text-slate-500">
              {id ? `Logs for Job ID: ${id}` : 'Latest execution logs across all jobs'}
            </p>
          </div>
        </div>
        <div>
          <button
            onClick={fetchLogs}
            className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors"
            title="Refresh logs"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <Spinner />
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-6 py-4 rounded-2xl">
          {error}
        </div>
      ) : !logs || logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">No logs found</h3>
          <p className="text-sm text-slate-500">
            {id ? 'This job hasn\'t been executed yet.' : 'No activity recorded yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {logs?.map((log: any) => (
            <JobLogEntry key={log._id} log={log} />
          ))}
        </div>
      )}
    </div>
  );
};

export default JobLogsPage;
