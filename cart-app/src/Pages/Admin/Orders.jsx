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
  RiCloseLine,
  RiUser3Fill,
  RiPhoneFill,
  RiMapPin2Fill,
  RiBankCardFill,
  RiErrorWarningFill,
  RiTimeFill,
  RiShieldCheckFill,
  RiFlagFill,
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

{
  /* Timeline Helper */
}
const TimelineItem = ({ label, date, icon, active }) => (
  <div
    className={`flex items-start gap-3 ${active ? "opacity-100" : "opacity-30"}`}
  >
    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 mt-1">
      {icon}
    </div>
    <div>
      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">
        {label}
      </p>
      <p className="text-[10px] font-bold text-gray-700 mt-1.5">
        {date ? new Date(date).toLocaleString() : "Pending Event"}
      </p>
    </div>
  </div>
);

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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-md px-4 transition-all duration-300">
          <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl animate-in zoom-in duration-300 border border-white/20 overflow-hidden">
            {/* HEADER: Branded & Contextual */}
            <div className="bg-red-500 p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black uppercase tracking-tight leading-none">
                  Update <span className="text-red-100">Order</span>
                </h2>
                <p className="text-red-100 text-[10px] font-black uppercase tracking-[0.2em] mt-2 opacity-80">
                  Logistics & Payment Processing
                </p>
              </div>
            </div>

            {/* BODY: Structured Premium Inputs */}
            <div className="p-8 space-y-6">
              {/* Read-Only Transaction Card */}
              <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 shadow-inner">
                <div className="min-w-0">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">
                    Order Ref
                  </p>
                  <p className="text-xs font-black text-gray-900 truncate mt-1 italic">
                    #{selectedOrder._id.slice(-8).toUpperCase()}
                  </p>
                </div>
                <div className="min-w-0 text-right">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">
                    Revenue
                  </p>
                  <p className="text-sm font-black text-red-500 mt-1 italic">
                    ₹{selectedOrder.totalAmount.toLocaleString()}
                  </p>
                </div>
                <div className="col-span-2 pt-2 mt-2 border-t border-gray-200">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">
                    Customer Account
                  </p>
                  <p className="text-xs font-bold text-gray-700 truncate mt-1">
                    {selectedOrder.user?.email || "Guest Checkout"}
                  </p>
                </div>
              </div>

              {/* Status Selection Logic */}
              <div className="space-y-4">
                {/* Order Lifecycle Status */}
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">
                    Logistics Milestone
                  </label>
                  <div className="relative">
                    <select
                      value={selectedOrder.orderStatus}
                      onChange={(e) =>
                        setSelectedOrder({
                          ...selectedOrder,
                          orderStatus: e.target.value,
                        })
                      }
                      className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50 font-bold text-sm text-gray-800 outline-none focus:bg-white focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all appearance-none cursor-pointer"
                    >
                      <option value="placed"> Order Placed</option>
                      <option value="confirmed"> Order Confirmed</option>
                      <option value="shipped"> Parcel Shipped</option>
                      <option value="delivered"> Handed to Customer</option>
                      <option value="cancelled"> Transaction Revoked</option>
                    </select>
                  </div>
                </div>

                {/* Payment Status */}
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">
                    Financial Status
                  </label>
                  <div className="relative">
                    <select
                      value={selectedOrder.isPaid ? "paid" : "unpaid"}
                      onChange={(e) =>
                        setSelectedOrder({
                          ...selectedOrder,
                          isPaid: e.target.value === "paid",
                        })
                      }
                      className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50 font-bold text-sm text-gray-800 outline-none focus:bg-white focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all appearance-none cursor-pointer"
                    >
                      <option value="paid"> Verified: Paid</option>
                      <option value="unpaid"> Pending: Unpaid</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* ACTIONS: Tactical & Clear */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setIsEditOpen(false)}
                  className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95"
                >
                  Discard
                </button>
                <button
                  onClick={() => handleUpdateOrder(selectedOrder)}
                  className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-red-200 hover:bg-red-600 transition-all active:scale-95"
                >
                  Apply Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isViewOpen && selectedOrder && (
        <div className="fixed inset-0 z-[100] bg-gray-900/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 transition-all duration-500">
          <div className="bg-white w-full max-w-5xl rounded-[3rem] shadow-2xl max-h-[90vh] flex flex-col overflow-hidden border border-white/20 animate-in slide-in-from-bottom-4 duration-500">
            {/* HEADER: Branded & Fixed */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-50 bg-white sticky top-0 z-20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-200">
                  <RiShoppingBag3Fill size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight leading-none">
                    Order <span className="text-red-500">Invoice</span>
                  </h2>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1.5 italic opacity-70">
                    Transaction ID: #{selectedOrder._id.toUpperCase()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsViewOpen(false)}
                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-50 text-gray-400 hover:text-red-500 transition-all hover:bg-red-50 group"
              >
                <RiCloseLine
                  size={28}
                  className="group-hover:rotate-90 transition-transform duration-300"
                />
              </button>
            </div>

            {/* BODY: Scrollable content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar bg-[#F9FAFB]/50 space-y-10">
              {/* TOP ROW: USER & SHIPPING INFO */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Account Profile */}
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
                  <div className="flex items-center gap-3 border-b border-gray-50 pb-3">
                    <RiUser3Fill className="text-red-500" />
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Customer Profile
                    </h3>
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-900 uppercase">
                      {selectedOrder.shippingAddress.name}
                    </p>
                    <p className="text-xs font-bold text-gray-500 italic mt-1">
                      {selectedOrder.user?.email}
                    </p>
                    <p className="text-xs font-black text-red-500 mt-2 flex items-center gap-1">
                      <RiPhoneFill size={12} />{" "}
                      {selectedOrder.shippingAddress.phone}
                    </p>
                  </div>
                </div>

                {/* Shipping Logistics */}
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
                  <div className="flex items-center gap-3 border-b border-gray-50 pb-3">
                    <RiMapPin2Fill className="text-red-500" />
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Delivery Destination
                    </h3>
                  </div>
                  <p className="text-xs font-bold text-gray-600 leading-relaxed uppercase tracking-tight">
                    {selectedOrder.shippingAddress.address},<br />
                    {selectedOrder.shippingAddress.city},{" "}
                    {selectedOrder.shippingAddress.state} —{" "}
                    {selectedOrder.shippingAddress.pincode}
                  </p>
                </div>
              </div>

              {/* MIDDLE ROW: PAYMENT & LOGISTICS STATUS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Payment Method */}
                <div className="bg-gray-900 rounded-[2rem] p-6 text-white relative overflow-hidden shadow-xl">
                  <RiBankCardFill className="absolute -right-2 -bottom-2 text-white/5 text-7xl" />
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">
                    Billing Method
                  </p>
                  <p className="text-lg font-black italic uppercase">
                    {selectedOrder.payment.method}
                  </p>
                  <p className="text-[10px] text-gray-500 mt-1 truncate">
                    ID: {selectedOrder.payment.paymentId || "INTERNAL_TX"}
                  </p>
                </div>

                {/* Financial Status */}
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-between">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">
                    Payment Verification
                  </p>
                  {selectedOrder.payment.status === "paid" ? (
                    <div className="flex items-center gap-2 text-emerald-600 font-black uppercase text-sm italic">
                      <RiCheckboxCircleFill size={20} /> Transaction Cleared
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-rose-600 font-black uppercase text-sm italic">
                      <RiErrorWarningFill size={20} /> Payment Deficit
                    </div>
                  )}
                </div>

                {/* Order State */}
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-between">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">
                    Logistics Milestone
                  </p>
                  <div className="flex">
                    <span
                      className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusBadge(selectedOrder.orderStatus)}`}
                    >
                      {selectedOrder.orderStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* ITEMS SECTION */}
              <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="bg-gray-50/50 px-8 py-4 border-b border-gray-100">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    Manifest Itemization
                  </h3>
                </div>
                <div className="divide-y divide-gray-50">
                  {selectedOrder.items.map((item, index) => (
                    <div
                      key={index}
                      className="px-8 py-5 flex items-center gap-6 group hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-16 h-16 rounded-2xl overflow-hidden border border-gray-100 bg-white p-1 shrink-0 shadow-sm">
                        <img
                          src={item.image}
                          alt=""
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-gray-900 uppercase tracking-tight truncate">
                          {item.title}
                        </p>
                        <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase italic">
                          Unit Price: ₹{item.price.toLocaleString()} ×{" "}
                          {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-gray-900 italic tracking-tighter">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Summary Footer */}
                <div className="bg-red-50/50 px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-red-100">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">
                      Total Invoice Value:
                    </span>
                    <span className="text-2xl font-black text-gray-900 italic">
                      ₹{selectedOrder.totalAmount.toLocaleString()}
                    </span>
                  </div>
                  <div
                    className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase border ${selectedOrder.isPaid ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-rose-50 text-rose-600 border-rose-200"}`}
                  >
                    Account Balance:{" "}
                    {selectedOrder.isPaid ? "Fully Settled" : "Outstanding"}
                  </div>
                </div>
              </div>

              {/* LOGISTICAL TIMELINE */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 px-4">
                <TimelineItem
                  label="Entry Timestamp"
                  date={selectedOrder.createdAt}
                  icon={<RiTimeFill />}
                />
                <TimelineItem
                  label="Settlement Date"
                  date={selectedOrder.paidAt}
                  icon={<RiShieldCheckFill />}
                  active={selectedOrder.isPaid}
                />
                <TimelineItem
                  label="Delivery Closure"
                  date={selectedOrder.deliveredAt}
                  icon={<RiFlagFill />}
                  active={selectedOrder.orderStatus === "delivered"}
                />
              </div>
            </div>

            {/* FOOTER ACTIONS */}
            <div className="px-8 py-6 border-t border-gray-50 bg-white flex justify-end gap-3">
              <button
                onClick={() => setIsViewOpen(false)}
                className="px-8 py-3 bg-gray-900 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-gray-200 hover:bg-red-500 hover:shadow-red-100 transition-all active:scale-95"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
