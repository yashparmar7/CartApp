import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RiEyeLine, RiTruckLine } from "react-icons/ri";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import Loader from "../../components/Loader";
import { getAllOrders } from "../../features/order/orderSlice";

const Orders = () => {
  const dispatch = useDispatch();

  const { orders = [], loading = false } = useSelector((state) => state.order);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  const statusBadge = (status) => {
    if (status === "placed") return "bg-yellow-100 text-yellow-700";
    if (status === "confirmed") return "bg-blue-100 text-blue-700";
    if (status === "shipped") return "bg-purple-100 text-purple-700";
    if (status === "delivered") return "bg-emerald-100 text-emerald-700";
    return "bg-rose-100 text-rose-700";
  };

  return (
    <div className="p-4 sm:p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
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
            className="bg-white rounded-xl shadow border border-gray-300 p-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold">
                  Order #{order._id.slice(-6)}
                </p>
                <p className="text-xs text-gray-500">{order.user?.email}</p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(
                  order.orderStatus
                )}`}
              >
                {order.orderStatus}
              </span>
            </div>

            <div className="mt-3 text-sm">
              <p>
                <b>Amount:</b> ₹{order.totalAmount}
              </p>
              <p>
                <b>Payment:</b> {order.payment?.method?.toUpperCase()}
              </p>
            </div>

            <div className="mt-3 flex justify-between items-center text-xs text-gray-500">
              <span>{new Date(order.createdAt).toLocaleDateString()}</span>

              <button
                onClick={() => {
                  setSelectedOrder(order);
                  setIsViewOpen(true);
                }}
                className="p-2 rounded-lg bg-gray-200 hover:bg-gray-700 hover:text-white"
              >
                <RiEyeLine />
              </button>
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
      <div className="hidden lg:block bg-white rounded-2xl shadow border border-gray-300 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[1400px] w-full text-sm">
            <thead className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
              <tr>
                {[
                  "Order ID",
                  "User",
                  "Email",
                  "Items",
                  "Amount",
                  "Payment",
                  "Status",
                  "Created",
                  "Action",
                ].map((h) => (
                  <th key={h} className="px-4 py-3 text-left">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {!loading && orders.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center py-10 text-gray-500">
                    No orders found
                  </td>
                </tr>
              )}

              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b border-gray-300 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 font-medium">
                    #{order._id.slice(-6)}
                  </td>
                  <td className="px-4 py-3">{order.user?.userName || "—"}</td>
                  <td className="px-4 py-3">{order.user?.email || "—"}</td>
                  <td className="px-4 py-3">{order.items?.length}</td>
                  <td className="px-4 py-3 font-semibold">
                    ₹{order.totalAmount}
                  </td>
                  <td className="px-4 py-3 uppercase text-xs">
                    {order.payment?.method}
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
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setIsViewOpen(true);
                      }}
                      className="p-2 rounded-lg bg-gray-200 hover:bg-gray-700 hover:text-white"
                    >
                      <RiEyeLine />
                    </button>
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

      {isViewOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden">
            {/* HEADER */}
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                Order #{selectedOrder._id.slice(-6)}
              </h2>
              <button
                onClick={() => setIsViewOpen(false)}
                className="text-gray-400 hover:text-red-500"
              >
                ✕
              </button>
            </div>

            {/* BODY */}
            <div className="p-6 space-y-4 text-sm">
              <p>
                <b>User:</b> {selectedOrder.user?.email}
              </p>
              <p>
                <b>Amount:</b> ₹{selectedOrder.totalAmount}
              </p>
              <p>
                <b>Payment:</b> {selectedOrder.payment?.method}
              </p>
              <p>
                <b>Status:</b>{" "}
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(
                    selectedOrder.orderStatus
                  )}`}
                >
                  {selectedOrder.orderStatus}
                </span>
              </p>

              <div>
                <p className="font-semibold mb-1">Items</p>
                <ul className="list-disc ml-5">
                  {selectedOrder.items.map((item) => (
                    <li key={item._id}>
                      {item.title} × {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* FOOTER */}
            <div className="px-6 py-4 border-t flex justify-end gap-3">
              <button
                onClick={() => setIsViewOpen(false)}
                className="px-4 py-2 rounded-lg border"
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
