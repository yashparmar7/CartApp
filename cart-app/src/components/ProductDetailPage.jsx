import React from "react";
import {
  RiShoppingCartFill,
  RiHeartLine,
  RiFlashlightFill,
  RiTruckLine,
  RiPriceTag3Fill,
} from "react-icons/ri";
import { FaStar } from "react-icons/fa";
import Navbar from "../components/Navbar";

const ProductDetailPage = () => {
  const price = 16000;
  const mrp = 19999;
  const discount = Math.round(((mrp - price) / mrp) * 100);

  return (
    <>
      <Navbar />
      <section className="bg-gray-50 py-10">
        <div className="container mx-auto px-5">
          <div className="bg-white rounded-xl shadow-lg p-6 lg:p-10">
            <div className="flex flex-wrap">
              {/* Image */}
              <div className="lg:w-1/2 w-full">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4QaRqKWxfrGdQ9r5U5mWg-RWItNxzmphX-Q&s"
                  alt="product"
                  className="w-full h-80 lg:h-[420px] object-cover rounded-lg"
                />
              </div>

              {/* Details */}
              <div className="lg:w-1/2 w-full lg:pl-10 mt-6 lg:mt-0">
                <h2 className="text-sm text-gray-500 uppercase mb-1">
                  Brand Name
                </h2>

                <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900 mb-2">
                  Running Shoes for Men | Lightweight & Comfortable
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="flex items-center gap-1 bg-green-600 text-white px-2 py-0.5 rounded text-sm font-medium">
                    4.3 <FaStar className="text-xs" />
                  </span>
                  <span className="text-gray-500 text-sm">
                    128 ratings & 34 reviews
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl font-bold text-gray-900">
                    ₹{price.toLocaleString()}
                  </span>
                  <span className="text-lg text-gray-400 line-through">
                    ₹{mrp.toLocaleString()}
                  </span>
                  <span className="text-lg text-green-600 font-semibold">
                    {discount}% off
                  </span>
                </div>

                <p className="text-sm text-green-600 mb-4">
                  Inclusive of all taxes
                </p>

                {/* Offers */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Available Offers</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center gap-2">
                      <RiPriceTag3Fill className="text-green-600" />
                      Bank Offer: 10% off on HDFC Credit Cards
                    </li>
                    <li className="flex items-center gap-2">
                      <RiPriceTag3Fill className="text-green-600" />
                      Special Price: Extra ₹2000 off
                    </li>
                    <li className="flex items-center gap-2">
                      <RiPriceTag3Fill className="text-green-600" />
                      Free delivery on orders above ₹499
                    </li>
                  </ul>
                </div>

                {/* Delivery */}
                <div className="flex items-center gap-2 mb-6 text-sm text-gray-700">
                  <RiTruckLine className="text-green-600" />
                  Delivery by <span className="font-medium">
                    Tomorrow
                  </span> | <span className="text-green-600">Free</span>
                </div>

                {/* CTA */}
                <div className="flex gap-4 mt-6">
                  <button className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition">
                    <RiShoppingCartFill />
                    Add to Cart
                  </button>

                  <button className="flex-1 flex items-center justify-center gap-2 bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition">
                    <RiFlashlightFill />
                    Buy Now
                  </button>

                  <button className="w-12 h-12 rounded-full border flex items-center justify-center hover:bg-gray-100">
                    <RiHeartLine size={22} />
                  </button>
                </div>

                {/* Description */}
                <div className="mt-8">
                  <h3 className="font-semibold mb-2">Product Description</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Comfortable and durable running shoes designed for everyday
                    wear. Lightweight sole, breathable material, and modern
                    design make it perfect for sports and casual use.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductDetailPage;
