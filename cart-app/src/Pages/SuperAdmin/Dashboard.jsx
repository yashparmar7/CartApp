import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../features/role/roleSlice";
import Loader from "../../components/Loader";

// Icons
import {
  RiUser3Fill,
  RiStore2Fill,
  RiShoppingBag3Fill,
  RiMoneyRupeeCircleFill,
  RiArrowRightUpLine,
  RiInformationLine,
} from "react-icons/ri";

const SuperAdminDashboard = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.role);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const stats = [
    {
      label: "Platform Users",
      value: users?.length || 0,
      icon: RiUser3Fill,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      trend: "+14%",
    },
    {
      label: "Active Sellers",
      value: "56",
      icon: RiStore2Fill,
      color: "text-red-500",
      bgColor: "bg-red-50",
      trend: "+2.5%",
    },
    {
      label: "Global Orders",
      value: "3,120",
      icon: RiShoppingBag3Fill,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      trend: "+18%",
    },
    {
      label: "Total Revenue",
      value: "₹8.4L",
      icon: RiMoneyRupeeCircleFill,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      trend: "+12%",
      isHighlighted: true,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* 1. WELCOME HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">
            Platform <span className="text-red-500">Overview</span>
          </h1>
          <p className="text-gray-500 text-sm font-medium">
            System-wide analytics and user activity across all roles.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 bg-white border border-gray-100 px-4 py-2 rounded-xl shadow-sm">
          <RiInformationLine className="text-red-500 text-sm" />
          LAST UPDATED: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {loading && <Loader />}
      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold">
          {error}
        </div>
      )}

      {/* 2. STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="group bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 relative overflow-hidden"
          >
            <div className="flex justify-between items-start relative z-10">
              <div className={`p-3 rounded-2xl ${stat.bgColor} ${stat.color} transition-all duration-500`}>
                <stat.icon size={24} />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">
                <RiArrowRightUpLine />
                {stat.trend}
              </div>
            </div>

            <div className="mt-6 relative z-10">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-1">
                {stat.label}
              </p>
              <h2 className={`text-3xl font-black tracking-tight ${stat.isHighlighted ? 'text-emerald-600' : 'text-gray-900'}`}>
                {stat.value}
              </h2>
            </div>

            {/* Background Decorative Icon */}
            <stat.icon className="absolute -right-4 -bottom-4 text-gray-50 text-8xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          </div>
        ))}
      </div>

      {/* 3. PLACEHOLDER FOR SYSTEM LOGS / RECENT ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Platform Traffic</h3>
            <button className="text-[10px] font-black text-red-500 hover:underline uppercase">View Report</button>
          </div>
          <div className="h-64 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 flex items-center justify-center">
             <p className="text-gray-400 font-bold text-sm">System Logs & Growth Chart</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-8">Role Distribution</h3>
          <div className="space-y-6">
            <RoleProgress label="Sellers" percent={30} color="bg-red-500" />
            <RoleProgress label="Customers" percent={65} color="bg-blue-500" />
            <RoleProgress label="Admins" percent={5} color="bg-gray-900" />
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- MINI COMPONENTS --- */

const RoleProgress = ({ label, percent, color }) => (
  <div>
    <div className="flex justify-between text-[10px] font-black uppercase mb-2">
      <span className="text-gray-500 tracking-wider">{label}</span>
      <span className="text-gray-900">{percent}%</span>
    </div>
    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full transition-all duration-1000`} style={{ width: `${percent}%` }} />
    </div>
  </div>
);

export default SuperAdminDashboard;