import React, { useState, useEffect } from "react";
import { RiAddLine, RiEdit2Line, RiDeleteBin6Line } from "react-icons/ri";
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
          })
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
          Categories
        </h1>

        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600"
        >
          <RiAddLine /> Add Category
        </button>
      </div>

      {/* MOBILE */}
      <div className="lg:hidden space-y-4">
        {categories.length === 0 && (
          <p className="text-center text-gray-500 py-10">No categories found</p>
        )}

        {categories.map((cat) => (
          <div
            key={cat._id}
            className="bg-white rounded-xl shadow border border-gray-300 p-4"
          >
            <h3 className="font-semibold text-gray-800">{cat.name}</h3>

            <p className="text-xs text-gray-500 mt-1">
              Created: {new Date(cat.createdAt).toLocaleDateString()}
            </p>

            <span
              className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                cat.isActive
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-rose-100 text-rose-700"
              }`}
            >
              {cat.isActive ? "Active" : "Inactive"}
            </span>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => openEdit(cat)}
                className="p-2 rounded-lg bg-gray-200 hover:bg-gray-700 hover:text-white"
              >
                <RiEdit2Line />
              </button>

              <button
                onClick={() => handleDelete(cat._id)}
                className="p-2 rounded-lg bg-gray-200 hover:bg-red-600 hover:text-white"
              >
                <RiDeleteBin6Line />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP */}
      <div className="hidden lg:block bg-white rounded-2xl shadow border border-gray-300 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
            <tr>
              {["Name", "Status", "Created", "Action"].map((h) => (
                <th key={h} className="px-4 py-3 text-left">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {categories.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-10 text-gray-500">
                  No categories found
                </td>
              </tr>
            )}

            {categories.map((cat) => (
              <tr
                key={cat._id}
                className="border-b border-gray-300 hover:bg-gray-50"
              >
                <td className="px-4 py-3 font-medium">{cat.name}</td>

                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      cat.isActive
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {cat.isActive ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="px-4 py-3 text-xs">
                  {new Date(cat.createdAt).toLocaleDateString()}
                </td>

                <td className="px-4 py-4 rounded-r-xl">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => openEdit(cat)}
                      className="p-2 rounded-lg bg-gray-100 hover:bg-gray-700 hover:text-white transition"
                    >
                      <RiEdit2Line size={16} />
                    </button>

                    <button
                      onClick={() => handleDelete(cat._id)}
                      className="p-2 rounded-lg bg-gray-100 hover:bg-red-600 hover:text-white transition"
                    >
                      <RiDeleteBin6Line size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && (
          <div className="flex justify-center py-10">
            <Loader />
          </div>
        )}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl">
            <div className="px-6 py-4 border-b border-gray-300">
              <h2 className="text-lg font-semibold">
                {editingCategory ? "Edit Category" : "Create Category"}
              </h2>
            </div>
            {error && <p className="px-6 py-4 text-red-500">{error}</p>}
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500">
                  Category Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
                <span className="text-sm text-gray-700">Active Category</span>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-300 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-lg border text-sm"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Category;
