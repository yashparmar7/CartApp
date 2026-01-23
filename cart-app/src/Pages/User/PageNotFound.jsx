import React from "react";
import { Link } from "react-router-dom";
import { RiSearchLine, RiArrowRightLine, RiHome4Line, RiShoppingBag3Line } from "react-icons/ri";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const PageNotFound = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="max-w-[1400px] mx-auto text-center">
          
          {/* 1. Large Visual Element */}
          <div className="relative inline-block mb-8">
            <h1 className="text-[150px] md:text-[220px] font-black leading-none text-gray-100 select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-red-500 p-6 md:p-8 rounded-3xl shadow-2xl shadow-red-200 rotate-12 group hover:rotate-0 transition-transform duration-300">
                <RiSearchLine className="text-white text-5xl md:text-7xl" />
              </div>
            </div>
          </div>

          {/* 2. Text Content */}
          <div className="max-w-xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tighter mb-4">
              LOST IN THE <span className="text-red-500">MARKET?</span>
            </h2>
            <p className="text-gray-500 font-medium text-lg leading-relaxed mb-10">
              The page you are looking for has been moved, deleted, or never existed. 
              Don't worry, your next favorite item is just a click away!
            </p>

            {/* 3. Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-black transition-all shadow-xl shadow-gray-200 active:scale-95"
              >
                <RiHome4Line size={20} />
                BACK TO HOME
              </Link>

              <Link
                to="/shop"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border-2 border-red-500 text-red-500 px-8 py-4 rounded-xl font-bold hover:bg-red-50 transition-all active:scale-95"
              >
                <RiShoppingBag3Line size={20} />
                CONTINUE SHOPPING
                <RiArrowRightLine />
              </Link>
            </div>
          </div>

          {/* 4. Quick Help Links */}
          <div className="mt-16 pt-10 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <HelpLink title="Track Order" link="/my-orders" />
            <HelpLink title="Help Center" link="/contact" />
            <HelpLink title="View Offers" link="/shop" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

// Sub-component for small footer links on 404
const HelpLink = ({ title, link }) => (
  <Link to={link} className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-red-500 transition-colors">
    {title}
  </Link>
);

export default PageNotFound;