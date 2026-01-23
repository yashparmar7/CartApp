import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../../features/auth/authSlice";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";

// Icons
import { RiUserAddFill, RiShieldCheckFill, RiFlashlightFill, RiGift2Fill } from "react-icons/ri";
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from "react-icons/fi";
import { TiTick } from "react-icons/ti";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(signup(formData)).unwrap();
      toast.success("Signup successful");
      navigate("/login"); 
    } catch (err) {
      toast.error(err || "Signup failed");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-white flex">
      {/* 1. LEFT SIDE: BRANDING (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-red-500 relative overflow-hidden items-center justify-center p-12">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -translate-x-1/4 translate-y-1/4" />

        <div className="relative z-10 max-w-lg text-white">
          <Link to="/" className="flex items-center gap-3 mb-12">
            <div className="bg-white p-2 rounded-xl">
              <RiFlashlightFill className="text-red-500 text-3xl" />
            </div>
            <span className="text-3xl font-black tracking-tighter uppercase">Cart<span className="text-red-200">App</span></span>
          </Link>

          <h1 className="text-5xl font-black leading-tight mb-6">
            Join the <br /> Shopping Revolution.
          </h1>
          <p className="text-red-100 text-lg mb-10 font-medium">
            Create an account today and unlock a personalized shopping experience with faster checkouts and smarter tracking.
          </p>

          <div className="space-y-4">
            <FeatureItem text="Early Access to Mega Sales" />
            <FeatureItem text="Save Unlimited Items to Wishlist" />
            <FeatureItem text="One-Click Express Checkout" />
            <FeatureItem text="Real-time Order Notifications" />
          </div>
        </div>
      </div>

      {/* 2. RIGHT SIDE: SIGNUP FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-gray-50 md:bg-white">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link to="/" className="flex items-center gap-2">
              <RiFlashlightFill className="text-red-500 text-4xl" />
              <span className="text-2xl font-black tracking-tighter uppercase text-gray-900">CartApp</span>
            </Link>
          </div>

          <div className="text-center md:text-left mb-8">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Sign Up</h2>
            <p className="text-gray-500 font-medium mt-2">Create your free shopper account now</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* User Name */}
            <div>
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Full Name</label>
              <div className="relative group">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                <input
                  type="text"
                  name="userName"
                  required
                  value={formData.userName}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 outline-none transition-all focus:border-red-500 focus:ring-4 focus:ring-red-500/10 font-medium"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Email Address</label>
              <div className="relative group">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 outline-none transition-all focus:border-red-500 focus:ring-4 focus:ring-red-500/10 font-medium"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Create Password</label>
              <div className="relative group">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 rounded-2xl border border-gray-200 outline-none transition-all focus:border-red-500 focus:ring-4 focus:ring-red-500/10 font-medium"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <p className="text-[11px] text-gray-500 leading-relaxed px-1">
              By signing up, you agree to our <span className="text-red-500 font-bold cursor-pointer underline">Terms of Service</span> and <span className="text-red-500 font-bold cursor-pointer underline">Privacy Policy</span>.
            </p>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-red-200 hover:bg-red-600 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Join Now"}
            </button>
          </form>

          {/* Bottom Link */}
          <div className="mt-10 text-center">
            <p className="text-gray-500 font-medium">
              Already a member?{" "}
              <Link to="/login" className="text-red-500 font-black hover:underline ml-1 uppercase text-sm tracking-tight">Login Instead</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-component for benefits
const FeatureItem = ({ text }) => (
  <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/10">
    <div className="bg-white text-red-500 rounded-full p-0.5">
      <TiTick size={20} />
    </div>
    <span className="text-sm font-bold text-white tracking-tight">{text}</span>
  </div>
);

export default SignupPage;