import axios from "axios";

// Make sure this matches your actual server URL
const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://retro-64h4.onrender.com"
    : "http://localhost:5001";

console.log("Axios configured with baseURL:", baseURL);

const instance = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Add request interceptor for error handling
instance.interceptors.request.use(
  (config) => {
    // Log the request in development
    if (process.env.NODE_ENV !== "production") {
      console.log("API Request:", config.method?.toUpperCase(), config.url);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Instead of direct redirect, check if we're already on the login page
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default instance;
