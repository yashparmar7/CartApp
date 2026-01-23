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
} from "react-icons/ri";
import { FaTimesCircle } from "react-icons/fa";
import Loader from "../../components/Loader";
import { getSellerOrders } from "../../features/order/orderSlice";

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
       <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Store Revenue</p>
       <p className="text-sm font-black text-gray-900 italic tracking-tighter">
         ₹{orders.reduce((acc, curr) => acc + curr.totalAmount, 0).toLocaleString()}
       </p>
    </div>

    {/* Total Orders Badge */}
    <div className="bg-red-50 px-5 py-2.5 rounded-2xl border border-red-100 flex items-center gap-3 transition-all hover:bg-red-100 group">
      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-red-500 shadow-sm group-hover:scale-110 transition-transform">
        <RiFileList3Fill size={18} />
      </div>
      <div>
        <p className="text-[9px] font-black text-red-600 uppercase tracking-[0.1em] leading-none">Total Volume</p>
        <p className="text-lg font-black text-red-700 mt-0.5 leading-none">
          {orders.length} <span className="text-[10px] font-bold opacity-60 uppercase">Jobs</span>
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
            <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No Order Data Found</p>
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
                <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] leading-none">Record</span>
                <h3 className="text-sm font-black text-gray-900 uppercase mt-1 tracking-tighter">#{order._id.slice(-6)}</h3>
              </div>
              <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border tracking-widest ${statusBadge(order.orderStatus)}`}>
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
                   <p className="text-xs font-black text-gray-800 truncate uppercase tracking-tight">{order.items[0]?.title}</p>
                   <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">{order.user?.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 bg-gray-50/50 p-3 rounded-2xl border border-gray-100">
                <div>
                   <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Revenue</p>
                   <p className="text-xs font-black text-gray-900 italic">₹{order.totalAmount.toLocaleString()}</p>
                </div>
                <div>
                   <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Gateway</p>
                   <p className="text-xs font-black text-gray-900 uppercase">{order.payment?.method}</p>
                </div>
                <div className="col-span-2 pt-1">
                   <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Financial State</p>
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
                {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
              </span>
              <div className="flex gap-2">
                <button 
                  onClick={() => { setSelectedOrder(order); setIsViewOpen(true); }} 
                  className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm shadow-blue-100"
                >
                  <RiEyeLine size={18}/>
                </button>
              </div>
            </div>
          </div>
        ))}

        {loading && <div className="py-10 text-center"><Loader /></div>}
      </div>

      {/* ===================== DESKTOP TABLE (REDESIGNED) ===================== */}
      <div className="hidden lg:block bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="min-w-[1400px] w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                {[
                  "Order Log", "Account Holder", "Contact", "Primary Item", "Qty", 
                  "Transaction", "Method", "Billing Status", "Logistics", "Timeline", "Action"
                ].map((header) => (
                  <th key={header} className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50 font-medium text-sm">
              {!loading && orders.length === 0 && (
                <tr>
                  <td colSpan="11" className="py-24 text-center bg-gray-50/30">
                    <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-sm italic">Archive Empty</p>
                  </td>
                </tr>
              )}

              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50/50 transition-all duration-200 group">
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
                    <span className="text-sm font-black text-gray-900 leading-none tracking-tighter">₹{order.totalAmount.toLocaleString()}</span>
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
                    <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase border tracking-widest transition-all ${statusBadge(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </td>

                  {/* Timeline */}
                  <td className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                    {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric'})}
                  </td>

                  {/* Row Actions */}
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => { setSelectedOrder(order); setIsViewOpen(true); }} title="Inspect Log" className="p-2 text-blue-600 hover:bg-blue-100 rounded-xl transition-all active:scale-90"><RiEyeLine size={18} /></button>
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

export default MyOrders;
