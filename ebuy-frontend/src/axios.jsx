import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:8080";

const API = axios.create({
  baseURL,
});

// Attach JWT token from localStorage to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
