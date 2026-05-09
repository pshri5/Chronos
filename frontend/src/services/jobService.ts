import api from './api';

// Types for job
export interface Job {
  _id: string;
  name: string;
  jobType: 'one-time' | 'recurring';
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  payload: Record<string, any>;
  scheduledAt: string;
  cronExpression: string | null;
  retryCount: number;
  maxRetries: number;
  lastError: string | null;
  createdAt: string;
  updatedAt: string;
}

// Fetch jobs with optional filters and pagination
export const getJobs = async (params?: {
  status?: string;
  jobType?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
}) => {
  const response = await api.get('/jobs', { params });
  return response.data;
};

// Get a single job by ID
export const getJob = async (id: string) => {
  const response = await api.get(`/jobs/${id}`);
  return response.data;
};

// Create a new job
export const createJob = async (jobData: Omit<Job, '_id' | 'createdAt' | 'updatedAt'>) => {
  const response = await api.post('/jobs', jobData);
  return response.data;
};

// Update an existing job
export const updateJob = async (id: string, jobData: Partial<Job>) => {
  const response = await api.patch(`/jobs/${id}`, jobData);
  return response.data;
};

// Delete a job
export const deleteJob = async (id: string) => {
  await api.delete(`/jobs/${id}`);
};

// Execute a job (manual execution)
export const executeJob = async (id: string) => {
  const response = await api.post(`/jobs/${id}/execute`);
  return response.data;
};

// Cancel a job
export const cancelJob = async (id: string) => {
  const response = await api.post(`/jobs/${id}/cancel`);
  return response.data;
};