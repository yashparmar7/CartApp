import React from "react";
import {
  RiShoppingBag3Fill,
  RiFacebookFill,
  RiTwitterXFill,
  RiInstagramLine,
  RiLinkedinFill,
} from "react-icons/ri";

const Footer = () => {
  return (
    <footer className="bg-gray-50 text-gray-600">
      <div className="container mx-auto px-5 py-16">
        <div className="flex flex-wrap md:flex-nowrap gap-10">
          {/* Brand */}
          <div className="w-full md:w-64 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-gray-900 font-semibold text-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="w-10 h-10 text-white p-2 bg-red-500 rounded-full"
                viewBox="0 0 24 24"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
              CartApp
            </div>
            <p className="mt-3 text-sm text-gray-500">
              Your one-stop destination for smart shopping, best deals, and fast
              delivery.
            </p>
          </div>

          {/* Links */}
          <div className="flex-grow grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 text-sm">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Shop</h3>
              <ul className="space-y-2">
                <li className="hover:text-red-500 cursor-pointer">Mobiles</li>
                <li className="hover:text-red-500 cursor-pointer">Fashion</li>
                <li className="hover:text-red-500 cursor-pointer">
                  Electronics
                </li>
                <li className="hover:text-red-500 cursor-pointer">Home</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Help</h3>
              <ul className="space-y-2">
                <li className="hover:text-red-500 cursor-pointer">Payments</li>
                <li className="hover:text-red-500 cursor-pointer">Shipping</li>
                <li className="hover:text-red-500 cursor-pointer">Returns</li>
                <li className="hover:text-red-500 cursor-pointer">FAQ</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Company</h3>
              <ul className="space-y-2">
                <li className="hover:text-red-500 cursor-pointer">About Us</li>
                <li className="hover:text-red-500 cursor-pointer">Careers</li>
                <li className="hover:text-red-500 cursor-pointer">Contact</li>
                <li className="hover:text-red-500 cursor-pointer">Blog</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Policy</h3>
              <ul className="space-y-2">
                <li className="hover:text-red-500 cursor-pointer">Privacy</li>
                <li className="hover:text-red-500 cursor-pointer">
                  Terms & Conditions
                </li>
                <li className="hover:text-red-500 cursor-pointer">
                  Refund Policy
                </li>
                <li className="hover:text-red-500 cursor-pointer">Security</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-100">
        <div className="container mx-auto px-5 py-4 flex flex-col sm:flex-row items-center justify-between text-sm">
          <p className="text-gray-500">
            © {new Date().getFullYear()} CartApp • All rights reserved by{" "}
            <span className="font-medium text-gray-700">Yash Parmar</span>
          </p>

          <div className="flex gap-4 mt-3 sm:mt-0">
            <RiFacebookFill className="cursor-pointer hover:text-red-500" />
            <RiTwitterXFill className="cursor-pointer hover:text-red-500" />
            <RiInstagramLine className="cursor-pointer hover:text-red-500" />
            <RiLinkedinFill className="cursor-pointer hover:text-red-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
