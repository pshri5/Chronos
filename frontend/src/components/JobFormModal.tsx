import React, { useState } from 'react';

export const JobFormModal: React.FC<{
  show: boolean;
  onHide: () => void;
  onSubmit: (jobData: any) => void;
  job?: any;
}> = ({ show, onHide, onSubmit, job }) => {
  const [formData, setFormData] = useState({
    name: '',
    jobType: 'one-time',
    payload: '',
    scheduledAt: '',
    cronExpression: '',
    maxRetries: 3,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Initialize form with job data if editing
  React.useEffect(() => {
    if (job) {
      setFormData({
        name: job.name,
        jobType: job.jobType,
        payload: typeof job.payload === 'string' ? job.payload : JSON.stringify(job.payload, null, 2),
        scheduledAt: job.scheduledAt ? new Date(job.scheduledAt).toISOString().slice(0, 16) : '',
        cronExpression: job.cronExpression || '',
        maxRetries: job.maxRetries ?? 3,
      });
    } else {
      // Reset to defaults when opening for create
      setFormData({
        name: '',
        jobType: 'one-time',
        payload: '',
        scheduledAt: '',
        cronExpression: '',
        maxRetries: 3,
      });
    }
    setErrors({});
  }, [job, show]);

  // B4 Fix: Properly typed change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'maxRetries' ? Number(value) : value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      // B5 Fix: Parse payload correctly for all job types
      let payload: Record<string, any> = {};
      if (formData.payload.trim() !== '') {
        try {
          payload = JSON.parse(formData.payload);
        } catch {
          setErrors({ payload: 'Invalid JSON format' });
          setLoading(false);
          return;
        }
      }

      // B6 Fix: Properly typed jobData object
      const jobData: Record<string, any> = {
        name: formData.name,
        jobType: formData.jobType,
        payload,
        cronExpression: formData.jobType === 'recurring' && formData.cronExpression ? formData.cronExpression : null,
        maxRetries: formData.maxRetries,
      };

      if (formData.scheduledAt) {
        jobData.scheduledAt = new Date(formData.scheduledAt).toISOString();
      }

      await onSubmit(jobData);
      onHide();
    } catch (err: any) {
      if (err.data && err.data.errors) {
        setErrors(err.data.errors);
      } else {
        setErrors({ submit: err.message || 'An unexpected error occurred' });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  const inputClass = (field: string) =>
    `w-full px-3 py-2 bg-slate-700 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors ${
      errors[field] ? 'border-red-500' : 'border-slate-600'
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onHide} />

      {/* Modal */}
      <div className="relative bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-white">
            {job ? 'Edit Job' : 'Create New Job'}
          </h2>
          <button
            onClick={onHide}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-700"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          {errors.submit && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
              {errors.submit}
            </div>
          )}

          {/* Job Name */}
          <div>
            <label htmlFor="modal-name" className="block text-sm font-medium text-slate-300 mb-1">
              Job Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="modal-name"
              name="name"
              className={inputClass('name')}
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Daily Report"
              required
            />
            {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
          </div>

          {/* Job Type */}
          <div>
            <label htmlFor="modal-jobType" className="block text-sm font-medium text-slate-300 mb-1">
              Job Type <span className="text-red-400">*</span>
            </label>
            <select
              id="modal-jobType"
              name="jobType"
              className={inputClass('jobType')}
              value={formData.jobType}
              onChange={handleChange}
              required
            >
              <option value="one-time">One-time</option>
              <option value="recurring">Recurring</option>
            </select>
          </div>

          {/* Scheduled At */}
          <div>
            <label htmlFor="modal-scheduledAt" className="block text-sm font-medium text-slate-300 mb-1">
              Scheduled At <span className="text-red-400">*</span>
            </label>
            <input
              type="datetime-local"
              id="modal-scheduledAt"
              name="scheduledAt"
              className={inputClass('scheduledAt')}
              value={formData.scheduledAt}
              onChange={handleChange}
              required
            />
            {errors.scheduledAt && <p className="mt-1 text-xs text-red-400">{errors.scheduledAt}</p>}
          </div>

          {/* Cron Expression (only for recurring) */}
          {formData.jobType === 'recurring' && (
            <div>
              <label htmlFor="modal-cronExpression" className="block text-sm font-medium text-slate-300 mb-1">
                Cron Expression
              </label>
              <input
                type="text"
                id="modal-cronExpression"
                name="cronExpression"
                className={inputClass('cronExpression')}
                value={formData.cronExpression}
                onChange={handleChange}
                placeholder="0 0 * * *"
              />
              <p className="mt-1 text-xs text-slate-500">Example: "0 0 * * *" for daily at midnight</p>
              {errors.cronExpression && <p className="mt-1 text-xs text-red-400">{errors.cronExpression}</p>}
            </div>
          )}

          {/* Payload */}
          <div>
            <label htmlFor="modal-payload" className="block text-sm font-medium text-slate-300 mb-1">
              Job Payload (JSON)
            </label>
            <textarea
              id="modal-payload"
              name="payload"
              className={`${inputClass('payload')} font-mono text-sm`}
              rows={4}
              value={formData.payload}
              onChange={handleChange}
              placeholder='{"key": "value"}'
            />
            <p className="mt-1 text-xs text-slate-500">Leave empty or provide valid JSON</p>
            {errors.payload && <p className="mt-1 text-xs text-red-400">{errors.payload}</p>}
          </div>

          {/* Max Retries */}
          <div>
            <label htmlFor="modal-maxRetries" className="block text-sm font-medium text-slate-300 mb-1">
              Max Retries
            </label>
            <input
              type="number"
              id="modal-maxRetries"
              name="maxRetries"
              className={inputClass('maxRetries')}
              min="0"
              max="10"
              value={formData.maxRetries}
              onChange={handleChange}
            />
            {errors.maxRetries && <p className="mt-1 text-xs text-red-400">{errors.maxRetries}</p>}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
            >
              {loading ? 'Saving...' : 'Save Job'}
            </button>
            <button
              type="button"
              onClick={onHide}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium py-2.5 px-4 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobFormModal;