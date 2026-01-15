import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  RiDashboardLine,
  RiUser3Line,
  RiStore2Line,
  RiShoppingBag3Line,
  RiBox3Line,
  RiMoneyRupeeCircleLine,
} from "react-icons/ri";
import { TbCategoryPlus } from "react-icons/tb";

/* ===================== LINK ===================== */
const SidebarLink = ({ to, Icon, label, collapsed, onClick }) => {
  const location = useLocation();
  const isActive =
    location.pathname === to || location.pathname.startsWith(to + "/");

  return (
    <Link
      to={to}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={`group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
        transition-all duration-200 ease-out
        ${
          isActive
            ? "bg-red-50 text-red-600"
            : "text-gray-700 hover:bg-gray-100"
        }
        ${collapsed ? "justify-center px-2" : ""}
      `}
    >
      <Icon
        className={`text-lg min-w-[20px] transition-transform duration-200
          ${collapsed ? "scale-110" : "group-hover:scale-110"}
        `}
      />

      {!collapsed && <span className="truncate">{label}</span>}

      {/* TOOLTIP (FIXED – NO OVERFLOW) */}
      {collapsed && (
        <span
          className="
      pointer-events-none fixed
      left-[80px] top-[var(--tooltip-y)]
      hidden md:block opacity-0 group-hover:opacity-100
      bg-gray-900 text-white text-xs rounded px-2 py-1
      whitespace-nowrap shadow-lg
      transition-opacity z-[9999]
    "
        >
          {label}
        </span>
      )}
    </Link>
  );
};

/* ===================== SECTION ===================== */
const SidebarSection = ({ title, collapsed, children }) => {
  if (collapsed) return <div className="space-y-1">{children}</div>;

  return (
    <div className="space-y-1">
      <p className="px-3 pt-3 pb-1 text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
        {title}
      </p>
      {children}
    </div>
  );
};

/* ================= SUPER ADMIN ================= */
export const SuperAdminSidebar = (
  <>
    <SidebarSection title="Analytics">
      <SidebarLink to="/superadmin" Icon={RiDashboardLine} label="Overview" />
    </SidebarSection>

    <SidebarSection title="Manage">
      <SidebarLink to="/superadmin/users" Icon={RiUser3Line} label="Users" />
      <SidebarLink
        to="/superadmin/sellers"
        Icon={RiStore2Line}
        label="Sellers"
      />
      <SidebarLink
        to="/superadmin/orders"
        Icon={RiShoppingBag3Line}
        label="Orders"
      />
    </SidebarSection>
  </>
);

/* ================= ADMIN ================= */
export const AdminSidebar = (
  <>
    <SidebarSection title="Analytics">
      <SidebarLink to="/admin" Icon={RiDashboardLine} label="Dashboard" />
    </SidebarSection>

    <SidebarSection title="Manage">
      <SidebarLink
        to="/admin/getSellerRequests"
        Icon={RiUser3Line}
        label="Seller Requests"
      />
      <SidebarLink to="/admin/products" Icon={RiBox3Line} label="Products" />
      <SidebarLink
        to="/admin/orders"
        Icon={RiShoppingBag3Line}
        label="Orders"
      />
      <SidebarLink
        to="/admin/categories"
        Icon={TbCategoryPlus}
        label="Categories"
      />
    </SidebarSection>
  </>
);

/* ================= SELLER ================= */
export const SellerSidebar = (
  <>
    <SidebarSection title="Analytics">
      <SidebarLink to="/seller" Icon={RiDashboardLine} label="Dashboard" />
      <SidebarLink
        to="/seller/earnings"
        Icon={RiMoneyRupeeCircleLine}
        label="Earnings"
      />
    </SidebarSection>

    <SidebarSection title="Manage">
      <SidebarLink
        to="/seller/products"
        Icon={RiBox3Line}
        label="My Products"
      />
      <SidebarLink
        to="/seller/orders"
        Icon={RiShoppingBag3Line}
        label="My Orders"
      />
    </SidebarSection>
  </>
);
