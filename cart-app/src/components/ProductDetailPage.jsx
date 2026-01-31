import React, { useEffect, useState } from "react";
import {
  RiShoppingCartFill,
  RiHeartLine,
  RiHeart3Fill,
  RiFlashlightFill,
  RiTruckLine,
  RiPriceTag3Fill,
  RiShieldCheckLine,
  RiArrowLeftRightLine,
} from "react-icons/ri";
import { FaStar, FaShareAlt } from "react-icons/fa";
import Navbar from "./Navbar";
import { useDispatch, useSelector } from "react-redux";
import { getSingleProduct } from "../features/product/productSlice";
import { addToCart } from "../features/cart/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "../features/wishlist/wishlistSlice";
import { selectIsAuthenticated } from "../features/auth/authSlice";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "./Loader";
import { toast } from "react-hot-toast";
import ProductReviewPage from "./ProductReviewPage";

const ProductDetailPage = () => {
  const [activeImage, setActiveImage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { singleProduct, loading, error } = useSelector(
    (state) => state.product,
  );
  const { wishlist } = useSelector((state) => state.wishlist);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (id) dispatch(getSingleProduct(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (singleProduct?.image?.length > 0) {
      setActiveImage(singleProduct.image[0]);
    }
  }, [singleProduct]);

  const handleAddToCart = (id) => {
    if (!isAuthenticated) {
      toast.error("Please login to continue");
      return;
    }
    dispatch(addToCart({ productId: id }))
      .unwrap()
      .then((res) => toast.success(res.message))
      .catch((err) => toast.error(err?.message || "Failed to add to cart"));
  };

  const isInWishlist = wishlist.some(
    (item) => item.product._id === singleProduct._id,
  );

  const handleAddToWishlist = (id) => {
    if (!isAuthenticated) {
      toast.error("Please login to continue");
      return;
    }
    if (isInWishlist) {
      dispatch(removeFromWishlist({ productId: id }))
        .unwrap()
        .then((res) => toast.success(res.message))
        .catch((err) =>
          toast.error(err?.message || "Failed to remove from wishlist"),
        );
    } else {
      dispatch(addToWishlist({ productId: id }))
        .unwrap()
        .then((res) => toast.success(res.message))
        .catch((err) =>
          toast.error(err?.message || "Failed to add to wishlist"),
        );
    }
  };
  const handleBuyNow = () => {
    if (!isAuthenticated) {
      toast.error("Please login to continue");
      return;
    }
    dispatch(addToCart({ productId: id }))
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        navigate("/checkout");
      })
      .catch((err) => toast.error(err?.message || "Failed to add to cart"));
  };

  if (loading) return <Loader />;
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 font-bold">
        {error}
      </div>
    );
  if (!singleProduct?._id) return null;

  const { price, mrp, discountPercentage } = singleProduct.pricing || {};

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <Navbar />

      <main className="max-w-[1400px] mx-auto px-4 py-4 md:py-8">
        {/* Breadcrumbs - Professional touch */}
        <nav className="text-xs text-gray-500 mb-4 flex gap-2">
          <span
            className="cursor-pointer hover:text-red-500"
            onClick={() => navigate("/")}
          >
            Home
          </span>{" "}
          /
          <span
            className="cursor-pointer hover:text-red-500"
            onClick={() => navigate("/shop")}
          >
            Shop
          </span>{" "}
          /
          <span className="text-gray-900 font-medium truncate">
            {singleProduct.title}
          </span>
        </nav>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-4 md:p-8">
            {/* LEFT: IMAGE GALLERY (Lg: 5 columns) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="relative group aspect-square rounded-xl bg-white border border-gray-100 flex items-center justify-center overflow-hidden">
                <img
                  src={activeImage || null}
                  alt={singleProduct.title}
                  className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                />
                <button
                  className={`absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-md transition ${isInWishlist ? "text-red-500" : "text-gray-600 hover:text-red-500"}`}
                  onClick={() => handleAddToWishlist(singleProduct._id)}
                >
                  {isInWishlist ? (
                    <RiHeart3Fill size={20} />
                  ) : (
                    <RiHeartLine size={20} />
                  )}
                </button>
              </div>

              {/* Thumbnails */}
              {singleProduct.image?.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar justify-center">
                  {singleProduct.image.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(img)}
                      className={`w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-lg border-2 transition-all overflow-hidden ${
                        activeImage === img
                          ? "border-red-500 shadow-md"
                          : "border-gray-100 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img}
                        alt="thumb"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT: CONTENT (Lg: 7 columns) */}
            <div className="lg:col-span-7 flex flex-col">
              <div className="border-b border-gray-100 pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-red-600 text-xs font-bold uppercase tracking-widest">
                      {singleProduct.brand}
                    </span>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">
                      {singleProduct.title}
                    </h1>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition">
                    <FaShareAlt />
                  </button>
                </div>

                {/* Rating & Stock */}
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1.5 bg-green-600 text-white px-2.5 py-1 rounded-md text-sm font-bold">
                    {singleProduct.ratings?.average || 0}{" "}
                    <FaStar className="text-[10px]" />
                  </div>
                  <span className="text-sm text-gray-500 font-medium">
                    {singleProduct.ratings?.count || 0} Ratings & Reviews
                  </span>
                  <span
                    className={`text-sm font-bold px-2 py-0.5 rounded ${singleProduct.stock > 0 ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"}`}
                  >
                    {singleProduct.stock > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </div>

              {/* Pricing Section */}
              <div className="py-6 bg-red-50/30 px-4 rounded-xl mt-4">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-black text-gray-900">
                    ₹{price?.toLocaleString()}
                  </span>
                  <span className="text-lg text-gray-400 line-through">
                    ₹{mrp?.toLocaleString()}
                  </span>
                  <span className="text-red-500 font-bold text-lg">
                    {discountPercentage}% OFF
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {singleProduct.delivery?.cost === "Free"
                    ? "Free delivery available on this item"
                    : `Delivery charges: ₹${singleProduct.delivery?.cost}`}
                </p>
              </div>

              {/* Offers Section */}
              <div className="mt-6">
                <h3 className="text-sm font-bold uppercase text-gray-400 tracking-wider mb-3">
                  Available Offers
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {singleProduct.offers?.length > 0 ? (
                    singleProduct.offers.map((offer, index) => (
                      <div
                        key={index}
                        className="flex gap-3 p-3 border border-dashed border-red-200 rounded-lg bg-white"
                      >
                        <RiPriceTag3Fill className="text-red-500 shrink-0 mt-1" />
                        <p className="text-xs text-gray-700">{offer}</p>
                      </div>
                    ))
                  ) : (
                    <div className="flex gap-3 p-3 border border-dashed border-red-200 rounded-lg bg-white">
                      <RiPriceTag3Fill className="text-red-500 shrink-0 mt-1" />
                      <p className="text-xs text-gray-700">
                        No offers available at the moment.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-2 py-6 border-y border-gray-100 my-6">
                <div className="flex flex-col items-center text-center">
                  <RiArrowLeftRightLine
                    className="text-red-500 mb-1"
                    size={20}
                  />
                  <span className="text-[10px] font-bold text-gray-600 uppercase">
                    7 Days Replacement
                  </span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <RiTruckLine className="text-red-500 mb-1" size={20} />
                  <span className="text-[10px] font-bold text-gray-600 uppercase">
                    {singleProduct.delivery?.estimated || "3-5 Days"} Delivery
                  </span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <RiShieldCheckLine className="text-red-500 mb-1" size={20} />
                  <span className="text-[10px] font-bold text-gray-600 uppercase">
                    1 Year Warranty
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 sticky bottom-4 md:static z-10 bg-white py-2">
                <button
                  onClick={() => handleAddToCart(id)}
                  className="flex-1 flex items-center justify-center gap-3 border-2 border-red-500 text-red-500 py-4 rounded-lg font-bold hover:bg-red-50 transition active:scale-95"
                >
                  <RiShoppingCartFill size={20} /> ADD TO CART
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 flex items-center justify-center gap-3 bg-red-500 text-white py-4 rounded-lg font-bold hover:bg-red-600 transition shadow-lg shadow-red-200 active:scale-95"
                >
                  <RiFlashlightFill size={20} /> BUY NOW
                </button>
              </div>
            </div>
          </div>

          {/* Detailed Description Section */}
          <div className="border-t border-gray-100 p-6 md:p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Product Specifications
            </h3>
            <div className="prose prose-sm max-w-none text-gray-600 leading-loose">
              {singleProduct.description}
            </div>
          </div>
        </div>
        <ProductReviewPage />
      </main>
    </div>
  );
};

export default ProductDetailPage;
