import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSellerRequests,
  approveSellerRequest,
  rejectSellerRequest,
  updateSellerUserRole,
  deleteSellerRequest,
} from "../../features/sellerRequest/sellerRequestSlice";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";
import {
  RiCheckLine,
  RiCloseLine,
  RiEdit2Line,
  RiDeleteBin6Line,
} from "react-icons/ri";
import Swal from "sweetalert2";

const ITEMS_PER_PAGE = 5;

const SellerRequests = () => {
  const dispatch = useDispatch();
  const {
    requests = [],
    loading,
    error,
  } = useSelector((state) => state.sellerRequest);

  const [currentPage, setCurrentPage] = useState(1);

  // Edit Role Modal State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("SELLER");

  useEffect(() => {
    dispatch(fetchSellerRequests());
  }, [dispatch]);

  console.log(fetchSellerRequests());

  const handleApprove = async (id) => {
    try {
      await dispatch(approveSellerRequest(id)).unwrap();
      toast.success("Seller approved successfully");
    } catch (err) {
      toast.error(err || "Approval failed");
    }
  };

  const handleReject = async (id) => {
    try {
      await dispatch(rejectSellerRequest(id)).unwrap();
      toast.success("Seller request rejected");
    } catch (err) {
      toast.error(err || "Rejection failed");
    }
  };
  const handleUpdateRole = async () => {
    try {
      const userId = selectedUser?.user?._id || selectedUser?._id;

      if (!userId) {
        toast.error("User ID not found");
        return;
      }

      await dispatch(
        updateSellerUserRole({
          id: userId,
          data: { role: selectedRole },
        })
      ).unwrap();

      toast.success("Role updated successfully");
      setIsEditOpen(false);
    } catch (err) {
      toast.error(err || "Update failed");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This seller request will be permanently deleted!",
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
      await dispatch(deleteSellerRequest(id)).unwrap();

      Swal.fire({
        title: "Deleted!",
        text: "Seller request has been deleted.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err || "Deletion failed",
        icon: "error",
      });
    }
  };

  // Pagination
  const totalPages = Math.ceil(requests.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentRequests = requests.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <>
      <div className="p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-semibold mb-6">
          Seller Requests
        </h1>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="hidden sm:table-header-group bg-gradient-to-r from-orange-600 to-red-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Shop</th>
                <th className="px-4 py-3 text-left font-medium">Email</th>
                <th className="px-4 py-3 text-left font-medium">Phone</th>
                <th className="px-4 py-3 text-left font-medium">Category</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-center font-medium">Action</th>
              </tr>
            </thead>

            <tbody>
              {!loading && currentRequests.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    No seller requests found
                  </td>
                </tr>
              )}

              {currentRequests.map((req) => (
                <tr
                  key={req._id}
                  className="border-b last:border-b-0 block sm:table-row hover:bg-indigo-50/60 transition"
                >
                  {/* SHOP */}
                  <td
                    data-label="Shop"
                    className="px-4 py-3 block sm:table-cell text-right sm:text-left
              before:content-[attr(data-label)] before:float-left before:font-medium
              before:text-gray-500 sm:before:hidden"
                  >
                    {req.shopName}
                  </td>

                  {/* EMAIL */}
                  <td
                    data-label="Email"
                    className="px-4 py-3 block sm:table-cell text-right sm:text-left break-all
              before:content-[attr(data-label)] before:float-left before:font-medium
              before:text-gray-500 sm:before:hidden"
                  >
                    {req.email}
                  </td>

                  {/* PHONE */}
                  <td
                    data-label="Phone"
                    className="px-4 py-3 block sm:table-cell text-right sm:text-left
              before:content-[attr(data-label)] before:float-left before:font-medium
              before:text-gray-500 sm:before:hidden"
                  >
                    {req.phone}
                  </td>

                  {/* CATEGORY */}
                  <td
                    data-label="Category"
                    className="px-4 py-3 block sm:table-cell text-right sm:text-left
              before:content-[attr(data-label)] before:float-left before:font-medium
              before:text-gray-500 sm:before:hidden"
                  >
                    {req.category?.name ?? "No Category"}
                  </td>

                  {/* STATUS */}
                  <td
                    data-label="Status"
                    className="px-4 py-3 block sm:table-cell text-right sm:text-left
              before:content-[attr(data-label)] before:float-left before:font-medium
              before:text-gray-500 sm:before:hidden"
                  >
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        req.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-700"
                          : req.status === "APPROVED"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>

                  {/* ACTION */}
                  <td
                    data-label="Action"
                    className="px-4 py-3 block sm:table-cell text-right sm:text-center
              before:content-[attr(data-label)] before:float-left before:font-medium
              before:text-gray-500 sm:before:hidden"
                  >
                    {req.status === "PENDING" ? (
                      <div className="flex justify-end sm:justify-center gap-2">
                        <button
                          onClick={() => handleApprove(req._id)}
                          className="p-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                        >
                          <RiCheckLine />
                        </button>
                        <button
                          onClick={() => handleReject(req._id)}
                          className="p-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                        >
                          <RiCloseLine />
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-end sm:justify-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedUser(req);
                            setSelectedRole(req.user?.role || "USER");
                            setIsEditOpen(true);
                          }}
                          className="p-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-700 hover:text-white"
                        >
                          <RiEdit2Line />
                        </button>
                        <button
                          onClick={() => handleDelete(req._id)}
                          className="p-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-red-600 hover:text-white"
                        >
                          <RiDeleteBin6Line />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {loading && (
            <div className="p-6 text-center">
              <Loader />
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded-lg border text-sm transition ${
                  currentPage === i + 1
                    ? "bg-red-600 text-white border-red-600"
                    : "hover:bg-red-50 text-gray-700"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* EDIT ROLE MODAL */}
      {isEditOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray/50 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm sm:max-w-md bg-white rounded-2xl shadow-2xl animate-[scaleIn_0.2s_ease-out]">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-300">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                Edit User Role
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Update role permissions carefully
              </p>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-4">
              {/* Username */}
              <div>
                <label className="text-xs font-medium text-gray-500">
                  Username
                </label>
                <input
                  disabled
                  value={
                    selectedUser?.user?.userName || selectedUser?.shopName || ""
                  }
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-700 cursor-not-allowed"
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-medium text-gray-500">
                  Email
                </label>
                <input
                  disabled
                  value={selectedUser?.user?.email || selectedUser?.email || ""}
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-700 cursor-not-allowed"
                />
              </div>

              {/* Role */}
              <div>
                <label className="text-xs font-medium text-gray-500">
                  Role
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
              focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="USER">User</option>
                  <option value="SELLER">Seller</option>
                </select>
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
                onClick={handleUpdateRole}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SellerRequests;
