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
});

export default instance;
