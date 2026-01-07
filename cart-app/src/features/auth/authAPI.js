import axiosInstance from "../../api/axiosInstance";

export const loginAPI = (data) => {
  try {
    const res = axiosInstance.post("/auth/login", data);
    return res;
  } catch (err) {
    console.log(err);
  }
};

export const signupAPI = (data) => {
  try {
    const res = axiosInstance.post("/auth/signup", data);
    return res;
  } catch (err) {
    console.log(err);
  }
};

export const logoutAPI = () => {
  try {
    const res = axiosInstance.post("/auth/logout");
    return res;
  } catch (err) {
    console.log(err);
  }
};
