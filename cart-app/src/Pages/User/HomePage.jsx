import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Components
import Navbar from "../../components/Navbar";
import Card from "../../components/Card";
import Footer from "../../components/Footer";
import Loader from "../../components/Loader";

// Assets
import heroImage from "../../assets/family-shop.png";

// Icons
import {
  RiFlashlightFill,
  RiTruckLine,
  RiRefund2Line,
  RiSecurePaymentLine,
  RiArrowRightLine,
  RiCoupon2Line,
} from "react-icons/ri";
import {
  MdPhoneAndroid,
  MdOutlineLocalGroceryStore,
  MdMoreHoriz,
} from "react-icons/md";
import { GiRunningShoe, GiLipstick } from "react-icons/gi";
import { FaTshirt, FaTv, FaHome, FaChevronRight } from "react-icons/fa";

import { getAllCategories } from "../../features/category/categorySlice";
import { getTopDeals, selectTopDeals } from "../../features/product/productSlice";

const iconMap = {
  Mobiles: MdPhoneAndroid,
  Fashion: FaTshirt,
  Electronics: FaTv,
  Shoes: GiRunningShoe,
  Beauty: GiLipstick,
  Home: FaHome,
  Grocery: MdOutlineLocalGroceryStore,
  More: MdMoreHoriz,
};

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { categories, loading, status } = useSelector(
    (state) => state.category,
  );
  const { topDealsStatus, topDeals } = useSelector((state) => state.product);
  const [countdown, setCountdown] = useState("");

useEffect(() => {
  const endTime = new Date();
  endTime.setHours(endTime.getHours() + 3);

  const timer = setInterval(() => {
    const now = new Date();
    const diff = endTime - now;

    if (diff <= 0) {
      clearInterval(timer);
      setCountdown("");
      return;
    }

    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);

    setCountdown(
      `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
    );
  }, 1000);

  return () => clearInterval(timer);
}, []);


  useEffect(() => {
    if (status === "idle") dispatch(getAllCategories());
    if (topDealsStatus === "idle") dispatch(getTopDeals());
  }, [dispatch, status, topDealsStatus]);

  const activeCategories = categories.filter((cat) => cat.isActive === true);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      {/* 1. CATEGORY STRIP (Flipkart Style) */}
      <nav className="bg-white border-b border-gray-200 shadow hidden md:block">
        <div className="max-w-[1400px] mx-auto px-4 py-3">
          <div className="flex justify-between items-center overflow-x-auto no-scrollbar">
            {activeCategories?.map((cat) => {
              const Icon = iconMap[cat?.name] || MdMoreHoriz;
              return (
                <div
                  key={cat._id}
                  onClick={() => navigate(`/shop?category=${cat.slug}`)}
                  className="flex flex-col items-center group cursor-pointer min-w-[80px]"
                >
                  <div className="p-2 rounded-full group-hover:bg-red-50 transition-colors">
                    <Icon className="text-2xl text-gray-700 group-hover:text-red-600" />
                  </div>
                  <span className="text-xs font-semibold text-gray-800 mt-1 group-hover:text-red-600">
                    {cat.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </nav>

      {/* 2. MODERN HERO SECTION */}
      <section className="relative bg-white md:bg-gray-100 py-4 md:px-4">
        <div className="max-w-[1400px] mx-auto overflow-hidden rounded-sm md:rounded-xl bg-gradient-to-r from-red-700 to-orange-600 h-[250px] md:h-[400px] flex items-center relative">
          <div className="z-10 px-8 md:px-16 w-full md:w-1/2">
            <span className="bg-yellow-400 text-black text-[10px] md:text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
              Limited Time Offer
            </span>
            <h1 className="text-2xl md:text-5xl font-black text-white mt-4 leading-tight">
              Upgrade Your <br /> Home Essentials
            </h1>
            <p className="text-white/80 mt-4 hidden md:block text-lg">
              Up to 60% off on top electronics and home decor.
            </p>
            <button
              onClick={() => navigate("/shop")}
              className="mt-6 bg-white text-red-700 font-bold py-2 px-6 md:py-3 md:px-10 rounded-md shadow-lg hover:bg-gray-100 transition-all flex items-center gap-2"
            >
              Shop Now <RiArrowRightLine />
            </button>
          </div>

          <div className="absolute right-0 bottom-0 md:top-0 w-1/2 h-full flex items-center justify-center opacity-40 md:opacity-100">
            <img
              src={heroImage}
              alt="Promo"
              className="object-contain h-[80%] md:h-[90%] drop-shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* 3. FEATURE CARDS */}
      <section className="max-w-[1400px] mx-auto px-4 -mt-8 relative z-20 hidden lg:block">
        <div className="grid grid-cols-4 gap-4">
          {[
            {
              icon: RiTruckLine,
              title: "Free Delivery",
              sub: "On orders over ₹5000",
            },
            {
              icon: RiRefund2Line,
              title: "Easy Returns",
              sub: "7-day money back",
            },
            {
              icon: RiSecurePaymentLine,
              title: "Secure Payment",
              sub: "100% protected",
            },
            {
              icon: RiCoupon2Line,
              title: "Special Offers",
              sub: "Get extra discounts",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 flex items-center gap-4"
            >
              <div className="bg-red-50 p-3 rounded-full text-red-600">
                <item.icon size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 leading-none">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-500 mt-1">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FLASH DEALS / PRODUCTS SECTION */}
      <section className="max-w-[1400px] mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <div className="flex items-center gap-3">
              <RiFlashlightFill className="text-yellow-500 text-2xl" />
              <h2 className="text-xl font-bold text-gray-800">Top Deals</h2>
              {countdown && (
                <div className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded font-mono hidden md:block">
                  {countdown}
                </div>
              )}
            </div>
            <button
              onClick={() => navigate("/shop")}
              className="bg-red-600 text-white text-sm px-4 py-1.5 rounded shadow hover:bg-red-700 transition"
            >
              View All
            </button>
          </div>

          <div className="p-4">{loading ? <Loader /> : <Card products={topDeals} />}</div>
        </div>
      </section>

      {/* 5. ENHANCED PROMO GRID (Professional Marketplace Style) */}
      <section className="max-w-[1400px] mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Multi-Category Grid (Amazon Style) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <h3 className="font-bold text-xl text-gray-900 mb-4 tracking-tight">
                Fashion Trends for You
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    label: "Men's Wear",
                    img: "https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=400&q=80",
                  },
                  {
                    label: "Women's Wear",
                    img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=400&q=80",
                  },
                  {
                    label: "Kids",
                    img: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=400&q=80",
                  },
                  {
                    label: "Accessories",
                    img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="cursor-pointer group">
                    <div className="bg-gray-50 rounded-lg overflow-hidden aspect-square mb-1">
                      <img
                        src={item.img}
                        alt={item.label}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <span className="text-[11px] font-bold text-gray-600 group-hover:text-red-500">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <button className="text-red-600 text-sm mt-6 font-bold flex items-center gap-1 hover:gap-2 transition-all">
              Explore More <RiArrowRightLine />
            </button>
          </div>

          {/* Card 2: High-Impact Promotional Card (Meesho/Flipkart Style) */}
          <div className="relative overflow-hidden bg-red-600 rounded-xl shadow-lg group p-8 flex flex-col justify-between text-white">
            {/* Background Decoration */}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>

            <div className="relative z-10">
              <span className="bg-yellow-400 text-black text-[10px] font-black px-2 py-1 rounded-md uppercase">
                Super Saver
              </span>
              <h3 className="text-3xl font-black mt-4 leading-tight">
                UP TO 70% OFF <br /> ON FIRST ORDER
              </h3>
              <p className="text-red-100 mt-3 text-sm font-medium">
                Use Code:{" "}
                <span className="text-white border-b-2 border-dashed border-white/50">
                  WELCOME10
                </span>
              </p>
            </div>

            <div className="relative z-10 mt-8">
              <div className="flex bg-white rounded-lg p-1 shadow-inner focus-within:ring-2 focus-within:ring-yellow-400 transition-all">
                <input
                  type="email"
                  placeholder="Email for offers"
                  className="bg-transparent w-full px-3 py-2 text-gray-900 text-sm outline-none"
                />
                <button className="bg-red-600 text-white px-5 py-2 rounded-md font-bold text-sm hover:bg-red-700 transition">
                  Join
                </button>
              </div>
              <p className="text-[10px] text-red-200 mt-3">
                *T&C apply. Exclusive for new members only.
              </p>
            </div>
          </div>

          {/* Card 3: Feature Highlight (Amazon Style) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
            <h3 className="font-bold text-xl text-gray-900 mb-4 tracking-tight">
              Best in Electronics
            </h3>
            <div className="flex-grow flex flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-white rounded-xl border border-gray-50">
              <div className="relative">
                <MdPhoneAndroid
                  size={100}
                  className="text-red-500 drop-shadow-xl animate-pulse-slow"
                />
                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] font-bold p-1 rounded-full shadow-lg">
                  New
                </div>
              </div>
              <div className="text-center mt-4">
                <p className="text-lg font-black text-gray-800">
                  Flagship Smartphones
                </p>
                <p className="text-red-500 font-bold text-sm">
                  Starts from ₹12,999*
                </p>
              </div>
            </div>
            <button className="w-full mt-6 bg-gray-900 text-white py-3 rounded-lg font-bold text-sm hover:bg-black transition shadow-lg shadow-gray-200">
              Browse Tech
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
