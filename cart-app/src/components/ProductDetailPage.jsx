import React, { useEffect } from "react";
import {
  RiShoppingCartFill,
  RiHeartLine,
  RiFlashlightFill,
  RiTruckLine,
  RiPriceTag3Fill,
} from "react-icons/ri";
import { FaStar } from "react-icons/fa";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { getSingleProduct } from "../features/product/productSlice";
import { addToCart } from "../features/cart/cartSlice";
import { useParams } from "react-router-dom";
import Loader from "./Loader";
import { toast } from "react-hot-toast";

const ProductDetailPage = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const { singleProduct, loading, error } = useSelector(
    (state) => state.product
  );

  useEffect(() => {
    if (id) {
      dispatch(getSingleProduct(id));
    }
  }, [dispatch, id]);

  const handleAddToCart = (id) => {
    dispatch(addToCart({ productId: id }))
      .unwrap()
      .then(() => {
        toast.success("Product added to cart successfully!");
      })
      .catch((err) => {
        toast.error(err);
      });
    console.log("Product added to cart:", id);
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
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-wrap">
              {/* Image */}
              <div className="w-full lg:w-1/2">
                <img
                  src={singleProduct.image?.[0]}
                  alt={singleProduct.title}
                  className="w-full h-72 lg:h-96 object-cover rounded-lg"
                />
              </div>

              {/* Details */}
              <div className="w-full lg:w-1/2 lg:pl-10 mt-6 lg:mt-0">
                <h2 className="text-sm text-gray-500 uppercase mb-1">
                  {singleProduct.brand}
                </h2>

                <h1 className="text-2xl lg:text-3xl font-semibold mb-2">
                  {singleProduct.title}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="flex items-center gap-1 bg-green-600 text-white px-2 py-0.5 rounded text-sm">
                    {singleProduct.ratings?.average || 0}
                    <FaStar className="text-xs" />
                  </span>
                  <span className="text-gray-500 text-sm">
                    {singleProduct.ratings?.count || 0} ratings
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl font-bold">
                    ₹{price?.toLocaleString()}
                  </span>
                  <span className="text-lg text-gray-400 line-through">
                    ₹{mrp?.toLocaleString()}
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
                  <ul className="space-y-2 text-sm">
                    {singleProduct.offers?.map((offer, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <RiPriceTag3Fill className="text-green-600" />
                        {offer}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Delivery */}
                <div className="flex items-center gap-2 mb-6 text-sm">
                  <RiTruckLine className="text-green-600" />
                  Delivery in{" "}
                  <span className="font-medium">
                    {singleProduct.delivery?.estimated}
                  </span>{" "}
                  |{" "}
                  <span className="text-green-600">
                    {singleProduct.delivery?.cost}
                  </span>
                </div>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <button
                    className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition"
                    onClick={() => handleAddToCart(id)}
                  >
                    <RiShoppingCartFill />
                    Add to Cart
                  </button>

                  <button className="flex-1 flex items-center justify-center gap-2 bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition">
                    <RiFlashlightFill />
                    Buy Now
                  </button>

                  <button className="w-full sm:w-12 h-12 rounded-lg sm:rounded-full border flex items-center justify-center hover:bg-gray-100">
                    <RiHeartLine
                      size={22}
                      className="text-gray-600 hover:text-red-500"
                    />
                  </button>
                </div>

                {/* Description */}
                <div className="mt-8">
                  <h3 className="font-semibold mb-2">Product Description</h3>
                  <p className="text-gray-600 text-sm">
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
