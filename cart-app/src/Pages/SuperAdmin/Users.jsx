import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RiDeleteBin6Line, RiEdit2Line, RiErrorWarningFill, RiGroupFill, RiShieldUserFill } from "react-icons/ri";
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
        {/* ===================== COMMAND BAR HEADER (USER MANAGEMENT) ===================== */}
<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
  {/* Left Side: Module Identity */}
  <div className="flex items-center gap-4">
    <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-200 shrink-0">
      <RiGroupFill size={24} />
    </div>
    <div>
      <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase leading-none">
        User <span className="text-red-500">Directory</span>
      </h1>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-2">
        Access Control & Identity Management
      </p>
    </div>
  </div>

  {/* Right Side: Platform Population Metrics */}
  <div className="flex items-center gap-3">
    {/* Secondary Stat: Role Breakdown Context */}
    <div className="hidden sm:flex flex-col items-end px-4 border-r border-gray-100">
       <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Platform Growth</p>
       <p className="text-sm font-black text-gray-900">
         {users?.length || 0} <span className="text-[10px] opacity-60 uppercase">Profiles</span>
       </p>
    </div>

    {/* Primary Metric Badge */}
    <div className="bg-red-50 px-5 py-2.5 rounded-2xl border border-red-100 flex items-center gap-3 transition-all hover:bg-red-100 group">
      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-red-500 shadow-sm group-hover:scale-110 transition-transform">
        <RiShieldUserFill size={18} />
      </div>
      <div>
        <p className="text-[9px] font-black text-red-600 uppercase tracking-[0.1em] leading-none">Global Access</p>
        <p className="text-lg font-black text-red-700 mt-0.5 leading-none uppercase">
          Verified <span className="text-[10px] font-bold opacity-60">Status</span>
        </p>
      </div>
    </div>
  </div>
</div>

{/* ===================== CONSISTENT ERROR STATE ===================== */}
{error && (
  <div className="mb-8 flex items-center gap-3 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl animate-in shake duration-500">
    <RiErrorWarningFill className="text-xl shrink-0" />
    <p className="text-xs font-black uppercase tracking-wide">{error}</p>
  </div>
)}

       {/* ===================== TABLE CONTAINER (DESKTOP) ===================== */}
      <div className="hidden lg:block bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          {loading ? (
            <div className="p-20 text-center">
              <Loader />
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  {[
                    "User Identity",
                    "Electronic Mail",
                    "Access Privilege",
                    "Account Actions"
                  ].map((header) => (
                    <th key={header} className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50 font-medium text-sm">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-20 text-center bg-gray-50/30">
                      <p className="text-gray-400 font-black uppercase tracking-widest text-sm italic">
                        No User Records Found
                      </p>
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50/50 transition-all duration-200 group">
                      {/* Username */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500 border border-red-100 font-black text-xs">
                            {user.userName.charAt(0).toUpperCase()}
                          </div>
                          <p className="text-sm font-black text-gray-900 uppercase tracking-tight group-hover:text-red-500 transition-colors">
                            {user.userName}
                          </p>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-6 py-4">
                        <p className="text-xs font-bold text-gray-500 italic">{user.email}</p>
                      </td>

                      {/* Role */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase border tracking-widest
                          ${user.role === "ADMIN" || user.role === "SUPERADMIN" 
                            ? "bg-gray-900 text-white border-gray-900" 
                            : user.role === "SELLER" 
                            ? "bg-red-50 text-red-600 border-red-200" 
                            : "bg-blue-50 text-blue-600 border-blue-200"}`}>
                          {user.role}
                        </span>
                      </td>

                      {/* Row Actions */}
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => openEditModal(user)} 
                            title="Edit Permissions"
                            className="p-2.5 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-600 hover:text-white transition-all shadow-sm"
                          >
                            <RiEdit2Line size={18} />
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(user._id)} 
                            title="Delete User"
                            className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                          >
                            <RiDeleteBin6Line size={18} />
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
      </div>

      {/* ===================== MOBILE LIST VIEW (REDESIGNED) ===================== */}
      <div className="lg:hidden space-y-4">
        {loading ? (
          <div className="py-10 text-center"><Loader /></div>
        ) : users.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-12 text-center border border-dashed border-gray-200">
            <p className="text-gray-400 font-bold tracking-tight">Zero members found.</p>
          </div>
        ) : (
          users.map((user) => (
            <div
              key={user._id}
              className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm transition-all active:scale-[0.98]"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center border border-red-100 font-black">
                    {user.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">{user.userName}</h3>
                    <p className="text-[10px] text-gray-400 font-bold mt-0.5 italic">{user.email}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border
                  ${user.role === "SELLER" ? "bg-red-50 text-red-600 border-red-100" : "bg-blue-50 text-blue-600 border-blue-100"}`}>
                  {user.role}
                </span>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-50 flex gap-2">
                <button 
                  onClick={() => openEditModal(user)} 
                  className="flex-1 py-3 bg-gray-50 text-gray-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <RiEdit2Line /> Modify Role
                </button>
                <button 
                  onClick={() => handleDeleteUser(user._id)} 
                  className="w-12 h-12 bg-gray-50 text-rose-600 rounded-2xl flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all shadow-inner"
                >
                  <RiDeleteBin6Line size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ===================== PAGINATION (REDESIGNED) ===================== */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-8 animate-in slide-in-from-bottom-2 duration-500">
          <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded-xl font-black text-[11px] transition-all duration-300
                  ${currentPage === i + 1 
                    ? "bg-red-500 text-white shadow-lg shadow-red-100 scale-105" 
                    : "bg-transparent text-gray-400 hover:text-red-500 hover:bg-red-50"}`}
              >
                {String(i + 1).padStart(2, '0')}
              </button>
            ))}
          </div>
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
