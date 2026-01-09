import axiosInstance from "../../api/axiosInstance";

export const getAllProductsAPI = () => {
  try {
    const res = axiosInstance.get("/products/getAllProducts");
    return res;
  } catch (err) {
    console.log(err);
  }
};

export const getSingleProductAPI = (id) => {
  try {
    const res = axiosInstance.get(`/products/getSingleProduct/${id}`);
    return res;
  } catch (err) {
    console.log(err);
  }
};

export const getAllProductsAdminAPI = () => {
  try {
    const res = axiosInstance.get("/admin/getAllProductsAdmin");
    return res;
  } catch (err) {
    console.log(err);
  }
};

export const updateSellerProductStatusAPI = (id, data) => {
  try {
    const res = axiosInstance.put(`/admin/products/${id}/status`, data);
    return res;
  } catch (err) {
    console.log(err);
  }
};

export const softDeleteSellerProductAPI = (id) => {
  try {
    const res = axiosInstance.put(`/admin/products/${id}/softDelete`);
    return res;
  } catch (err) {
    console.log(err);
  }
};
