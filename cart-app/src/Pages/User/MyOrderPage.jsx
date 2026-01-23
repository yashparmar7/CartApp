import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { getUserOrders, cancelOrder } from "../../features/order/orderSlice";
import Loader from "../../components/Loader";
import { FaPhoneAlt, FaBox, FaChevronRight } from "react-icons/fa";
import { RiCalendarLine, RiWalletLine, RiTruckLine } from "react-icons/ri";
import toast from "react-hot-toast";

const statusColor = (status) => {
  const colors = {
    placed: "bg-yellow-50 text-yellow-600 border-yellow-200",
    confirmed: "bg-blue-50 text-blue-600 border-blue-200",
    shipped: "bg-purple-50 text-purple-600 border-purple-200",
    delivered: "bg-emerald-50 text-emerald-600 border-emerald-200",
    cancelled: "bg-red-50 text-red-600 border-red-200",
  };
  return colors[status] || "bg-gray-50 text-gray-600 border-gray-200";
};

const MyOrderPage = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.order);
  const [cancelTarget, setCancelTarget] = useState(null);

  useEffect(() => {
    dispatch(getUserOrders());
  }, [dispatch]);

  const handleCancelOrder = async () => {
    try {
      await dispatch(cancelOrder(cancelTarget._id)).unwrap();
      toast.success("Order cancelled successfully");
      setCancelTarget(null);
      dispatch(getUserOrders());
    } catch (err) {
      toast.error(err || "Failed to cancel order");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">MY ORDERS</h1>
            <p className="text-gray-500 text-sm mt-1">Check the status of your recent and past orders.</p>
          </div>
          <div className="text-xs font-bold text-gray-400 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
            TOTAL ORDERS: {orders?.length || 0}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
            <span className="font-bold">Error:</span> {error}
          </div>
        )}

        {/* EMPTY STATE */}
        {orders?.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-16 text-center shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaBox className="text-gray-300 text-3xl" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">No orders found</h2>
            <p className="text-gray-500 mt-2 mb-6">Looks like you haven't ordered anything yet.</p>
            <button 
              onClick={() => window.location.href = '/shop'}
              className="bg-red-500 text-white px-8 py-3 rounded-lg font-bold shadow-lg shadow-red-200 hover:bg-red-600 transition"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div 
                key={order._id}
                className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all hover:border-red-200 ${
                  order.orderStatus === "cancelled" ? "grayscale-[0.5] opacity-80" : ""
                }`}
              >
                {/* 1. ORDER TOP STRIP */}
                <div className="bg-gray-50/50 px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-gray-100">
                  <div className="flex gap-6">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order Placed</p>
                      <div className="flex items-center gap-1 text-sm font-semibold text-gray-700">
                        <RiCalendarLine className="text-red-500" />
                        {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric'})}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order ID</p>
                      <p className="text-sm font-mono text-gray-600">#{order._id.slice(-8).toUpperCase()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-md text-[11px] font-black uppercase border ${statusColor(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                    {(order.orderStatus === "placed" || order.orderStatus === "confirmed") && (
                      <button 
                        onClick={() => setCancelTarget(order)}
                        className="text-[11px] font-bold text-red-500 hover:underline"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>

                {/* 2. ORDER ITEMS */}
                <div className="p-6">
                  <div className="space-y-4">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex gap-4 items-center group">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-20 h-20 rounded-lg object-contain bg-gray-50 border border-gray-100 group-hover:scale-105 transition" 
                        />
                        <div className="flex-1">
                          <h3 className="text-sm font-bold text-gray-900 group-hover:text-red-500 cursor-pointer">{item.title}</h3>
                          <p className="text-xs text-gray-500 mt-1 font-medium">Qty: {item.quantity} • Unit Price: ₹{item.price}</p>
                          <div className="mt-2 flex items-center gap-2 text-[10px] font-bold text-emerald-600">
                            <RiTruckLine /> Standard Delivery
                          </div>
                        </div>
                        <div className="text-right">
                           <p className="text-sm font-black text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. INFO GRID */}
                <div className="px-6 py-5 bg-gray-50/30 border-t border-gray-100 grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-[11px] font-bold text-gray-400 uppercase mb-2 flex items-center gap-1">
                      <RiTruckLine /> Shipping Address
                    </h4>
                    <div className="text-xs text-gray-600 leading-relaxed">
                      <p className="font-bold text-gray-800">{order.shippingAddress.name}</p>
                      <p>{order.shippingAddress.address}, {order.shippingAddress.city}</p>
                      <p className="flex items-center gap-1 mt-1 text-red-500 font-bold">
                        <FaPhoneAlt size={10} /> {order.shippingAddress.phone}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[11px] font-bold text-gray-400 uppercase mb-2 flex items-center gap-1">
                      <RiWalletLine /> Payment Details
                    </h4>
                    <div className="text-xs text-gray-600">
                      <p className="font-bold uppercase text-gray-800">{order.payment.method}</p>
                      <p className={order.isPaid ? "text-emerald-600 font-bold" : "text-orange-500 font-bold"}>
                        {order.isPaid ? "Transaction Successful" : "Payment Pending"}
                      </p>
                    </div>
                  </div>

                  <div className="md:text-right flex flex-col justify-center">
                    <p className="text-xs font-bold text-gray-500 uppercase">Grand Total</p>
                    <p className="text-2xl font-black text-gray-900">₹{order.totalAmount.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* CANCEL MODAL */}
      {cancelTarget && (
        <div className="fixed inset-0 z-[100] bg-gray-900/60 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-8 shadow-2xl scale-in-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaBox size={24} />
            </div>
            <h3 className="text-xl font-black text-gray-900 text-center">Cancel Order?</h3>
            <p className="text-sm text-gray-500 text-center mt-2 leading-relaxed">
              Are you sure you want to cancel this order? This action cannot be undone.
            </p>
            <div className="flex flex-col gap-3 mt-8">
              <button 
                onClick={handleCancelOrder}
                className="w-full bg-red-500 text-white py-3 rounded-xl font-bold hover:bg-red-600 transition shadow-lg shadow-red-100"
              >
                Yes, Cancel Order
              </button>
              <button 
                onClick={() => setCancelTarget(null)}
                className="w-full bg-gray-100 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-200 transition"
              >
                Keep Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrderPage;