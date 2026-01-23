import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../features/auth/authSlice";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";

// Icons
import { RiShieldCheckFill, RiFlashlightFill, RiTruckFill, RiCoupon3Fill } from "react-icons/ri";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

const LoginPage = () => {
  const [user, setUser] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await dispatch(login(user)).unwrap();
      toast.success("Welcome back!");
      const role = res?.user?.role;
      if (role === "ADMIN") navigate("/admin");
      else if (role === "SELLER") navigate("/seller");
      else if (role === "SUPERADMIN") navigate("/superadmin");
      else navigate("/");
    } catch (err) {
      toast.error(err || "Login failed");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-white flex">
      {/* 1. LEFT SIDE: BRANDING (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-red-500 relative overflow-hidden items-center justify-center p-12">
        {/* Background Decorative Circles */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-black/10 rounded-full translate-x-1/4 translate-y-1/4" />

        <div className="relative z-10 max-w-lg text-white">
          <Link to="/" className="flex items-center gap-3 mb-12">
            <div className="bg-white p-2 rounded-xl">
               <RiFlashlightFill className="text-red-500 text-3xl" />
            </div>
            <span className="text-3xl font-black tracking-tighter uppercase">Cart<span className="text-red-200">App</span></span>
          </Link>

          <h1 className="text-5xl font-black leading-tight mb-6">
            The Smartest Way <br /> to Shop.
          </h1>
          <p className="text-red-100 text-lg mb-10 font-medium">
            Join our community of over 10k+ shoppers and get access to exclusive daily deals and lightning-fast delivery.
          </p>

          <div className="grid grid-cols-2 gap-6">
            <BenefitItem icon={<RiShieldCheckFill />} title="Secure" desc="Verified Payments" />
            <BenefitItem icon={<RiTruckFill />} title="Fast" desc="Express Shipping" />
            <BenefitItem icon={<RiCoupon3Fill />} title="Offers" desc="Daily Discounts" />
            <BenefitItem icon={<RiFlashlightFill />} title="Smart" desc="Easy Tracking" />
          </div>
        </div>
      </div>

      {/* 2. RIGHT SIDE: LOGIN FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-gray-50 md:bg-white">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link to="/" className="flex items-center gap-2">
              <RiFlashlightFill className="text-red-500 text-4xl" />
              <span className="text-2xl font-black tracking-tighter uppercase">CartApp</span>
            </Link>
          </div>

          <div className="text-center md:text-left mb-10">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">LOGIN</h2>
            <p className="text-gray-500 font-medium mt-2">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Email Address</label>
              <div className="relative group">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                <input
                  type="email"
                  name="email"
                  required
                  onChange={handleChange}
                  placeholder="Enter you email"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 outline-none transition-all focus:border-red-500 focus:ring-4 focus:ring-red-500/10 font-medium"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1 block">Password</label>
                <Link to="/forgot-password" size="sm" className="text-xs font-bold text-red-500 hover:underline">Forgot?</Link>
              </div>
              <div className="relative group">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
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

            {/* Remember Me */}
            <label className="flex items-center gap-3 cursor-pointer group w-fit">
              <input type="checkbox" className="w-5 h-5 rounded-md border-gray-300 text-red-500 focus:ring-red-500 accent-red-500" />
              <span className="text-sm font-bold text-gray-600 group-hover:text-gray-900 transition-colors">Keep me logged in</span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-red-200 hover:bg-red-600 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Sign In"}
            </button>
          </form>

          {/* Bottom Link */}
          <div className="mt-10 text-center">
            <p className="text-gray-500 font-medium">
              Don't have an account?{" "}
              <Link to="/signup" className="text-red-500 font-black hover:underline ml-1 uppercase text-sm tracking-tight">Create Account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Component
const BenefitItem = ({ icon, title, desc }) => (
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl shrink-0">{icon}</div>
    <div>
      <h4 className="font-bold text-sm leading-none">{title}</h4>
      <p className="text-[10px] text-red-100 uppercase font-bold mt-1 tracking-wider">{desc}</p>
    </div>
  </div>
);

export default LoginPage;