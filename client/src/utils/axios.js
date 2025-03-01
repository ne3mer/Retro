import axios from "axios";

// Get the current environment
const isProduction = process.env.NODE_ENV === "production";
const baseURL = isProduction
  ? "https://retro-64h4.onrender.com"
  : "http://localhost:5001";

console.log(
  `API Base URL: ${baseURL} (${
    isProduction ? "production" : "development"
  } mode)`
);

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5001",
  withCredentials: true,
  timeout: 30000, // Increased timeout for Render's cold start
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add request interceptor for error handling
api.interceptors.request.use(
  (config) => {
    // Log the request in development
    if (!isProduction) {
      console.log("API Request:", config.method?.toUpperCase(), config.url);
      console.log("Request headers:", config.headers);
    }

    // Ensure credentials are included in every request
    config.withCredentials = true;

    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("API Error:", error.response.data);

      // Handle authentication errors
      if (error.response.status === 401) {
        // Clear any stored auth data
        localStorage.removeItem("user");

        // Redirect to login if not already there
        if (!window.location.pathname.includes("/login")) {
          window.location.href = `/login?redirect=${window.location.pathname}`;
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
