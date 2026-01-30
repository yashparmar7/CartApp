import axios from "axios";
import store from "../app/store";
import { logout } from "../features/auth/authSlice";
import toast from "react-hot-toast";

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

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      store.dispatch(logout());
      toast.error("Session expired, please login");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
