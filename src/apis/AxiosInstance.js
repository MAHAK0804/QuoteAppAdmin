import axios from "axios";

// Create axios instance
const axiosInstance = axios.create({
  baseURL: "https://quoteappserver.onrender.com/api", // ✅ Change to your actual base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to attach token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
