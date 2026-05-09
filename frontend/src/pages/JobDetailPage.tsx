import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getJob, updateJob, deleteJob, executeJob, cancelJob } from '../services/jobService';
import { JobDetail } from '../components/JobDetail';
import { JobFormModal } from '../components/JobFormModal';
import { Spinner } from '../components/Spinner';

export const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const fetchJob = async () => {
    if (!id) {
      navigate('/jobs');
      return;
    }
    setLoading(true);
    try {
      const response = await getJob(id);
      setJob(response.data || response.job || response);
    } catch (err: any) {
      setError(err.message || 'Failed to load job details');
      if (err.status === 404) navigate('/jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  const handleUpdateJob = async (jobData: any) => {
    if (!id) return;
    try {
      await updateJob(id, jobData);
      setShowEditModal(false);
      fetchJob();
    } catch (err: any) {
      setError(err.message || 'Failed to update job');
    }
  };

  const handleDeleteJob = async () => {
    if (!id) return;
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
    if (!id) return;
    try {
      await executeJob(id);
      fetchJob();
    } catch (err: any) {
      setError(err.message || 'Failed to execute job');
    }
  };

  const handleCancelJob = async () => {
    if (!id) return;
    try {
      await cancelJob(id);
      fetchJob();
    } catch (err: any) {
      setError(err.message || 'Failed to cancel job');
    }
  };

  if (loading && !job) return <div className="py-20"><Spinner size="lg" /></div>;

  if (error && !job) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center animate-fade-in">
        <div className="glass-card rounded-[2.5rem] p-12 border-l-4 border-l-red-500">
           <h2 className="text-2xl font-black text-white mb-4">Connection Error</h2>
           <p className="text-slate-400 font-medium mb-8">{error}</p>
           <button className="btn-secondary" onClick={() => navigate('/jobs')}>Return to Dashboard</button>
        </div>
      </div>
    );
  }

  if (!job) return null;

  const isLocked = job.status === 'running' || job.status === 'completed';

  return (
    <div className="max-w-5xl mx-auto animate-fade-in space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate('/jobs')}
            className="w-12 h-12 flex items-center justify-center glass-card rounded-2xl text-slate-400 hover:text-white hover:border-primary-500/30 transition-all active:scale-90"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
               <h1 className="text-3xl font-black text-white tracking-tight">{job.name}</h1>
               <span className="text-[10px] font-black text-slate-500 bg-white/5 border border-white/10 px-2 py-1 rounded-lg uppercase tracking-widest">{job.jobType}</span>
            </div>
            <p className="text-sm font-medium text-slate-500 font-mono tracking-tighter">REF: {job._id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to={`/jobs/${job._id}/logs`}
            className="h-11 px-5 flex items-center justify-center gap-2 text-sm font-bold text-primary-400 hover:text-primary-300 glass-card rounded-xl border-primary-500/10 hover:border-primary-500/30 transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            Execution Logs
          </Link>
          <button
            className="h-11 px-5 text-sm font-bold text-slate-300 hover:text-white glass-card rounded-xl border-white/5 hover:border-white/10 transition-all disabled:opacity-30"
            onClick={() => setShowEditModal(true)}
            disabled={isLocked}
          >
            Edit Settings
          </button>
          <button
            className="h-11 px-5 text-sm font-bold text-red-500 hover:text-red-400 glass-card rounded-xl border-red-500/10 hover:border-red-500/30 transition-all disabled:opacity-30"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isLocked}
          >
            Archive Job
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
            <JobDetail job={job} />
        </div>

        {/* Action Panel */}
        <div className="glass-card rounded-[2rem] p-8 border-t-4 border-t-primary-500 sticky top-28">
           <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Workflow Control</h3>
           
           <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">State</p>
                 <p className="text-lg font-black text-white uppercase tracking-tight">{job.status}</p>
              </div>

              {!['completed', 'failed', 'cancelled'].includes(job.status) && (
                <button
                  className="w-full h-14 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 font-black rounded-2xl border border-amber-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                  onClick={handleCancelJob}
                  disabled={job.status === 'running'}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                  Terminate Process
                </button>
              )}

              {!['running', 'completed'].includes(job.status) && (
                <button
                  className="w-full h-14 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                  onClick={handleExecuteJob}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Trigger Execution
                </button>
              )}
           </div>

           <div className="mt-8 pt-8 border-t border-white/5">
              <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                Manually triggering this job will bypass the next scheduled cycle. All outputs will be recorded in the log archive.
              </p>
           </div>
        </div>
      </div>

      <JobFormModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        onSubmit={handleUpdateJob}
        job={job}
      />

      {/* Delete Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)} />
          <div className="relative glass-card rounded-[2.5rem] shadow-2xl w-full max-w-md p-10 border-t-4 border-t-red-500 animate-slide-up">
            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 border border-red-500/20 mx-auto">
                <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </div>
            <h2 className="text-2xl font-black text-white text-center mb-2">Confirm Archival</h2>
            <p className="text-slate-400 text-center font-medium mb-8">
              Are you sure you want to permanently archive <span className="text-white">"{job.name}"</span>?
            </p>
            <div className="flex gap-4">
              <button
                className="flex-1 h-12 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl transition-all"
                onClick={handleDeleteJob}
              >
                Confirm
              </button>
              <button
                className="flex-1 h-12 bg-slate-800 hover:bg-slate-700 text-slate-200 font-black rounded-xl transition-all"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetailPage;