import axiosInstance from "../../api/axiosInstance";

export const loginAPI = (data) => axiosInstance.post("/auth/login", data);

export const signupAPI = (data) => axiosInstance.post("/auth/signup", data);

export const logoutAPI = () => axiosInstance.post("/auth/logout");
