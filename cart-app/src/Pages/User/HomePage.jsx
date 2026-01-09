import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Components
import Navbar from "../../components/Navbar";
import Card from "../../components/Card";
import Footer from "../../components/Footer";
import Loader from "../../components/Loader";

// Assets
import heroImage from "../../assets/hero-section.png";

// Icons
import {
  RiFlashlightFill,
  RiTruckLine,
  RiRefund2Line,
  RiSecurePaymentLine,
  RiArrowRightLine,
} from "react-icons/ri";

import {
  MdPhoneAndroid,
  MdOutlineLocalGroceryStore,
  MdMoreHoriz,
} from "react-icons/md";
import { GiRunningShoe, GiLipstick } from "react-icons/gi";
import { FaTshirt, FaTv, FaHome } from "react-icons/fa";

// Redux
import { getAllCategories } from "../../features/category/categorySlice";

// Fallback icons map
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

  const { categories, loading } = useSelector((state) => state.category);

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  const category = categories.filter((cat) => cat.isActive === true);

  return (
    <>
      <Navbar />

      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-500 via-red-400 to-orange-400 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
          <div className="flex flex-col-reverse lg:flex-row items-center gap-10 lg:gap-16">
            {/* LEFT */}
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-extrabold leading-tight mb-5">
                Smart Shopping
                <span className="block text-white/95">Starts Here</span>
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-white/90 max-w-xl mx-auto lg:mx-0 mb-8">
                Discover top deals, trending products, and a fast, secure
                checkout experience — all built for modern shoppers.
              </p>

              <div className="flex justify-center lg:justify-start">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 bg-white text-red-600 px-7 py-3.5 rounded-full font-semibold shadow-lg hover:shadow-xl hover:bg-gray-100 transition-all"
                >
                  Shop Now
                  <RiArrowRightLine className="text-lg" />
                </Link>
              </div>
            </div>

            {/* RIGHT */}
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
              <div className="relative">
                <img
                  src={heroImage}
                  alt="Ecommerce Hero"
                  loading="lazy"
                  draggable="false"
                  className="select-none w-[200px] sm:w-[260px] md:w-[320px] lg:w-[420px] xl:w-[480px] drop-shadow-2xl"
                />
                <div className="absolute inset-0 -z-10 rounded-full bg-white/20 blur-3xl scale-110" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CATEGORIES ================= */}
      <section className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          {loading ? (
            <Loader />
          ) : (
            <div
              className="
          flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory
          sm:grid sm:gap-4 sm:overflow-visible
          sm:[grid-template-columns:repeat(auto-fit,minmax(90px,1fr))]
          md:gap-6
        "
            >
              {category?.map((cat) => {
                const Icon = iconMap[cat?.name] || MdMoreHoriz;

                return (
                  <div
                    key={cat._id}
                    onClick={() => navigate(`/shop?category=${cat.slug}`)}
                    className="
                snap-start
                min-w-[72px] sm:min-w-0
                flex flex-col items-center justify-center
                text-center cursor-pointer
                rounded-md px-2 py-3 sm:px-3 sm:py-4
                hover:text-red-500 transition
              "
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-100 flex items-center justify-center hover:bg-red-100 transition">
                      <Icon className="text-lg sm:text-xl text-red-500" />
                    </div>

                    <span className="mt-1 sm:mt-2 text-[11px] sm:text-xs font-medium text-gray-700">
                      {cat.name}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="bg-gray-50">
        <div className="mx-auto px-4 py-6">
          <div className="flex gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible">
            {[
              { icon: RiFlashlightFill, text: "Daily Deals" },
              { icon: RiTruckLine, text: "Fast Delivery" },
              { icon: RiRefund2Line, text: "Easy Returns" },
              { icon: RiSecurePaymentLine, text: "Secure Payment" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[110px] sm:w-[130px] md:w-auto flex flex-col items-center justify-center bg-white border border-gray-200 rounded-lg px-3 py-3 sm:px-4 sm:py-4 hover:-translate-y-1 hover:shadow-md transition-all duration-300"
              >
                <item.icon className="text-red-500 mb-1 sm:mb-2" size={22} />
                <p className="text-[11px] sm:text-sm font-medium text-center">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TOP DEALS ================= */}
      <section className="bg-white">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            Top Deals for You
          </h2>
          <button
            className="text-sm text-red-500 font-medium hover:underline"
            onClick={() => navigate("/shop")}
          >
            View All
          </button>
        </div>

        <Card />
      </section>

      {/* ================= SALE CTA ================= */}
      <section className="bg-red-50">
        <div className="container mx-auto px-4 py-10 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Mega Sale Live Now
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4">
            Save big on fashion, electronics, and daily essentials.
          </p>
          <button
            onClick={() => navigate("/shop")}
            className="bg-red-500 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-red-600 transition"
          >
            Explore Offers
          </button>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default HomePage;
