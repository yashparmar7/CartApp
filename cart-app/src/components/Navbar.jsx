import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoCart, IoMenu, IoClose } from "react-icons/io5";
import { HiOutlineLogout } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { logoutAsync } from "../features/auth/authSlice";
import toast from "react-hot-toast";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  const handleLogout = () => {
    dispatch(logoutAsync());
    navigate("/login");
    toast.success("Logout successful!");
    setOpen(false);
  };

  return (
    <>
      {/* ===== HEADER ===== */}
      <header className="sticky top-0 z-50 bg-gray-50 shadow">
        <div className="container mx-auto flex items-center p-5">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center font-semibold text-gray-900"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-10 h-10 text-white p-2 bg-red-500 rounded-full"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            <span className="ml-3 text-xl">CartApp</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex md:ml-auto md:mr-auto font-semibold">
            <Link className="mr-8 hover:text-red-500" to="/">
              Home
            </Link>
            <Link className="mr-8 hover:text-red-500" to="/shop">
              Shop
            </Link>
            <Link className="mr-8 hover:text-red-500" to="/about">
              About
            </Link>
            <Link className="mr-8 hover:text-red-500" to="/contact">
              Contact
            </Link>
          </nav>

          {/* Right Side */}
          <div className="ml-auto flex items-center gap-2">
            {/* Cart */}
            <Link
              to="/cart"
              className="relative bg-gray-100 p-2 rounded hover:bg-gray-200"
            >
              <IoCart className="w-5 h-5" />
              {cart?.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 rounded-full">
                  {cart.length}
                </span>
              )}
            </Link>

            {/* Mobile Menu Btn */}
            <button
              onClick={() => setOpen(true)}
              className="md:hidden ml-2 text-3xl"
            >
              <IoMenu />
            </button>

            {/* Desktop Auth Area */}
            <div className="hidden md:flex items-center gap-2">
              {!user ? (
                <>
                  <Link
                    to="/login"
                    className="font-semibold bg-gray-100 py-1 px-3 rounded hover:bg-gray-200"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="font-semibold bg-gray-100 py-1 px-3 rounded hover:bg-gray-200"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <span className="text-sm font-semibold">
                    Hi, {user.userName}
                  </span>

                  {user.role === "USER" && (
                    <Link
                      to="/become-seller"
                      className="border border-red-500 text-red-500
                      py-1 px-3 rounded font-semibold
                      hover:bg-red-500 hover:text-white transition"
                    >
                      Become a Seller
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="flex items-center font-semibold bg-gray-100 py-1 px-3 rounded hover:bg-gray-200"
                  >
                    Logout <HiOutlineLogout className="ml-2" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white z-50
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-300">
          <span className="font-semibold text-lg">
            {user ? `Hello, ${user.userName}` : "Menu"}
          </span>
          <button onClick={() => setOpen(false)}>
            <IoClose size={22} />
          </button>
        </div>

        <nav className="flex flex-col">
          <Link
            onClick={() => setOpen(false)}
            className="px-4 py-3 border-b border-gray-300"
            to="/"
          >
            Home
          </Link>
          <Link
            onClick={() => setOpen(false)}
            className="px-4 py-3 border-b border-gray-300"
            to="/shop"
          >
            Shop
          </Link>
          <Link
            onClick={() => setOpen(false)}
            className="px-4 py-3 border-b border-gray-300"
            to="/about"
          >
            About
          </Link>
          <Link
            onClick={() => setOpen(false)}
            className="px-4 py-3 border-b border-gray-300"
            to="/contact"
          >
            Contact
          </Link>
          <Link
            onClick={() => setOpen(false)}
            className="px-4 py-3 border-b border-gray-300"
            to="/cart"
          >
            Cart
          </Link>

          {user && user.role === "USER" && (
            <Link
              onClick={() => setOpen(false)}
              className="px-4 py-3 border-b border-gray-300 text-red-500 font-semibold"
              to="/become-seller"
            >
              Become a Seller
            </Link>
          )}

          {!user ? (
            <>
              <Link
                onClick={() => setOpen(false)}
                className="px-4 py-3 text-red-500 font-semibold"
                to="/login"
              >
                Login
              </Link>
              <Link
                onClick={() => setOpen(false)}
                className="px-4 py-3 text-red-500 font-semibold"
                to="/signup"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="px-4 py-3 text-left text-red-500 font-semibold"
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </>
  );
};

export default Navbar;
