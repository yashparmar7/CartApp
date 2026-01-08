import React from "react";
import { Link } from "react-router-dom";
import { RiEmotionSadLine, RiArrowRightLine } from "react-icons/ri";

const PageNotFound = () => {
  return (
    <>
      <section className="min-h-[70vh] flex items-center justify-center bg-gray-50">
        <div className="container mx-auto px-5 text-center">
          <div className="flex justify-center mb-4">
            <RiEmotionSadLine className="text-red-500 text-6xl" />
          </div>

          <h1 className="text-6xl font-extrabold text-gray-900 mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            Page Not Found
          </h2>

          <p className="text-gray-600 max-w-md mx-auto mb-6">
            Oops! The page you’re looking for doesn’t exist or might have been
            moved. Let’s get you back to shopping.
          </p>

          <div className="flex justify-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition"
            >
              Go to Home
              <RiArrowRightLine />
            </Link>

            <Link
              to="/shop"
              className="inline-flex items-center gap-2 border border-red-500 text-red-500 px-6 py-3 rounded-lg font-semibold hover:bg-red-50 transition"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default PageNotFound;
