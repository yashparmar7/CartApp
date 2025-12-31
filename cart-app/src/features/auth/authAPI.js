import axiosInstance from "../../api/axiosInstance";

export const loginAPI = (data) => {
  const res = axiosInstance.post("/auth/login", data);
  return res;
};

export const signupAPI = (data) => {
  const res = axiosInstance.post("/auth/signup", data);
  return res;
};

export const logoutAPI = () => {
  const res = axiosInstance.post("/auth/logout");
  return res;
};
