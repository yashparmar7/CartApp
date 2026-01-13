import axiosInstance from "../../api/axiosInstance";

export const createOrderAPI = (data) => {
  try {
    const res = axiosInstance.post("/order/createOrder", data);
    return res;
  } catch (err) {
    console.log(err);
  }
};

export const getAllOrdersAPI = async () => {
  const res = await axiosInstance.get("/admin/getAllOrders");
  return res;
};
