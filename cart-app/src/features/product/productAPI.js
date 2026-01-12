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

export const getSellerMyProductsAPI = () => {
  try {
    const res = axiosInstance.get("/seller/getMyProducts");
    return res;
  } catch (err) {
    console.log(err);
  }
};

export const createProductAPI = (data) => {
  try {
    const res = axiosInstance.post("/seller/createProduct", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res;
  } catch (err) {
    console.log(err);
  }
};

export const updateProductAPI = (id, data) => {
  try {
    const res = axiosInstance.put(`/seller/updateProduct/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res;
  } catch (err) {
    console.log(err);
  }
};

export const deleteProductAPI = (id) => {
  try {
    const res = axiosInstance.delete(`/seller/deleteProduct/${id}`);
    return res;
  } catch (err) {
    console.log(err);
  }
};
