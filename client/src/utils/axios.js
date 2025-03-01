import axios from "axios";

const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://retroterminal-api.onrender.com"
    : "http://localhost:5001";

const instance = axios.create({
  baseURL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
