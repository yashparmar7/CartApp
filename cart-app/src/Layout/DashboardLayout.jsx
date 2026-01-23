import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import {
  RiMenu3Fill,
  RiCloseLine,
  RiNotification3Line,
  RiSearchLine,
  RiFlashlightFill,
} from "react-icons/ri";
import LogoutButton from "../components/LogoutButton";

const DashboardLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-[#F9FAFB] overflow-hidden">
      {/* ================= MOBILE OVERLAY ================= */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`
          fixed md:static z-[70]
          h-screen bg-white border-r border-gray-200
          transition-all duration-300 ease-in-out
          flex flex-col
          ${collapsed ? "md:w-20" : "md:w-64"}
          w-72
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* ===== LOGO ===== */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-gray-100 shrink-0">
          <div
            className={`flex items-center gap-3 transition-all duration-300 ${
              collapsed ? "justify-center" : "justify-start"
            }`}
          >
            <div className="bg-red-500 p-2 rounded-lg shrink-0">
              <RiFlashlightFill className="text-white text-2xl" />
            </div>

            {!collapsed && (
              <span className="text-xl font-black tracking-tight text-gray-900 uppercase">
                Cart<span className="text-red-500">App</span>
              </span>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-2 text-gray-400 hover:text-red-500"
          >
            <RiCloseLine size={22} />
          </button>
        </div>

        {/* ===== SIDEBAR CONTENT ===== */}
        <div className="flex-1 px-3 py-6 overflow-y-auto no-scrollbar">
          {!collapsed && (
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-3">
              Main Menu
            </p>
          )}

          <nav className="space-y-1.5">
            {React.Children.map(children, (child) =>
              React.isValidElement(child)
                ? React.cloneElement(child, {
                    collapsed,
                    onLinkClick: () => setMobileOpen(false),
                  })
                : child,
            )}
          </nav>
        </div>

        {/* ===== LOGOUT ===== */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <LogoutButton collapsed={collapsed} />
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* ===== TOP BAR ===== */}
        <header className="h-20 bg-white border-b border-gray-200 px-4 md:px-8 flex items-center justify-between shrink-0 z-40">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 rounded-lg bg-gray-100 text-gray-600"
              onClick={() => setMobileOpen(true)}
            >
              <RiMenu3Fill size={20} />
            </button>

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:flex p-2 rounded-lg hover:bg-gray-100 text-gray-500"
            >
              <RiMenu3Fill
                size={20}
                className={`transition-transform duration-300 ${
                  collapsed ? "rotate-180" : ""
                }`}
              />
            </button>

            <div className="hidden md:block h-8 w-[1px] bg-gray-200 mx-2" />

            <h1 className="text-lg font-bold text-gray-900">Dashboard</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center bg-gray-100 rounded-xl px-3 py-2">
              <RiSearchLine className="text-gray-400" />
              <input
                className="bg-transparent ml-2 text-xs outline-none w-40"
                placeholder="Search..."
              />
            </div>

            <button className="relative p-2.5 rounded-xl bg-gray-100 text-gray-500">
              <RiNotification3Line size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>

            <div className="w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center font-bold text-gray-600">
              YP
            </div>
          </div>
        </header>

        {/* ===== PAGE CONTENT ===== */}
        <main className="flex-1 overflow-y-auto bg-[#F9FAFB] p-4 md:p-8">
          <div className="max-w-[1400px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
