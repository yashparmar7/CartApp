import React from "react";
import { Link } from "react-router-dom";
import { TiTick } from "react-icons/ti";
import { RiShoppingCartFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/auth/authSlice";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [user, setUser] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(login(user)).unwrap();
      toast.success("Login successful!");
      navigate("/");
    } catch (err) {
      toast.error(err || "Login failed");
    }
  };

  return (
    <section className="min-h-screen bg-gray-50 flex items-center">
      <div className="container mx-auto px-5 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left – Branding / Benefits */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 leading-tight flex items-center gap-3">
              Welcome back <br />
              Let’s continue shopping
              {/* <RiShoppingCartFill className="text-red-500 text-4xl" /> */}
            </h1>

            <p className="mt-4 text-gray-600 text-lg">
              Login to manage your cart, track orders, and grab exclusive deals
              before they’re gone.
            </p>

            <ul className="mt-6 space-y-3 text-gray-700">
              <li className="flex items-center gap-2">
                <TiTick className="text-green-500 text-xl" />
                Saved cart items
              </li>
              <li className="flex items-center gap-2">
                <TiTick className="text-green-500 text-xl" />
                Order tracking
              </li>
              <li className="flex items-center gap-2">
                <TiTick className="text-green-500 text-xl" />
                Secure checkout
              </li>
              <li className="flex items-center gap-2">
                <TiTick className="text-green-500 text-xl" />
                Members-only offers
              </li>
            </ul>
          </div>

          {/* Right – Login Card */}
          <form onSubmit={handleSubmit}>
            <div className="bg-white shadow-xl rounded-xl p-8 max-w-md w-full mx-auto">
              <h2 className="text-2xl font-semibold text-gray-900 mb-1">
                Login
              </h2>
              <p className="text-sm text-gray-500 mb-6">Access your account</p>

              {/* Email */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  onChange={handleChange}
                  placeholder="abc@example.com"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none"
                />
              </div>

              {/* Password */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none"
                />
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between mb-6">
                <label className="flex items-center text-sm text-gray-600">
                  <input type="checkbox" className="mr-2 accent-red-500" />
                  Remember me
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-red-500 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* CTA */}
              <button className="w-full bg-red-500 text-white py-2.5 rounded-lg font-semibold hover:bg-red-600 transition">
                {loading ? "Logging in..." : "Login"}
              </button>

              {/* Divider */}
              <div className="flex items-center my-6">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="px-3 text-sm text-gray-400">OR</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Signup Link */}
              <p className="text-sm text-center text-gray-600">
                New here?{" "}
                <Link
                  to="/signup"
                  className="text-red-500 font-medium hover:underline"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
