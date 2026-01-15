import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  RiEyeLine,
  RiCheckboxCircleFill,
  RiDeleteBin6Line,
  RiEdit2Line,
} from "react-icons/ri";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import Loader from "../../components/Loader";
import {
  getAllOrders,
  updateOrder,
  deleteOrder,
} from "../../features/order/orderSlice";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";

const Orders = () => {
  const dispatch = useDispatch();

  const { orders = [], loading = false } = useSelector((state) => state.order);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  const handleUpdateOrder = async (order) => {
    await dispatch(updateOrder({ id: order._id, data: order }));
    toast.success("Order updated successfully");
    setIsEditOpen(false);
    dispatch(getAllOrders());
  };

  const handleDeleteOrder = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this order!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await dispatch(deleteOrder(id));
        dispatch(getAllOrders());
        toast.success("Order deleted successfully");
      }
    });
  };

  const statusBadge = (status) => {
    if (status === "placed") return "bg-yellow-100 text-yellow-700";
    if (status === "confirmed") return "bg-blue-100 text-blue-700";
    if (status === "shipped") return "bg-purple-100 text-purple-700";
    if (status === "delivered") return "bg-emerald-100 text-emerald-700";
    return "bg-rose-100 text-rose-700";
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
          Orders
        </h1>
        <p className="text-sm text-gray-500">
          Total Orders:{" "}
          <span className="font-semibold text-red-600">{orders.length}</span>
        </p>
      </div>

      {/* ---------------- MOBILE VIEW ---------------- */}
      <div className="lg:hidden space-y-4">
        {!loading && orders.length === 0 && (
          <p className="text-center text-gray-500 py-10">No orders found</p>
        )}

        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">
                  Order #{order._id.slice(-6)}
                </p>
                <p className="text-xs text-gray-500 break-all">
                  {order.user?.email}
                </p>
              </div>

              <span
                className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(
                  order.orderStatus
                )}`}
              >
                {order.orderStatus}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <p className="col-span-2">
                <b>Product:</b> {order.items[0]?.title}
              </p>
              <p>
                <b>Items:</b> {order.items?.length}
              </p>
              <p>
                <b>Amount:</b> ₹{order.totalAmount}
              </p>
              <p>
                <b>Payment:</b> {order.payment?.method?.toUpperCase()}
              </p>
              <p className="col-span-2 flex items-center gap-1">
                <b>Payment Status:</b>
                {order.payment?.status === "paid" ? (
                  <span className="flex items-center gap-1 text-green-600">
                    <RiCheckboxCircleFill /> Paid
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-red-600">
                    <FaTimesCircle /> Not Paid
                  </span>
                )}
              </p>
            </div>

            <hr />

            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-gray-500" title={order.createdAt}>
                Ordered on: {new Date(order.createdAt).toLocaleDateString()}
              </span>

              <div className="flex gap-2 text-gray-700">
                <button
                  onClick={() => {
                    setSelectedOrder(order);
                    setIsViewOpen(true);
                  }}
                  className="p-2 rounded-lg bg-gray-200 hover:bg-gray-700 hover:text-white transition"
                >
                  <RiEyeLine />
                </button>
                <button
                  onClick={() => {
                    setSelectedOrder(order);
                    setIsEditOpen(true);
                  }}
                  className="p-2 rounded-lg bg-gray-200 hover:bg-gray-700 hover:text-white transition"
                >
                  <RiEdit2Line />
                </button>
                <button
                  onClick={() => handleDeleteOrder(order._id)}
                  className="p-2 rounded-lg bg-gray-200 hover:bg-red-600 hover:text-white transition"
                >
                  <RiDeleteBin6Line />
                </button>
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="text-center py-6">
            <Loader />
          </div>
        )}
      </div>

      {/* ---------------- DESKTOP TABLE ---------------- */}
      <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[1400px] w-full text-sm">
            <thead className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
              <tr>
                {[
                  "Order ID",
                  "User",
                  "Email",
                  "Product Name",
                  "Items",
                  "Amount",
                  "Payment",
                  "Payment Status",
                  "Order Status",
                  "Created",
                  "Action",
                ].map((h) => (
                  <th key={h} className="px-4 py-3 text-left whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {!loading && orders.length === 0 && (
                <tr>
                  <td colSpan="11" className="text-center py-10 text-gray-500">
                    No orders found
                  </td>
                </tr>
              )}

              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 font-medium">
                    #{order._id.slice(-6)}
                  </td>
                  <td className="px-4 py-3">{order.user?.userName || "—"}</td>
                  <td className="px-4 py-3">{order.user?.email || "—"}</td>
                  <td className="px-4 py-3">
                    {order.items[0]?.title}
                    {order.items.length > 1 && (
                      <span className="text-gray-500 ml-1">
                        (+{order.items.length - 1})
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">{order.items?.length}</td>
                  <td className="px-4 py-3 font-semibold">
                    ₹{order.totalAmount}
                  </td>
                  <td className="px-4 py-3 uppercase text-xs">
                    {order.payment?.method}
                  </td>
                  <td className="px-4 py-3">
                    {order.payment?.status === "paid" ? (
                      <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                        <RiCheckboxCircleFill /> Paid
                      </span>
                    ) : order.payment?.status === "pending" ? (
                      <span className="flex items-center gap-1 text-amber-600 font-semibold">
                        <RiCheckboxCircleFill /> Pending
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-rose-600 font-semibold">
                        <FaTimesCircle /> Failed
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsViewOpen(true);
                        }}
                        className="p-2 rounded-lg bg-gray-200 hover:bg-gray-700 hover:text-white transition"
                      >
                        <RiEyeLine />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsEditOpen(true);
                        }}
                        className="p-2 rounded-lg bg-gray-200 hover:bg-gray-700 hover:text-white transition"
                      >
                        <RiEdit2Line />
                      </button>
                      <button
                        onClick={() => handleDeleteOrder(order._id)}
                        className="p-2 rounded-lg bg-gray-200 hover:bg-red-600 hover:text-white transition"
                      >
                        <RiDeleteBin6Line />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {loading && (
          <div className="p-6 text-center">
            <Loader />
          </div>
        )}
      </div>

      {isEditOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm sm:max-w-md bg-white rounded-2xl shadow-2xl animate-[scaleIn_0.2s_ease-out]">
            {/* HEADER */}
            <div className="px-6 py-4 border-b border-gray-300">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                Update Order
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Manage order status & payment
              </p>
            </div>

            {/* BODY */}
            <div className="px-6 py-5 space-y-4">
              {/* ORDER ID */}
              <div>
                <label className="text-xs font-medium text-gray-500">
                  Order ID
                </label>
                <input
                  disabled
                  value={selectedOrder._id}
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-700 cursor-not-allowed"
                />
              </div>

              {/* USER */}
              <div>
                <label className="text-xs font-medium text-gray-500">
                  User Email
                </label>
                <input
                  disabled
                  value={selectedOrder.user?.email || "—"}
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-700 cursor-not-allowed"
                />
              </div>

              {/* ORDER STATUS */}
              <div>
                <label className="text-xs font-medium text-gray-500">
                  Order Status
                </label>
                <select
                  value={selectedOrder.orderStatus}
                  onChange={(e) =>
                    setSelectedOrder({
                      ...selectedOrder,
                      orderStatus: e.target.value,
                    })
                  }
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="placed">Placed</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* PAYMENT STATUS */}
              <div>
                <label className="text-xs font-medium text-gray-500">
                  Payment Status
                </label>
                <select
                  value={selectedOrder.isPaid ? "paid" : "unpaid"}
                  onChange={(e) =>
                    setSelectedOrder({
                      ...selectedOrder,
                      isPaid: e.target.value === "paid",
                    })
                  }
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid</option>
                </select>
              </div>

              {/* TOTAL */}
              <div>
                <label className="text-xs font-medium text-gray-500">
                  Total Amount
                </label>
                <input
                  disabled
                  value={`₹${selectedOrder.totalAmount}`}
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-700 cursor-not-allowed"
                />
              </div>
            </div>

            {/* FOOTER */}
            <div className="px-6 py-4 border-t border-gray-300 flex flex-col sm:flex-row gap-3 sm:justify-end">
              <button
                onClick={() => setIsEditOpen(false)}
                className="w-full sm:w-auto px-4 py-2 rounded-lg border text-sm text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={() => handleUpdateOrder(selectedOrder)}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {isViewOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden">
            {/* HEADER */}
            <div className="px-5 sm:px-6 py-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                Order #{selectedOrder._id.slice(-6)}
              </h2>
              <button
                onClick={() => setIsViewOpen(false)}
                className="text-gray-400 hover:text-red-500 text-xl"
              >
                ✕
              </button>
            </div>

            {/* BODY */}
            <div className="p-5 sm:p-6 space-y-6 text-sm max-h-[70vh] overflow-y-auto">
              {/* USER INFO */}
              <div className="space-y-1">
                <h3 className="font-semibold text-gray-800">User Info</h3>
                <p>
                  <b>Email:</b> {selectedOrder.user?.email}
                </p>
              </div>

              {/* SHIPPING ADDRESS */}
              <div className="space-y-1">
                <h3 className="font-semibold text-gray-800">
                  Shipping Address
                </h3>
                <p>{selectedOrder.shippingAddress.name}</p>
                <p>{selectedOrder.shippingAddress.phone}</p>
                <p>
                  {selectedOrder.shippingAddress.address},{" "}
                  {selectedOrder.shippingAddress.city},{" "}
                  {selectedOrder.shippingAddress.state} -{" "}
                  {selectedOrder.shippingAddress.pincode}
                </p>
              </div>

              {/* PAYMENT DETAILS */}
              <div className="space-y-1">
                <h3 className="font-semibold text-gray-800">Payment Details</h3>
                <p>
                  <b>Method:</b> {selectedOrder.payment.method.toUpperCase()}
                </p>
                <p>
                  <b>Payment ID:</b> {selectedOrder.payment.paymentId || "N/A"}
                </p>
                <p className="flex items-center gap-2">
                  <b>Status:</b>
                  {selectedOrder.payment.status === "paid" ? (
                    <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                      <RiCheckboxCircleFill /> Paid
                    </span>
                  ) : selectedOrder.payment.status === "pending" ? (
                    <span className="flex items-center gap-1 text-amber-600 font-semibold">
                      <RiCheckboxCircleFill /> Pending
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-rose-600 font-semibold">
                      <FaTimesCircle /> Failed
                    </span>
                  )}
                </p>
              </div>

              {/* ORDER STATUS */}
              <div className="space-y-1">
                <h3 className="font-semibold text-gray-800">Order Status</h3>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(
                    selectedOrder.orderStatus
                  )}`}
                >
                  {selectedOrder.orderStatus}
                </span>
              </div>

              {/* ITEMS */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 border rounded-lg p-3"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-14 h-14 object-cover rounded-md border"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{item.title}</p>
                        <p className="text-xs text-gray-500">
                          ₹{item.price} × {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold">
                        ₹{item.price * item.quantity}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* TOTAL + TIMESTAMPS */}
              <div className="space-y-1 border-t pt-4">
                <p className="text-base font-semibold">
                  Total Amount: ₹{selectedOrder.totalAmount}
                </p>
                <p>
                  <b>Paid:</b> {selectedOrder.isPaid ? "Yes" : "No"}
                </p>
                {selectedOrder.paidAt && (
                  <p>
                    <b>Paid At:</b>{" "}
                    {new Date(selectedOrder.paidAt).toLocaleString()}
                  </p>
                )}
                {selectedOrder.deliveredAt && (
                  <p>
                    <b>Delivered At:</b>{" "}
                    {new Date(selectedOrder.deliveredAt).toLocaleString()}
                  </p>
                )}
                <p>
                  <b>Created:</b>{" "}
                  {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            {/* FOOTER */}
            <div className="px-5 sm:px-6 py-4 border-t flex justify-end">
              <button
                onClick={() => setIsViewOpen(false)}
                className="px-4 py-2 rounded-lg border hover:bg-gray-100 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
