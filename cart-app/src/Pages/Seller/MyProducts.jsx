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
import { RiEdit2Line, RiDeleteBin6Line, RiEyeLine, RiBox3Fill, RiAddLine } from "react-icons/ri";
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
  });

  const [images, setImages] = useState([]);
  const [activeImage, setActiveImage] = useState("");

  const [existingImages, setExistingImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);

  const [isViewOpen, setIsViewOpen] = useState(false);
  const { singleProduct } = useSelector((state) => state.product);

  const { myProducts, loading, sellerProductsStatus } = useSelector(
    (state) => state.product
  );

  const { categories, status: categoryStatus } = useSelector(
    (state) => state.category
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
  });

  const closeEditModal = () => {
    setIsEditOpen(false);
    setSelectedProduct(null);
    setImages([]);
    setExistingImages([]);
    setRemovedImages([]);
  };

  const handleSaveChanges = async () => {
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
       <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Storefront Presence</p>
       <p className="text-sm font-black text-gray-900">
         {activeProducts} <span className="text-emerald-500 text-[10px]">Active</span>
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
            <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No Inventory Found</p>
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
                    <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase border tracking-widest
                      ${product.isActive ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-rose-50 text-rose-600 border-rose-200"}`}>
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
                    <span className="text-sm font-black text-gray-900">₹{price}</span>
                    <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-1 rounded">-{discountPercentage}%</span>
                  </div>
                </div>
              </div>

              {/* Inventory & Actions */}
              <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter leading-none tracking-widest">Inventory</span>
                  <span className={`text-xs font-bold mt-1 ${product.stock < 10 ? 'text-rose-500' : 'text-gray-700'}`}>
                    {product.stock < 10 ? `Low (${product.stock})` : `${product.stock} Units`}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleViewProduct(product._id)} 
                    className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm shadow-blue-100"
                  >
                    <RiEyeLine size={18}/>
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
                    <RiEdit2Line size={18}/>
                  </button>
                  <button 
                    onClick={() => handleDeleteProduct(product._id)} 
                    className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm shadow-red-100"
                  >
                    <RiDeleteBin6Line size={18}/>
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {loading && <div className="py-10 text-center"><Loader /></div>}
      </div>

      {/* ===================== DESKTOP VIEW (REDESIGNED) ===================== */}
      <div className="hidden lg:block bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="min-w-[1800px] w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                {[
                  "Visual", "Item Specification", "Brand Identity", "Taxonomy", "Net Price", 
                  "List Price", "Savings", "Stock Level", "Review Score", "Sold Vol.", 
                  "Logistics", "Store Visibility", "Created On", "Operations"
                ].map((header) => (
                  <th key={header} className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50 font-medium text-sm">
              {!loading && myProducts.length === 0 && (
                <tr>
                  <td colSpan="14" className="py-24 text-center bg-gray-50/30">
                    <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-sm italic">Catalog is Empty</p>
                  </td>
                </tr>
              )}

              {myProducts.map((product) => {
                const { price, mrp, discountPercentage } = product.pricing || {};
                return (
                  <tr key={product._id} className="hover:bg-gray-50/50 transition-all duration-200 group">
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
                    <td className="px-6 py-4 font-black text-gray-900 italic text-sm">₹{price.toLocaleString()}</td>
                    <td className="px-6 py-4 text-gray-400 line-through text-xs font-bold opacity-60">₹{mrp.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className="text-[11px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                        {discountPercentage}% OFF
                      </span>
                    </td>

                    {/* Inventory */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-2 h-2 rounded-full ${product.stock < 10 ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
                        <span className={`text-xs font-black uppercase ${product.stock < 10 ? 'text-red-600' : 'text-gray-600'}`}>
                          {product.stock < 10 ? `LOW (${product.stock})` : `${product.stock} In Stock`}
                        </span>
                      </div>
                    </td>

                    {/* Quality */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <div className="flex text-yellow-400 scale-90 origin-left">
                          {renderStars(product.ratings?.average)}
                        </div>
                        <span className="text-[10px] font-black text-gray-300">({product.ratings?.count})</span>
                      </div>
                    </td>

                    {/* Performance */}
                    <td className="px-6 py-4">
                       <span className="text-xs font-black text-gray-800 border-b-2 border-red-500/10 italic">{product.dynamicOrderCount || 0} Orders</span>
                    </td>

                    {/* Logistics */}
                    <td className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase leading-tight tracking-tighter">
                      {product.delivery?.estimated}
                    </td>

                    {/* Visibility */}
                    <td className="px-6 py-4">
                       <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase border tracking-widest
                        ${product.isActive ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-rose-50 text-rose-600 border-rose-200"}`}>
                        {product.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-[10px] font-bold text-gray-400">
                      {new Date(product.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric'})}
                    </td>

                    {/* Row Actions */}
                    <td className="px-6 py-4 sticky right-0 bg-white group-hover:bg-gray-50 transition-colors">
                      <div className="flex justify-end gap-1.5">
                        <button onClick={() => handleViewProduct(product._id)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-xl transition-all"><RiEyeLine size={18} /></button>
                        <button 
                          onClick={() => {
                            setSelectedProduct(product);
                            setExistingImages(product.image || []);
                            setRemovedImages([]);
                            setImages([]);
                            setIsEditOpen(true);
                          }} 
                          className="p-2 text-amber-600 hover:bg-amber-100 rounded-xl transition-all"
                        ><RiEdit2Line size={18} /></button>
                        <button onClick={() => handleDeleteProduct(product._id)} className="p-2 text-red-600 hover:bg-red-100 rounded-xl transition-all"><RiDeleteBin6Line size={18} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {loading && <div className="p-16 text-center bg-white"><Loader /></div>}
      </div>

      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-3 sm:px-4">
          <div className="w-full max-w-lg sm:max-w-xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
            {/* HEADER */}
            <div className="px-5 sm:px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800">
                Create Product
              </h2>
              <p className="text-sm text-gray-500">
                Product will be sent for admin approval
              </p>
            </div>

            {/* BODY */}
            <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-6">
              {/* BASIC INFO */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700">
                  Basic Information
                </h3>

                <div>
                  <label className="block text-xs font-medium text-gray-600">
                    Product Title
                  </label>
                  <input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Enter product title"
                    className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600">
                    Brand
                  </label>
                  <input
                    value={formData.brand}
                    onChange={(e) =>
                      setFormData({ ...formData, brand: e.target.value })
                    }
                    placeholder="Brand name"
                    className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600">
                    Description
                  </label>
                  <textarea
                    rows="3"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Describe your product"
                    className="mt-1 w-full border rounded-lg px-3 py-2 text-sm resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600">
                    Category
                  </label>
                  <select
                    value={formData.category || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="" disabled>
                      Select Category
                    </option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* PRICING & INVENTORY */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700">
                  Pricing & Inventory
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600">
                      Selling Price
                    </label>
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
                      className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600">
                      MRP
                    </label>
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
                      className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                </div>

                <p className="text-xs text-gray-500">
                  Discount will be calculated automatically
                </p>

                <div>
                  <label className="block text-xs font-medium text-gray-600">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    placeholder="Available stock"
                    className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>

              {/* DELIVERY */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700">
                  Delivery
                </h3>

                <div>
                  <label className="block text-xs font-medium text-gray-600">
                    Estimated Delivery Time
                  </label>
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
                    placeholder="e.g. 3–5 Days"
                    className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                  />
                </div>

                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={formData.delivery.codAvailable}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        delivery: {
                          ...formData.delivery,
                          codAvailable: e.target.checked,
                        },
                      })
                    }
                  />
                  Cash on Delivery Available
                </label>
              </div>

              {/* OFFERS */}
              <div>
                <label className="block text-xs font-medium text-gray-600">
                  Offers
                </label>
                <input
                  value={formData.offers}
                  onChange={(e) =>
                    setFormData({ ...formData, offers: e.target.value })
                  }
                  placeholder="e.g. Free shipping, Festival offer"
                  className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>

              {/* IMAGES */}
              <div>
                <label className="block text-xs font-medium text-gray-600">
                  Product Images
                </label>

                <label className="mt-2 flex flex-col items-center justify-center w-full h-40 sm:h-48 border-2 border-dashed rounded-xl cursor-pointer hover:border-red-500 transition">
                  <div className="text-center text-gray-500 text-sm">
                    <p className="font-medium">Click to upload images</p>
                    <p className="text-xs">PNG, JPG, WEBP (max 5)</p>
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
                  <div className="flex flex-wrap gap-3 mt-5 ">
                    {images.map((file, i) => (
                      <div key={i} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          className="w-16 h-16 rounded-lg object-cover border"
                        />
                        <button
                          onClick={() => removeNewImage(i)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* FOOTER */}
            <div className="px-5 sm:px-6 py-4 border-t flex justify-end gap-2">
              <button
                onClick={() => setIsCreateOpen(false)}
                className="px-4 py-2 border rounded-lg text-sm"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateProduct}
                className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm"
              >
                Create Product
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-3 sm:px-4">
          <div className="w-full max-w-lg sm:max-w-xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
            {/* HEADER */}
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800">
                Edit Product
              </h2>
              <p className="text-sm text-gray-500">
                Editing will send product for admin re-approval
              </p>
            </div>

            {/* BODY */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              {/* BASIC INFO */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-600">
                    Product Title
                  </label>
                  <input
                    value={selectedProduct.title}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        title: e.target.value,
                      })
                    }
                    className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600">
                    Brand
                  </label>
                  <input
                    value={selectedProduct.brand}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        brand: e.target.value,
                      })
                    }
                    className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600">
                    Description
                  </label>
                  <textarea
                    rows="3"
                    value={selectedProduct.description}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        description: e.target.value,
                      })
                    }
                    className="mt-1 w-full border rounded-lg px-3 py-2 text-sm resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600">
                    Category
                  </label>
                  <select
                    value={selectedProduct.category._id || ""}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        category: categories.find(
                          (cat) => cat._id === e.target.value
                        ),
                      })
                    }
                    className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="" disabled>
                      Select Category
                    </option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* PRICING & STOCK */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700">
                  Pricing & Inventory
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-600">
                      Price
                    </label>
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
                      className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-600">
                      MRP
                    </label>
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
                      className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                </div>

                {/* DISCOUNT (READ ONLY) */}
                <p className="text-xs text-gray-500">
                  Discount:{" "}
                  <span className="font-semibold text-green-600">
                    {selectedProduct.pricing?.discountPercentage || 0}%
                  </span>
                </p>

                <div>
                  <label className="text-xs font-medium text-gray-600">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    value={selectedProduct.stock}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        stock: e.target.value,
                      })
                    }
                    className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>

              {/* STATUS */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-600">
                  Current Status
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                  {selectedProduct.status}
                </span>
              </div>

              {/* ACTIVE TOGGLE */}
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={selectedProduct.isActive}
                  onChange={(e) => {
                    const checked = e.target.checked;

                    setSelectedProduct({
                      ...selectedProduct,
                      isActive: checked,
                      status: checked ? "PENDING" : selectedProduct.status,
                    });
                  }}
                />
                Product Active
              </label>

              {!selectedProduct.isActive && (
                <p className="text-xs text-red-500">
                  Product will be hidden from customers
                </p>
              )}

              {selectedProduct.isActive && (
                <p className="text-xs text-gray-500">
                  Activating requires admin approval
                </p>
              )}

              {/* EXISTING IMAGES */}
              {existingImages.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-600">
                    Current Images
                  </label>

                  <div className="flex flex-wrap gap-3 pt-5">
                    {existingImages.map((img, i) => (
                      <div key={i} className="relative">
                        <img
                          src={img}
                          className="w-16 h-16 rounded-lg object-cover border"
                        />
                        <button
                          onClick={() => removeExistingImage(img)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* NEW IMAGE UPLOAD */}
              <div>
                <label className="text-xs font-medium text-gray-600">
                  Upload New Images (optional)
                </label>
                <label className="mt-2 flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer hover:border-red-500 transition">
                  <p className="text-sm text-gray-500">
                    Click to upload new images
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                {images.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-5">
                    {images.map((file, i) => (
                      <div key={i} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          className="w-16 h-16 rounded-lg object-cover border"
                        />
                        <button
                          onClick={() => removeNewImage(i)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* FOOTER */}
            <div className="px-6 py-4 border-t flex justify-end gap-2">
              <button
                onClick={() => setIsEditOpen(false)}
                className="px-4 py-2 border rounded-lg text-sm"
              >
                Cancel
              </button>

              <button
                onClick={() => handleSaveChanges()}
                className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm"
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
                {/* IMAGES (ALL IMAGES) */}
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

export default MyProducts;
