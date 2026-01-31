// client/src/api/axios.js

// Import axios library (used to make HTTP requests)
import axios from 'axios';

// Base URL of backend
// 1️⃣ First tries to read from Vite environment variable (for production)
// 2️⃣ If not found, uses localhost (for development)
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create a custom axios instance
// This instance will be used everywhere instead of normal axios
const api = axios.create({
  baseURL: BASE_URL,                 // Automatically adds this before every API route
  headers: {
    'Content-Type': 'application/json', // Tells backend that data is JSON
  },
  timeout: 10000,                    // Cancel request if it takes more than 10 seconds
});

// ======================= REQUEST INTERCEPTOR =======================
// This runs BEFORE every request is sent to the backend
api.interceptors.request.use(
  (config) => {
    // Get token from browser storage
    const token = localStorage.getItem('token');

    // If token exists, attach it to request headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Must return config, otherwise request will fail
    return config;
  },
  (error) => {
    // If something goes wrong while sending request
    return Promise.reject(error);
  }
);

// ======================= RESPONSE INTERCEPTOR =======================
// This runs AFTER backend sends a response
api.interceptors.response.use(
  (response) => {
    // If response is successful, just return it
    return response;
  },
  (error) => {
    // If backend responds with 401 (Unauthorized)
    if (error.response?.status === 401) {
      // Token is invalid or expired → logout user
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Redirect user to login page
      window.location.href = '/login';
    }

    // Pass error to the place where API was called
    return Promise.reject(error);
  }
);

// Export the custom axios instance
// This is what you import in AuthContext and other files
export default api;
