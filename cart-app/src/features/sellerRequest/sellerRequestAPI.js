import axiosInstance from "../../api/axiosInstance";

export const createSellerRequestAPI = (data) => {
  return axiosInstance.post("/sellerRequest/createSellerRequest", data);
};

export const getSellerRequestsAPI = () => {
  return axiosInstance.get("/sellerRequest/getSellerRequests");
};

export const updateSellerRequestAPI = (id, data) => {
  return axiosInstance.put(`/sellerRequest/updateSellerRequest/${id}`, data);
};
