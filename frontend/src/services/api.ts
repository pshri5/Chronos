import axios, { AxiosError } from 'axios';

const BACKEND_URL = import.meta.env.VITE_API_URL || `${import.meta.env.REACT_APP_BACKEND_URL || ''}/api/v1`;

const api = axios.create({
  baseURL: BACKEND_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    const customError = {
      message: error.response?.data?.message || 'An unexpected error occurred',
      status: error.response?.status || 500,
      data: error.response?.data || null
    };
    
    return Promise.reject(customError);
  }
);

export default api;
