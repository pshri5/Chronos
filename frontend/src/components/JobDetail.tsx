import React from 'react';

const statusConfig: Record<string, { label: string; classes: string }> = {
  pending:   { label: 'Pending',   classes: 'bg-amber-500/20 text-amber-400 border border-amber-500/30' },
  running:   { label: 'Running',   classes: 'bg-blue-500/20 text-blue-400 border border-blue-500/30' },
  completed: { label: 'Completed', classes: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' },
  failed:    { label: 'Failed',    classes: 'bg-red-500/20 text-red-400 border border-red-500/30' },
  cancelled: { label: 'Cancelled', classes: 'bg-slate-500/20 text-slate-400 border border-slate-500/30' },
};

export const JobDetail: React.FC<{ job: any }> = ({ job }) => {
  const status = statusConfig[job.status] ?? statusConfig.cancelled;

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

  const formatPayload = (payload: any) => {
    try {
      return JSON.stringify(payload, null, 2);
    } catch {
      return String(payload);
    }
  };

  const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="flex items-start gap-3 py-3 border-b border-slate-800 last:border-0">
      <span className="w-32 shrink-0 text-sm text-slate-500 font-medium">{label}</span>
      <span className="text-sm text-slate-200">{children}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Job Info Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Job Information</h3>
        <div>
          <Row label="Name">{job.name}</Row>
          <Row label="Type">{job.jobType === 'one-time' ? 'One-time' : 'Recurring'}</Row>
          <Row label="Status">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${status.classes}`}>
              {status.label}
            </span>
          </Row>
          <Row label="Scheduled At">{formatDate(job.scheduledAt)}</Row>
          {job.jobType === 'recurring' && job.cronExpression && (
            <Row label="Cron">
              <code className="font-mono text-violet-400 text-xs">{job.cronExpression}</code>
            </Row>
          )}
          <Row label="Max Retries">{job.maxRetries}</Row>
          <Row label="Retry Count">{job.retryCount}</Row>
          <Row label="Created">{formatDate(job.createdAt)}</Row>
          <Row label="Updated">{formatDate(job.updatedAt)}</Row>
        </div>
      </div>

      {/* Last Error */}
      {job.lastError && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-red-400 mb-2">Last Error</h3>
          <p className="text-sm text-red-300">{job.lastError}</p>
        </div>
      )}

      {/* Payload Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Job Payload</h3>
        <pre className="bg-slate-950 border border-slate-800 rounded-lg p-4 text-xs font-mono text-slate-300 overflow-auto max-h-64 leading-relaxed">
          {formatPayload(job.payload)}
        </pre>
      </div>
    </div>
  );
};

export default JobDetail;