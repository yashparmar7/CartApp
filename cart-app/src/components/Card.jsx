import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { RiShoppingCartFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllProducts,
  getSingleProduct,
} from "../features/product/productSlice";
import { addToCart } from "../features/cart/cartSlice";
import { selectIsAuthenticated } from "../features/auth/authSlice";
import Loader from "./Loader";
import { toast } from "react-hot-toast";

const Card = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { products, loading, productsStatus } = useSelector(
    (state) => state.product
  );
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (productsStatus === "idle") {
      dispatch(getAllProducts());
    }
  }, [dispatch, productsStatus]);

  const handleAddToCart = (e, id) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please login to continue");
      return;
    }

    dispatch(addToCart({ productId: id }))
      .unwrap()
      .then((res) => toast.success(res.message))
      .catch((err) =>
        toast.error(err?.message || "Failed to add product to cart")
      );
  };

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

  return (
    <section className="text-gray-600 body-font">
      <div className="container mx-auto px-3 sm:px-4 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {products.map((product) => {
            const { price, mrp, discountPercentage } = product.pricing || {};

            return (
              <div
                key={product._id}
                onClick={() => handleRedirect(product._id)}
                className="group flex flex-col h-full bg-white border border-gray-200 rounded-xl p-3 sm:p-4 cursor-pointer transition hover:shadow-lg"
              >
                {/* Image */}
                <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={product.image?.[0]}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>

                {/* Content */}
                <div className="mt-3 flex flex-col flex-1 space-y-1">
                  <h3 className="text-[10px] sm:text-xs text-gray-500 uppercase truncate">
                    {product.brand}
                  </h3>

                  <h2 className="text-sm sm:text-base font-medium line-clamp-2 leading-snug">
                    {product.title}
                  </h2>

                  {/* Rating */}
                  <div className="flex items-center gap-1 text-xs">
                    <div className="flex">
                      {renderStars(product.ratings?.average)}
                    </div>
                    <span className="text-gray-400">
                      ({product.ratings?.count || 0})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="font-semibold text-sm sm:text-base">
                      ₹{price?.toLocaleString()}
                    </span>
                    <span className="line-through text-gray-400 text-xs">
                      ₹{mrp?.toLocaleString()}
                    </span>
                    <span className="text-green-600 text-xs font-medium">
                      {discountPercentage}% off
                    </span>
                  </div>

                  <p className="text-[11px] text-green-600">Free Delivery</p>

                  {/* Spacer */}
                  <div className="flex-1" />

                  {/* Button */}
                  <button
                    onClick={(e) => handleAddToCart(e, product._id)}
                    className="mt-3 w-full flex items-center justify-center gap-1 bg-red-500 text-white py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-red-600 active:scale-95 transition"
                  >
                    <RiShoppingCartFill size={14} />
                    Add to Cart
                  </button>
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
