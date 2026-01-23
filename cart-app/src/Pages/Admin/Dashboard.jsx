import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  RiBox3Fill,
  RiShoppingBag3Fill,
  RiUser3Fill,
  RiArrowUpLine,
  RiArrowDownLine,
} from "react-icons/ri";

import { getAllProductsAdmin } from "../../features/product/productSlice";
import { fetchSellerRequests } from "../../features/sellerRequest/sellerRequestSlice";
import { getAllOrders } from "../../features/order/orderSlice";

import DateRangeSwitch from "../../components/DateRangeSwitch";

import RevenueChart from "../../components/RevenueChart";

import OrdersStatusChart from "../../components/OrdersStatusChart";

import MonthlyOrdersChart from "../../components/MonthlyOrdersChart";

import OrdersTrendChart from "../../components/OrdersTrendChart";

import OrderStatusBreakdown from "../../components/OrderStatusBreakdown";

import TopProductsChart from "../../components/TopProductsChart";

import TopSellersChart from "../../components/TopSellersChart";

import RevenueByMonthChart from "../../components/RevenueByMonthChart";
import SellerRequestStatusChart from "../../components/SellerRequestStatusChart";

import ProductsOrdersChart from "../../components/ProductsOrdersChart";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.product);
  const { requests } = useSelector((state) => state.sellerRequest);
  const { orders } = useSelector((state) => state.order);
  const [range, setRange] = useState(30);

  useEffect(() => {
    dispatch(getAllProductsAdmin());
    dispatch(fetchSellerRequests());
    dispatch(getAllOrders());
  }, [dispatch]);

  const approvedSellers =
    requests?.filter((r) => r.status === "APPROVED") || [];

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

  // Redesigned Stats Configuration
  const stats = [
    {
      label: "Total Products",
      value: products?.length || 0,
      icon: RiBox3Fill,
      trend: "+12%",
      isPositive: true,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Active Sellers",
      value: approvedSellers.length,
      icon: RiUser3Fill,
      trend: "+5%",
      isPositive: true,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      label: "Recent Orders",
      value: filteredOrders.length,
      icon: RiShoppingBag3Fill,
      trend: "-2%",
      isPositive: false,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            DASHBOARD OVERVIEW
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            Welcome back, Admin. Here's what's happening today.
          </p>
        </div>
        <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-100 inline-flex">
          <DateRangeSwitch value={range} onChange={setRange} />
        </div>
      </div>

      {/* 2. STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between">
              <div
                className={`p-3 rounded-2xl ${stat.bgColor} ${stat.color} transition-colors`}
              >
                <stat.icon size={24} />
              </div>
              <div
                className={`flex items-center gap-1 text-xs font-bold ${stat.isPositive ? "text-emerald-500" : "text-rose-500"}`}
              >
                {stat.isPositive ? <RiArrowUpLine /> : <RiArrowDownLine />}
                {stat.trend}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                {stat.label}
              </p>
              <h2 className="text-3xl font-black text-gray-900 mt-1">
                {stat.value.toLocaleString()}
              </h2>
            </div>
          </div>
        ))}
      </div>

      {/* 3. CHARTS LAYOUT */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-6">
          {/* Main Revenue Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <DashboardCard
              title="Revenue Performance"
              className="lg:col-span-2"
            >
              <RevenueChart orders={filteredOrders} />
            </DashboardCard>
            <DashboardCard title="Orders Trend">
              <OrdersTrendChart orders={filteredOrders} />
            </DashboardCard>
          </div>

          {/* Status Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardCard title="Order Status">
              <OrdersStatusChart orders={filteredOrders} />
            </DashboardCard>
            <DashboardCard title="Status Breakdown">
              <OrderStatusBreakdown orders={filteredOrders} />
            </DashboardCard>
            <DashboardCard title="Monthly Volume">
              <MonthlyOrdersChart orders={filteredOrders} />
            </DashboardCard>
          </div>

          {/* Extra Analytics Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardCard title="Revenue by Month">
              <RevenueByMonthChart orders={filteredOrders} />
            </DashboardCard>

            <DashboardCard title="Seller Request Status">
              <SellerRequestStatusChart requests={requests} />
            </DashboardCard>
          </div>

          {/* Ranking Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardCard title="Top Performing Products">
              <TopProductsChart products={products} orders={filteredOrders} />
            </DashboardCard>
            <DashboardCard title="Leading Sellers">
              <TopSellersChart
                sellers={approvedSellers}
                orders={filteredOrders}
              />
            </DashboardCard>
          </div>
          {/* Products vs Orders */}
          <div className="grid grid-cols-1">
            <DashboardCard title="Products vs Orders">
              <ProductsOrdersChart
                products={products}
                orders={filteredOrders}
              />
            </DashboardCard>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-gray-200">
          <RiShoppingBag3Fill className="mx-auto text-gray-200 text-6xl mb-4" />
          <h3 className="text-lg font-bold text-gray-400">
            No data found for this period
          </h3>
        </div>
      )}
    </div>
  );
};

// Helper Component for Chart Containers
const DashboardCard = ({ title, children, className = "" }) => (
  <div
    className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-50 flex flex-col ${className}`}
  >
    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-50 pb-4">
      {title}
    </h3>
    <div className="flex-1">{children}</div>
  </div>
);

export default AdminDashboard;
