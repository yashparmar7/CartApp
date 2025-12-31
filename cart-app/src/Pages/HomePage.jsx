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

const HomePage = () => {
  return (
    <>
      <Navbar />

      {/* HERO SECTION */}
      <section className="bg-gradient-to-r from-red-500 to-orange-400 text-white">
        <div className="container mx-auto px-5 py-16 flex flex-col lg:flex-row items-center gap-10">
          {/* Left Content */}
          <div className="lg:w-1/2">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              Smart Shopping <br /> Starts Here
            </h1>
            <p className="text-lg mb-6 text-white/90">
              Discover top deals, trending products, and secure checkout — all
              in one place.
            </p>

            <button className="flex items-center gap-2 bg-white text-red-500 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              Shop Now
              <RiArrowRightLine />
            </button>
          </div>

          {/* Right Image (YOUR IMAGE) */}
          <div className="lg:w-1/2 flex justify-center">
            <img
              src={heroImage}
              alt="ecommerce hero"
              className="w-full max-w-md drop-shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* CATEGORY STRIP */}
      <section className="bg-white shadow-sm">
        <div className="container mx-auto px-5 py-6 grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-8 gap-4 text-center text-sm font-medium text-gray-700">
          {[
            "Mobiles",
            "Fashion",
            "Electronics",
            "Shoes",
            "Beauty",
            "Home",
            "Grocery",
            "More",
          ].map((cat, i) => (
            <div
              key={i}
              className="cursor-pointer border-2 border-red-500 rounded-sm px-4 py-2 hover:text-red-500 transition"
            >
              {cat}
            </div>
          ))}
        </div>
      </section>

      {/* TRUST SECTION */}
      <section className="bg-gray-50">
        <div className="container mx-auto px-5 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center border border-gray-200 rounded-lg p-4 hover:shadow-md">
            <RiFlashlightFill size={28} className="text-red-500 mb-2" />
            <p className="font-medium">Daily Deals</p>
          </div>
          <div className="flex flex-col items-center border border-gray-200 rounded-lg p-4 hover:shadow-md">
            <RiTruckLine size={28} className="text-red-500 mb-2" />
            <p className="font-medium">Fast Delivery</p>
          </div>
          <div className="flex flex-col items-center border border-gray-200 rounded-lg p-4 hover:shadow-md">
            <RiRefund2Line size={28} className="text-red-500 mb-2" />
            <p className="font-medium">Easy Returns</p>
          </div>
          <div className="flex flex-col items-center border border-gray-200 rounded-lg p-4 hover:shadow-md">
            <RiSecurePaymentLine size={28} className="text-red-500 mb-2" />
            <p className="font-medium">Secure Payment</p>
          </div>
        </div>
      </section>

      {/* PRODUCTS SECTION */}
      <section className="bg-white">
        <div className="container mx-auto px-5 py-10 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900">
            Top Deals for You
          </h2>
          <button className="text-red-500 font-medium hover:underline">
            View All
          </button>
        </div>

        <Card />
      </section>

      {/* PROMO SECTION */}
      <section className="bg-red-50">
        <div className="container mx-auto px-5 py-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Mega Sale Live Now
          </h2>
          <p className="text-gray-600 mb-6">
            Save big on fashion, electronics, and daily essentials.
          </p>
          <button className="bg-red-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-600 transition">
            Explore Offers
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </>
  );
};

export default HomePage;
