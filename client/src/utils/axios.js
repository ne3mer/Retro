import axios from "axios";

const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://retro-64h4.onrender.com"
    : "http://localhost:5001";

const instance = axios.create({
  baseURL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Add response interceptor for error handling
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default instance;
