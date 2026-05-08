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