import React from "react";
import { Link } from "react-router-dom";
import {
  RiFacebookFill,
  RiTwitterXFill,
  RiInstagramLine,
  RiLinkedinFill,
  RiMailSendLine,
  RiMapPinLine,
  RiPhoneLine,
  RiFlashlightFill,
} from "react-icons/ri";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 text-gray-600 mt-20">
      {/* 1. Newsletter / Action Section */}
      <div className="bg-red-500 py-10">
        <div className="max-w-[1400px] mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-white">
            <h2 className="text-2xl font-black italic tracking-tighter">
              JOIN THE CARTAPP FAMILY
            </h2>
            <p className="opacity-90 text-sm">
              Subscribe to get updates on new arrivals and special offers!
            </p>
          </div>
          <div className="flex w-full md:w-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-3 rounded-l-lg w-full md:w-80 outline-none bg-white text-gray-900"
            />
            <button className="bg-gray-900 text-white px-4 py-3 rounded-r-lg font-bold hover:bg-black transition-colors flex items-center gap-2">
              Subscribe <RiMailSendLine />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Content */}
      <div className="max-w-[1400px] mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center group mb-6">
              <div className="bg-red-500 p-2 rounded-xl ">
                <RiFlashlightFill className="text-white text-3xl" />
              </div>
              <span className="ml-3 text-2xl font-black tracking-tighter text-gray-900 uppercase">
                Cart<span className="text-red-500">App</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-6 max-w-sm">
              We provide the best shopping experience with high-quality
              products, secure payments, and lightning-fast delivery across the
              nation.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <RiMapPinLine className="text-red-500" />
                <span>123 Market Street, Surat, Gujarat</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <RiPhoneLine className="text-red-500" />
                <span>+91 98765 43210</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="font-bold text-gray-900 uppercase text-xs tracking-widest mb-6">
              Quick Shop
            </h3>
            <ul className="space-y-4 text-sm font-medium">
              <FooterLink to="/shop">Mobiles & Tablets</FooterLink>
              <FooterLink to="/shop">Men's Fashion</FooterLink>
              <FooterLink to="/shop">Electronics</FooterLink>
              <FooterLink to="/shop">Home Decor</FooterLink>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 uppercase text-xs tracking-widest mb-6">
              Support
            </h3>
            <ul className="space-y-4 text-sm font-medium">
              <FooterLink to="/contact">Track Order</FooterLink>
              <FooterLink to="/contact">Returns & Refunds</FooterLink>
              <FooterLink to="/contact">Shipping Policy</FooterLink>
              <FooterLink to="/contact">Help Center</FooterLink>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 uppercase text-xs tracking-widest mb-6">
              Legal
            </h3>
            <ul className="space-y-4 text-sm font-medium">
              <FooterLink to="/">Privacy Policy</FooterLink>
              <FooterLink to="/">Terms of Service</FooterLink>
              <FooterLink to="/">Security</FooterLink>
              <FooterLink to="/">Disclaimer</FooterLink>
            </ul>
          </div>
        </div>
      </div>

      {/* 3. Bottom Bar */}
      <div className="border-t border-gray-100 bg-gray-50/50">
        <div className="max-w-[1400px] mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-sm text-gray-500 font-medium">
              © {new Date().getFullYear()}{" "}
              <span className="text-red-500 font-bold">CartApp</span>. Designed
              by{" "}
              <span className="text-gray-900 font-bold underline decoration-red-500/30">
                Yash Parmar
              </span>
            </p>

            <div className="flex items-center gap-6">
              <SocialIcon icon={<RiFacebookFill />} />
              <SocialIcon icon={<RiTwitterXFill />} />
              <SocialIcon icon={<RiInstagramLine />} />
              <SocialIcon icon={<RiLinkedinFill />} />
            </div>

            {/* <div className="flex gap-4">
               Dummy Payment Icons
               <div className="h-6 w-10 bg-gray-200 rounded opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer"></div>
               <div className="h-6 w-10 bg-gray-200 rounded opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer"></div>
               <div className="h-6 w-10 bg-gray-200 rounded opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer"></div>
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

// Sub-components for cleaner code
const FooterLink = ({ to, children }) => (
  <li>
    <Link
      to={to}
      className="hover:text-red-500 transition-colors flex items-center"
    >
      {children}
    </Link>
  </li>
);

const SocialIcon = ({ icon }) => (
  <a
    href="#"
    className="text-gray-400 hover:text-red-500 transition-all transform hover:-translate-y-1 text-xl"
  >
    {icon}
  </a>
);

export default Footer;
