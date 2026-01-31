import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getSellerMyProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../features/product/productSlice";
import { getAllCategories } from "../../features/category/categorySlice";
import {
  RiEdit2Line,
  RiDeleteBin6Line,
  RiEyeLine,
  RiBox3Fill,
  RiAddLine,
  RiAddBoxFill,
  RiFileList3Line,
  RiMoneyRupeeCircleLine,
  RiInformationFill,
  RiTruckLine,
  RiHandCoinFill,
  RiFireFill,
  RiStarSmileFill,
  RiImageAddLine,
  RiUploadCloud2Fill,
  RiCloseLine,
  RiSendPlaneFill,
  RiDeleteBinLine,
  RiSave3Fill,
  RiImageEditLine,
  RiShieldCheckFill,
  RiEditBoxFill,
  RiMoneyRupeeCircleFill,
} from "react-icons/ri";
import { FaStar, FaStarHalfAlt, FaRegStar, FaPlus } from "react-icons/fa";
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

const SectionHeader = ({ icon, title }) => (
  <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
    <div className="text-red-500 text-xl">{icon}</div>
    <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] italic">
      {title}
    </h3>
  </div>
);

const InputGroup = ({ label, children }) => (
  <div className="group">
    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block transition-colors group-focus-within:text-red-500">
      {label}
    </label>
    {children}
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

const MyProducts = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    brand: "",
    description: "",
    category: "",

    pricing: {
      price: "",
      mrp: "",
    },

    stock: "",

    delivery: {
      estimated: "3-5 Days",
      cost: "Free",
      codAvailable: true,
    },

    offers: "",

    // Top Deal fields
    isTopDeal: false,
    topDealStart: "",
    topDealEnd: "",
  });

  const [images, setImages] = useState([]);
  const [activeImage, setActiveImage] = useState("");

  const [existingImages, setExistingImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);

  const [isViewOpen, setIsViewOpen] = useState(false);
  const { singleProduct } = useSelector((state) => state.product);

  const { myProducts, loading, sellerProductsStatus } = useSelector(
    (state) => state.product,
  );

  const { categories, status: categoryStatus } = useSelector(
    (state) => state.category,
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (sellerProductsStatus === "idle") {
      dispatch(getSellerMyProducts());
    }
    if (categoryStatus === "idle") {
      dispatch(getAllCategories());
    }
  }, [dispatch, sellerProductsStatus, categoryStatus]);

  useEffect(() => {
    if (isViewOpen && singleProduct?.image?.length > 0) {
      setActiveImage(singleProduct.image[0]);
    }
  }, [isViewOpen, singleProduct]);

  const handleCreateProduct = async (e) => {
    e.preventDefault();

    try {
      if (formData.isTopDeal) {
        if (!formData.topDealStart || !formData.topDealEnd) {
          toast.error("Top Deal start and end time are required");
          return;
        }

        if (new Date(formData.topDealEnd) <= new Date(formData.topDealStart)) {
          toast.error("Top Deal end time must be after start time");
          return;
        }
      }

      await dispatch(createProduct({ formData, images })).unwrap();

      toast.success("Product created successfully!");

      setFormData({
        title: "",
        brand: "",
        description: "",
        category: "",
        pricing: { price: "", mrp: "" },
        stock: "",
        delivery: {
          estimated: "3-5 Days",
          cost: "Free",
          codAvailable: true,
        },
        offers: "",
        isTopDeal: false,
        topDealStart: "",
        topDealEnd: "",
      });

      setImages([]);
      setIsCreateOpen(false);

      dispatch(getSellerMyProducts());
    } catch (err) {
      toast.error(err?.message || "Failed to create product");
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  const removeNewImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (imgUrl) => {
    setExistingImages((prev) => prev.filter((img) => img !== imgUrl));
    setRemovedImages((prev) => [...prev, imgUrl]);
  };

  const prepareEditPayload = (product) => ({
    title: product.title,
    brand: product.brand,
    description: product.description,
    category: product.category?._id || product.category,
    pricing: {
      price: Number(product.pricing?.price),
      mrp: Number(product.pricing?.mrp),
    },
    stock: Number(product.stock),
    delivery: {
      estimated: product.delivery?.estimated,
      cost: product.delivery?.cost,
      codAvailable: product.delivery?.codAvailable,
    },
    offers: product.offers,
    isActive: product.isActive,
    status: product.status,
    // Top Deal fields
    isTopDeal: product.isTopDeal || false,
    topDealStart: product.topDealStart
      ? new Date(product.topDealStart).toISOString().slice(0, 16)
      : "",
    topDealEnd: product.topDealEnd
      ? new Date(product.topDealEnd).toISOString().slice(0, 16)
      : "",
  });

  const closeEditModal = () => {
    setIsEditOpen(false);
    setSelectedProduct(null);
    setImages([]);
    setExistingImages([]);
    setRemovedImages([]);
  };

  const handleSaveChanges = async () => {
    if (selectedProduct.isTopDeal) {
      if (!selectedProduct.topDealStart || !selectedProduct.topDealEnd) {
        toast.error("Top Deal start and end time are required");
        return;
      }

      if (
        new Date(selectedProduct.topDealEnd) <=
        new Date(selectedProduct.topDealStart)
      ) {
        toast.error("Top Deal end time must be after start time");
        return;
      }
    }

    if (!selectedProduct?._id) {
      toast.error("Invalid product");
      return;
    }

    const payload = prepareEditPayload(selectedProduct);

    const updatePayload = {
      id: selectedProduct._id,
      formData: payload,
      images: images,
      removedImages: removedImages,
    };

    try {
      await dispatch(updateProduct(updatePayload)).unwrap();

      toast.success("Product updated successfully");

      closeEditModal();
      dispatch(getSellerMyProducts());
    } catch (err) {
      toast.error(err?.message || "Failed to update product");
    }
  };

  const handleDeleteProduct = async (id) => {
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
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await dispatch(deleteProduct(id)).unwrap();
          toast.success("Product deleted successfully");
          dispatch(getSellerMyProducts());
        } catch (err) {
          toast.error(err?.message || "Failed to delete product");
        }
      }
    });
  };

  const handleViewProduct = (id) => {
    dispatch(getSingleProduct(id))
      .unwrap()
      .then(() => setIsViewOpen(true))
      .catch(() => toast.error("Failed to load product"));
  };

  if (loading) return <Loader />;

  const renderStars = (rating = 0) =>
    [...Array(5)].map((_, i) => {
      const index = i + 1;
      if (rating >= index)
        return <FaStar key={i} className="text-yellow-500" />;
      if (rating >= index - 0.5)
        return <FaStarHalfAlt key={i} className="text-yellow-500" />;
      return <FaRegStar key={i} className="text-gray-300" />;
    });

  const activeProducts = myProducts.filter((p) => p.isActive === true).length;

  return (
    <div className="p-4 sm:p-6">
      {/* HEADER */}
      {/* ===================== COMMAND BAR HEADER (SELLER PRODUCTS) ===================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
        {/* Left Side: Module Identity */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-200 shrink-0">
            <RiBox3Fill size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase leading-none">
              Inventory <span className="text-red-500">Center</span>
            </h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-2">
              Manage listings & Stock levels
            </p>
          </div>
        </div>

        {/* Right Side: Metrics & Primary Action */}
        <div className="flex items-center gap-4">
          {/* Active Inventory Badge */}
          <div className="hidden sm:flex flex-col items-end px-4 border-r border-gray-100">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
              Storefront Presence
            </p>
            <p className="text-sm font-black text-gray-900">
              {activeProducts}{" "}
              <span className="text-emerald-500 text-[10px]">Active</span>
            </p>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={() => setIsCreateOpen(true)}
            className="group flex items-center justify-center gap-3 px-6 py-3 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-gray-200 hover:bg-red-500 hover:shadow-red-100 transition-all active:scale-95 w-full sm:w-auto"
          >
            <RiAddLine className="text-lg group-hover:rotate-90 transition-transform duration-300" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* ===================== MOBILE VIEW (REDESIGNED) ===================== */}
      <div className="lg:hidden space-y-4">
        {!loading && myProducts.length === 0 && (
          <div className="bg-white rounded-[2rem] p-12 text-center border border-dashed border-gray-200">
            <p className="text-gray-400 font-black uppercase tracking-widest text-xs">
              No Inventory Found
            </p>
          </div>
        )}

        {myProducts.map((product) => {
          const { price, mrp, discountPercentage } = product.pricing || {};
          return (
            <div
              key={product._id}
              className="bg-white rounded-[2rem] p-5 border border-gray-100 shadow-sm transition-all active:scale-[0.98] hover:shadow-md"
            >
              <div className="flex gap-5">
                {/* Product Image with Stock Status */}
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
                  <div className="mb-1 flex items-center justify-between">
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase border tracking-widest
                      ${product.isActive ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-rose-50 text-rose-600 border-rose-200"}`}
                    >
                      {product.isActive ? "Active" : "Hidden"}
                    </span>
                    <span className="text-[10px] font-bold text-gray-300 uppercase italic">
                      #{product._id.slice(-6).toUpperCase()}
                    </span>
                  </div>

                  <h3 className="font-bold text-gray-900 truncate leading-tight text-sm">
                    {product.title}
                  </h3>

                  <p className="text-[10px] font-black text-gray-400 uppercase mt-1">
                    {product.brand} • {product.category?.name || "General"}
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

              {/* Inventory & Actions */}
              <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter leading-none tracking-widest">
                    Inventory
                  </span>
                  <span
                    className={`text-xs font-bold mt-1 ${product.stock < 10 ? "text-rose-500" : "text-gray-700"}`}
                  >
                    {product.stock < 10
                      ? `Low (${product.stock})`
                      : `${product.stock} Units`}
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
                      setExistingImages(product.image || []);
                      setRemovedImages([]);
                      setImages([]);
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
          <div className="py-10 text-center">
            <Loader />
          </div>
        )}
      </div>

      {/* ===================== DESKTOP VIEW (REDESIGNED) ===================== */}
      <div className="hidden lg:block bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="min-w-[1800px] w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                {[
                  "Visual",
                  "Item Specification",
                  "Brand Identity",
                  "Taxonomy",
                  "Net Price",
                  "List Price",
                  "Savings",
                  "Stock Level",
                  "Review Score",
                  "Sold Vol.",
                  "Logistics",
                  "Store Visibility",
                  "Created On",
                  "Operations",
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

            <tbody className="divide-y divide-gray-50 font-medium text-sm">
              {!loading && myProducts.length === 0 && (
                <tr>
                  <td colSpan="14" className="py-24 text-center bg-gray-50/30">
                    <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-sm italic">
                      Catalog is Empty
                    </p>
                  </td>
                </tr>
              )}

              {myProducts.map((product) => {
                const { price, mrp, discountPercentage } =
                  product.pricing || {};
                return (
                  <tr
                    key={product._id}
                    className="hover:bg-gray-50/50 transition-all duration-200 group"
                  >
                    {/* Visual */}
                    <td className="px-6 py-4">
                      <div className="relative w-14 h-14">
                        <img
                          src={product.image?.[0]}
                          alt={product.title}
                          className="w-full h-full rounded-2xl object-contain border border-gray-100 bg-white p-1 shadow-sm group-hover:scale-110 transition-transform"
                        />
                      </div>
                    </td>

                    {/* Specification */}
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

                    {/* Brand */}
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-black text-red-500 bg-red-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                        {product.brand}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                      {product.category?.name || "General"}
                    </td>

                    {/* Pricing Logic */}
                    <td className="px-6 py-4 font-black text-gray-900 italic text-sm">
                      ₹{price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-gray-400 line-through text-xs font-bold opacity-60">
                      ₹{mrp.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[11px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                        {discountPercentage}% OFF
                      </span>
                    </td>

                    {/* Inventory */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-2 h-2 rounded-full ${product.stock < 10 ? "bg-red-500 animate-pulse" : "bg-emerald-500"}`}
                        />
                        <span
                          className={`text-xs font-black uppercase ${product.stock < 10 ? "text-red-600" : "text-gray-600"}`}
                        >
                          {product.stock < 10
                            ? `LOW (${product.stock})`
                            : `${product.stock} In Stock`}
                        </span>
                      </div>
                    </td>

                    {/* Quality */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <div className="flex text-yellow-400 scale-90 origin-left">
                          {renderStars(product.ratings?.average)}
                        </div>
                        <span className="text-[10px] font-black text-gray-300">
                          ({product.ratings?.count})
                        </span>
                      </div>
                    </td>

                    {/* Performance */}
                    <td className="px-6 py-4">
                      <span className="text-xs font-black text-gray-800 border-b-2 border-red-500/10 italic">
                        {product.dynamicOrderCount || 0} Orders
                      </span>
                    </td>

                    {/* Logistics */}
                    <td className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase leading-tight tracking-tighter">
                      {product.delivery?.estimated}
                    </td>

                    {/* Visibility */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase border tracking-widest
                        ${product.isActive ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-rose-50 text-rose-600 border-rose-200"}`}
                      >
                        {product.isActive ? "Active" : "Inactive"}
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
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => handleViewProduct(product._id)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-xl transition-all"
                        >
                          <RiEyeLine size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setExistingImages(product.image || []);
                            setRemovedImages([]);
                            setImages([]);
                            setIsEditOpen(true);
                          }}
                          className="p-2 text-amber-600 hover:bg-amber-100 rounded-xl transition-all"
                        >
                          <RiEdit2Line size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
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
          <div className="p-16 text-center bg-white">
            <Loader />
          </div>
        )}
      </div>

      {isCreateOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/70 backdrop-blur-md px-3 sm:px-4 transition-all duration-300">
          <div className="w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl flex flex-col max-h-[92vh] border border-white/20 animate-in zoom-in duration-300 overflow-hidden">
            {/* ===================== HEADER ===================== */}
            <div className="bg-red-500 p-8 text-white relative overflow-hidden shrink-0">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2" />
              <div className="relative z-10 flex items-center gap-5">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-inner">
                  <RiAddBoxFill size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight leading-none">
                    Initialize{" "}
                    <span className="text-red-100 italic">Listing</span>
                  </h2>
                  <p className="text-red-100 text-[10px] font-black uppercase tracking-[0.2em] mt-2 opacity-80 italic leading-none">
                    Submission will be sent for Admin review
                  </p>
                </div>
              </div>
            </div>

            {/* ===================== BODY (SCROLLABLE) ===================== */}
            <div className="flex-1 overflow-y-auto p-8 sm:p-10 space-y-10 custom-scrollbar bg-[#F9FAFB]/50">
              {/* SECTION 1: BASIC INFO */}
              <div className="space-y-6">
                <SectionHeader
                  icon={<RiFileList3Line />}
                  title="Basic Information"
                />
                <div className="space-y-5">
                  <InputGroup label="Product Title">
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="Enter product title"
                      className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-white font-bold text-sm outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all shadow-sm"
                    />
                  </InputGroup>

                  <InputGroup label="Brand Label">
                    <input
                      type="text"
                      value={formData.brand}
                      onChange={(e) =>
                        setFormData({ ...formData, brand: e.target.value })
                      }
                      placeholder="Brand name"
                      className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-white font-bold text-sm outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all shadow-sm"
                    />
                  </InputGroup>

                  <InputGroup label="Detailed Description">
                    <textarea
                      rows="3"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Describe your product..."
                      className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-white font-bold text-sm outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all shadow-sm resize-none"
                    />
                  </InputGroup>

                  <InputGroup label="Taxonomy Category">
                    <select
                      value={formData.category || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-white font-black text-sm outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all shadow-sm appearance-none cursor-pointer"
                    >
                      <option value="" disabled>
                        Select category
                      </option>
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </InputGroup>
                </div>
              </div>

              {/* SECTION 2: PRICING & STOCK */}
              <div className="space-y-6">
                <SectionHeader
                  icon={<RiMoneyRupeeCircleLine />}
                  title="Financials & Warehouse"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <InputGroup label="Selling Price (₹)">
                    <input
                      type="number"
                      value={formData.pricing.price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pricing: {
                            ...formData.pricing,
                            price: e.target.value,
                          },
                        })
                      }
                      placeholder="₹ Price"
                      className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-white font-black text-sm text-red-500 outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all shadow-sm"
                    />
                  </InputGroup>
                  <InputGroup label="MRP (₹)">
                    <input
                      type="number"
                      value={formData.pricing.mrp}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pricing: { ...formData.pricing, mrp: e.target.value },
                        })
                      }
                      placeholder="₹ MRP"
                      className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-white font-bold text-sm text-gray-400 outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all shadow-sm"
                    />
                  </InputGroup>
                </div>
                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 flex items-center gap-3">
                  <RiInformationFill className="text-emerald-500 shrink-0" />
                  <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest leading-none italic">
                    Discount Percentage will be calculated automatically based
                    on inputs.
                  </p>
                </div>
                <InputGroup label="Inventory Quantity">
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    placeholder="Available stock units"
                    className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-white font-bold text-sm outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all shadow-sm"
                  />
                </InputGroup>
              </div>

              {/* SECTION 3: DELIVERY & OFFERS */}
              <div className="space-y-6">
                <SectionHeader
                  icon={<RiTruckLine />}
                  title="Logistics & Marketing"
                />
                <InputGroup label="Estimated Fulfillment Window">
                  <input
                    value={formData.delivery.estimated}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        delivery: {
                          ...formData.delivery,
                          estimated: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g. 3–5 Working Days"
                    className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-white font-bold text-sm outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all shadow-sm"
                  />
                </InputGroup>

                {/* CHECKBOX REPLACED WITH INTERACTIVE TOGGLE */}
                <div
                  onClick={() =>
                    setFormData({
                      ...formData,
                      delivery: {
                        ...formData.delivery,
                        codAvailable: !formData.delivery.codAvailable,
                      },
                    })
                  }
                  className="flex items-center justify-between p-5 rounded-2xl border border-gray-100 bg-white cursor-pointer hover:bg-red-50/50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <RiHandCoinFill
                      className={`text-xl ${formData.delivery.codAvailable ? "text-red-500" : "text-gray-300"}`}
                    />
                    <p className="text-xs font-black text-gray-900 uppercase tracking-tight leading-none">
                      Cash on Delivery Support
                    </p>
                  </div>
                  <div
                    className={`w-10 h-5 rounded-full relative transition-colors ${formData.delivery.codAvailable ? "bg-red-500" : "bg-gray-200"}`}
                  >
                    <div
                      className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${formData.delivery.codAvailable ? "left-6" : "left-1"}`}
                    />
                  </div>
                </div>

                <InputGroup label="Exclusive Offers">
                  <input
                    value={formData.offers}
                    onChange={(e) =>
                      setFormData({ ...formData, offers: e.target.value })
                    }
                    placeholder="e.g. Free shipping, Festival offer"
                    className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-white font-bold text-sm outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all shadow-sm"
                  />
                </InputGroup>
              </div>

              {/* SECTION 4: TOP DEAL (FULL LOGIC PRESERVED) */}
              <div className="space-y-6">
                <SectionHeader
                  icon={<RiFireFill />}
                  title="Exclusive Promotions"
                />
                <div
                  onClick={() =>
                    setFormData({
                      ...formData,
                      isTopDeal: !formData.isTopDeal,
                      topDealStart: !formData.isTopDeal
                        ? formData.topDealStart
                        : "",
                      topDealEnd: !formData.isTopDeal
                        ? formData.topDealEnd
                        : "",
                    })
                  }
                  className="flex items-center justify-between p-5 rounded-2xl border border-gray-100 bg-white cursor-pointer hover:bg-red-50/50 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <RiStarSmileFill
                      className={`text-xl ${formData.isTopDeal ? "text-amber-500" : "text-gray-300"}`}
                    />
                    <p className="text-xs font-black text-gray-900 uppercase tracking-tight leading-none">
                      Register as Top Deal
                    </p>
                  </div>
                  <div
                    className={`w-10 h-5 rounded-full relative transition-colors ${formData.isTopDeal ? "bg-amber-500" : "bg-gray-200"}`}
                  >
                    <div
                      className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${formData.isTopDeal ? "left-6" : "left-1"}`}
                    />
                  </div>
                </div>

                {formData.isTopDeal && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-in slide-in-from-top-4 duration-300">
                    <InputGroup label="Campaign Launch (Date/Time)">
                      <input
                        type="datetime-local"
                        value={formData.topDealStart}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            topDealStart: e.target.value,
                          })
                        }
                        className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-white font-bold text-sm outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all shadow-sm appearance-none"
                      />
                    </InputGroup>
                    <InputGroup label="Campaign Expiry (Date/Time)">
                      <input
                        type="datetime-local"
                        value={formData.topDealEnd}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            topDealEnd: e.target.value,
                          })
                        }
                        className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-white font-bold text-sm outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all shadow-sm appearance-none"
                      />
                    </InputGroup>
                  </div>
                )}

                {formData.isTopDeal &&
                  formData.topDealStart &&
                  formData.topDealEnd && (
                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                      <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest text-center italic">
                        Live Window:{" "}
                        {new Date(formData.topDealStart).toLocaleString()} —{" "}
                        {new Date(formData.topDealEnd).toLocaleString()}
                      </p>
                    </div>
                  )}
              </div>

              {/* SECTION 5: MEDIA ASSETS */}
              <div className="space-y-6 pb-4">
                <SectionHeader
                  icon={<RiImageAddLine />}
                  title="Visual Portfolio"
                />
                <label className="group relative mt-2 flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-200 rounded-[2.5rem] bg-white cursor-pointer hover:border-red-500 hover:bg-red-50/50 transition-all duration-300 overflow-hidden shadow-sm">
                  <div className="text-center p-6">
                    <RiUploadCloud2Fill
                      size={40}
                      className="mx-auto text-gray-300 group-hover:text-red-500 transition-colors mb-2"
                    />
                    <p className="text-xs font-black text-gray-900 uppercase tracking-widest">
                      Upload Visual Assets
                    </p>
                    <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase">
                      Max 5 Images (PNG, WEBP, JPG)
                    </p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>

                {images.length > 0 && (
                  <div className="flex flex-wrap gap-4 mt-6 p-4 bg-white rounded-3xl border border-gray-100 shadow-inner">
                    {images.map((file, i) => (
                      <div
                        key={i}
                        className="group relative w-20 h-20 rounded-2xl border-2 border-white shadow-md overflow-hidden bg-white"
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          className="w-full h-full object-cover"
                          alt=""
                        />
                        <button
                          onClick={() => removeNewImage(i)}
                          className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <RiDeleteBinLine size={24} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ===================== FOOTER (ACTIONS) ===================== */}
            <div className="px-10 py-8 border-t border-gray-50 bg-white flex flex-col sm:flex-row justify-end gap-4 shrink-0">
              <button
                onClick={() => setIsCreateOpen(false)}
                className="px-8 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95 w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProduct}
                className="px-8 py-4 bg-red-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-red-200 hover:bg-red-600 transition-all active:scale-95 flex items-center justify-center gap-3 w-full sm:w-auto"
              >
                <RiSendPlaneFill size={18} />
                <span>Publish Listing</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditOpen && selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/70 backdrop-blur-md px-3 sm:px-4 transition-all duration-300">
          <div className="w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl flex flex-col max-h-[92vh] border border-white/20 animate-in zoom-in duration-300 overflow-hidden">
            {/* ===================== HEADER ===================== */}
            <div className="bg-red-500 p-8 text-white relative overflow-hidden shrink-0">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2" />
              <div className="relative z-10 flex items-center gap-5">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-inner text-white">
                  <RiEditBoxFill size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight leading-none">
                    Modify <span className="text-red-100 italic">Listing</span>
                  </h2>
                  <p className="text-red-100 text-[10px] font-black uppercase tracking-[0.2em] mt-2 opacity-80 italic leading-none">
                    Edits require administrative re-verification
                  </p>
                </div>
              </div>
            </div>

            {/* ===================== BODY (SCROLLABLE) ===================== */}
            <div className="flex-1 overflow-y-auto p-8 sm:p-10 space-y-10 custom-scrollbar bg-[#F9FAFB]/50">
              {/* SECTION 1: CORE DETAILS */}
              <div className="space-y-6">
                <SectionHeader
                  icon={<RiFileList3Line />}
                  title="Identity & Classification"
                />
                <div className="space-y-5">
                  <InputGroup label="Product Title">
                    <input
                      type="text"
                      value={selectedProduct.title}
                      onChange={(e) =>
                        setSelectedProduct({
                          ...selectedProduct,
                          title: e.target.value,
                        })
                      }
                      className="form-input-premium appearance-none  font-black"
                    />
                  </InputGroup>

                  <InputGroup label="Brand Label">
                    <input
                      type="text"
                      value={selectedProduct.brand}
                      onChange={(e) =>
                        setSelectedProduct({
                          ...selectedProduct,
                          brand: e.target.value,
                        })
                      }
                      className="form-input-premium appearance-none font-black"
                    />
                  </InputGroup>

                  <InputGroup label="Marketing Description">
                    <textarea
                      rows="3"
                      value={selectedProduct.description}
                      onChange={(e) =>
                        setSelectedProduct({
                          ...selectedProduct,
                          description: e.target.value,
                        })
                      }
                      className="form-input-premium resize-none h-28 appearance-none  font-black"
                    />
                  </InputGroup>

                  <InputGroup label="Product Category">
                    <select
                      value={selectedProduct.category._id || ""}
                      onChange={(e) =>
                        setSelectedProduct({
                          ...selectedProduct,
                          category: categories.find(
                            (cat) => cat._id === e.target.value,
                          ),
                        })
                      }
                      className="form-input-premium appearance-none cursor-pointer font-black"
                    >
                      <option value="" disabled>
                        Select category
                      </option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </InputGroup>
                </div>
              </div>

              {/* SECTION 2: FINANCIALS & STOCK */}
              <div className="space-y-6">
                <SectionHeader
                  icon={<RiMoneyRupeeCircleLine />}
                  title="Valuation & Warehouse"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <InputGroup label="Current Price (₹)">
                    <input
                      type="number"
                      value={selectedProduct.pricing?.price || ""}
                      onChange={(e) =>
                        setSelectedProduct({
                          ...selectedProduct,
                          pricing: {
                            ...selectedProduct.pricing,
                            price: e.target.value,
                          },
                        })
                      }
                      className="form-input-premium font-black text-red-600"
                    />
                  </InputGroup>
                  <InputGroup label="List Price / MRP (₹)">
                    <input
                      type="number"
                      value={selectedProduct.pricing?.mrp || ""}
                      onChange={(e) =>
                        setSelectedProduct({
                          ...selectedProduct,
                          pricing: {
                            ...selectedProduct.pricing,
                            mrp: e.target.value,
                          },
                        })
                      }
                      className="form-input-premium text-gray-400 line-through"
                    />
                  </InputGroup>
                </div>

                <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest leading-none">
                    Yielding Discount
                  </p>
                  <span className="text-sm font-black text-emerald-600 italic">
                    {selectedProduct.pricing?.discountPercentage || 0}% OFF
                  </span>
                </div>

                <InputGroup label="Live Inventory Count">
                  <input
                    type="number"
                    value={selectedProduct.stock}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        stock: e.target.value,
                      })
                    }
                    className="form-input-premium font-bold"
                  />
                </InputGroup>

                <InputGroup label="Offers (comma separated)">
                  <input
                    type="text"
                    value={selectedProduct.offers?.join(", ") || ""}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        offers: e.target.value.split(",").map((o) => o.trim()),
                      })
                    }
                    className="form-input-premium font-black"
                    placeholder="Free delivery, Festival offer"
                  />
                </InputGroup>
              </div>

              <div
                onClick={() =>
                  setSelectedProduct({
                    ...selectedProduct,
                    delivery: {
                      ...selectedProduct.delivery,
                      codAvailable: !selectedProduct.delivery?.codAvailable,
                    },
                  })
                }
                className="flex items-center justify-between p-5 rounded-2xl border border-gray-100 bg-white cursor-pointer hover:bg-red-50/50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <RiHandCoinFill
                    className={`text-xl ${
                      selectedProduct.delivery?.codAvailable
                        ? "text-red-500"
                        : "text-gray-300"
                    }`}
                  />
                  <p className="text-xs font-black text-gray-900 uppercase tracking-tight">
                    Cash on Delivery
                  </p>
                </div>

                <div
                  className={`w-10 h-5 rounded-full relative transition-colors ${
                    selectedProduct.delivery?.codAvailable
                      ? "bg-red-500"
                      : "bg-gray-200"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${
                      selectedProduct.delivery?.codAvailable
                        ? "left-6"
                        : "left-1"
                    }`}
                  />
                </div>
              </div>

              {/* SECTION 3: PROMOTIONS (TOP DEAL) */}
              <div className="space-y-6">
                <SectionHeader
                  icon={<RiFireFill />}
                  title="Exclusive Deal Logic"
                />
                <div
                  onClick={() =>
                    setSelectedProduct({
                      ...selectedProduct,
                      isTopDeal: !selectedProduct.isTopDeal,
                      topDealStart: !selectedProduct.isTopDeal
                        ? selectedProduct.topDealStart
                        : "",
                      topDealEnd: !selectedProduct.isTopDeal
                        ? selectedProduct.topDealEnd
                        : "",
                    })
                  }
                  className="flex items-center justify-between p-5 rounded-2xl border border-gray-100 bg-white cursor-pointer hover:bg-red-50/50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <RiStarSmileFill
                      className={`text-xl transition-colors ${selectedProduct.isTopDeal ? "text-amber-500" : "text-gray-300"}`}
                    />
                    <p className="text-xs font-black text-gray-900 uppercase tracking-tight">
                      Active Top Deal Status
                    </p>
                  </div>
                  <div
                    className={`w-10 h-5 rounded-full relative transition-colors ${selectedProduct.isTopDeal ? "bg-amber-500" : "bg-gray-200"}`}
                  >
                    <div
                      className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${selectedProduct.isTopDeal ? "left-6" : "left-1"}`}
                    />
                  </div>
                </div>

                {selectedProduct.isTopDeal && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-in slide-in-from-top-4 duration-300">
                    <InputGroup label="Activation Date">
                      <input
                        type="datetime-local"
                        value={selectedProduct.topDealStart || ""}
                        onChange={(e) =>
                          setSelectedProduct({
                            ...selectedProduct,
                            topDealStart: e.target.value,
                          })
                        }
                        className="form-input-premium"
                      />
                    </InputGroup>
                    <InputGroup label="Expiration Date">
                      <input
                        type="datetime-local"
                        value={selectedProduct.topDealEnd || ""}
                        onChange={(e) =>
                          setSelectedProduct({
                            ...selectedProduct,
                            topDealEnd: e.target.value,
                          })
                        }
                        className="form-input-premium"
                      />
                    </InputGroup>
                  </div>
                )}
              </div>

              {/* SECTION 4: VISIBILITY & COMPLIANCE */}
              <div className="space-y-6">
                <SectionHeader
                  icon={<RiShieldCheckFill />}
                  title="System Visibility"
                />

                <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl gap-4 shadow-sm">
                  <div className="flex flex-col">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Verification State
                    </p>
                    <p className="text-xs font-black text-amber-600 mt-1 uppercase italic">
                      {selectedProduct.status}
                    </p>
                  </div>
                  <div
                    onClick={() => {
                      const checked = !selectedProduct.isActive;
                      setSelectedProduct({
                        ...selectedProduct,
                        isActive: checked,
                        status: checked ? "PENDING" : selectedProduct.status,
                      });
                    }}
                    className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl cursor-pointer hover:bg-gray-100 transition-all border border-gray-100"
                  >
                    <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">
                      Marketplace Active
                    </span>
                    <div
                      className={`w-8 h-4 rounded-full relative transition-colors ${selectedProduct.isActive ? "bg-red-500" : "bg-gray-300"}`}
                    >
                      <div
                        className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${selectedProduct.isActive ? "left-4.5" : "left-0.5"}`}
                      />
                    </div>
                  </div>
                </div>

                <div
                  className={`p-4 rounded-2xl border flex items-center gap-3 transition-all ${selectedProduct.isActive ? "bg-amber-50 border-amber-100 text-amber-700" : "bg-rose-50 border-rose-100 text-rose-700"}`}
                >
                  <RiInformationFill className="shrink-0" />
                  <p className="text-[10px] font-black uppercase tracking-wide leading-none italic">
                    {selectedProduct.isActive
                      ? "Activation triggers an immediate Admin review cycle."
                      : "Product will be invisible to all storefront customers."}
                  </p>
                </div>
              </div>

              {/* SECTION 5: MEDIA ASSETS (EXISTING & NEW) */}
              <div className="space-y-8">
                <SectionHeader
                  icon={<RiImageEditLine />}
                  title="Visual Portfolio"
                />

                {/* Existing Gallery */}
                {existingImages.length > 0 && (
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 italic">
                      Current Production Assets
                    </p>
                    <div className="flex flex-wrap gap-4 p-4 bg-white rounded-[2rem] border border-gray-100 shadow-inner">
                      {existingImages.map((img, i) => (
                        <div
                          key={i}
                          className="group relative w-20 h-20 rounded-2xl border-2 border-white shadow-md overflow-hidden bg-white"
                        >
                          <img
                            src={img}
                            className="w-full h-full object-cover"
                            alt=""
                          />
                          <button
                            onClick={() => removeExistingImage(img)}
                            className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <RiDeleteBin6Line size={20} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Upload Area */}
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 italic">
                    Append New Imagery
                  </p>
                  <label className="group relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-200 rounded-[2.5rem] bg-white cursor-pointer hover:border-red-500 hover:bg-red-50/50 transition-all duration-300 overflow-hidden shadow-sm">
                    <div className="text-center p-6">
                      <RiUploadCloud2Fill
                        size={40}
                        className="mx-auto text-gray-300 group-hover:text-red-500 transition-colors mb-2"
                      />
                      <p className="text-xs font-black text-gray-900 uppercase tracking-widest leading-none">
                        Upload New Assets
                      </p>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>

                  {images.length > 0 && (
                    <div className="flex flex-wrap gap-4 p-4 bg-emerald-50/30 rounded-[2rem] border border-emerald-100 animate-in slide-in-from-top-2">
                      {images.map((file, i) => (
                        <div
                          key={i}
                          className="group relative w-16 h-16 rounded-xl border-2 border-white shadow-md overflow-hidden"
                        >
                          <img
                            src={URL.createObjectURL(file)}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => removeNewImage(i)}
                            className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <RiDeleteBin6Line size={20} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ===================== FOOTER ===================== */}
            <div className="px-10 py-8 border-t border-gray-50 bg-white flex flex-col sm:flex-row justify-end gap-4 shrink-0">
              <button
                onClick={() => setIsEditOpen(false)}
                className="px-8 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95 w-full sm:w-auto"
              >
                Discard
              </button>
              <button
                onClick={() => handleSaveChanges()}
                className="px-8 py-4 bg-red-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-red-200 hover:bg-red-600 transition-all active:scale-95 flex items-center justify-center gap-3 w-full sm:w-auto"
              >
                <RiSave3Fill size={18} />
                <span>Commit Changes</span>
              </button>
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
                    Inventory <span className="text-red-500">Inspector</span>
                  </h2>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1.5 italic opacity-70">
                    SKU: #{singleProduct._id.slice(-12).toUpperCase()}
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
                    Product Gallery
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
                      <div className="text-gray-300 font-black uppercase text-xs tracking-widest italic text-center">
                        Visual Asset
                        <br />
                        Not Found
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

                {/* RIGHT: PERFORMANCE & DATA */}
                <div className="space-y-8">
                  {/* 1. Identity & Market Status */}
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
                      <span
                        className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter border ${singleProduct.isActive ? "bg-emerald-500 text-white border-emerald-600" : "bg-gray-200 text-gray-500 border-gray-300"}`}
                      >
                        {singleProduct.isActive
                          ? "● Marketplace Live"
                          : "○ Storefront Hidden"}
                      </span>
                    </div>
                    <h3 className="text-4xl font-black text-gray-900 leading-none tracking-tighter uppercase italic">
                      {singleProduct.title}
                    </h3>
                    <p className="text-gray-500 font-medium mt-6 text-sm leading-relaxed bg-white p-6 rounded-3xl border border-gray-100 italic shadow-sm border-l-4 border-l-red-500">
                      "{singleProduct.description}"
                    </p>
                  </div>

                  {/* 2. Taxonomy Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <DetailBox
                      label="Registered Brand"
                      value={singleProduct.brand}
                    />
                    <DetailBox
                      label="Global Category"
                      value={singleProduct.category?.name || "General"}
                    />
                  </div>

                  {/* 3. Pricing Analytics Card */}
                  <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-gray-200">
                    <RiMoneyRupeeCircleFill className="absolute -right-4 -bottom-4 text-white/5 text-[10rem] pointer-events-none" />
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">
                      Commercial Valuation
                    </p>
                    <div className="flex items-baseline gap-4 relative z-10">
                      <span className="text-4xl font-black tracking-tighter italic text-red-500">
                        ₹{singleProduct.pricing?.price.toLocaleString()}
                      </span>
                      <span className="text-gray-500 line-through font-bold text-sm">
                        ₹{singleProduct.pricing?.mrp.toLocaleString()}
                      </span>
                      <span className="bg-white/10 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-tighter border border-white/10">
                        {singleProduct.pricing?.discountPercentage}% Store
                        Discount
                      </span>
                    </div>
                  </div>

                  {/* 4. Logistics Configuration */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <StatTile
                      label="Lead Time"
                      value={singleProduct.delivery?.estimated || "N/A"}
                    />
                    <StatTile
                      label="Ship Cost"
                      value={
                        singleProduct.delivery?.cost === 0
                          ? "Free"
                          : `₹${singleProduct.delivery?.cost}`
                      }
                    />
                    <StatTile
                      label="COD Status"
                      value={
                        singleProduct.delivery?.codAvailable
                          ? "Active"
                          : "Locked"
                      }
                    />
                  </div>

                  {/* 5. Warehouse Performance */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <StatTile
                      label="Inventory"
                      value={singleProduct.stock}
                      color={
                        singleProduct.stock < 10
                          ? "text-rose-500"
                          : "text-gray-900"
                      }
                    />
                    <StatTile
                      label="Open Orders"
                      value={singleProduct.ordersCount || 0}
                    />
                    <StatTile
                      label="Units Sold"
                      value={singleProduct.soldCount || 0}
                    />
                    <StatTile
                      label="Store Rating"
                      value={
                        singleProduct.ratings?.average?.toFixed(1) || "0.0"
                      }
                    />
                  </div>

                  {/* 6. Rating & Admin Feedback Log */}
                  <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-white border border-gray-100 rounded-[2rem] shadow-sm gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex text-yellow-400 text-xl">
                        {renderStars(singleProduct.ratings?.average)}
                      </div>
                      <p className="text-sm font-black text-gray-900 uppercase tracking-tighter italic">
                        ({singleProduct.ratings?.count} Verified Reviews)
                      </p>
                    </div>
                    {singleProduct.adminNote && (
                      <div className="bg-amber-50 px-4 py-2 rounded-xl border border-amber-100 max-w-xs">
                        <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest">
                          Admin Notification
                        </p>
                        <p className="text-[11px] font-bold text-amber-700 italic leading-tight mt-1">
                          {singleProduct.adminNote}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* 7. Timeline Meta */}
                  <div className="flex flex-col sm:flex-row justify-between items-center px-4 border-t border-gray-100 pt-6 gap-4">
                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">
                      Added to Store:{" "}
                      {new Date(singleProduct.createdAt).toLocaleString()}
                    </p>
                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">
                      Last Modified:{" "}
                      {new Date(singleProduct.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* FOOTER ACTIONS */}
            <div className="px-8 py-6 border-t border-gray-50 bg-white flex justify-end">
              <button
                onClick={() => setIsViewOpen(false)}
                className="px-10 py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-gray-200 hover:bg-red-500 transition-all active:scale-95"
              >
                Exit Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProducts;
