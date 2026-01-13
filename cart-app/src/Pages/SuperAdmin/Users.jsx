import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RiDeleteBin6Line, RiEdit2Line } from "react-icons/ri";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../../components/Loader";
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
} from "../../features/role/roleSlice";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";

const Users = () => {
  const dispatch = useDispatch();

  const { users = [], loading, error } = useSelector((state) => state.role);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [role, setRole] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 1;

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const openEditModal = (user) => {
    setSelectedUser(user);
    setRole(user.role);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setRole("");
  };

  const handleSaveRole = () => {
    if (!selectedUser) return;

    dispatch(
      updateUserRole({
        userId: selectedUser._id,
        role,
      })
    );

    toast.success("Role updated successfully");
    closeModal();
  };

  const handleDeleteUser = (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteUser(userId));
        toast.success("User deleted successfully");
      }
    });
  };
  return (
    <>
      <div className="p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-semibold mb-6">
          Users Management
        </h1>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-6 text-center">
              <Loader />
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="hidden sm:table-header-group bg-gradient-to-r from-orange-600 to-red-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">UserName</th>
                  <th className="px-4 py-3 text-left font-medium">Email</th>
                  <th className="px-4 py-3 text-left font-medium">Role</th>
                  <th className="px-4 py-3 text-center font-medium">Action</th>
                </tr>
              </thead>

              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-4 py-6 text-center text-gray-500"
                    >
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      key={user._id}
                      className="border-b last:border-b-0 block sm:table-row hover:bg-indigo-50/60 transition"
                    >
                      {/* USERNAME */}
                      <td
                        data-label="Username"
                        className="px-4 py-3 block sm:table-cell text-right sm:text-left
                        before:content-[attr(data-label)] before:float-left before:font-medium
                        before:text-gray-500 sm:before:hidden"
                      >
                        {user.userName}
                      </td>

                      {/* EMAIL */}
                      <td
                        data-label="Email"
                        className="px-4 py-3 block sm:table-cell text-right sm:text-left break-all
                        before:content-[attr(data-label)] before:float-left before:font-medium
                        before:text-gray-500 sm:before:hidden"
                      >
                        {user.email}
                      </td>

                      {/* ROLE */}
                      <td
                        data-label="Role"
                        className="px-4 py-3 block sm:table-cell text-right sm:text-left
                        before:content-[attr(data-label)] before:float-left before:font-medium
                        before:text-gray-500 sm:before:hidden"
                      >
                        {user.role}
                      </td>

                      {/* ACTION */}
                      <td
                        data-label="Action"
                        className="px-4 py-3 block sm:table-cell text-right sm:text-center
                        before:content-[attr(data-label)] before:float-left before:font-medium
                        before:text-gray-500 sm:before:hidden"
                      >
                        <div className="flex justify-end sm:justify-center gap-2">
                          <button
                            onClick={() => openEditModal(user)}
                            className="p-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-700 hover:text-white"
                          >
                            <RiEdit2Line />
                          </button>

                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="p-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-red-600 hover:text-white"
                          >
                            <RiDeleteBin6Line />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
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

      {/* ================= EDIT ROLE MODAL ================= */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm sm:max-w-md bg-white rounded-2xl shadow-2xl">
            <div className="px-6 py-4 border-b border-gray-300">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                Edit User Role
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Update role permissions carefully
              </p>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500">
                  Username
                </label>
                <input
                  disabled
                  value={selectedUser.userName}
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500">
                  Email
                </label>
                <input
                  disabled
                  value={selectedUser.email}
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500">
                  Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                  focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="USER">User</option>
                  <option value="SELLER">Seller</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-300 flex flex-col sm:flex-row gap-3 sm:justify-end">
              <button
                onClick={closeModal}
                className="w-full sm:w-auto px-4 py-2 rounded-lg border text-sm text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveRole}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600"
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

export default Users;
