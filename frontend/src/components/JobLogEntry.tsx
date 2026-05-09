import React from 'react';

const statusConfig: Record<string, { label: string; classes: string }> = {
  started:   { label: 'Started',   classes: 'bg-blue-500/20 text-blue-400 border border-blue-500/30' },
  completed: { label: 'Completed', classes: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' },
  failed:    { label: 'Failed',    classes: 'bg-red-500/20 text-red-400 border border-red-500/30' },
  retrying:  { label: 'Retrying',  classes: 'bg-amber-500/20 text-amber-400 border border-amber-500/30' },
};

export const JobLogEntry: React.FC<{ log: any }> = ({ log }) => {
  const status = statusConfig[log.status] ?? statusConfig.started;

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex gap-4">
      {/* Status dot */}
      <div className="flex flex-col items-center gap-1 pt-1">
        <div className={`w-2.5 h-2.5 rounded-full ${
          log.status === 'completed' ? 'bg-emerald-400' :
          log.status === 'failed' ? 'bg-red-400' :
          log.status === 'retrying' ? 'bg-amber-400' : 'bg-blue-400'
        }`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${status.classes}`}>
            {status.label}
          </span>
          <span className="text-xs text-slate-500">{formatDate(log.executedAt)}</span>
        </div>
        <p className="text-sm text-slate-300">{log.message}</p>
        {log.duration !== null && (
          <p className="mt-1 text-xs text-slate-500">
            Duration: <span className="text-slate-400 font-medium">{log.duration} ms</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default JobLogEntry;