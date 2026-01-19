import axiosInstance from "../../api/axiosInstance";

export const loginAPI = (data) => axiosInstance.post("/auth/login", data);

export const signupAPI = (data) => axiosInstance.post("/auth/signup", data);

export const logoutAPI = () => axiosInstance.post("/auth/logout");
export const verifyEmailAPI = (token) =>
  axiosInstance.get(`/auth/verify-email/${token}`);

export const resendVerificationEmailAPI = (token) =>
  axiosInstance.post(`/auth/resend-verification-email/${token}`);
