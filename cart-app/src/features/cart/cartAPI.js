import axiosInstance from "../../api/axiosInstance";

export const addToCartAPI = (data) => {
  try {
    const res = axiosInstance.post("/cart/addToCart", data);
    console.log(res);
    return res;
  } catch (err) {
    console.log(err);
  }
};

export const getCartAPI = () => {
  try {
    const res = axiosInstance.get("/cart/getCart");
    return res;
  } catch (err) {
    console.log(err);
  }
};

export const removeFromCartAPI = (data) => {
  try {
    const res = axiosInstance.post("/cart/removeFromCart", data);
    return res;
  } catch (err) {
    console.log(err);
  }
};
