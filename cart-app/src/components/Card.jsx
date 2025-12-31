import React from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const Card = () => {
  const navigate = useNavigate();

  const handleRedirect = (id) => {
    navigate(`/product/${id}`);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i)
        stars.push(<FaStar key={i} className="text-green-600" />);
      else if (rating >= i - 0.5)
        stars.push(<FaStarHalfAlt key={i} className="text-green-600" />);
      else stars.push(<FaRegStar key={i} className="text-gray-300" />);
    }
    return stars;
  };

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-10 mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(6)
            .fill(0)
            .map((_, i) => {
              const rating = 4.3;
              const reviews = 128;
              const price = 16000;
              const mrp = 19999;
              const discount = Math.round(((mrp - price) / mrp) * 100);

              return (
                <div
                  key={i}
                  onClick={() => handleRedirect(i + 1)}
                  className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-xl transition bg-white"
                >
                  {/* Image */}
                  <div className="relative h-48 rounded overflow-hidden">
                    <img
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4QaRqKWxfrGdQ9r5U5mWg-RWItNxzmphX-Q&s"
                      alt="product"
                      className="object-cover w-full h-full hover:scale-105 transition"
                    />
                  </div>

                  {/* Details */}
                  <div className="mt-3 space-y-1">
                    <h3 className="text-xs text-gray-500 uppercase">Shoes</h3>

                    <h2 className="text-sm font-medium text-gray-900 line-clamp-2">
                      Running Shoes for Men | Lightweight & Comfortable
                    </h2>

                    {/* Rating */}
                    <div className="flex items-center gap-1 text-xs">
                      <div className="flex items-center">
                        {renderStars(rating)}
                      </div>
                      <span className="text-gray-500">({reviews})</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold text-gray-900">
                        ₹{price.toLocaleString()}
                      </span>
                      <span className="text-sm line-through text-gray-400">
                        ₹{mrp.toLocaleString()}
                      </span>
                      <span className="text-sm text-green-600 font-medium">
                        {discount}% off
                      </span>
                    </div>

                    <p className="text-xs text-green-600">Free Delivery</p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
};

export default Card;
