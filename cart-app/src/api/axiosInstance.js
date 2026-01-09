import axios from "axios";

const url = import.meta.env.DEV
  ? "http://localhost:5000/api"
  : import.meta.env.VITE_BASE_URL + "/api";

const axiosInstance = axios.create({
  baseURL: url,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
