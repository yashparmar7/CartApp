import React from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { RiShoppingCartLine, RiHeartLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { getSingleProduct } from "../features/product/productSlice";
import { addToCart } from "../features/cart/cartSlice";
import { selectIsAuthenticated } from "../features/auth/authSlice";
import Loader from "./Loader";
import { toast } from "react-hot-toast";

const Card = ({ products: propProducts }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { products: reduxProducts, loading } = useSelector((state) => state.product);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Use prop products if provided, otherwise use redux products
  const products = propProducts || reduxProducts;

  const handleAddToCart = (e, id) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error("Please login to continue");
      return;
    }
    dispatch(addToCart({ productId: id }))
      .unwrap()
      .then((res) => toast.success(res.message))
      .catch((err) => toast.error(err?.message || "Failed to add to cart"));
  };

  const handleRedirect = (id) => {
    dispatch(getSingleProduct(id));
    navigate(`/product/${id}`);
  };

  const renderStars = (rating = 0) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) stars.push(<FaStar key={i} className="text-yellow-400" />);
      else if (rating >= i - 0.5) stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      else stars.push(<FaRegStar key={i} className="text-gray-200" />);
    }
    return stars;
  };

  if (loading) return <Loader />;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
      {products.map((product) => {
        const { price, mrp, discountPercentage } = product.pricing || {};

        return (
          <div
            key={product._id}
            onClick={() => handleRedirect(product._id)}
            className="group relative bg-white border border-gray-100 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 cursor-pointer flex flex-col h-full"
          >
            {/* 1. Image Area */}
            <div className="relative aspect-[4/5] overflow-hidden bg-gray-50 p-4">
              {/* Discount Tag */}
              <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                -{discountPercentage}%
              </div>
              
              {/* Wishlist Icon */}
              <button className="absolute top-2 right-2 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 hover:bg-white transition-all shadow-sm">
                <RiHeartLine size={16} />
              </button>

              <img
                src={product.image?.[0]}
                alt={product.title}
                className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            {/* 2. Product Info */}
            <div className="p-3 sm:p-4 flex flex-col flex-grow">
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider mb-1">
                {product.brand}
              </span>
              
              <h2 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-2  transition-colors leading-snug h-10">
                {product.title}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-1.5 mb-3">
                <div className="flex text-xs">{renderStars(product.ratings?.average)}</div>
                <span className="text-[10px] font-medium text-gray-400">({product.ratings?.count || 0})</span>
              </div>

              {/* Price Row */}
              <div className="mt-auto">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-lg font-black text-gray-900 leading-none">
                    ₹{price?.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-400 line-through">
                    ₹{mrp?.toLocaleString()}
                  </span>
                </div>
                
                <p className="text-[11px] text-green-600 font-bold mt-1.5 flex items-center gap-1">
                  <span className="w-1 h-1 bg-green-600 rounded-full"></span> Free Delivery
                </p>
              </div>

              {/* 3. Add to Cart Button */}
              <button
                onClick={(e) => handleAddToCart(e, product._id)}
                className="mt-4 w-full flex items-center justify-center gap-2 bg-red-500 border-2 border-red-500 text-white py-2 rounded-lg text-xs font-bold transition-all active:scale-95 group/btn"
              >
                <RiShoppingCartLine size={16} className="group-hover/btn:animate-bounce" />
                ADD TO CART
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Card;