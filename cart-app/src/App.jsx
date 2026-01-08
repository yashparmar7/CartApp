import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import store from "./app/store";

import DashboardLayout from "./Layout/DashboardLayout";
import {
  SuperAdminSidebar,
  AdminSidebar,
  SellerSidebar,
} from "./Layout/Sidebars";

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

function App() {
  return (
    <Provider store={store}>
      <Toaster />
      <BrowserRouter>
        <Routes>
          {/* User Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/become-seller" element={<BecomeSeller />} />

          {/* ADMIN */}
          <Route
            path="/admin"
            element={<DashboardLayout sidebar={AdminSidebar} />}
          >
            <Route index element={<AdminDashboard />} />
          </Route>

          <Route path="/admin/getSellerRequests" element={<SellerRequests />} />

          {/* SELLER */}
          <Route
            path="/seller"
            element={<DashboardLayout sidebar={SellerSidebar} />}
          >
            <Route index element={<SellerDashboard />} />
          </Route>
          {/* SUPER ADMIN */}
          <Route
            path="/superadmin"
            element={<DashboardLayout sidebar={SuperAdminSidebar} />}
          >
            <Route index element={<SuperAdminDashboard />} />
            {/* later: users, sellers, orders */}
          </Route>

          {/* Utils */}
          <Route path="/load" element={<Loader />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
