import axiosInstance from "../../api/axiosInstance";

export const createCategoryAPI = (data) => {
  try {
    const res = axiosInstance.post("/category/createCategory", data);
    return res;
  } catch (err) {
    console.log(err);
  }
};

export const getAllCategoriesAPI = () => {
  try {
    const res = axiosInstance.get("/category/getAllCategories");
    return res;
  } catch (err) {
    console.log(err);
  }
};

export const deleteCategoryAPI = (id) => {
  try {
    const res = axiosInstance.delete(`/category/deleteCategory/${id}`);
    return res;
  } catch (err) {
    console.log(err);
  }
};

export const updateCategoryAPI = (id, data) => {
  try {
    const res = axiosInstance.put(`/category/updateCategory/${id}`, data);
    return res;
  } catch (err) {
    console.log(err);
  }
};
