import React, { useEffect, useState } from "react";

import {
  RiShoppingCartFill,
  RiHeartLine,
  RiFlashlightFill,
  RiTruckLine,
  RiPriceTag3Fill,
} from "react-icons/ri";
import { FaStar } from "react-icons/fa";
import Navbar from "./Navbar";
import { useDispatch, useSelector } from "react-redux";
import { getSingleProduct } from "../features/product/productSlice";
import { addToCart } from "../features/cart/cartSlice";
import { selectIsAuthenticated } from "../features/auth/authSlice";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "./Loader";
import { toast } from "react-hot-toast";

const ProductDetailPage = () => {
  const [activeImage, setActiveImage] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { singleProduct, loading, error } = useSelector(
    (state) => state.product
  );
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // useEffect(() => {
  //   if (id) dispatch(getSingleProduct(id));
  // }, [dispatch, id]);

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
      .catch((err) =>
        toast.error(err?.message || "Failed to add product to cart")
      );
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      toast.error("Please login to continue");
      return;
    }
    navigate("/cart");
  };

  if (loading) return <Loader />;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!singleProduct?._id) return null;

  const price = singleProduct.pricing?.price;
  const mrp = singleProduct.pricing?.mrp;
  const discount = singleProduct.pricing?.discountPercentage;

  return (
    <>
      <Navbar />

      <section className="bg-gray-50 py-6 sm:py-10">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* IMAGE */}
              {/* IMAGE GALLERY */}
              <div className="w-full flex flex-col sm:flex-row gap-4">
                {/* Thumbnails */}
                {singleProduct.image?.length > 1 && (
                  <div className="flex sm:flex-col gap-3 order-2 sm:order-1 justify-center">
                    {singleProduct.image.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImage(img)}
                        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl border overflow-hidden transition
            ${
              activeImage === img
                ? "border-red-500 ring-2 ring-red-200"
                : "border-gray-200 hover:border-gray-400"
            }`}
                      >
                        <img
                          src={img}
                          alt={`thumb-${index}`}
                          className="w-full h-full object-contain p-1"
                          draggable={false}
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Main Image */}
                <div className="relative w-full max-w-lg aspect-square rounded-2xl bg-white border border-gray-200 overflow-hidden order-1 sm:order-2">
                  <img
                    src={activeImage}
                    alt={singleProduct.title}
                    className="w-full h-full object-contain p-6 transition-transform duration-300 ease-out hover:scale-110"
                    loading="eager"
                    draggable={false}
                  />
                </div>
              </div>

              {/* DETAILS */}
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 uppercase">
                  {singleProduct.brand}
                </span>

                <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold mt-1">
                  {singleProduct.title}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-3">
                  <span className="flex items-center gap-1 bg-green-600 text-white px-2 py-0.5 rounded text-sm">
                    {singleProduct.ratings?.average || 0}
                    <FaStar className="text-xs" />
                  </span>
                  <span className="text-gray-500 text-sm">
                    {singleProduct.ratings?.count || 0} ratings
                  </span>
                </div>

                {/* Price */}
                <div className="flex flex-wrap items-center gap-3 mt-4">
                  <span className="text-2xl sm:text-3xl font-bold">
                    ₹{price?.toLocaleString()}
                  </span>
                  <span className="text-gray-400 line-through">
                    ₹{mrp?.toLocaleString()}
                  </span>
                  <span className="text-green-600 font-semibold">
                    {discount}% off
                  </span>
                </div>

                <p className="text-sm text-green-600 mt-1">
                  Inclusive of all taxes
                </p>

                {/* Offers */}
                {singleProduct.offers?.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold mb-2">Available Offers</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      {singleProduct.offers.map((offer, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <RiPriceTag3Fill className="text-green-600 mt-0.5" />
                          <span>{offer}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Delivery */}
                <div className="flex items-center gap-2 mt-5 text-sm text-gray-700">
                  <RiTruckLine className="text-green-600" />
                  Delivery in{" "}
                  <span className="font-medium">
                    {singleProduct.delivery?.estimated}
                  </span>
                  <span className="text-green-600 ml-1">
                    {singleProduct.delivery?.cost}
                  </span>
                </div>

                {/* CTA */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
                  <button
                    onClick={() => handleAddToCart(id)}
                    className="flex items-center justify-center gap-2 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 active:scale-95 transition"
                  >
                    <RiShoppingCartFill />
                    Add to Cart
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="flex items-center justify-center gap-2 bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 active:scale-95 transition"
                  >
                    <RiFlashlightFill />
                    Buy Now
                  </button>

                  <button className="sm:col-span-2 h-12 rounded-xl border flex items-center justify-center hover:bg-gray-100 transition">
                    <RiHeartLine
                      size={22}
                      className="text-gray-600 hover:text-red-500"
                    />
                  </button>
                </div>

                {/* Description */}
                <div className="mt-8">
                  <h3 className="font-semibold mb-2">Product Description</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {singleProduct.description}
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
