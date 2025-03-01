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
  baseURL,
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
  (response) => {
    if (!isProduction) {
      console.log("API Response:", response.status, response.config.url);
    }
    return response;
  },
  async (error) => {
    // Get the original request configuration
    const originalRequest = error.config;

    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error("Unauthorized access:", error.response?.data);

      // Instead of direct redirect, check if we're already on the login page
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    } else if (error.code === "ERR_NETWORK") {
      console.error("Network error - server may be down or CORS issue");
      console.error("Error details:", error);

      // Check if we should retry the request
      if (!originalRequest._retry && originalRequest.method === "get") {
        originalRequest._retry = true;
        console.log("Retrying request after network error...");

        // Wait a moment before retrying
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return api(originalRequest);
      }
    } else {
      console.error("API Error:", error.response?.data || error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
