import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { getUserOrders, cancelOrder } from "../../features/order/orderSlice";
import Loader from "../../components/Loader";
import Footer from "../../components/Footer";
import { FaPhoneAlt } from "react-icons/fa";
import toast from "react-hot-toast";

const statusColor = (status) => {
  if (status === "placed") return "bg-yellow-100 text-yellow-700";
  if (status === "confirmed") return "bg-blue-100 text-blue-700";
  if (status === "shipped") return "bg-purple-100 text-purple-700";
  if (status === "delivered") return "bg-emerald-100 text-emerald-700";
  if (status === "cancelled") return "bg-rose-100 text-rose-700";
  return "bg-neutral-100 text-neutral-600";
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
    <>
      <Navbar />

      <section className="min-h-screen bg-neutral-50 py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* HEADER */}
          <div className="mb-10">
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
              My Orders
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              Track purchases, payments & deliveries
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-8 rounded-xl bg-red-50 ring-1 ring-red-200 px-5 py-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* EMPTY */}
          {orders?.length === 0 ? (
            <div className="rounded-2xl bg-white ring-1 ring-neutral-200 p-12 text-center">
              <h2 className="text-lg font-semibold text-neutral-900">
                No orders yet
              </h2>
              <p className="text-sm text-neutral-500 mt-2">
                Your future purchases will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className={`rounded-2xl bg-white ring-1 ring-neutral-200 overflow-hidden ${
                    order.orderStatus === "cancelled" ? "opacity-70" : ""
                  }`}
                >
                  {/* TOP */}
                  <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-200">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-neutral-400">
                        Order ID
                      </p>
                      <p className="text-sm font-medium text-neutral-900 break-all">
                        {order._id}
                      </p>
                      <p className="text-xs text-neutral-500 mt-1">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium capitalize ring-1 ${statusColor(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus}
                      </span>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ring-1 ${
                          order.isPaid
                            ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                            : "bg-neutral-100 text-neutral-600 ring-neutral-200"
                        }`}
                      >
                        {order.isPaid ? "Paid" : "Cash on Delivery"}
                      </span>

                      {(order.orderStatus === "placed" ||
                        order.orderStatus === "confirmed") && (
                        <button
                          onClick={() => setCancelTarget(order)}
                          className="text-xs font-medium rounded-full ring-1 px-3 py-1 ring-red-300 text-red-600 hover:text-red-700 transition"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>

                  {/* ITEMS */}
                  <div className="px-6 py-5 space-y-4">
                    {order.items.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 rounded-xl bg-neutral-50 px-4 py-3"
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-16 h-16 rounded-lg object-cover ring-1 ring-neutral-200"
                        />

                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-neutral-900 truncate">
                            {item.title}
                          </h3>
                          <p className="text-xs text-neutral-500 mt-0.5">
                            Quantity × {item.quantity}
                          </p>
                        </div>

                        <p className="text-sm font-semibold text-neutral-900">
                          ₹{item.price}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* ADDRESS + PAYMENT */}
                  <div className="px-6 pb-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl bg-neutral-50 p-4 ring-1 ring-neutral-200">
                      <p className="text-sm font-medium text-neutral-900 mb-2">
                        Shipping Address
                      </p>
                      <div className="text-sm text-neutral-600 space-y-1">
                        <p>{order.shippingAddress.name}</p>
                        <p>{order.shippingAddress.address}</p>
                        <p>
                          {order.shippingAddress.city},{" "}
                          {order.shippingAddress.state}
                        </p>
                        <p className="text-neutral-500">
                          <FaPhoneAlt className="inline mr-1 text-red-500" />
                          {order.shippingAddress.phone}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-xl bg-neutral-50 p-4 ring-1 ring-neutral-200">
                      <p className="text-sm font-medium text-neutral-900 mb-2">
                        Payment
                      </p>
                      <div className="text-sm text-neutral-600 space-y-1 capitalize">
                        <p>Method: {order.payment.method.toUpperCase()}</p>
                        <p>Status: {order.payment.status}</p>
                      </div>
                    </div>
                  </div>

                  {/* TOTAL */}
                  <div className="flex items-center justify-between px-6 py-4 bg-neutral-50 border-t border-neutral-200">
                    <p className="text-sm text-neutral-600">Total</p>
                    <p className="text-xl font-semibold text-neutral-900">
                      ₹{order.totalAmount}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CANCEL CONFIRMATION MODAL */}
      {cancelTarget && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-neutral-900">
              Cancel this order?
            </h3>
            <p className="text-sm text-neutral-500 mt-2">
              This action cannot be undone. Any refund will be processed
              automatically.
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setCancelTarget(null)}
                className="px-4 py-2 text-sm rounded-lg ring-1 ring-neutral-300 text-neutral-700 hover:bg-neutral-100"
              >
                Keep Order
              </button>

              <button
                onClick={handleCancelOrder}
                className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default MyOrderPage;
