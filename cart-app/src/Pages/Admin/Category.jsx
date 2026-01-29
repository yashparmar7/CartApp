import React, { useState, useEffect } from "react";
import {
  RiAddLine,
  RiEdit2Line,
  RiDeleteBin6Line,
  RiStackFill,
  RiSave3Line,
  RiCheckboxCircleFill,
  RiErrorWarningFill,
} from "react-icons/ri";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import {
  getAllCategories,
  createCategory,
  deleteCategory,
  updateCategory,
} from "../../features/category/categorySlice";
import Swal from "sweetalert2";

const Category = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(true);

  const dispatch = useDispatch();

  const { categories, loading, error } = useSelector((state) => state.category);

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  const openCreate = () => {
    setEditingCategory(null);
    setName("");
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEdit = (cat) => {
    setEditingCategory(cat);
    setName(cat.name);
    setIsActive(cat.isActive);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      if (editingCategory) {
        // UPDATE
        await dispatch(
          updateCategory({
            id: editingCategory._id,
            data: { name, isActive },
          }),
        ).unwrap();

        toast.success("Category updated successfully");
      } else {
        // CREATE
        await dispatch(createCategory({ name, isActive })).unwrap();

        toast.success("Category created successfully");
      }

      setIsModalOpen(false);
      setEditingCategory(null);
      setName("");
      setIsActive(true);
    } catch (err) {
      toast.error(err || "Something went wrong");
    }
  };
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This category will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      await dispatch(deleteCategory(id)).unwrap();
      toast.success("Category deleted successfully");
    } catch (err) {
      toast.error(err || "Delete failed");
    }
  };

  return (
    <div className="p-4 sm:p-6">
      {/* HEADER */}
      {/* ===================== COMMAND BAR HEADER (CATEGORIES) ===================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
        {/* Left Side: Module Identity */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-200 shrink-0">
            <RiStackFill size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase leading-none">
              Store <span className="text-red-500">Categories</span>
            </h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-2">
              Category Tree & Organization
            </p>
          </div>
        </div>

        {/* Right Side: Metrics & Primary Action */}
        <div className="flex items-center gap-4">
          {/* Count Badge */}
          <div className="hidden sm:flex flex-col items-end px-4 border-r border-gray-100">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
              Active Groups
            </p>
            <p className="text-sm font-black text-gray-900">
              {categories?.length || 0} Categories
            </p>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={openCreate}
            className="group flex items-center gap-3 px-6 py-3 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-gray-200 hover:bg-red-500 hover:shadow-red-100 transition-all active:scale-95"
          >
            <RiAddLine className="text-lg group-hover:rotate-90 transition-transform duration-300" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* ===================== MOBILE LIST VIEW (REDESIGNED) ===================== */}
      <div className="lg:hidden space-y-4">
        {categories.length === 0 && (
          <div className="bg-white rounded-[2rem] p-12 text-center border border-dashed border-gray-200">
            <p className="text-gray-400 font-bold tracking-tight italic">
              No categories found in system.
            </p>
          </div>
        )}

        {categories.map((cat) => (
          <div
            key={cat._id}
            className="bg-white rounded-[2rem] p-5 border border-gray-100 shadow-sm transition-all active:scale-[0.98] hover:shadow-md"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center border border-red-100 shrink-0 shadow-sm">
                  <span className="font-black text-xs uppercase">
                    {cat.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-black text-gray-900 uppercase leading-none tracking-tight">
                    {cat.name}
                  </h3>
                  <p className="text-[10px] text-gray-400 font-bold mt-1 tracking-widest uppercase">
                    Ref: {cat._id.slice(-6).toUpperCase()}
                  </p>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border tracking-widest
                ${cat.isActive ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-rose-50 text-rose-600 border-rose-200"}`}
              >
                {cat.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                Added:{" "}
                {new Date(cat.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                })}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(cat)}
                  className="p-3 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-600 hover:text-white transition-all shadow-sm shadow-amber-100"
                >
                  <RiEdit2Line size={18} />
                </button>
                <button
                  onClick={() => handleDelete(cat._id)}
                  className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm shadow-red-100"
                >
                  <RiDeleteBin6Line size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="text-center py-10">
            <Loader />
          </div>
        )}
      </div>

      {/* ===================== DESKTOP TABLE VIEW (REDESIGNED) ===================== */}
      <div className="hidden lg:block bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                {[
                  "Category Identity",
                  "Visibility Status",
                  "Created Timestamp",
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

            <tbody className="divide-y divide-gray-50 font-medium text-sm">
              {categories.length === 0 && !loading && (
                <tr>
                  <td colSpan="4" className="py-20 text-center bg-gray-50/30">
                    <p className="text-gray-400 font-black uppercase tracking-widest text-sm italic tracking-[0.2em]">
                      Zero Categories Found
                    </p>
                  </td>
                </tr>
              )}

              {categories.map((cat) => (
                <tr
                  key={cat._id}
                  className="hover:bg-gray-50/50 transition-all duration-200 group"
                >
                  {/* Category Name */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100 group-hover:bg-red-50 group-hover:text-red-500 transition-all duration-300">
                        <span className="font-black text-xs uppercase">
                          {cat.name.charAt(0)}
                        </span>
                      </div>
                      <p className="text-sm font-black text-gray-900 uppercase tracking-tight group-hover:translate-x-1 transition-transform">
                        {cat.name}
                      </p>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase border tracking-widest
                      ${cat.isActive ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-rose-50 text-rose-600 border-rose-200"}`}
                    >
                      {cat.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4 text-[10px] font-bold text-gray-400 tracking-wider">
                    {new Date(cat.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>

                  {/* Row Actions */}
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(cat)}
                        title="Edit Category"
                        className="p-2.5 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-600 hover:text-white transition-all shadow-sm shadow-amber-50"
                      >
                        <RiEdit2Line size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat._id)}
                        title="Delete Category"
                        className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm shadow-rose-50"
                      >
                        <RiDeleteBin6Line size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {loading && (
          <div className="p-12 text-center bg-white">
            <Loader />
          </div>
        )}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-md px-4 transition-all duration-300">
          <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl animate-in zoom-in duration-300 border border-white/20 overflow-hidden">
            {/* HEADER: Branded & Contextual */}
            <div className="bg-red-500 p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2" />
              <div className="relative z-10 flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                  <RiStackFill size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight leading-none">
                    {editingCategory ? "Update" : "Create"}{" "}
                    <span className="text-red-100 text-lg block">Category</span>
                  </h2>
                </div>
              </div>
            </div>

            {/* ERROR MESSAGE (Consistent Style) */}
            {error && (
              <div className="mx-8 mt-6 flex items-center gap-2 p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl animate-in shake duration-500">
                <RiErrorWarningFill className="shrink-0" />
                <p className="text-[10px] font-black uppercase tracking-wide">
                  {error}
                </p>
              </div>
            )}

            {/* BODY: Structured Premium Inputs */}
            <div className="p-8 space-y-8">
              {/* Category Input */}
              <div className="group">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block transition-colors group-focus-within:text-red-500">
                  Internal Category Name
                </label>
                <input
                  autoFocus
                  type="text"
                  placeholder="e.g. Footwear, Electronics..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 font-bold text-sm text-gray-900 outline-none focus:bg-white focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all placeholder:text-gray-300"
                />
              </div>

              {/* Custom Styled Toggle (Replacing Checkbox) */}
              <div
                onClick={() => setIsActive(!isActive)}
                className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-gray-50/50 cursor-pointer hover:bg-white transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg transition-colors ${isActive ? "bg-emerald-50 text-emerald-500" : "bg-gray-100 text-gray-400"}`}
                  >
                    <RiCheckboxCircleFill size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-900 uppercase tracking-tight">
                      Active Visibility
                    </p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter italic">
                      Show category on storefront
                    </p>
                  </div>
                </div>
                <div
                  className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${isActive ? "bg-emerald-500" : "bg-gray-200"}`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-sm ${isActive ? "left-7" : "left-1"}`}
                  />
                </div>
              </div>

              {/* ACTIONS: Large & Tactile */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-red-200 hover:bg-red-600 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <RiSave3Line size={18} />
                  {editingCategory ? "Commit Changes" : "Create Category"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Category;
