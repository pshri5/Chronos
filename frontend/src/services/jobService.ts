import axios from 'axios';

// Create an axios instance with base URL from environment variable
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
});

// Request interceptor to attach token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle common errors (optional)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // You can handle common errors here, e.g., redirect to login on 401
    return Promise.reject(error);
  }
);

export default api;

// Types for job (we'll define them here for now, but we can move to types later)
export interface Job {
  _id: string;
  name: string;
  jobType: 'one-time' | 'recurring';
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  payload: Record<string, any>;
  scheduledAt: string; // ISO date string
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