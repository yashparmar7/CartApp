import axiosInstance from "../../api/axiosInstance";

export const createSellerRequestAPI = (data) => {
  return axiosInstance.post("/sellerRequest/createSellerRequest", data);
};

export const getSellerRequestsAPI = () => {
  return axiosInstance.get("/admin/seller-requests");
};

export const approveSellerRequestAPI = (id) => {
  return axiosInstance.patch(`/admin/seller-requests/${id}/approve`);
};

export const rejectSellerRequestAPI = (id) => {
  return axiosInstance.patch(`/admin/seller-requests/${id}/reject`);
};

export const updateSellerUserRoleAPI = (id, data) => {
  return axiosInstance.patch(`/admin/users/${id}/role`, data);
};

export const deleteSellerRequestAPI = (id) => {
  return axiosInstance.delete(`/admin/seller-requests/${id}`);
};
