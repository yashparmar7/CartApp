import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  RiDashboardFill,
  RiDashboardLine,
  RiUser3Fill,
  RiUser3Line,
  RiStore2Fill,
  RiStore2Line,
  RiShoppingBag3Fill,
  RiShoppingBag3Line,
  RiBox3Fill,
  RiBox3Line,
  RiMoneyRupeeCircleFill,
  RiMoneyRupeeCircleLine,
} from "react-icons/ri";
import { TbCategoryPlus } from "react-icons/tb";

/* ===================== SIDEBAR LINK ===================== */
const SidebarLink = ({ to, Icon, ActiveIcon, label, collapsed, onClick }) => {
  const location = useLocation();
  const isActive =
    location.pathname === to ||
    location.pathname.startsWith(to + "/");

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold
        transition-all duration-300 mx-2
        ${
          isActive
            ? "bg-red-50 text-red-600 shadow-sm shadow-red-100"
            : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
        }
        ${collapsed ? "justify-center px-0" : ""}
      `}
    >
      {/* Active Indicator */}
      {isActive && (
        <div className="absolute left-[-8px] w-1.5 h-6 bg-red-500 rounded-r-full" />
      )}

      {/* Icon */}
      <div className="flex items-center justify-center min-w-[24px]">
        {isActive ? (
          <ActiveIcon className="text-xl text-red-500" />
        ) : (
          <Icon className="text-xl text-gray-400 group-hover:text-red-500 transition-colors" />
        )}
      </div>

      {/* Label */}
      {!collapsed && <span className="truncate">{label}</span>}

      {/* Tooltip when collapsed */}
      {collapsed && (
        <div className="fixed left-20 hidden md:group-hover:flex items-center z-[9999] animate-in fade-in slide-in-from-left-2">
          <div className="bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-md px-3 py-1.5 shadow-xl whitespace-nowrap">
            {label}
          </div>
          <div className="w-2 h-2 bg-gray-900 rotate-45 -ml-1" />
        </div>
      )}
    </Link>
  );
};

/* ===================== SIDEBAR SECTION ===================== */
const SidebarSection = ({ title, collapsed, children }) => {
  return (
    <div className="mb-6">
      {!collapsed && (
        <p className="px-6 mb-3 text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">
          {title}
        </p>
      )}
      <div className="space-y-1.5">{children}</div>
    </div>
  );
};

/* ================= SUPER ADMIN SIDEBAR ================= */
export const SuperAdminSidebar = ({ collapsed, onLinkClick }) => {
  return (
    <>
      <SidebarSection title="Insights" collapsed={collapsed}>
        <SidebarLink
          to="/superadmin"
          Icon={RiDashboardLine}
          ActiveIcon={RiDashboardFill}
          label="Overview"
          collapsed={collapsed}
          onClick={onLinkClick}
        />
      </SidebarSection>

      <SidebarSection title="Control Center" collapsed={collapsed}>
        <SidebarLink
          to="/superadmin/users"
          Icon={RiUser3Line}
          ActiveIcon={RiUser3Fill}
          label="User Directory"
          collapsed={collapsed}
          onClick={onLinkClick}
        />
        <SidebarLink
          to="/superadmin/sellers"
          Icon={RiStore2Line}
          ActiveIcon={RiStore2Fill}
          label="Sellers List"
          collapsed={collapsed}
          onClick={onLinkClick}
        />
        <SidebarLink
          to="/superadmin/orders"
          Icon={RiShoppingBag3Line}
          ActiveIcon={RiShoppingBag3Fill}
          label="Global Orders"
          collapsed={collapsed}
          onClick={onLinkClick}
        />
      </SidebarSection>
    </>
  );
};

/* ================= ADMIN SIDEBAR ================= */
export const AdminSidebar = ({ collapsed, onLinkClick }) => {
  return (
    <>
      <SidebarSection title="Analytics" collapsed={collapsed}>
        <SidebarLink
          to="/admin"
          Icon={RiDashboardLine}
          ActiveIcon={RiDashboardFill}
          label="Dashboard"
          collapsed={collapsed}
          onClick={onLinkClick}
        />
      </SidebarSection>

      <SidebarSection title="Operations" collapsed={collapsed}>
        <SidebarLink
          to="/admin/getSellerRequests"
          Icon={RiUser3Line}
          ActiveIcon={RiUser3Fill}
          label="Seller Requests"
          collapsed={collapsed}
          onClick={onLinkClick}
        />
        <SidebarLink
          to="/admin/products"
          Icon={RiBox3Line}
          ActiveIcon={RiBox3Fill}
          label="Master Catalogs"
          collapsed={collapsed}
          onClick={onLinkClick}
        />
        <SidebarLink
          to="/admin/orders"
          Icon={RiShoppingBag3Line}
          ActiveIcon={RiShoppingBag3Fill}
          label="Customer Orders"
          collapsed={collapsed}
          onClick={onLinkClick}
        />
        <SidebarLink
          to="/admin/categories"
          Icon={TbCategoryPlus}
          ActiveIcon={TbCategoryPlus}
          label="Category Manager"
          collapsed={collapsed}
          onClick={onLinkClick}
        />
      </SidebarSection>
    </>
  );
};

/* ================= SELLER SIDEBAR ================= */
export const SellerSidebar = ({ collapsed, onLinkClick }) => {
  return (
    <>
      <SidebarSection title="My Store" collapsed={collapsed}>
        <SidebarLink
          to="/seller"
          Icon={RiDashboardLine}
          ActiveIcon={RiDashboardFill}
          label="Store Stats"
          collapsed={collapsed}
          onClick={onLinkClick}
        />
        <SidebarLink
          to="/seller/earnings"
          Icon={RiMoneyRupeeCircleLine}
          ActiveIcon={RiMoneyRupeeCircleFill}
          label="Revenue"
          collapsed={collapsed}
          onClick={onLinkClick}
        />
      </SidebarSection>

      <SidebarSection title="Inventory" collapsed={collapsed}>
        <SidebarLink
          to="/seller/products"
          Icon={RiBox3Line}
          ActiveIcon={RiBox3Fill}
          label="My Products"
          collapsed={collapsed}
          onClick={onLinkClick}
        />
        <SidebarLink
          to="/seller/orders"
          Icon={RiShoppingBag3Line}
          ActiveIcon={RiShoppingBag3Fill}
          label="My Orders"
          collapsed={collapsed}
          onClick={onLinkClick}
        />
      </SidebarSection>
    </>
  );
};
