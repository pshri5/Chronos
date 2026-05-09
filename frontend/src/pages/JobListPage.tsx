import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getJobs, createJob, deleteJob, executeJob } from '../services/jobService';
import { JobCard } from '../components/JobCard';
import { JobFormModal } from '../components/JobFormModal';
import { Spinner } from '../components/Spinner';

export const JobListPage: React.FC = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    jobType: '',
    page: 1,
    limit: 12,
    sortBy: 'scheduledAt',
    sortOrder: 'asc',
  });
  const navigate = useNavigate();

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== '' && v !== undefined)
      );
      const response = await getJobs(cleanFilters);
      setJobs(response.jobs || response.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const handleCreateJob = async (jobData: any) => {
    try {
      await createJob(jobData);
      setShowCreateModal(false);
      fetchJobs();
    } catch (err: any) {
      setError(err.message || 'Failed to create job');
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (window.confirm('Delete this job?')) {
      try {
        await deleteJob(id);
        fetchJobs();
      } catch (err: any) {
        setError(err.message || 'Failed to delete job');
      }
    }
  };

  const handleExecuteJob = async (id: string) => {
    try {
      await executeJob(id);
      fetchJobs();
    } catch (err: any) {
      setError(err.message || 'Failed to execute job');
    }
  };

  const FilterSelect = ({ label, value, options, onChange }: any) => (
    <div className="flex-1 min-w-[160px]">
      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">{label}</label>
      <select
        className="w-full h-11 px-4 bg-slate-900/50 border border-white/5 rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all appearance-none cursor-pointer"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">{opt.label}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome & Stats Row */}
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">Job Dashboard</h1>
          <p className="text-slate-400 font-medium max-w-lg">
            Monitor and manage your automated workflows in real-time. 
            <span className="text-primary-400 ml-1 font-bold">{jobs.length} active tasks</span> detected.
          </p>
        </div>
        <button
          id="create-job-btn"
          className="btn-primary h-12 px-6 flex items-center gap-2 group"
          onClick={() => setShowCreateModal(true)}
        >
          <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
          </svg>
          Create New Job
        </button>
      </div>

      {/* Filter Bar */}
      <div className="glass-card rounded-2xl p-5 flex flex-wrap items-center gap-4 border-l-4 border-l-primary-500">
        <FilterSelect
          label="Status"
          value={filters.status}
          onChange={(v: string) => setFilters({ ...filters, status: v, page: 1 })}
          options={[
            { label: 'All Statuses', value: '' },
            { label: 'Pending', value: 'pending' },
            { label: 'Running', value: 'running' },
            { label: 'Completed', value: 'completed' },
            { label: 'Failed', value: 'failed' },
          ]}
        />
        <FilterSelect
          label="Job Type"
          value={filters.jobType}
          onChange={(v: string) => setFilters({ ...filters, jobType: v, page: 1 })}
          options={[
            { label: 'All Types', value: '' },
            { label: 'One-time', value: 'one-time' },
            { label: 'Recurring', value: 'recurring' },
          ]}
        />
        <FilterSelect
          label="Sort By"
          value={filters.sortBy}
          onChange={(v: string) => setFilters({ ...filters, sortBy: v, page: 1 })}
          options={[
            { label: 'Execution Time', value: 'scheduledAt' },
            { label: 'Created Date', value: 'createdAt' },
            { label: 'Job Name', value: 'name' },
          ]}
        />
        <div className="flex-1 min-w-[120px]">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Order</label>
            <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/5 h-11">
                <button 
                    onClick={() => setFilters({...filters, sortOrder: 'asc'})}
                    className={`flex-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filters.sortOrder === 'asc' ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    ASC
                </button>
                <button 
                    onClick={() => setFilters({...filters, sortOrder: 'desc'})}
                    className={`flex-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filters.sortOrder === 'desc' ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    DESC
                </button>
            </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border-l-4 border-l-red-500 text-red-400 px-6 py-4 rounded-xl text-sm font-medium animate-slide-up">
          {error}
        </div>
      )}

      {/* Grid Content */}
      {loading ? (
        <div className="py-20"><Spinner size="lg" /></div>
      ) : jobs.length === 0 ? (
        <div className="glass-card rounded-3xl p-20 flex flex-col items-center justify-center text-center animate-slide-up">
          <div className="w-24 h-24 bg-slate-950 rounded-3xl flex items-center justify-center mb-6 shadow-premium border border-white/5">
            <svg className="w-12 h-12 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-2xl font-black text-white mb-2">No active jobs found</h3>
          <p className="text-slate-500 font-medium mb-8 max-w-sm">
            It looks like you haven't scheduled any tasks yet. Create one to get started with automation.
          </p>
          <button
            className="btn-primary px-8 h-12"
            onClick={() => setShowCreateModal(true)}
          >
            Schedule First Job
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-slide-up">
          {jobs.map((job: any) => (
            <JobCard
              key={job._id}
              job={job}
              onDelete={handleDeleteJob}
              onExecute={handleExecuteJob}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && jobs.length > 0 && (
        <div className="flex items-center justify-center gap-4 py-8">
            <button
              className="w-12 h-12 flex items-center justify-center rounded-xl glass-card text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              onClick={() => setFilters(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
              disabled={filters.page <= 1}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div className="h-12 px-6 flex items-center glass-card rounded-xl font-bold text-sm tracking-widest uppercase">
              Page <span className="text-primary-400 ml-2">{filters.page}</span>
            </div>
            <button
              className="w-12 h-12 flex items-center justify-center rounded-xl glass-card text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={jobs.length < filters.limit}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
            </button>
        </div>
      )}

      <JobFormModal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        onSubmit={handleCreateJob}
      />
    </div>
  );
};

export default JobListPage;