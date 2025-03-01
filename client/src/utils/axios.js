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
    }

    // Add origin header for CORS
    config.headers["Origin"] = window.location.origin;

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
  async (error) => {
    if (error.response) {
      console.error("API Error:", error.response.data);

      // Handle authentication errors
      if (error.response.status === 401) {
        // Try to refresh the token first
        try {
          const refreshResponse = await api.post("/auth/refresh");
          if (refreshResponse.data.token) {
            // Retry the original request
            return api(error.config);
          }
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          // Clear any stored auth data
          localStorage.removeItem("user");

          // Only redirect to login if not already there and not trying to refresh
          if (
            !window.location.pathname.includes("/login") &&
            !error.config.url.includes("/auth/refresh")
          ) {
            window.location.href = `/login?redirect=${encodeURIComponent(
              window.location.pathname
            )}`;
          }
        }
      } else if (error.response.status === 403) {
        console.error("Forbidden access:", error.response.data);
        // Handle forbidden access (e.g., trying to access admin resources)
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/";
        }
      }
    } else if (error.code === "ERR_NETWORK") {
      console.error("Network Error:", error);
      // Show a user-friendly error message for network issues
      throw new Error("Network error: Please check your internet connection");
    }
    return Promise.reject(error);
  }
);

export default api;
