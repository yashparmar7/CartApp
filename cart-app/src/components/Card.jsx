import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllProducts,
  getSingleProduct,
} from "../features/product/productSlice";
import Loader from "./Loader";

const Card = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { products, loading, error } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  const handleRedirect = (id) => {
    dispatch(getSingleProduct(id));
    navigate(`/product/${id}`);
  };

  const renderStars = (rating = 0) => {
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

  if (loading) return <Loader />;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-4 py-6 mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map((product) => {
            const price = product.pricing?.price;
            const mrp = product.pricing?.mrp;
            const discount = product.pricing?.discountPercentage;

            return (
              <div
                key={product._id}
                onClick={() => handleRedirect(product._id)}
                className="border border-gray-300 rounded-lg p-3 cursor-pointer bg-white hover:shadow-md transition"
              >
                <div className="relative w-full aspect-square rounded overflow-hidden">
                  <img
                    src={product.image?.[0]}
                    alt={product.title}
                    className="object-cover w-full h-full"
                  />
                </div>

                <div className="mt-2 space-y-1">
                  <h3 className="text-xs text-gray-500 uppercase">
                    {product.brand}
                  </h3>

                  <h2 className="text-sm font-medium line-clamp-2">
                    {product.title}
                  </h2>

                  <div className="flex items-center gap-1 text-xs">
                    <div className="flex">
                      {renderStars(product.ratings?.average)}
                    </div>
                    <span className="text-gray-500">
                      ({product.ratings?.count || 0})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-semibold">
                      ₹{price?.toLocaleString()}
                    </span>
                    <span className="line-through text-gray-400 text-sm">
                      ₹{mrp?.toLocaleString()}
                    </span>
                    <span className="text-green-600 text-sm">
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
