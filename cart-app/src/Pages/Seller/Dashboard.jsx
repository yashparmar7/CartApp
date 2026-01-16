import {
  RiBox3Line,
  RiShoppingBag3Line,
  RiMoneyRupeeCircleLine,
} from "react-icons/ri";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useMemo } from "react";

import Loader from "../../components/Loader";
import DateRangeSwitch from "../../components/DateRangeSwitch";

import { getSellerMyProducts } from "../../features/product/productSlice";
import { getSellerOrders } from "../../features/order/orderSlice";

import RevenueChart from "../../components/RevenueChart";
import OrdersStatusChart from "../../components/OrdersStatusChart";
import MonthlyOrdersChart from "../../components/MonthlyOrdersChart";

const SellerDashboard = () => {
  const dispatch = useDispatch();

  const { myProducts, isLoading } = useSelector((state) => state.product);
  const { orders } = useSelector((state) => state.order);

  /* ================= DATE RANGE ================= */
  const [range, setRange] = useState(30);

  useEffect(() => {
    dispatch(getSellerMyProducts());
    dispatch(getSellerOrders());
  }, [dispatch]);

  /* ================= FILTER ORDERS BY DATE ================= */
  const filteredOrders = useMemo(() => {
    if (!orders || orders.length === 0) return [];

    const now = new Date();

    return orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      const diffDays =
        (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24);

      return diffDays <= range;
    });
  }, [orders, range]);

  /* ================= REAL EARNINGS ================= */
  const totalEarnings =
    filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0) || 0;

  /* ================= STATS ================= */
  const stats = [
    {
      label: "My Products",
      value: myProducts?.length || 0,
      icon: RiBox3Line,
    },
    {
      label: "Orders",
      value: filteredOrders.length,
      icon: RiShoppingBag3Line,
    },
    {
      label: "Earnings",
      value: `₹${totalEarnings.toLocaleString("en-IN")}`,
      icon: RiMoneyRupeeCircleLine,
      highlight: true,
    },
  ];

  return (
    <>
      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading && <Loader />}

        {stats.map(({ label, value, icon: Icon, highlight }) => (
          <div
            key={label}
            className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm
                       hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">{label}</p>
              <Icon className="text-xl text-red-500" />
            </div>

            <h2
              className={`mt-3 text-3xl font-bold ${
                highlight ? "text-green-600" : "text-gray-800"
              }`}
            >
              {value}
            </h2>
          </div>
        ))}
      </div>

      {/* ================= HEADER + DATE FILTER ================= */}
      <div className="mt-10 mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Sales Overview
          </h2>
          <p className="text-sm text-gray-500">
            Performance for the selected period
          </p>
        </div>

        <DateRangeSwitch value={range} onChange={setRange} />
      </div>

      {/* ================= EMPTY STATE ================= */}
      {filteredOrders.length === 0 && (
        <div className="bg-white border border-dashed border-gray-300 rounded-xl p-8 text-center">
          <h3 className="text-lg font-semibold text-gray-800">
            No orders in this period
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Try selecting a different date range.
          </p>
        </div>
      )}

      {/* ================= CHARTS ================= */}
      {filteredOrders.length > 0 && (
        <>
          {/* ===== ROW 1: MONEY + STATUS ===== */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RevenueChart orders={filteredOrders} />
            </div>

            <OrdersStatusChart orders={filteredOrders} />
          </div>

          {/* ===== ROW 2: GROWTH ===== */}
          <div className="mt-6">
            <MonthlyOrdersChart orders={filteredOrders} />
          </div>
        </>
      )}
    </>
  );
};

export default SellerDashboard;
