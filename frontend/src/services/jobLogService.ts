import api from './api';

// Types for job log
export interface JobLog {
  _id: string;
  jobId: string;
  status: 'started' | 'completed' | 'failed' | 'retrying';
  message: string;
  duration: number | null;
  executedAt: string;
  createdAt: string;
  updatedAt: string;
}

const unwrap = (response: any) => response.data?.data ?? response.data;

// Fetch job logs for a specific job with optional pagination
export const getJobLogs = async (jobId: string, params?: {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
}) => {
  const response = await api.get(`/job-logs/job/${jobId}`, { params });
<<<<<<< Updated upstream
  return unwrap(response);
=======
  return response.data.data;
>>>>>>> Stashed changes
};

// Fetch recent job logs for the current user (across all jobs) with optional pagination
export const getRecentJobLogs = async (params?: {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
}) => {
  const response = await api.get('/job-logs/recent', { params });
<<<<<<< Updated upstream
  return unwrap(response);
=======
  return response.data.data;
>>>>>>> Stashed changes
};