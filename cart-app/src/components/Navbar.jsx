import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  IoCartOutline,
  IoMenuOutline,
  IoCloseOutline,
  IoPersonOutline,
  IoSearchOutline,
  IoHeart,
  IoHeartOutline,
} from "react-icons/io5";
import { HiOutlineLogout } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { logoutAsync } from "../features/auth/authSlice";
import toast from "react-hot-toast";
import SearchBar from "./SearchBar";
import { FaHome } from "react-icons/fa";
import { RiFlashlightFill } from "react-icons/ri";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);

  const handleLogout = () => {
    dispatch(logoutAsync());
    navigate("/login");
    toast.success("Logout successful!");
    setOpen(false);
  };

  const getDashboardPath = (role) => {
    const paths = {
      ADMIN: "/admin",
      SUPERADMIN: "/superadmin",
      SELLER: "/seller",
    };
    return paths[role] || "/";
  };

  return (
    <>
      {/* Top Thin Bar (Optional - common in professional sites) */}
      <div className="bg-gray-900 text-white py-1.5 text-center text-[11px] md:text-xs font-medium tracking-wide">
        Free Shipping on all orders over ₹5000!{" "}
        <Link to="/shop" className="underline ml-1 text-red-400">
          Shop Now
        </Link>
      </div>

      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20 gap-4 md:gap-8">
            {/* 1. Logo */}
            <Link to="/" className="flex items-center group shrink-0">
              <div className="bg-red-500 p-2 rounded-xl group-hover:rotate-6 transition-transform">
                <RiFlashlightFill className="text-white text-3xl" />
              </div>
              <span className="ml-3 text-xl md:text-2xl font-black tracking-tighter text-gray-900 uppercase">
                Cart<span className="text-red-500">App</span>
              </span>
            </Link>

            <div className="hidden md:block flex-1 max-w-2xl">
              <div className="relative group">
                <SearchBar />
              </div>
            </div>

            {/* 3. Right Navigation */}
            <div className="flex items-center gap-3 md:gap-6">
              {/* Desktop Links */}
              <nav className="hidden lg:flex items-center gap-6 text-sm font-bold text-gray-600">
                <Link
                  className="hover:text-red-500 transition-colors"
                  to="/shop"
                >
                  Shop
                </Link>
                <Link
                  className="hover:text-red-500 transition-colors"
                  to="/my-orders"
                >
                  Orders
                </Link>
              </nav>

              <div className="h-6 w-[1px] bg-gray-200 hidden lg:block"></div>

              {/* User Account */}
              <div className="hidden md:flex items-center gap-4">
                {!user ? (
                  <div className="flex items-center gap-2">
                    <Link
                      to="/login"
                      className="text-sm font-bold text-gray-700 hover:text-red-500"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="bg-red-500 text-white text-sm font-bold px-5 py-2 rounded-md hover:bg-red-600 transition shadow-md shadow-red-100"
                    >
                      Sign Up
                    </Link>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] uppercase font-bold text-gray-400 leading-none">
                        Account
                      </span>
                      <span className="text-sm font-bold text-gray-900 leading-tight">
                        {user.userName}
                      </span>
                    </div>
                    {user?.role !== "USER" ? (
                      <Link
                        to={getDashboardPath(user?.role)}
                        className="text-xs bg-gray-100 hover:bg-red-50 text-red-600 px-3 py-1.5 rounded-full font-bold transition"
                      >
                        Dashboard
                      </Link>
                    ) : (
                      <Link
                        to="/become-seller"
                        className="text-xs text-red-500 font-bold hover:underline"
                      >
                        Seller Hub
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition"
                    >
                      <HiOutlineLogout size={20} />
                    </button>
                  </div>
                )}
              </div>

              {/* Cart Icon */}
              <Link
                to="/cart"
                className="relative group p-2 rounded-full hover:bg-gray-50 transition"
              >
                <IoCartOutline className="w-7 h-7 text-gray-700 group-hover:text-red-500" />
                {cart?.length > 0 && (
                  <span className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                    {cart.length}
                  </span>
                )}
              </Link>

              <Link
                to="/wishlist"
                className="relative group p-2 rounded-full hover:bg-gray-50 transition"
              >
                <IoHeartOutline className="w-7 h-7 text-gray-700 group-hover:text-red-500" />
                {wishlist?.length > 0 && (
                  <span className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setOpen(true)}
                className="md:hidden p-1 text-gray-800"
              >
                <IoMenuOutline size={32} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-[85%] max-w-xs bg-white z-[70] transform transition-transform duration-300 ease-in-out shadow-2xl ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex flex-col h-full">
          {/* Drawer Header */}
          <div className="bg-red-500 p-6 text-white">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-black italic tracking-tighter">
                CARTAPP
              </span>
              <button
                onClick={() => setOpen(false)}
                className="p-1 hover:bg-white/20 rounded-full"
              >
                <IoCloseOutline size={28} />
              </button>
            </div>
            {user ? (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center border border-white/30">
                  <IoPersonOutline size={24} />
                </div>
                <div>
                  <p className="text-xs opacity-80">Welcome back,</p>
                  <p className="font-bold text-lg leading-none">
                    {user.userName}
                  </p>
                </div>
              </div>
            ) : (
              <p className="font-bold">Welcome, Guest</p>
            )}
          </div>

          {/* Drawer Links */}
          <div className="flex-1 overflow-y-auto py-4">
            <div className="px-4 mb-4 md:hidden w-full overflow-hidden">
              <SearchBar />
            </div>

            <nav className="flex flex-col font-semibold text-gray-700">
              <MobileNavLink
                to="/"
                label="Home"
                icon={<FaHome className="w-5" />}
                close={() => setOpen(false)}
              />
              <MobileNavLink
                to="/shop"
                label="Shop All Products"
                close={() => setOpen(false)}
              />
              <MobileNavLink
                to="/my-orders"
                label="Track Orders"
                close={() => setOpen(false)}
              />
              <div className="h-[1px] bg-gray-100 my-2 mx-4"></div>
              {user && user.role !== "USER" && (
                <MobileNavLink
                  to={getDashboardPath(user.role)}
                  label="Dashboard"
                  close={() => setOpen(false)}
                />
              )}

              {user && user.role === "USER" && (
                <MobileNavLink
                  to="/become-seller"
                  label="Seller Hub"
                  close={() => setOpen(false)}
                />
              )}

              <MobileNavLink
                to="/about"
                label="About Us"
                close={() => setOpen(false)}
              />
              <MobileNavLink
                to="/contact"
                label="Help Center"
                close={() => setOpen(false)}
              />
            </nav>
          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t">
            {!user ? (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="text-center py-3 border border-gray-200 rounded-lg font-bold"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setOpen(false)}
                  className="text-center py-3 bg-red-500 text-white rounded-lg font-bold shadow-lg shadow-red-100"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gray-100 text-red-600 rounded-lg font-bold"
              >
                <HiOutlineLogout /> Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// Helper for mobile links
const MobileNavLink = ({ to, label, close }) => (
  <Link
    onClick={close}
    to={to}
    className="px-6 py-4 hover:bg-red-50 hover:text-red-500 transition-colors border-b border-gray-50 last:border-0"
  >
    {label}
  </Link>
);

export default Navbar;
