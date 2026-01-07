import axiosInstance from "../../api/axiosInstance";

export const addToCartAPI = (data) =>
  axiosInstance.post("/cart/addToCart", data);

export const getCartAPI = () => axiosInstance.get("/cart/getCart");

export const removeFromCartAPI = (data) =>
  axiosInstance.post("/cart/removeFromCart", data);

export const updateQuantityAPI = (data) =>
  axiosInstance.post("/cart/updateQuantity", data);
