import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RiBox3Fill, RiShoppingBag3Fill, RiMoneyRupeeCircleFill, RiArrowUpSLine, RiInformationLine } from "react-icons/ri";

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
  const [range, setRange] = useState(30);

  useEffect(() => {
    dispatch(getSellerMyProducts());
    dispatch(getSellerOrders());
  }, [dispatch]);

  const filteredOrders = useMemo(() => {
    if (!orders || orders.length === 0) return [];
    const now = new Date();
    return orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      const diffDays = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24);
      return diffDays <= range;
    });
  }, [orders, range]);

  const totalEarnings = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0) || 0;

  const stats = [
    {
      label: "My Inventory",
      value: myProducts?.length || 0,
      icon: RiBox3Fill,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      sub: "Active listings",
    },
    {
      label: "Orders Received",
      value: filteredOrders.length,
      icon: RiShoppingBag3Fill,
      color: "text-red-500",
      bgColor: "bg-red-50",
      sub: "In selected period",
    },
    {
      label: "Net Earnings",
      value: `₹${totalEarnings.toLocaleString("en-IN")}`,
      icon: RiMoneyRupeeCircleFill,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      sub: "Total revenue",
      isSuccess: true,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* 1. WELCOME & FILTER HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2 uppercase">
            Store Performance
          </h1>
          <p className="text-gray-500 text-sm font-medium">Monitoring your shop's growth and sales activity.</p>
        </div>
        <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 flex items-center">
          <DateRangeSwitch value={range} onChange={setRange} />
        </div>
      </div>

      {isLoading && <Loader />}

      {/* 2. STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
            <div className="flex items-start justify-between relative z-10">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <h2 className={`text-3xl font-black ${stat.isSuccess ? 'text-emerald-600' : 'text-gray-900'}`}>
                  {stat.value}
                </h2>
                <p className="text-[10px] font-bold text-gray-400 mt-2 flex items-center gap-1">
                   <RiInformationLine /> {stat.sub}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-2xl ${stat.bgColor} ${stat.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                <stat.icon />
              </div>
            </div>
            {/* Background Decoration */}
            <div className="absolute -right-2 -bottom-2 text-gray-50 opacity-10 group-hover:text-red-500 transition-colors">
              <stat.icon size={100} />
            </div>
          </div>
        ))}
      </div>

      {/* 3. CHART SECTIONS */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <SellerChartWrapper title="Revenue Analytics" sub="Income generated over time">
                <RevenueChart orders={filteredOrders} />
              </SellerChartWrapper>
            </div>
            <SellerChartWrapper title="Order Status" sub="Current fulfillment state">
              <OrdersStatusChart orders={filteredOrders} />
            </SellerChartWrapper>
          </div>

          <SellerChartWrapper title="Order Volume History" sub="Monthly sales distribution">
            <MonthlyOrdersChart orders={filteredOrders} />
          </SellerChartWrapper>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border-2 border-dashed border-gray-200 py-20 text-center">
          <RiShoppingBag3Fill className="mx-auto text-gray-200 text-6xl mb-4" />
          <h3 className="text-lg font-black text-gray-400 uppercase tracking-tight">No Sales Data</h3>
          <p className="text-sm text-gray-400 max-w-xs mx-auto mt-2">No orders found for the last {range} days. Try adjusting your filter or adding more products.</p>
        </div>
      )}
    </div>
  );
};

/* --- HELPER COMPONENTS --- */

const SellerChartWrapper = ({ title, sub, children }) => (
  <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
    <div className="mb-8 border-b border-gray-50 pb-4">
      <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">{title}</h3>
      <p className="text-[10px] font-bold text-gray-400 uppercase mt-1 tracking-tight">{sub}</p>
    </div>
    <div className="w-full">
      {children}
    </div>
  </div>
);

export default SellerDashboard;