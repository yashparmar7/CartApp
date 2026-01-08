import React from "react";
import { Link } from "react-router-dom";
import { TiTick } from "react-icons/ti";
import { RiShoppingCartFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../../features/auth/authSlice";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";
const SignupPage = () => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error, loading } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(signup(formData)).unwrap();
      toast.success("Signup successful!");
      navigate("/");
    } catch (err) {
      toast.error(err || "Signup failed");
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <section className="min-h-screen bg-gray-50 flex items-center">
      <div className="container mx-auto px-5 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left – Ecommerce Content */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 leading-tight flex items-center gap-2">
              Create your account & <br />
              start shopping smarter
              {/* <RiShoppingCartFill className="text-red-500 text-4xl" /> */}
            </h1>

            <p className="mt-4 text-gray-600 text-lg">
              Join our cart app to track orders, save favorites, and get
              exclusive deals on every purchase.
            </p>

            <ul className="mt-6 space-y-3 text-gray-700">
              <li className="flex items-center gap-2">
                <TiTick className="text-green-500 text-xl" />
                Easy checkout experience
              </li>
              <li className="flex items-center gap-2">
                <TiTick className="text-green-500 text-xl" />
                Secure payments
              </li>
              <li className="flex items-center gap-2">
                <TiTick className="text-green-500 text-xl" />
                Fast order tracking
              </li>
              <li className="flex items-center gap-2">
                <TiTick className="text-green-500 text-xl" />
                Exclusive member discounts
              </li>
            </ul>
          </div>

          {/* Right – Signup Card */}
          <form onSubmit={handleSubmit}>
            <div className="bg-white shadow-xl rounded-xl p-8 max-w-md w-full mx-auto">
              <h2 className="text-2xl font-semibold text-gray-900 mb-1">
                Sign Up
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Create your free account
              </p>

              {/* User Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  User Name
                </label>
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  placeholder="User Name"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none"
                />
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="abc@example.com"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none"
                />
              </div>

              {/* Password */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none"
                />
              </div>

              {/* CTA */}
              <button className="w-full bg-red-500 text-white py-2.5 rounded-lg font-semibold hover:bg-red-600 transition">
                Create Account
              </button>

              {error && <p className="text-red-500 mt-4">{error}</p>}

              {/* Divider */}
              <div className="flex items-center my-6">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="px-3 text-sm text-gray-400">OR</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Login Link */}
              <p className="text-sm text-center text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-red-500 font-medium hover:underline"
                >
                  Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignupPage;
