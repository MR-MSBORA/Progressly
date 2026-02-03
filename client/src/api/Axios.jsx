import axios from "axios";

// client/src/api/axios.js

/*
  PURPOSE OF THIS FILE:
  ---------------------
  This file creates a custom axios instance used to communicate with the backend.
  It:
  1 Sets a common backend base URL
  2 Automatically sends JSON data
  3 Attaches JWT token to every request
  4 Handles unauthorized (401) errors globally
 
  Instead of configuring axios again and again,
  we import this single instance everywhere in the app.
 */

// Import axios library for making HTTP requests

// Backend base URL
// - Uses environment variable in production
// - Falls back to localhost during development
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create a custom axios instance
const api = axios.create({
  baseURL: BASE_URL, // Automatically added before every API route
  headers: {
    "Content-Type": "application/json", // Tells backend data is JSON
  },
  timeout: 10000, // Cancel request if it takes more than 10 seconds
});

// ======================= REQUEST INTERCEPTOR =======================
// Runs BEFORE every request is sent to the backend
api.interceptors.request.use(
  (config) => {
    // Get JWT token from browser storage
    const token = localStorage.getItem("token");

    // If token exists, attach it to request headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Must return config or request will fail
    return config;
  },
  (error) => {
    // If an error occurs before request is sent
    return Promise.reject(error);
  }
);

// ======================= RESPONSE INTERCEPTOR =======================
// Runs AFTER backend sends a response
api.interceptors.response.use(
  (response) => {
    // If response is successful, return it as-is
    return response;
  },
  (error) => {
    // If backend returns 401 (Unauthorized)
    if (error.response?.status === 401) {
      // Remove stored login data
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      // Redirect user to login page
      window.location.href = "/login";
    }

    // Pass error to the component that made the request
    return Promise.reject(error);
  }
);

// Export the axios instance to use throughout the app
export default api;
