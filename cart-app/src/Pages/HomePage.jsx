import React from "react";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import {
  RiFlashlightFill,
  RiTruckLine,
  RiRefund2Line,
  RiSecurePaymentLine,
  RiArrowRightLine,
} from "react-icons/ri";
import heroImage from "../assets/hero-section.png";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

import {
  MdPhoneAndroid,
  MdOutlineLocalGroceryStore,
  MdMoreHoriz,
} from "react-icons/md";
import { GiRunningShoe, GiLipstick } from "react-icons/gi";
import { FaTshirt, FaTv, FaHome } from "react-icons/fa";

const categories = [
  { name: "Mobiles", icon: MdPhoneAndroid },
  { name: "Fashion", icon: FaTshirt },
  { name: "Electronics", icon: FaTv },
  { name: "Shoes", icon: GiRunningShoe },
  { name: "Beauty", icon: GiLipstick },
  { name: "Home", icon: FaHome },
  { name: "Grocery", icon: MdOutlineLocalGroceryStore },
  { name: "More", icon: MdMoreHoriz },
];

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <>
      <Navbar />

      <section className="bg-gradient-to-r from-red-500 to-orange-400 text-white">
        <div className="container mx-auto px-4 py-8 md:py-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold leading-tight mb-3">
              Smart Shopping <br /> Starts Here
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-white/90 mb-5">
              Discover top deals, trending products, and secure checkout — all
              in one place.
            </p>

            <button className="inline-flex items-center gap-2 bg-white text-red-500 px-5 py-2.5 rounded-lg font-semibold hover:bg-gray-100 transition">
              Shop Now <RiArrowRightLine />
            </button>
          </div>

          <div className="flex justify-center">
            <img
              src={heroImage}
              alt="ecommerce hero"
              className="w-full max-w-xs sm:max-w-sm lg:max-w-md"
            />
          </div>
        </div>
      </section>

      <section className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 overflow-x-auto">
          <div className="flex gap-3 sm:gap-4 md:grid md:grid-cols-4 lg:grid-cols-8 md:gap-6">
            {categories.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <div
                  key={i}
                  className="min-w-[72px] sm:min-w-[90px] md:min-w-0 flex flex-col items-center justify-center text-center cursor-pointer rounded-md px-2 py-3 sm:px-3 sm:py-4 hover:text-red-500 transition"
                >
                  <div className=" w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-100 flex items-center justify-center hover:bg-red-100 transition">
                    <Icon className="text-lg sm:text-xl text-red-500" />
                  </div>

                  <span className=" mt-1 sm:mt-2 text-[11px] sm:text-xs font-medium text-gray-700 leading-tight ">
                    {cat.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-gray-50">
        <div className="mx-auto px-4 py-6">
          <div
            className="
        flex gap-3 overflow-x-auto pb-2
        md:grid md:grid-cols-4 md:gap-6 md:overflow-visible
      "
          >
            {[
              { icon: RiFlashlightFill, text: "Daily Deals" },
              { icon: RiTruckLine, text: "Fast Delivery" },
              { icon: RiRefund2Line, text: "Easy Returns" },
              { icon: RiSecurePaymentLine, text: "Secure Payment" },
            ].map((item, i) => (
              <div
                key={i}
                className="
            flex-shrink-0
            w-[110px] sm:w-[130px] md:w-auto
            flex flex-col items-center justify-center
            bg-white border border-gray-200 rounded-lg
            px-3 py-3 sm:px-4 sm:py-4
            hover:shadow-sm transition
          "
              >
                <item.icon className="text-red-500 mb-1 sm:mb-2" size={22} />
                <p className="text-[11px] sm:text-sm font-medium text-center leading-tight">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            Top Deals for You
          </h2>
          <button
            className="text-sm text-red-500 font-medium hover:underline"
            onClick={() => {
              navigate("/shop");
            }}
          >
            View All
          </button>
        </div>

        <Card />
      </section>

      <section className="bg-red-50">
        <div className="container mx-auto px-4 py-10 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Mega Sale Live Now
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4">
            Save big on fashion, electronics, and daily essentials.
          </p>
          <button className="bg-red-500 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-red-600 transition">
            Explore Offers
          </button>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default HomePage;
