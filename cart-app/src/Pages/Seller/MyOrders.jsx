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
  RiTruckFill,
  RiShoppingBag3Fill,
  RiCloseLine,
  RiUser3Fill,
  RiPhoneFill,
  RiMapPin2Fill,
  RiBankCardFill,
} from "react-icons/ri";
import { FaTimesCircle } from "react-icons/fa";
import Loader from "../../components/Loader";
import { getSellerOrders } from "../../features/order/orderSlice";

const AuditLog = ({ label, date, active }) => (
  <div className={`space-y-1 ${active ? "opacity-100" : "opacity-30"}`}>
    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
      {label}
    </p>
    <p className="text-[10px] font-bold text-gray-800 italic">
      {date ? new Date(date).toLocaleString() : "Pending..."}
    </p>
  </div>
);
const MyOrders = () => {
  const dispatch = useDispatch();

  const { orders = [], loading = false } = useSelector((state) => state.order);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  useEffect(() => {
    dispatch(getSellerOrders());
  }, [dispatch]);

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
      {/* ===================== COMMAND BAR HEADER (SELLER ORDERS) ===================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
        {/* Left Side: Module Identity */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-200 shrink-0">
            <RiTruckFill size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase leading-none">
              My <span className="text-red-500">Orders</span>
            </h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-2">
              Fulfillment & Shipping Pipeline
            </p>
          </div>
        </div>

        {/* Right Side: Metrics & Store Status */}
        <div className="flex items-center gap-3">
          {/* Secondary Seller Metric */}
          <div className="hidden sm:flex flex-col items-end px-4 border-r border-gray-100">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
              Store Revenue
            </p>
            <p className="text-sm font-black text-gray-900 italic tracking-tighter">
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
                Total Volume
              </p>
              <p className="text-lg font-black text-red-700 mt-0.5 leading-none">
                {orders.length}{" "}
                <span className="text-[10px] font-bold opacity-60 uppercase">
                  Jobs
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- MOBILE VIEW ---------------- */}
      {/* ===================== MOBILE VIEW (REDESIGNED) ===================== */}
      <div className="lg:hidden space-y-4">
        {!loading && orders.length === 0 && (
          <div className="bg-white rounded-[2rem] p-12 text-center border border-dashed border-gray-200">
            <p className="text-gray-400 font-black uppercase tracking-widest text-xs">
              No Order Data Found
            </p>
          </div>
        )}

        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm transition-all active:scale-[0.98] hover:shadow-md"
          >
            {/* Mobile Card Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] leading-none">
                  Record
                </span>
                <h3 className="text-sm font-black text-gray-900 uppercase mt-1 tracking-tighter">
                  #{order._id.slice(-6)}
                </h3>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border tracking-widest ${statusBadge(order.orderStatus)}`}
              >
                {order.orderStatus}
              </span>
            </div>

            {/* Mobile Body Content */}
            <div className="space-y-3 py-4 border-y border-gray-50">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center border border-red-100 shrink-0 shadow-inner">
                  <RiShoppingBag3Line className="text-red-500" size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-black text-gray-800 truncate uppercase tracking-tight">
                    {order.items[0]?.title}
                  </p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">
                    {order.user?.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-gray-50/50 p-3 rounded-2xl border border-gray-100">
                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                    Revenue
                  </p>
                  <p className="text-xs font-black text-gray-900 italic">
                    ₹{order.totalAmount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                    Gateway
                  </p>
                  <p className="text-xs font-black text-gray-900 uppercase">
                    {order.payment?.method}
                  </p>
                </div>
                <div className="col-span-2 pt-1">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    Financial State
                  </p>
                  {order.payment?.status === "paid" ? (
                    <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600 uppercase">
                      <RiCheckboxCircleFill /> Cleared Payment
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-[10px] font-black text-rose-600 uppercase">
                      <RiCloseCircleFill /> Payment Deficit
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Footer Actions */}
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
                  className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm shadow-blue-100"
                >
                  <RiEyeLine size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="py-10 text-center">
            <Loader />
          </div>
        )}
      </div>

      {/* ===================== DESKTOP TABLE (REDESIGNED) ===================== */}
      <div className="hidden lg:block bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="min-w-[1400px] w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                {[
                  "Order Log",
                  "Account Holder",
                  "Contact",
                  "Primary Item",
                  "Qty",
                  "Transaction",
                  "Method",
                  "Billing Status",
                  "Logistics",
                  "Timeline",
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
                  <td colSpan="11" className="py-24 text-center bg-gray-50/30">
                    <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-sm italic">
                      Archive Empty
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
                  <td className="px-6 py-4 font-black text-gray-900 uppercase tracking-tighter italic">
                    #{order._id.slice(-6)}
                  </td>

                  {/* User Profile */}
                  <td className="px-6 py-4 font-black text-gray-800 uppercase text-xs tracking-tight">
                    {order.user?.userName || "—"}
                  </td>

                  {/* Email */}
                  <td className="px-6 py-4 text-xs font-bold text-gray-400 italic">
                    {order.user?.email || "—"}
                  </td>

                  {/* Product Title */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <p className="text-xs font-black text-gray-700 truncate max-w-[220px] group-hover:text-red-500 transition-colors uppercase">
                        {order.items[0]?.title}
                      </p>
                      {order.items.length > 1 && (
                        <span className="text-[9px] font-black text-red-400 uppercase tracking-widest mt-1">
                          + {order.items.length - 1} Multiple Parcel
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
                    <span className="text-sm font-black text-gray-900 leading-none tracking-tighter">
                      ₹{order.totalAmount.toLocaleString()}
                    </span>
                  </td>

                  {/* Gateway */}
                  <td className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                    {order.payment?.method}
                  </td>

                  {/* Billing Logic */}
                  <td className="px-6 py-4">
                    {order.payment?.status === "paid" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase border border-emerald-100">
                        <RiCheckboxCircleFill /> Verified
                      </span>
                    ) : order.payment?.status === "pending" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-600 text-[10px] font-black uppercase border border-amber-100 shadow-sm">
                        <RiCheckboxCircleFill /> Processing
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-600 text-[10px] font-black uppercase border border-rose-100">
                        <RiCloseCircleFill /> Failed
                      </span>
                    )}
                  </td>

                  {/* Logistics Status */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase border tracking-widest transition-all ${statusBadge(order.orderStatus)}`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>

                  {/* Timeline */}
                  <td className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                    {new Date(order.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>

                  {/* Row Actions */}
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsViewOpen(true);
                        }}
                        title="Inspect Log"
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-xl transition-all active:scale-90"
                      >
                        <RiEyeLine size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {loading && (
          <div className="p-16 text-center bg-white">
            <Loader />
          </div>
        )}
      </div>

      {isViewOpen && selectedOrder && (
        <div className="fixed inset-0 z-[100] bg-gray-900/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 transition-all duration-500">
          <div className="bg-white w-full max-w-5xl rounded-[3rem] shadow-2xl max-h-[90vh] flex flex-col overflow-hidden border border-white/20 animate-in slide-in-from-bottom-4 duration-500">
            {/* ===================== HEADER ===================== */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-50 bg-white sticky top-0 z-20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-200">
                  <RiShoppingBag3Fill size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight leading-none">
                    Order <span className="text-red-500">Manifest</span>
                  </h2>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1.5 italic opacity-70">
                    Reference: #{selectedOrder._id.slice(-12).toUpperCase()}
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

            {/* ===================== BODY ===================== */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar bg-[#F9FAFB]/50 space-y-8">
              {/* TOP SECTION: CUSTOMER & LOGISTICS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Identity */}
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3 border-b border-gray-50 pb-3 mb-4">
                    <RiUser3Fill className="text-red-500" />
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Buyer Information
                    </h3>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-black text-gray-900 uppercase">
                      {selectedOrder.shippingAddress.name}
                    </p>
                    <p className="text-xs font-bold text-gray-500 italic">
                      {selectedOrder.user?.email}
                    </p>
                    <p className="text-xs font-black text-red-500 mt-2 flex items-center gap-1">
                      <RiPhoneFill size={12} />{" "}
                      {selectedOrder.shippingAddress.phone}
                    </p>
                  </div>
                </div>

                {/* Delivery Coordinates */}
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3 border-b border-gray-50 pb-3 mb-4">
                    <RiMapPin2Fill className="text-red-500" />
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Shipment Destination
                    </h3>
                  </div>
                  <p className="text-xs font-bold text-gray-600 leading-relaxed uppercase tracking-tight italic">
                    {selectedOrder.shippingAddress.address},<br />
                    {selectedOrder.shippingAddress.city},{" "}
                    {selectedOrder.shippingAddress.state} —{" "}
                    {selectedOrder.shippingAddress.pincode}
                  </p>
                </div>
              </div>

              {/* STATUS TILES */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Payment Methodology */}
                <div className="bg-gray-900 rounded-[2rem] p-6 text-white relative overflow-hidden shadow-xl">
                  <RiBankCardFill className="absolute -right-2 -bottom-2 text-white/5 text-7xl" />
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">
                    Gateway Method
                  </p>
                  <p className="text-lg font-black italic uppercase leading-none">
                    {selectedOrder.payment.method}
                  </p>
                  <p className="text-[10px] text-gray-500 mt-2 truncate">
                    ID: {selectedOrder.payment.paymentId || "INTERNAL_RECORD"}
                  </p>
                </div>

                {/* Billing State */}
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-between">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">
                    Financial Status
                  </p>
                  {selectedOrder.payment.status === "paid" ? (
                    <div className="flex items-center gap-2 text-emerald-600 font-black uppercase text-sm italic">
                      <RiCheckboxCircleFill size={20} /> Payment Cleared
                    </div>
                  ) : selectedOrder.payment.status === "pending" ? (
                    <div className="flex items-center gap-2 text-amber-600 font-black uppercase text-sm italic">
                      <RiCheckboxCircleFill size={20} /> Awaiting Settlement
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-rose-600 font-black uppercase text-sm italic">
                      <RiCloseCircleFill size={20} /> Transaction Failed
                    </div>
                  )}
                </div>

                {/* Order Lifecycle */}
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-between">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">
                    Logistics Stage
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

              {/* ITEM MANIFEST */}
              <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="bg-gray-50/50 px-8 py-4 border-b border-gray-100">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    Package itemization
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
                          ₹{item.price.toLocaleString()} per unit ×{" "}
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

                {/* INVOICE SUMMARY FOOTER */}
                <div className="bg-red-50/50 px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-red-100">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">
                      Total Valuation:
                    </span>
                    <span className="text-2xl font-black text-gray-900 italic">
                      ₹{selectedOrder.totalAmount.toLocaleString()}
                    </span>
                  </div>
                  <div
                    className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase border ${selectedOrder.isPaid ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-rose-50 text-rose-600 border-rose-200"}`}
                  >
                    Account State:{" "}
                    {selectedOrder.isPaid ? "Fully Paid" : "Unpaid Balance"}
                  </div>
                </div>
              </div>

              {/* SYSTEM AUDIT LOGS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
                <AuditLog label="Created" date={selectedOrder.createdAt} />
                <AuditLog
                  label="Settled"
                  date={selectedOrder.paidAt}
                  active={selectedOrder.isPaid}
                />
                <AuditLog
                  label="Dispatched"
                  date={selectedOrder.shippedAt}
                  active={!!selectedOrder.shippedAt}
                />
                <AuditLog
                  label="Completed"
                  date={selectedOrder.deliveredAt}
                  active={selectedOrder.orderStatus === "delivered"}
                />
              </div>
            </div>

            {/* ===================== FOOTER ===================== */}
            <div className="px-8 py-6 border-t border-gray-50 bg-white flex justify-end">
              <button
                onClick={() => setIsViewOpen(false)}
                className="px-10 py-4 bg-gray-900 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-gray-200 hover:bg-red-500 transition-all active:scale-95"
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

export default MyOrders;
