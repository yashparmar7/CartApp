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

  const handleLogout = () => {
    dispatch(logoutAsync());
    navigate("/login");
    toast.success("Logout successful!");
    setOpen(false);
  };

  return (
    <>
      <header className="text-gray-600 body-font sticky top-0 z-50 bg-gray-50 shadow">
        <div className="container mx-auto flex items-center p-5">
          <Link
            to="/"
            className="flex title-font font-medium items-center text-gray-900"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
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

          <nav className="hidden md:flex md:items-center md:ml-auto md:mr-auto font-semibold">
            <Link className="mr-10 hover:text-red-500" to="/">
              Home
            </Link>
            <Link className="mr-10 hover:text-red-500" to="/shop">
              Shop
            </Link>
            <Link className="mr-10 hover:text-red-500" to="/about">
              About
            </Link>
            <Link className="mr-10 hover:text-red-500" to="/contact">
              Contact
            </Link>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <Link
              to="/cart"
              className="relative bg-gray-100 p-2 rounded hover:bg-gray-200"
            >
              <IoCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 rounded-full">
                2
              </span>
            </Link>
            <button
              onClick={() => setOpen(true)}
              className="md:hidden ml-3 text-3xl"
            >
              <IoMenu />
            </button>

            <div className="hidden md:flex items-center gap-2">
              {!user ? (
                <>
                  <Link
                    to="/login"
                    className="inline-flex items-center font-semibold bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="inline-flex items-center font-semibold bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <span className="text-sm font-semibold">
                    Hi, {user.userName}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center font-semibold bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0"
                  >
                    Logout <HiOutlineLogout className="ml-2" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white z-50 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b-2 border-red-500">
          <span className="font-semibold text-lg">
            {user ? `Hello, ${user.userName}` : "Menu"}
          </span>
          <button onClick={() => setOpen(false)}>
            <IoClose size={22} />
          </button>
        </div>

        <nav className="flex flex-col text-gray-700">
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

          {!user ? (
            <>
              <Link
                onClick={() => setOpen(false)}
                className="px-4 py-3 border-b border-gray-300 text-left text-red-500 font-semibold"
                to="/login"
              >
                Login
              </Link>
              <Link
                onClick={() => setOpen(false)}
                className="px-4 py-3 text-left text-red-500 font-semibold"
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
