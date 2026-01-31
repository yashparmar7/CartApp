import axiosInstance from "../../api/axiosInstance";

export const getWishlistAPI = () => axiosInstance.get("/wishlist/getWishlist");

export const addToWishlistAPI = (data) =>
  axiosInstance.post(`/wishlist/addToWishlist/${data.productId}`, data);

export const removeFromWishlistAPI = (data) =>
  axiosInstance.delete(`/wishlist/removeFromWishlist/${data.productId}`);
