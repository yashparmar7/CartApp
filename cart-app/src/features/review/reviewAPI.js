import axiosInstance from "../../api/axiosInstance";

export const getProductReviewsAPI = (id) =>
  axiosInstance.get(`/reviews/getProductReviews/${id}`);

export const addReviewAPI = (id, data) =>
  axiosInstance.post(`/reviews/addReview/${id}`, data);
