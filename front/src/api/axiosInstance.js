import axios from 'axios';
const baseUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8000/api/v1/'
    : '/api/v1/';
const api = axios.create({
  baseURL: baseUrl, // Set your API base URL
  timeout: 10000, // Set the request timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add an interceptor for request configuration
api.interceptors.request.use(
  (config) => {
    // You can modify the request config here if needed
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

// Add an interceptor for response handling
api.interceptors.response.use(
  (response) => {
    // You can modify the response data here if needed
    return response;
  },
  (error) => {
    // Handle response errors
    return Promise.reject(error);
  }
);

export default api;
