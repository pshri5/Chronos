import React, { useState } from 'react';

// Define the JobFormModal component
const JobFormModal: React.FC<{
  show: boolean;
  onHide: () => void;
  onSubmit: (jobData: any) => void;
  job?: any; // For editing an existing job
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
    }
  }, [job]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let newValue = value;
    if (type === 'checkbox') {
      newValue = e.target.checked;
    }
    setFormData(prev => ({ ...prev, [name]: newValue }));
    // Clear error for this field when user starts typing
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
      // Prepare payload
      let payload = formData.payload;
      if (formData.jobType === 'one-time' || formData.payload.trim() === '') {
        payload = {};
      } else {
        try {
          payload = JSON.parse(formData.payload);
        } catch (parseError) {
          setErrors({ payload: 'Invalid JSON format' });
          setLoading(false);
          return;
        }
      }

      const jobData = {
        name: formData.name,
        jobType: formData.jobType,
        payload,
        scheduledAt: formData.scheduledAt ? new Date(formData.scheduledAt).toISOString() : undefined,
        cronExpression: formData.jobType === 'recurring' && formData.cronExpression ? formData.cronExpression : null,
        maxRetries: formData.maxRetries,
      };

      // Remove undefined fields
      Object.keys(jobData).forEach(key => jobData[key] === undefined && delete jobData[key]);

      await onSubmit(jobData);
      onHide();
    } catch (err: any) {
      // Handle validation errors from backend
      if (err.response && err.response.data && err.response.data.errors) {
        // Assuming backend returns errors in a field like { errors: { field: 'message' } }
        setErrors(err.response.data.errors);
      } else {
        setErrors({ submit: err.response?.data?.message || 'An unexpected error occurred' });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!show) {
    return null;
  }

  return (
    <>
      <div className="modal fade show" style={{ display: 'block' }} aria-hidden="false">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{job ? 'Edit Job' : 'Create New Job'}</h5>
              <button type="button" className="btn-close" onClick={onHide} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Job Name
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="jobType" className="form-label">
                    Job Type
                  </label>
                  <select
                    className="form-control"
                    id="jobType"
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleChange}
                    required
                  >
                    <option value="one-time">One-time</option>
                    <option value="recurring">Recurring</option>
                  </select>
                  {errors.jobType && <div className="invalid-feedback">{errors.jobType}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="scheduledAt" className="form-label">
                    Scheduled At
                  </label>
                  <input
                    type="datetime-local"
                    className={`form-control ${errors.scheduledAt ? 'is-invalid' : ''}`}
                    id="scheduledAt"
                    name="scheduledAt"
                    value={formData.scheduledAt}
                    onChange={handleChange}
                    required
                  />
                  {errors.scheduledAt && <div className="invalid-feedback">{errors.scheduledAt}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="cronExpression" className="form-label">
                    Cron Expression (for recurring jobs)
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.cronExpression ? 'is-invalid' : ''}`}
                    id="cronExpression"
                    name="cronExpression"
                    value={formData.cronExpression}
                    onChange={handleChange}
                  />
                  {errors.cronExpression && <div className="invalid-feedback">{errors.cronExpression}</div>}
                  <small className="text-muted">
                    Example: "0 0 * * *" for daily at midnight
                  </small>
                </div>

                <div className="mb-3">
                  <label htmlFor="payload" className="form-label">
                    Job Payload (JSON)
                  </label>
                  <textarea
                    className={`form-control ${errors.payload ? 'is-invalid' : ''}`}
                    id="payload"
                    name="payload"
                    rows={4}
                    value={formData.payload}
                    onChange={handleChange}
                    placeholder='{"key": "value"}'
                  />
                  {errors.payload && <div className="invalid-feedback">{errors.payload}</div>}
                  <small className="text-muted">
                    Leave empty for one-time jobs or provide valid JSON
                  </small>
                </div>

                <div className="mb-3">
                  <label htmlFor="maxRetries" className="form-label">
                    Max Retries
                  </label>
                  <input
                    type="number"
                    className={`form-control ${errors.maxRetries ? 'is-invalid' : ''}`}
                    id="maxRetries"
                    name="maxRetries"
                    min="0"
                    max="10"
                    value={formData.maxRetries}
                    onChange={handleChange}
                  />
                  {errors.maxRetries && <div className="invalid-feedback">{errors.maxRetries}</div>}
                </div>

                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Job'}
                  </button>
                  <button type="button" className="btn btn-outline-secondary" onClick={onHide}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="modal-backdrop fade show"></div>
      </div>
      </>
  );
};

export default JobFormModal;