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

export const updateOrderAPI = async (id, data) => {
  const res = await axiosInstance.put(`/admin/updateOrder/${id}`, data);
  return res;
};

export const deleteOrderAPI = async (id) => {
  const res = await axiosInstance.delete(`/admin/deleteOrder/${id}`);
  return res;
};

export const getUserOrdersAPI = async () => {
  const res = await axiosInstance.get("/order/getUserOrders");
  return res;
};

export const cancelOrderAPI = async (id) => {
  const res = await axiosInstance.put(`/order/cancelOrder/${id}`);
  return res;
};
