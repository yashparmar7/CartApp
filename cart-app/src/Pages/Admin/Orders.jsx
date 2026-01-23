import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  RiEyeLine,
  RiCheckboxCircleFill,
  RiDeleteBin6Line,
  RiEdit2Line,
  RiShoppingBag3Line,
  RiCloseCircleFill,
  RiFileList3Fill,
  RiShoppingBag3Fill,
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
      {/* ===================== COMMAND BAR HEADER (ORDERS) ===================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
        {/* Left Side: Module Identity */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-200 shrink-0">
            <RiShoppingBag3Fill size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase leading-none">
              Order <span className="text-red-500">Logistics</span>
            </h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-2">
              Transaction History & Fulfillment
            </p>
          </div>
        </div>

        {/* Right Side: Metrics & Status */}
        <div className="flex items-center gap-3">
          {/* Secondary Financial Metric (Optional but recommended) */}
          <div className="flex flex-col items-end px-4 border-r border-gray-100 hidden sm:block">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
              Active Revenue
            </p>
            <p className="text-sm font-black text-gray-900 italic">
              ₹
              {orders
                .reduce((acc, curr) => acc + curr.totalAmount, 0)
                .toLocaleString()}
            </p>
          </div>

          {/* Total Orders Badge */}
          <div className="bg-red-50 px-5 py-2.5 rounded-2xl border border-red-100 flex items-center gap-3 transition-all hover:bg-red-100 group">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-red-500 shadow-sm group-hover:scale-110 transition-transform">
              <RiFileList3Fill size={18} />
            </div>
            <div>
              <p className="text-[9px] font-black text-red-600 uppercase tracking-[0.1em] leading-none">
                Total Orders
              </p>
              <p className="text-lg font-black text-red-700 mt-0.5 leading-none">
                {orders.length}{" "}
                <span className="text-[10px] font-bold opacity-60 uppercase">
                  Entries
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ===================== MOBILE LIST VIEW (REDESIGNED) ===================== */}
      <div className="lg:hidden space-y-4">
        {!loading && orders.length === 0 && (
          <div className="bg-white rounded-[2rem] p-12 text-center border border-dashed border-gray-200">
            <p className="text-gray-400 font-bold tracking-tight italic">
              No order records found.
            </p>
          </div>
        )}

        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm transition-all active:scale-[0.98] hover:shadow-md"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-black text-red-500 uppercase tracking-widest leading-none">
                  Order ID
                </span>
                <h3 className="text-sm font-black text-gray-900 uppercase mt-0.5">
                  #{order._id.slice(-6)}
                </h3>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border tracking-widest ${statusBadge(order.orderStatus)}`}
              >
                {order.orderStatus}
              </span>
            </div>

            <div className="space-y-3 py-4 border-y border-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 shrink-0">
                  <RiShoppingBag3Line className="text-gray-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-700 truncate">
                    {order.items[0]?.title}
                  </p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">
                    {order.items?.length} items • ₹{order.totalAmount}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between bg-gray-50/50 p-2.5 rounded-xl border border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                  Payment Status
                </p>
                {order.payment?.status === "paid" ? (
                  <span className="flex items-center gap-1 text-[10px] font-black text-emerald-600 uppercase">
                    <RiCheckboxCircleFill /> Verified Paid
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] font-black text-rose-600 uppercase">
                    <RiCloseCircleFill /> Unpaid
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                {new Date(order.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                })}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedOrder(order);
                    setIsViewOpen(true);
                  }}
                  className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm shadow-blue-100"
                >
                  <RiEyeLine size={18} />
                </button>
                <button
                  onClick={() => {
                    setSelectedOrder(order);
                    setIsEditOpen(true);
                  }}
                  className="p-2.5 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-600 hover:text-white transition-all shadow-sm shadow-amber-100"
                >
                  <RiEdit2Line size={18} />
                </button>
                <button
                  onClick={() => handleDeleteOrder(order._id)}
                  className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm shadow-red-100"
                >
                  <RiDeleteBin6Line size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="text-center py-10">
            <Loader />
          </div>
        )}
      </div>

      {/* ===================== DESKTOP TABLE VIEW (REDESIGNED) ===================== */}
      <div className="hidden lg:block bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="min-w-[1400px] w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                {[
                  "Identifier",
                  "Customer",
                  "Primary Product",
                  "Qty",
                  "Total Amount",
                  "Gateway",
                  "Payment Logic",
                  "Logistics Status",
                  "Ordered On",
                  "Action",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50 font-medium text-sm">
              {!loading && orders.length === 0 && (
                <tr>
                  <td colSpan="11" className="py-20 text-center bg-gray-50/30">
                    <p className="text-gray-400 font-black uppercase tracking-widest text-sm italic">
                      Zero Transaction History
                    </p>
                  </td>
                </tr>
              )}

              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-gray-50/50 transition-all duration-200 group"
                >
                  {/* Order ID */}
                  <td className="px-6 py-4 font-black text-gray-900 uppercase tracking-tighter">
                    #{order._id.slice(-6)}
                  </td>

                  {/* User Info */}
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-gray-800 leading-none">
                      {order.user?.userName || "—"}
                    </p>
                    <p className="text-[10px] text-gray-400 font-medium mt-1 truncate max-w-[150px]">
                      {order.user?.email || "—"}
                    </p>
                  </td>

                  {/* Product */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <p className="text-xs font-bold text-gray-700 truncate max-w-[200px] group-hover:text-red-500 transition-colors">
                        {order.items[0]?.title}
                      </p>
                      {order.items.length > 1 && (
                        <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-1">
                          +{order.items.length - 1} More Items
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Quantity */}
                  <td className="px-6 py-4 text-xs font-black text-gray-400">
                    {order.items?.length} units
                  </td>

                  {/* Amount */}
                  <td className="px-6 py-4">
                    <span className="text-sm font-black text-gray-900 italic">
                      ₹{order.totalAmount.toLocaleString()}
                    </span>
                  </td>

                  {/* Payment Method */}
                  <td className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                    {order.payment?.method}
                  </td>

                  {/* Payment Status */}
                  <td className="px-6 py-4">
                    {order.payment?.status === "paid" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase border border-emerald-100">
                        <RiCheckboxCircleFill /> Paid
                      </span>
                    ) : order.payment?.status === "pending" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-600 text-[10px] font-black uppercase border border-amber-100">
                        <RiCheckboxCircleFill /> Pending
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-600 text-[10px] font-black uppercase border border-rose-100">
                        <RiCloseCircleFill /> Failed
                      </span>
                    )}
                  </td>

                  {/* Order Status Badge */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase border tracking-widest ${statusBadge(order.orderStatus)}`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>

                  {/* Created At */}
                  <td className="px-6 py-4 text-[10px] font-bold text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 sticky right-0 bg-white group-hover:bg-gray-50 transition-colors">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsViewOpen(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-xl transition-all"
                      >
                        <RiEyeLine size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsEditOpen(true);
                        }}
                        className="p-2 text-amber-600 hover:bg-amber-100 rounded-xl transition-all"
                      >
                        <RiEdit2Line size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteOrder(order._id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-xl transition-all"
                      >
                        <RiDeleteBin6Line size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {loading && (
          <div className="p-12 text-center bg-white">
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
                    selectedOrder.orderStatus,
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
