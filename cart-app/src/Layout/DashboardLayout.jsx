import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { RiMenu2Line, RiCloseLine } from "react-icons/ri";

const DashboardLayout = ({ sidebar }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* ===== MOBILE OVERLAY ===== */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed md:static z-50
          h-screen bg-white border-r border-gray-300 shadow
          transition-all duration-300
          ${collapsed ? "md:w-20" : "md:w-64"}
          w-64
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          flex flex-col
        `}
      >
        <div className="h-16 flex items-center justify-between px-4 ">
          {!collapsed && (
            <span className="text-xl font-bold text-red-500">CartApp</span>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:block p-2 rounded hover:bg-gray-100"
          >
            <RiMenu2Line size={20} />
          </button>

          {/* Mobile close */}
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-2 rounded hover:bg-gray-100"
          >
            <RiCloseLine size={22} />
          </button>
        </div>

        {/* Sidebar items */}
        <nav className="flex-1 p-3 space-y-1">
          {React.Children.map(sidebar.props.children, (child) =>
            React.cloneElement(child, {
              collapsed,
              onClick: () => setMobileOpen(false),
            })
          )}
        </nav>
      </aside>

      {/* ===== MAIN ===== */}
      <div className="flex-1 flex flex-col md:ml-0">
        {/* NAVBAR */}
        <header className="h-16 bg-white border-b border-gray-300 px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded hover:bg-gray-100"
              onClick={() => setMobileOpen(true)}
            >
              <RiMenu2Line size={22} />
            </button>

            <h1 className="text-lg font-semibold text-gray-800">Dashboard</h1>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
