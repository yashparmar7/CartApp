import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllProductsAdmin,
  getSingleProduct,
  updateSellerProductStatus,
  softDeleteSellerProduct,
} from "../../features/product/productSlice";
import {
  RiEdit2Line,
  RiDeleteBin6Line,
  RiEyeLine,
  RiErrorWarningFill,
  RiBox3Fill,
} from "react-icons/ri";
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
      }),
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
        {/* Left Side: Context & Title */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-200 shrink-0">
            <RiBox3Fill size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase leading-none">
              Master <span className="text-red-500">Catalog</span>
            </h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-2">
              Inventory Control & Management
            </p>
          </div>
        </div>

        {/* Right Side: Status Badges & Alerts */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end px-4 border-r border-gray-100 hidden sm:block">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
              Total Inventory
            </p>
            <p className="text-sm font-black text-gray-900">
              {products?.length || 0} Units
            </p>
          </div>

          <div className="bg-amber-50 px-5 py-2.5 rounded-2xl border border-amber-100 flex items-center gap-3 transition-all hover:bg-amber-100">
            <div className="relative">
              <RiErrorWarningFill className="text-amber-500 text-xl" />
              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-amber-50 animate-ping" />
              )}
            </div>
            <div>
              <p className="text-[9px] font-black text-amber-600 uppercase tracking-[0.1em] leading-none">
                Awaiting Approval
              </p>
              <p className="text-lg font-black text-amber-700 mt-0.5 leading-none">
                {pendingCount}{" "}
                <span className="text-[10px] font-bold opacity-60">items</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden space-y-4">
        {!loading && products.length === 0 && (
          <div className="bg-white rounded-[2rem] p-12 text-center border border-dashed border-gray-200">
            <p className="text-gray-400 font-bold tracking-tight">
              No products found in the catalog.
            </p>
          </div>
        )}

        {products.map((product) => {
          const { price, mrp, discountPercentage } = product.pricing || {};
          return (
            <div
              key={product._id}
              className="bg-white rounded-[2rem] p-5 border border-gray-100 shadow-sm transition-all active:scale-[0.98] hover:shadow-md"
            >
              <div className="flex gap-5">
                {/* Product Image with Stock Indicator */}
                <div className="relative shrink-0">
                  <img
                    src={product.image?.[0]}
                    alt={product.title}
                    className="w-20 h-20 rounded-2xl object-contain bg-gray-50 border border-gray-100 p-2 shadow-inner"
                  />
                  {product.stock < 10 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full animate-pulse" />
                  )}
                </div>

                {/* Content Area */}
                <div className="flex-1 min-w-0">
                  <div className="mb-1.5 flex items-center justify-between">
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase border 
                      ${
                        product.status === "PENDING"
                          ? "bg-amber-50 text-amber-600 border-amber-200"
                          : product.status === "APPROVED"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                            : "bg-rose-50 text-rose-600 border-rose-200"
                      }`}
                    >
                      {product.status}
                    </span>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
                      #{product._id.slice(-6)}
                    </span>
                  </div>

                  <h3 className="font-bold text-gray-900 truncate leading-tight text-sm">
                    {product.title}
                  </h3>

                  <p className="text-[10px] font-black text-gray-400 uppercase mt-1">
                    {product.brand} • {product.category?.name || "Global"}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm font-black text-gray-900">
                      ₹{price}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-1 rounded">
                      -{discountPercentage}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Vendor & Quick Actions */}
              <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter leading-none">
                    Vendor
                  </span>
                  <span className="text-xs font-bold text-gray-700 truncate max-w-[120px] mt-0.5">
                    {product.seller?.userName}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewProduct(product._id)}
                    className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm shadow-blue-100"
                  >
                    <RiEyeLine size={18} />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                      setIsEditOpen(true);
                    }}
                    className="p-2.5 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-600 hover:text-white transition-all shadow-sm shadow-amber-100"
                  >
                    <RiEdit2Line size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product._id)}
                    className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm shadow-red-100"
                  >
                    <RiDeleteBin6Line size={18} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="text-center py-10">
            <Loader />
          </div>
        )}
      </div>

      {/* ===================== DESKTOP TABLE VIEW (REDESIGNED) ===================== */}
      <div className="hidden lg:block bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="min-w-[1800px] w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                {[
                  "Visual",
                  "Product Details",
                  "Brand & Category",
                  "Seller / Vendor",
                  "Seller Contact",
                  "Net Price",
                  "MRP",
                  "Savings",
                  "Inventory",
                  "Rating Score",
                  "Order Vol.",
                  "Delivery Log",
                  "Current Status",
                  "Timestamp",
                  "Quick Actions",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {!loading && products.length === 0 && (
                <tr>
                  <td colSpan="15" className="text-center py-20 bg-gray-50/30">
                    <p className="text-gray-400 font-black uppercase tracking-widest text-sm italic">
                      No Master Data Available
                    </p>
                  </td>
                </tr>
              )}

              {products.map((product) => {
                const { price, mrp, discountPercentage } =
                  product.pricing || {};
                return (
                  <tr
                    key={product._id}
                    className="hover:bg-gray-50/50 transition-all duration-200 group"
                  >
                    {/* Image */}
                    <td className="px-6 py-4">
                      <div className="relative w-14 h-14">
                        <img
                          src={product.image?.[0]}
                          alt={product.title}
                          className="w-full h-full rounded-2xl object-contain border border-gray-100 bg-white p-1 group-hover:scale-110 transition-transform shadow-sm"
                        />
                      </div>
                    </td>

                    {/* Product Name */}
                    <td className="px-6 py-4">
                      <div className="max-w-[250px]">
                        <p className="text-sm font-black text-gray-900 line-clamp-1 group-hover:text-red-500 transition-colors uppercase tracking-tight">
                          {product.title}
                        </p>
                        <p className="text-[10px] text-gray-400 font-bold line-clamp-1 mt-1">
                          {product.description}
                        </p>
                      </div>
                    </td>

                    {/* Meta */}
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-black text-red-500 bg-red-50 px-2 py-0.5 rounded-md uppercase">
                        {product.brand}
                      </span>
                      <p className="text-xs font-bold text-gray-500 mt-1">
                        {product.category?.name || "General"}
                      </p>
                    </td>

                    {/* Seller Info */}
                    <td className="px-6 py-4">
                      <p className="text-sm font-black text-gray-800 leading-none">
                        {product.seller?.userName || "—"}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-gray-400 italic">
                      {product.seller?.email || "—"}
                    </td>

                    {/* Pricing */}
                    <td className="px-6 py-4 font-black text-gray-900">
                      ₹{price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-gray-400 line-through text-xs italic font-bold">
                      ₹{mrp.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                        {discountPercentage}% OFF
                      </span>
                    </td>

                    {/* Stock */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-2 h-2 rounded-full ${product.stock < 10 ? "bg-red-500 animate-pulse" : "bg-emerald-500"}`}
                        />
                        <span
                          className={`text-xs font-black ${product.stock < 10 ? "text-red-600 uppercase" : "text-gray-600"}`}
                        >
                          {product.stock < 10
                            ? `LOW (${product.stock})`
                            : `${product.stock} Units`}
                        </span>
                      </div>
                    </td>

                    {/* Rating */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <div className="flex text-yellow-400 scale-90 origin-left">
                          {renderStars(product.ratings?.average)}
                        </div>
                        <span className="text-[10px] font-black text-gray-300">
                          ({product.ratings?.count || 0})
                        </span>
                      </div>
                    </td>

                    {/* Performance */}
                    <td className="px-6 py-4">
                      <span className="text-xs font-black text-gray-900 border-b-2 border-red-500/20">
                        {product.ordersCount || 0} Orders
                      </span>
                    </td>

                    {/* Logistics */}
                    <td className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase leading-tight tracking-tighter">
                      {product.delivery?.estimated}
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase border tracking-widest
                        ${
                          product.status === "PENDING"
                            ? "bg-amber-50 text-amber-600 border-amber-200"
                            : product.status === "APPROVED"
                              ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                              : "bg-rose-50 text-rose-600 border-rose-200"
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-[10px] font-bold text-gray-400">
                      {new Date(product.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    {/* Row Actions */}
                    <td className="px-6 py-4 sticky right-0 bg-white group-hover:bg-gray-50 transition-colors">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => handleViewProduct(product._id)}
                          title="View Detail"
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-xl transition-all"
                        >
                          <RiEyeLine size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setIsEditOpen(true);
                          }}
                          title="Moderate"
                          className="p-2 text-amber-600 hover:bg-amber-100 rounded-xl transition-all"
                        >
                          <RiEdit2Line size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          title="Archive"
                          className="p-2 text-red-600 hover:bg-red-100 rounded-xl transition-all"
                        >
                          <RiDeleteBin6Line size={18} />
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
          <div className="p-12 text-center bg-white">
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
