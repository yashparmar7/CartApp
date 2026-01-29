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
  RiCloseLine,
  RiMoneyRupeeCircleFill,
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

const StatTile = ({ label, value }) => (
  <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center hover:shadow-md transition-all">
    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
      {label}
    </p>
    <p className="mt-1 text-lg font-black text-gray-900 tracking-tight">
      {value ?? "—"}
    </p>
  </div>
);
const DetailBox = ({ label, value }) => (
  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
      {label}
    </p>
    <p className="mt-1 text-sm font-bold text-gray-800">{value ?? "—"}</p>
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
                        {product.dynamicOrderCount || 0} Orders
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-md px-4 transition-all duration-300">
          <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl animate-in zoom-in duration-300 border border-white/20 overflow-hidden">
            {/* HEADER: Branded & Authoritative */}
            <div className="bg-red-500 p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black uppercase tracking-tight leading-none">
                  Moderate <span className="text-red-100">Product</span>
                </h2>
                <p className="text-red-100 text-[10px] font-black uppercase tracking-[0.2em] mt-2 opacity-80">
                  Compliance & Quality Control
                </p>
              </div>
            </div>

            {/* BODY: Structured Premium Inputs */}
            <div className="p-8 space-y-6">
              {/* Read-Only Identity Card */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 group transition-all">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center border border-gray-200 shadow-sm overflow-hidden shrink-0">
                  <img
                    src={selectedProduct.image?.[0]}
                    className="w-full h-full object-contain"
                    alt=""
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                    Selected Item
                  </p>
                  <p className="text-sm font-bold text-gray-900 truncate mt-1">
                    {selectedProduct.title}
                  </p>
                  <p className="text-[10px] font-bold text-red-500 uppercase tracking-tighter mt-0.5">
                    By {selectedProduct.seller?.userName || "Unknown Vendor"}
                  </p>
                </div>
              </div>

              {/* Status Selection */}
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">
                  Update Moderation Status
                </label>
                <div className="relative group">
                  <select
                    value={selectedProduct.status}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        status: e.target.value,
                      })
                    }
                    className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50 font-bold text-sm text-gray-800 outline-none focus:bg-white focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all appearance-none cursor-pointer"
                  >
                    <option value="PENDING">Pending Review</option>
                    <option value="APPROVED">Approve Listing</option>
                    <option value="REJECTED">Reject Submission</option>
                    <option value="BLOCKED">Block Product</option>
                  </select>
                </div>
              </div>

              {/* Admin Feedback */}
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">
                  Admin Note (Visible to Seller)
                </label>
                <textarea
                  rows="3"
                  placeholder="Explain the reason for rejection or block..."
                  value={selectedProduct.adminNote || ""}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      adminNote: e.target.value,
                    })
                  }
                  className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50 font-medium text-sm text-gray-700 outline-none focus:bg-white focus:ring-4 focus:ring-red-500/10 focus:border-red-500 resize-none transition-all placeholder:text-gray-400"
                />
              </div>

              {/* ACTIONS: Large & Tactile */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setIsEditOpen(false)}
                  className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95"
                >
                  Discard
                </button>
                <button
                  onClick={() => handleUpdateProduct(selectedProduct)}
                  className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-red-200 hover:bg-red-600 transition-all active:scale-95"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isViewOpen && singleProduct && (
        <div className="fixed inset-0 z-[100] bg-gray-900/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 transition-all duration-500">
          {/* MODAL CONTAINER */}
          <div className="w-full max-w-6xl bg-white rounded-[3rem] shadow-2xl max-h-[90vh] flex flex-col overflow-hidden border border-white/20 animate-in slide-in-from-bottom-4 duration-500">
            {/* HEADER: Branded & Fixed */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-50 bg-white sticky top-0 z-20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-200">
                  <RiEyeLine size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight leading-none">
                    Product <span className="text-red-500">Inspector</span>
                  </h2>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1.5 italic opacity-70">
                    System ID: #{singleProduct._id.slice(-12).toUpperCase()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsViewOpen(false)}
                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-50 text-gray-400 hover:text-red-500 transition-all hover:bg-red-50 group"
              >
                <RiCloseLine
                  size={28}
                  className="group-hover:rotate-90 transition-transform duration-300"
                />
              </button>
            </div>

            {/* BODY: Scrollable content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar bg-[#F9FAFB]/50">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                {/* LEFT: VISUAL ASSETS */}
                <div className="space-y-6 sticky lg:top-0">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">
                    Visual Assets
                  </h3>
                  <div className="w-full aspect-square rounded-[2.5rem] border border-gray-100 bg-white shadow-sm overflow-hidden flex items-center justify-center p-12 group relative">
                    {activeImage ? (
                      <img
                        src={activeImage}
                        alt={singleProduct.title}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 select-none"
                        draggable={false}
                      />
                    ) : (
                      <div className="text-gray-300 font-black uppercase text-xs tracking-widest italic">
                        Graphic Missing
                      </div>
                    )}
                  </div>

                  {/* THUMBNAILS GALLERY */}
                  {singleProduct.image?.length > 1 && (
                    <div className="flex gap-4 flex-wrap justify-center bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm">
                      {singleProduct.image.map((img, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveImage(img)}
                          className={`w-20 h-20 rounded-2xl border-2 overflow-hidden transition-all duration-300 shrink-0 
                      ${activeImage === img ? "border-red-500 scale-95 shadow-md shadow-red-100" : "border-gray-100 opacity-60 hover:opacity-100 hover:scale-105"}`}
                        >
                          <img
                            src={img}
                            className="w-full h-full object-cover"
                            alt={`view-${index}`}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* RIGHT: DATA & ANALYTICS */}
                <div className="space-y-8">
                  {/* 1. Identity & Narrative */}
                  <div>
                    <div className="flex items-center gap-3 mb-5">
                      <span
                        className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border 
                  ${
                    singleProduct.status === "APPROVED"
                      ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                      : singleProduct.status === "PENDING"
                        ? "bg-amber-50 text-amber-600 border-amber-200"
                        : "bg-rose-50 text-rose-600 border-rose-200"
                  }`}
                      >
                        {singleProduct.status}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-gray-900 text-white text-[9px] font-black uppercase tracking-tighter">
                        {singleProduct.isActive ? "Live" : "Hidden"}
                      </span>
                    </div>
                    <h3 className="text-4xl font-black text-gray-900 leading-none tracking-tighter uppercase italic">
                      {singleProduct.title}
                    </h3>
                    <p className="text-gray-500 font-medium mt-6 text-sm leading-relaxed bg-white p-6 rounded-3xl border border-gray-100 italic shadow-sm border-l-4 border-l-red-500">
                      "{singleProduct.description}"
                    </p>
                  </div>

                  {/* 2. Classification Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <DetailBox
                      label="Assigned Brand"
                      value={singleProduct.brand || "Private Label"}
                    />
                    <DetailBox
                      label="Master Category"
                      value={singleProduct.category?.name || "Uncategorized"}
                    />
                  </div>

                  {/* 3. Pricing Logic Card */}
                  <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-gray-200">
                    <RiMoneyRupeeCircleFill className="absolute -right-4 -bottom-4 text-white/5 text-[10rem] pointer-events-none" />
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">
                      Market Valuation
                    </p>
                    <div className="flex items-baseline gap-4 relative z-10">
                      <span className="text-4xl font-black tracking-tighter italic">
                        ₹{singleProduct.pricing?.price.toLocaleString()}
                      </span>
                      <span className="text-gray-500 line-through font-bold text-sm">
                        ₹{singleProduct.pricing?.mrp.toLocaleString()}
                      </span>
                      <span className="bg-red-500 text-white text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-tighter shadow-lg shadow-red-500/20">
                        {singleProduct.pricing?.discountPercentage}% OFF
                      </span>
                    </div>
                  </div>

                  {/* 4. Logistics & Supply Chain */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <StatTile
                      label="Lead Time"
                      value={singleProduct.delivery?.estimated || "—"}
                    />
                    <StatTile
                      label="Ship Fee"
                      value={
                        singleProduct.delivery?.cost === 0
                          ? "Free"
                          : `₹${singleProduct.delivery?.cost}`
                      }
                    />
                    <StatTile
                      label="COD Support"
                      value={
                        singleProduct.delivery?.codAvailable
                          ? "Active"
                          : "Disabled"
                      }
                    />
                  </div>

                  {/* 5. Inventory & Sales Performance */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <StatTile
                      label="Stock On Hand"
                      value={singleProduct.stock}
                    />
                    <StatTile
                      label="Lifetime Orders"
                      value={singleProduct.ordersCount || 0}
                    />
                    <StatTile
                      label="Total Units Sold"
                      value={singleProduct.soldCount || 0}
                    />
                    <StatTile
                      label="Review Count"
                      value={singleProduct.ratings?.count || 0}
                    />
                  </div>

                  {/* 6. Ratings & Moderation Logs */}
                  <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-white border border-gray-100 rounded-[2rem] shadow-sm gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex text-yellow-400 text-xl">
                        {renderStars(singleProduct.ratings?.average)}
                      </div>
                      <p className="text-sm font-black text-gray-900 uppercase tracking-tighter italic">
                        ({singleProduct.ratings?.average?.toFixed(1)} / 5.0)
                      </p>
                    </div>
                    {singleProduct.adminNote && (
                      <div className="bg-red-50 px-4 py-2 rounded-xl border border-red-100">
                        <p className="text-[9px] font-black text-red-400 uppercase tracking-widest">
                          Moderator Feedback
                        </p>
                        <p className="text-[11px] font-bold text-red-600 italic">
                          "{singleProduct.adminNote}"
                        </p>
                      </div>
                    )}
                  </div>

                  {/* 7. System Metadata */}
                  <div className="flex justify-between items-center px-4 border-t border-gray-100 pt-6">
                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">
                      Entry Date:{" "}
                      {new Date(singleProduct.createdAt).toLocaleString()}
                    </p>
                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">
                      Last Update:{" "}
                      {new Date(singleProduct.updatedAt).toLocaleString()}
                    </p>
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
