import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllProductsAdmin,
  getSingleProduct,
  updateSellerProductStatus,
  softDeleteSellerProduct,
} from "../../features/product/productSlice";
import { RiEdit2Line, RiDeleteBin6Line, RiEyeLine } from "react-icons/ri";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import Loader from "../../components/Loader";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";

const Stat = ({ label, value }) => (
  <div className="bg-gray-50 rounded-xl p-3 text-center">
    <p className="text-xs text-gray-500">{label}</p>
    <p className="font-semibold text-gray-800">{value}</p>
  </div>
);

const InfoBox = ({ label, value }) => (
  <div className="bg-gray-50 rounded-xl p-3">
    <p className="text-xs text-gray-500">{label}</p>
    <p className="font-medium text-gray-800">{value}</p>
  </div>
);

const Products = () => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [activeImage, setActiveImage] = useState("");

  const [isViewOpen, setIsViewOpen] = useState(false);
  const { singleProduct } = useSelector((state) => state.product);

  const dispatch = useDispatch();
  const { products = [], loading } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getAllProductsAdmin());
  }, [dispatch]);

  const handleUpdateProduct = (product) => {
    if (
      ["REJECTED", "BLOCKED"].includes(product.status) &&
      !product.adminNote?.trim()
    ) {
      toast.error("Admin note is required for rejection or block");
      return;
    }

    dispatch(
      updateSellerProductStatus({
        id: product._id,
        status: product.status,
        adminNote: product.adminNote,
      })
    )
      .unwrap()
      .then((data) => {
        toast.success(data.message);
        dispatch(getAllProductsAdmin());
        setIsEditOpen(false);
      })
      .catch((err) => {
        toast.error(err || "Update failed");
      });
  };

  useEffect(() => {
    if (isViewOpen && singleProduct?.image?.length > 0) {
      setActiveImage(singleProduct.image[0]);
    }
  }, [isViewOpen, singleProduct]);

  const handleDeleteProduct = (id) => {
    Swal.fire({
      title: "Delete product?",
      text: "This product will be removed from the store.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(softDeleteSellerProduct(id))
          .unwrap()
          .then((data) => {
            Swal.fire({
              icon: "success",
              title: "Deleted!",
              text: data.message,
              timer: 1500,
              showConfirmButton: false,
            });
            dispatch(getAllProductsAdmin());
          })
          .catch((err) => {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: err || "Delete failed",
            });
          });
      }
    });
  };

  const handleViewProduct = (id) => {
    dispatch(getSingleProduct(id))
      .unwrap()
      .then(() => setIsViewOpen(true))
      .catch(() => toast.error("Failed to load product"));
  };

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
          Pending:{" "}
          <span className="font-semibold text-orange-600">{pendingCount}</span>
        </p>
      </div>

      {/* mobile */}
      <div className="lg:hidden space-y-4">
        {!loading && products.length === 0 && (
          <p className="text-center text-gray-500 py-10">No products found</p>
        )}

        {products.map((product) => {
          const { price, mrp, discountPercentage } = product.pricing || {};

          return (
            <div
              key={product._id}
              className="bg-white rounded-xl shadow border border-gray-300 p-4"
            >
              <div className="flex gap-4">
                <img
                  src={product.image?.[0]}
                  alt={product.title}
                  className="w-20 h-20 rounded-lg object-cover shadow border border-gray-300"
                />

                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 line-clamp-1">
                    {product.title}
                  </h3>

                  <p className="text-xs text-gray-500 line-clamp-2">
                    {product.description}
                  </p>

                  <p className="text-xs mt-1">
                    <span className="font-medium">{product.brand}</span> •{" "}
                    {product.category?.name || "—"}
                  </p>
                  <p className="text-xs mt-1">
                    <span className="font-medium">
                      {product.seller?.userName}
                    </span>{" "}
                    • {product.seller?.email || "—"}
                  </p>
                </div>
              </div>

              {/* PRICE */}
              <div className="flex items-center gap-3 mt-3">
                <span className="text-lg font-bold">₹{price}</span>
                <span className="text-sm text-gray-400 line-through">
                  ₹{mrp}
                </span>
                <span className="text-sm text-green-600 font-semibold">
                  {discountPercentage}%
                </span>
              </div>

              {/* META */}
              <div className="flex justify-between items-center mt-3">
                <div className="flex items-center gap-1">
                  {renderStars(product.ratings?.average)}
                  <span className="text-xs text-gray-500">
                    ({product.ratings?.count || 0})
                  </span>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    product.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-700"
                      : product.status === "APPROVED"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {product.status}
                </span>
              </div>

              {/* STOCK */}
              <div className="flex justify-between mt-3 text-xs text-gray-600">
                <p>
                  Stock:{" "}
                  {product.stock < 10 ? (
                    <span className="text-red-600 font-semibold">
                      Low ({product.stock})
                    </span>
                  ) : (
                    product.stock
                  )}
                </p>
                <p>{product.delivery?.estimated}</p>
              </div>

              {/* ACTIONS */}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => handleViewProduct(product._id)}
                  className="p-2 rounded-lg bg-gray-200 hover:bg-gray-700 hover:text-white"
                >
                  <RiEyeLine />
                </button>

                <button
                  onClick={() => {
                    setSelectedProduct(product);
                    setIsEditOpen(true);
                  }}
                  className="p-2 rounded-lg bg-gray-200 hover:bg-gray-700 hover:text-white"
                >
                  <RiEdit2Line />
                </button>

                <button
                  onClick={() => handleDeleteProduct(product._id)}
                  className="p-2 rounded-lg bg-gray-200 hover:bg-red-600 hover:text-white"
                >
                  <RiDeleteBin6Line />
                </button>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="text-center py-6">
            <Loader />
          </div>
        )}
      </div>

      {/* Desktop */}
      <div className="hidden lg:block bg-white rounded-2xl shadow border border-gray-300 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[1800px] w-full text-sm">
            <thead className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
              <tr>
                {[
                  "Image",
                  "Product",
                  "Brand",
                  "Category",
                  "Seller",
                  "Email",
                  "Price",
                  "MRP",
                  "Discount",
                  "Stock",
                  "Rating",
                  "Orders",
                  "Delivery",
                  "Status",
                  "Created",
                  "Action",
                ].map((h) => (
                  <th key={h} className="px-4 py-3 text-left whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {!loading && products.length === 0 && (
                <tr>
                  <td colSpan="15" className="text-center py-10 text-gray-500">
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
                    className="border-b border-gray-300 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">
                      <img
                        src={product.image?.[0]}
                        alt={product.title}
                        className="w-12 h-12 rounded-lg object-cover border border-gray-300 shadow"
                      />
                    </td>

                    <td className="px-4 py-3">
                      <p className="font-semibold line-clamp-1">
                        {product.title}
                      </p>
                      <p className="text-xs text-gray-500 line-clamp-1">
                        {product.description}
                      </p>
                    </td>

                    <td className="px-4 py-3">{product.brand}</td>
                    <td className="px-4 py-3">
                      {product.category?.name || "—"}
                    </td>
                    <td className="px-4 py-3">
                      {product.seller?.userName || "—"}
                    </td>
                    <td className="px-4 py-3">
                      {product.seller?.email || "—"}
                    </td>
                    <td className="px-4 py-3 font-medium">₹{price}</td>
                    <td className="px-4 py-3 line-through text-gray-400">
                      ₹{mrp}
                    </td>
                    <td className="px-4 py-3 text-green-600 font-semibold">
                      {discountPercentage}%
                    </td>
                    <td className="px-4 py-3">
                      {product.stock < 10 ? (
                        <span className="text-red-600 font-semibold">
                          Low ({product.stock})
                        </span>
                      ) : (
                        product.stock
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {renderStars(product.ratings?.average)}
                      </div>
                    </td>
                    <td className="px-4 py-3">{product.ordersCount || 0}</td>
                    <td className="px-4 py-3 text-xs">
                      {product.delivery?.estimated}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          product.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : product.status === "APPROVED"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleViewProduct(product._id)}
                          className="p-2 rounded-lg bg-gray-200 hover:bg-gray-700 hover:text-white"
                        >
                          <RiEyeLine />
                        </button>

                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setIsEditOpen(true);
                          }}
                          className="p-2 rounded-lg bg-gray-200 hover:bg-gray-700 hover:text-white"
                        >
                          <RiEdit2Line />
                        </button>

                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="p-2 rounded-lg bg-gray-200 hover:bg-red-600 hover:text-white"
                        >
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

      {isEditOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm sm:max-w-md bg-white rounded-2xl shadow-2xl animate-[scaleIn_0.2s_ease-out]">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-300">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                Moderate Product
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Review and update product status
              </p>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-4">
              {/* Product Title */}
              <div>
                <label className="text-xs font-medium text-gray-500">
                  Product
                </label>
                <input
                  disabled
                  value={selectedProduct.title}
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-700 cursor-not-allowed"
                />
              </div>

              {/* Seller */}
              <div>
                <label className="text-xs font-medium text-gray-500">
                  Seller
                </label>
                <input
                  disabled
                  value={selectedProduct.seller?.userName || "—"}
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-700 cursor-not-allowed"
                />
              </div>

              {/* Status */}
              <div>
                <label className="text-xs font-medium text-gray-500">
                  Status
                </label>
                <select
                  value={selectedProduct.status}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      status: e.target.value,
                    })
                  }
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="BLOCKED">Blocked</option>
                </select>
              </div>

              {/* Admin Note */}
              <div>
                <label className="text-xs font-medium text-gray-500">
                  Admin Note
                </label>
                <textarea
                  rows="3"
                  placeholder="Reason for rejection / block"
                  value={selectedProduct.adminNote || ""}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      adminNote: e.target.value,
                    })
                  }
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-300 flex flex-col sm:flex-row gap-3 sm:justify-end">
              <button
                onClick={() => setIsEditOpen(false)}
                className="w-full sm:w-auto px-4 py-2 rounded-lg border text-sm text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={() => handleUpdateProduct(selectedProduct)}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {isViewOpen && singleProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          {/* MODAL */}
          <div
            className="
        w-full max-w-5xl
        bg-white rounded-2xl shadow-2xl
        max-h-[90vh] flex flex-col overflow-hidden
      "
          >
            {/* HEADER */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                Product Details
              </h2>
              <button
                onClick={() => setIsViewOpen(false)}
                className="text-gray-400 hover:text-red-500 text-xl"
              >
                ✕
              </button>
            </div>

            {/* BODY */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* IMAGE (SINGLE – HERO STYLE) */}
                {/* IMAGES */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Product Images
                  </h3>

                  {/* MAIN IMAGE */}
                  <div className="w-full aspect-square rounded-xl border bg-white overflow-hidden flex items-center justify-center">
                    {activeImage ? (
                      <img
                        src={activeImage}
                        alt={singleProduct.title}
                        className="w-full h-full object-contain p-4 transition-transform duration-300 hover:scale-105"
                        draggable={false}
                      />
                    ) : (
                      <div className="text-gray-400 text-sm">No image</div>
                    )}
                  </div>

                  {/* THUMBNAILS */}
                  {singleProduct.image?.length > 1 && (
                    <div className="flex gap-3 flex-wrap">
                      {singleProduct.image.map((img, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveImage(img)}
                          className={`w-16 h-16 rounded-lg border overflow-hidden transition
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
                </div>

                {/* DETAILS */}
                <div className="space-y-5">
                  {/* TITLE + DESC */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {singleProduct.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                      {singleProduct.description}
                    </p>
                  </div>

                  {/* BRAND / CATEGORY */}
                  <div className="flex flex-wrap gap-4 text-sm">
                    <p>
                      <b>Brand:</b> {singleProduct.brand}
                    </p>
                    <p>
                      <b>Category:</b> {singleProduct.category?.name}
                    </p>
                  </div>

                  {/* PRICE */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Pricing
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-2xl font-bold text-gray-800">
                        ₹{singleProduct.pricing?.price}
                      </span>
                      <span className="line-through text-gray-400">
                        ₹{singleProduct.pricing?.mrp}
                      </span>
                      <span className="text-green-600 font-semibold">
                        {singleProduct.pricing?.discountPercentage}% OFF
                      </span>
                    </div>
                  </div>

                  {/* DELIVERY */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                    <InfoBox
                      label="Delivery"
                      value={singleProduct.delivery?.estimated}
                    />
                    <InfoBox
                      label="Cost"
                      value={singleProduct.delivery?.cost}
                    />
                    <InfoBox
                      label="COD"
                      value={
                        singleProduct.delivery?.codAvailable
                          ? "Available"
                          : "No"
                      }
                    />
                  </div>

                  {/* STATS */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                    <Stat label="Stock" value={singleProduct.stock} />
                    <Stat label="Orders" value={singleProduct.ordersCount} />
                    <Stat label="Sold" value={singleProduct.soldCount} />
                    <Stat
                      label="Active"
                      value={singleProduct.isActive ? "Yes" : "No"}
                    />
                  </div>

                  {/* RATING */}
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {renderStars(singleProduct.ratings?.average)}
                    </div>
                    <span className="text-xs text-gray-500">
                      ({singleProduct.ratings?.count} reviews)
                    </span>
                  </div>

                  {/* STATUS */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <span
                      className={`px-4 py-1 rounded-full text-xs font-semibold w-fit ${
                        singleProduct.status === "APPROVED"
                          ? "bg-emerald-100 text-emerald-700"
                          : singleProduct.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {singleProduct.status}
                    </span>

                    {singleProduct.adminNote && (
                      <p className="text-xs text-gray-500">
                        <b>Admin Note:</b> {singleProduct.adminNote}
                      </p>
                    )}
                  </div>

                  {/* META */}
                  <div className="text-xs text-gray-400">
                    Created:{" "}
                    {new Date(singleProduct.createdAt).toLocaleString()}
                    <br />
                    Updated:{" "}
                    {new Date(singleProduct.updatedAt).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
