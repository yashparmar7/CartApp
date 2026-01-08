import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductsAdmin } from "../../features/product/productSlice";
import { RiEdit2Line, RiDeleteBin6Line, RiEyeLine } from "react-icons/ri";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import Loader from "../../components/Loader";

const Products = () => {
  const dispatch = useDispatch();
  const { products = [], loading } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getAllProductsAdmin());
  }, [dispatch]);

  const renderStars = (rating = 0) =>
    [...Array(5)].map((_, i) => {
      const index = i + 1;
      if (rating >= index)
        return <FaStar key={i} className="text-yellow-500" />;
      if (rating >= index - 0.5)
        return <FaStarHalfAlt key={i} className="text-yellow-500" />;
      return <FaRegStar key={i} className="text-gray-300" />;
    });

  const pendingCount = products.filter((p) => p.status === "PENDING").length;

  return (
    <div className="p-4 sm:p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
          Products
        </h1>

        <p className="text-sm text-gray-500">
          Pending Approval:{" "}
          <span className="font-semibold text-orange-600">{pendingCount}</span>
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[1800px] w-full text-sm">
            {/* TABLE HEADER */}
            <thead className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Image</th>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-left">Brand</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Seller</th>
                <th className="px-4 py-3 text-left">Price</th>
                <th className="px-4 py-3 text-left">MRP</th>
                <th className="px-4 py-3 text-left">Discount</th>
                <th className="px-4 py-3 text-left">Stock</th>
                <th className="px-4 py-3 text-left">Rating</th>
                <th className="px-4 py-3 text-left">Orders</th>
                <th className="px-4 py-3 text-left">Delivery</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Created</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>

            {/* TABLE BODY */}
            <tbody>
              {!loading && products.length === 0 && (
                <tr>
                  <td
                    colSpan="15"
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    No products found
                  </td>
                </tr>
              )}

              {products.map((product) => {
                const { price, mrp, discountPercentage } =
                  product.pricing || {};

                return (
                  <tr
                    key={product._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    {/* IMAGE */}
                    <td className="px-4 py-3">
                      <img
                        src={product.image?.[0]}
                        alt={product.title}
                        className="w-12 h-12 rounded-lg object-cover border"
                      />
                    </td>

                    {/* PRODUCT */}
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-800 line-clamp-1">
                        {product.title}
                      </p>
                      <p className="text-xs text-gray-500 line-clamp-1">
                        {product.description}
                      </p>
                    </td>

                    {/* BRAND */}
                    <td className="px-4 py-3">{product.brand}</td>

                    {/* CATEGORY */}
                    <td className="px-4 py-3">
                      {product.category?.name || "—"}
                    </td>

                    {/* SELLER */}
                    <td className="px-4 py-3">
                      {product.seller?.shopName || "—"}
                    </td>

                    {/* PRICE */}
                    <td className="px-4 py-3 font-medium">₹{price}</td>

                    {/* MRP */}
                    <td className="px-4 py-3 text-gray-400 line-through">
                      ₹{mrp}
                    </td>

                    {/* DISCOUNT */}
                    <td className="px-4 py-3">
                      <span className="text-green-600 font-semibold">
                        {discountPercentage}%
                      </span>
                    </td>

                    {/* STOCK */}
                    <td className="px-4 py-3">
                      {product.stock < 10 ? (
                        <span className="text-red-600 font-semibold">
                          Low ({product.stock})
                        </span>
                      ) : (
                        product.stock
                      )}
                    </td>

                    {/* RATING */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {renderStars(product.ratings?.average)}
                        <span className="text-xs text-gray-500">
                          ({product.ratings?.count || 0})
                        </span>
                      </div>
                    </td>

                    {/* ORDERS */}
                    <td className="px-4 py-3">{product.ordersCount || 0}</td>

                    {/* DELIVERY */}
                    <td className="px-4 py-3">
                      <p className="text-xs">{product.delivery?.estimated}</p>
                      <p className="text-xs text-green-600">
                        {product.delivery?.cost}
                      </p>
                    </td>

                    {/* STATUS */}
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          product.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : product.status === "APPROVED"
                            ? "bg-emerald-100 text-emerald-700"
                            : product.status === "REJECTED"
                            ? "bg-rose-100 text-rose-700"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>

                    {/* CREATED */}
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </td>

                    {/* ACTIONS */}
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <button className="p-2 rounded-lg bg-gray-200 hover:bg-gray-600 hover:text-white">
                          <RiEyeLine />
                        </button>

                        <button
                          disabled={product.status === "PENDING"}
                          className="p-2 rounded-lg bg-gray-200 hover:bg-gray-600 hover:text-white disabled:opacity-50"
                        >
                          <RiEdit2Line />
                        </button>

                        <button className="p-2 rounded-lg bg-gray-200 hover:bg-red-600 hover:text-white">
                          <RiDeleteBin6Line />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {loading && (
          <div className="p-6 text-center">
            <Loader />
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
