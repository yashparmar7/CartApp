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

const SidebarLink = ({ to, Icon, label, collapsed, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition
        ${
          isActive
            ? "bg-red-50 text-red-600"
            : "text-gray-700 hover:bg-gray-100"
        }
      `}
    >
      <Icon className="text-lg min-w-[20px]" />

      {!collapsed && <span className="whitespace-nowrap">{label}</span>}
    </Link>
  );
};

/* SUPER ADMIN */
export const SuperAdminSidebar = (
  <>
    <SidebarLink to="/superadmin" Icon={RiDashboardLine} label="Overview" />
    <SidebarLink to="/superadmin/users" Icon={RiUser3Line} label="Users" />
    <SidebarLink to="/superadmin/sellers" Icon={RiStore2Line} label="Sellers" />
    <SidebarLink
      to="/superadmin/orders"
      Icon={RiShoppingBag3Line}
      label="Orders"
    />
  </>
);

/* ADMIN */
export const AdminSidebar = (
  <>
    <SidebarLink to="/admin" Icon={RiDashboardLine} label="Dashboard" />
    <SidebarLink
      to="/admin/getSellerRequests"
      Icon={RiUser3Line}
      label="Sellers Requests"
    />
    <SidebarLink to="/admin/products" Icon={RiBox3Line} label="Products" />
    <SidebarLink to="/admin/orders" Icon={RiShoppingBag3Line} label="Orders" />
  </>
);

/* SELLER */
export const SellerSidebar = (
  <>
    <SidebarLink to="/seller" Icon={RiDashboardLine} label="Dashboard" />
    <SidebarLink to="/seller/products" Icon={RiBox3Line} label="My Products" />
    <SidebarLink to="/seller/orders" Icon={RiShoppingBag3Line} label="Orders" />
    <SidebarLink
      to="/seller/earnings"
      Icon={RiMoneyRupeeCircleLine}
      label="Earnings"
    />
  </>
);
