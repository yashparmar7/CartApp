import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import DashboardLayout from "./Layout/DashboardLayout";
import {
  SuperAdminSidebar,
  AdminSidebar,
  SellerSidebar,
} from "./Layout/Sidebars";
import ProtectRoutes from "./routes/ProtectRoutes";

/* User Pages */
import HomePage from "./Pages/User/HomePage";
import SignupPage from "./Pages/User/SignupPage";
import LoginPage from "./Pages/User/LoginPage";
import CartPage from "./Pages/User/CartPage";
import ShopPage from "./Pages/User/ShopPage";
import ContactPage from "./Pages/User/ContactPage";
import AboutPage from "./Pages/User/AboutPage";
import BecomeSeller from "./Pages/User/BecomeSeller";
import PageNotFound from "./Pages/User/PageNotFound";

/* Dashboards */
import AdminDashboard from "./Pages/Admin/Dashboard";
import SellerDashboard from "./Pages/Seller/Dashboard";
import SuperAdminDashboard from "./Pages/SuperAdmin/Dashboard";

/* Others */
import ProductDetailPage from "./components/ProductDetailPage";
import Loader from "./components/Loader";
import SellerRequests from "./Pages/Admin/SellerRequests";
import Products from "./Pages/Admin/Products";
import Category from "./Pages/Admin/Category";
import Orders from "./Pages/Admin/Orders";
import MyProducts from "./Pages/Seller/MyProducts";
import MyOrders from "./Pages/Seller/MyOrders";
import MyEarnings from "./Pages/Seller/MyEarnings";
import Users from "./Pages/SuperAdmin/Users";
import Sellers from "./Pages/SuperAdmin/Sellers";
import OrdersPage from "./Pages/SuperAdmin/Orders";
import CheckoutPage from "./Pages/User/CheckoutPage";
import MyOrderPage from "./Pages/User/MyOrderPage";

function App() {
  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Routes>
          {/* User Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />

          <Route path="/shop" element={<ShopPage />} />
          <Route path="/my-orders" element={<MyOrderPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/become-seller" element={<BecomeSeller />} />

          {/* ADMIN */}
          <Route
            path="/admin"
            element={
              <ProtectRoutes allowedRoles={["ADMIN"]}>
                <DashboardLayout sidebar={AdminSidebar} />
              </ProtectRoutes>
            }
          >
            <Route index element={<AdminDashboard />} />

            <Route
              path="/admin/getSellerRequests"
              element={<SellerRequests />}
            />

            <Route path="/admin/products" element={<Products />} />

            <Route path="/admin/orders" element={<Orders />} />

            <Route path="/admin/categories" element={<Category />} />
          </Route>

          {/* SELLER */}
          <Route
            path="/seller"
            element={
              <ProtectRoutes allowedRoles={["SELLER"]}>
                <DashboardLayout sidebar={SellerSidebar} />
              </ProtectRoutes>
            }
          >
            <Route index element={<SellerDashboard />} />
            <Route path="/seller/products" element={<MyProducts />} />
            <Route path="/seller/orders" element={<MyOrders />} />
            <Route path="/seller/earnings" element={<MyEarnings />} />
          </Route>
          {/* SUPER ADMIN */}
          <Route
            path="/superadmin"
            element={
              <ProtectRoutes allowedRoles={["SUPERADMIN"]}>
                <DashboardLayout sidebar={SuperAdminSidebar} />
              </ProtectRoutes>
            }
          >
            <Route index element={<SuperAdminDashboard />} />
            <Route path="/superadmin/users" element={<Users />} />
            <Route path="/superadmin/sellers" element={<Sellers />} />
            <Route path="/superadmin/orders" element={<OrdersPage />} />
          </Route>

          {/* Utils */}
          <Route path="/load" element={<Loader />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
