import React from 'react';
import { Link } from 'react-router-dom';

const statusConfig: Record<string, { label: string; icon: string; classes: string; glow: string }> = {
  pending:   { label: 'Pending',   icon: 'clock',   classes: 'bg-amber-500/10 text-amber-500 border-amber-500/20', glow: 'shadow-amber-500/10' },
  running:   { label: 'Running',   icon: 'refresh', classes: 'bg-blue-500/10 text-blue-500 border-blue-500/20', glow: 'shadow-blue-500/10' },
  completed: { label: 'Completed', icon: 'check',   classes: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20', glow: 'shadow-emerald-500/10' },
  failed:    { label: 'Failed',    icon: 'x',       classes: 'bg-red-500/10 text-red-500 border-red-500/20', glow: 'shadow-red-500/10' },
  cancelled: { label: 'Cancelled', icon: 'minus',   classes: 'bg-slate-500/10 text-slate-500 border-slate-500/20', glow: 'shadow-slate-500/10' },
};

const Icon = ({ name, className }: { name: string; className?: string }) => {
  if (name === 'clock') return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
  if (name === 'refresh') return <svg className={`${className} animate-spin`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>;
  if (name === 'check') return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
  if (name === 'x') return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>;
};

export const JobCard: React.FC<{
  job: any;
  onDelete: (id: string) => void;
  onExecute: (id: string) => void;
}> = ({ job, onDelete, onExecute }) => {
  const status = statusConfig[job.status] ?? statusConfig.cancelled;
  const isLocked = job.status === 'running' || job.status === 'completed';

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className="group glass-card rounded-2xl p-6 hover:border-primary-500/30 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden">
      {/* Background Accent */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/0 to-white/[0.02] -mr-8 -mt-8 rounded-full blur-2xl group-hover:bg-primary-500/5 transition-colors duration-500`} />
      
      {/* Header */}
      <div className="flex items-start justify-between mb-6 relative">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${status.classes} ${status.glow}`}>
              <Icon name={status.icon} className="w-3 h-3" />
              {status.label}
            </span>
            <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase bg-white/5 px-2 py-1 rounded-lg border border-white/5">
              {job.jobType}
            </span>
          </div>
          <h3 className="text-lg font-bold text-white group-hover:text-primary-400 transition-colors duration-300 line-clamp-1">
            {job.name}
          </h3>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8 relative">
        <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Schedule</p>
          <p className="text-xs text-slate-200 font-medium truncate">{formatDate(job.scheduledAt)}</p>
        </div>
        <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Retries</p>
          <p className="text-xs text-slate-200 font-medium">
            {job.retryCount} <span className="text-slate-500">/</span> {job.maxRetries}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 relative">
        <Link
          to={`/jobs/${job._id}`}
          className="flex-1 flex items-center justify-center gap-2 h-11 bg-white/5 hover:bg-white/10 text-white text-sm font-bold rounded-xl border border-white/5 hover:border-white/10 transition-all active:scale-95"
        >
          Details
        </Link>
        {!isLocked && (
           <button
            onClick={() => onExecute(job._id)}
            className="w-11 h-11 flex items-center justify-center bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 rounded-xl border border-emerald-500/20 transition-all active:scale-95"
            title="Execute Now"
          >
            <Icon name="refresh" className="w-5 h-5" />
          </button>
        )}
        {!isLocked && (
          <button
            onClick={() => onDelete(job._id)}
            className="w-11 h-11 flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl border border-red-500/20 transition-all active:scale-95"
            title="Delete Job"
          >
            <Icon name="x" className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default JobCard;