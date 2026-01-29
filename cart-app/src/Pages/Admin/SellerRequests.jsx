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
  RiStore2Line,
  RiMailLine,
  RiPhoneLine,
  RiShieldUserLine,
  RiUserAddFill,
  RiSave3Fill,
  RiInformationFill,
  RiArrowDownSLine,
  RiShieldUserFill,
} from "react-icons/ri";
import Swal from "sweetalert2";

const ITEMS_PER_PAGE = 5;

const SellerRequests = () => {
  const dispatch = useDispatch();
  const {
    requests = [],
    loading,
    error,
    status,
  } = useSelector((state) => state.sellerRequest);

  const [currentPage, setCurrentPage] = useState(1);

  // Edit Role Modal State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("SELLER");

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchSellerRequests());
    }
  }, [dispatch, status]);

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
        }),
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
    startIndex + ITEMS_PER_PAGE,
  );

  const getStatusStyle = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-50 text-amber-600 border-amber-200";
      case "APPROVED":
        return "bg-emerald-50 text-emerald-600 border-emerald-200";
      case "REJECTED":
        return "bg-rose-50 text-rose-600 border-rose-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  return (
    <>
      <div className="p-4 sm:p-6">
        {/* ===================== COMMAND BAR HEADER ===================== */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
          {/* Left Side: Module Identity */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-200 shrink-0">
              <RiUserAddFill size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase leading-none">
                Seller <span className="text-red-500">Requests</span>
              </h1>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-2">
                Onboarding & Partner Verification
              </p>
            </div>
          </div>

          {/* Right Side: Status & Alert Logic */}
          <div className="flex items-center gap-3">
            {/* Global Application Stat */}
            <div className="flex flex-col items-end px-4 border-r border-gray-100 hidden sm:block">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                Total Applications
              </p>
              <p className="text-sm font-black text-gray-900">
                {requests?.length || 0} Records
              </p>
            </div>

            {/* Pending Badge */}
            <div className="bg-amber-50 px-5 py-2.5 rounded-2xl border border-amber-100 flex items-center gap-3 transition-all hover:bg-amber-100 group">
              <div className="relative">
                <RiShieldUserLine className="text-amber-500 text-xl group-hover:scale-110 transition-transform" />
                {requests?.filter((r) => r.status === "PENDING").length > 0 && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-amber-50 animate-ping" />
                )}
              </div>
              <div>
                <p className="text-[9px] font-black text-amber-600 uppercase tracking-[0.1em] leading-none">
                  Awaiting Review
                </p>
                <p className="text-lg font-black text-amber-700 mt-0.5 leading-none">
                  {requests?.filter((r) => r.status === "PENDING").length}{" "}
                  <span className="text-[10px] font-bold opacity-60 uppercase">
                    New
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== CONSISTENT ERROR STATE ===================== */}
        {error && (
          <div className="mb-8 flex items-center gap-3 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl animate-in shake duration-500">
            <RiErrorWarningFill className="text-xl shrink-0" />
            <p className="text-xs font-black uppercase tracking-wide">
              {error}
            </p>
          </div>
        )}

        {/* ===================== TABLE CONTAINER (DESKTOP) ===================== */}
        <div className="hidden lg:block bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  {[
                    "Business Detail",
                    "Contact Info",
                    "Industry",
                    "Current Status",
                    "Moderation Actions",
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
                {!loading && currentRequests.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-20 text-center bg-gray-50/30">
                      <p className="text-gray-400 font-black uppercase tracking-widest text-sm italic">
                        No Seller Requests Found
                      </p>
                    </td>
                  </tr>
                )}

                {currentRequests.map((req) => (
                  <tr
                    key={req._id}
                    className="hover:bg-gray-50/50 transition-all duration-200 group"
                  >
                    {/* Shop Details */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-500 shrink-0 border border-red-100 shadow-sm">
                          <RiStore2Line size={24} />
                        </div>
                        <div className="max-w-[200px]">
                          <p className="text-sm font-black text-gray-900 truncate leading-tight uppercase tracking-tight">
                            {req.shopName}
                          </p>
                          <p className="text-[10px] text-gray-400 font-bold mt-1">
                            ID: #{req._id.slice(-8).toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Contact Info */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-gray-700 flex items-center gap-1.5 hover:text-red-500 transition-colors">
                          {req.email}
                        </p>
                        <p className="text-[10px] font-black text-gray-400 flex items-center gap-1.5 uppercase tracking-tighter">
                          Tel: {req.phone}
                        </p>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-black text-red-500 bg-red-50 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                        {req.category?.name ?? "General"}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase border tracking-widest
                      ${
                        req.status === "PENDING"
                          ? "bg-amber-50 text-amber-600 border-amber-200"
                          : req.status === "APPROVED"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                            : "bg-rose-50 text-rose-600 border-rose-200"
                      }`}
                      >
                        {req.status}
                      </span>
                    </td>

                    {/* Row Actions */}
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        {req.status === "PENDING" ? (
                          <>
                            <button
                              onClick={() => handleApprove(req._id)}
                              title="Approve Seller"
                              className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm shadow-emerald-100"
                            >
                              <RiCheckLine size={20} />
                            </button>
                            <button
                              onClick={() => handleReject(req._id)}
                              title="Reject Seller"
                              className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm shadow-rose-100"
                            >
                              <RiCloseLine size={20} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setSelectedUser(req);
                                setSelectedRole(req.user?.role || "USER");
                                setIsEditOpen(true);
                              }}
                              title="Edit Permissions"
                              className="p-2.5 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-900 hover:text-white transition-all"
                            >
                              <RiEdit2Line size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(req._id)}
                              title="Delete Permanently"
                              className="p-2.5 bg-gray-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                            >
                              <RiDeleteBin6Line size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {loading && (
              <div className="p-12 text-center bg-white">
                <Loader />
              </div>
            )}
          </div>
        </div>

        {/* ===================== MOBILE LIST VIEW (REDESIGNED) ===================== */}
        <div className="lg:hidden space-y-4">
          {!loading && currentRequests.length === 0 && (
            <div className="bg-white rounded-[2rem] p-12 text-center border border-dashed border-gray-200">
              <p className="text-gray-400 font-bold tracking-tight italic">
                No applications available.
              </p>
            </div>
          )}

          {currentRequests.map((req) => (
            <div
              key={req._id}
              className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm transition-all active:scale-[0.98] hover:shadow-md"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center border border-red-100 shadow-inner">
                    <RiStore2Line size={24} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-gray-900 uppercase leading-none tracking-tight">
                      {req.shopName}
                    </h3>
                    <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-tighter">
                      {req.category?.name ?? "General Industry"}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase border tracking-widest ${getStatusStyle(req.status)}`}
                >
                  {req.status}
                </span>
              </div>

              <div className="space-y-2 py-4 border-y border-gray-50">
                <p className="text-xs font-bold text-gray-600 truncate flex items-center gap-2">
                  <RiMailLine size={14} className="text-red-500" /> {req.email}
                </p>
                <p className="text-xs font-bold text-gray-600 flex items-center gap-2">
                  <RiPhoneLine size={14} className="text-red-500" /> {req.phone}
                </p>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                {req.status === "PENDING" ? (
                  <>
                    <button
                      onClick={() => handleApprove(req._id)}
                      className="flex-1 py-3 bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-100 active:scale-95 transition-all"
                    >
                      Approve Request
                    </button>
                    <button
                      onClick={() => handleReject(req._id)}
                      className="flex-1 py-3 bg-rose-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-rose-100 active:scale-95 transition-all"
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <div className="flex gap-2 w-full">
                    <button
                      onClick={() => {
                        setSelectedUser(req);
                        setSelectedRole(req.user?.role || "USER");
                        setIsEditOpen(true);
                      }}
                      className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                      <RiEdit2Line /> Modify Privilege
                    </button>
                    <button
                      onClick={() => handleDelete(req._id)}
                      className="w-12 h-12 flex items-center justify-center bg-gray-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-inner"
                    >
                      <RiDeleteBin6Line size={18} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="py-6 text-center">
              <Loader />
            </div>
          )}
        </div>

        {/* ===================== PAGINATION (REDESIGNED) ===================== */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-6 animate-in slide-in-from-bottom-2 duration-500">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 disabled:opacity-30 hover:bg-red-50 hover:text-red-500 transition-all shadow-sm"
            >
              <RiArrowLeftSLine size={24} />
            </button>

            <div className="flex items-center gap-1.5 bg-gray-100/50 p-1.5 rounded-2xl border border-gray-100">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-xl font-black text-[11px] tracking-tighter transition-all duration-300
                  ${
                    currentPage === i + 1
                      ? "bg-red-500 text-white shadow-lg shadow-red-200 scale-105"
                      : "bg-transparent text-gray-500 hover:text-red-500 hover:bg-white"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </button>
              ))}
            </div>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 disabled:opacity-30 hover:bg-red-50 hover:text-red-500 transition-all shadow-sm"
            >
              <RiArrowRightSLine size={24} />
            </button>
          </div>
        )}
      </div>

      {/* EDIT ROLE MODAL */}
      {isEditOpen && selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-md px-4 transition-all duration-300">
          <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl animate-in zoom-in duration-300 border border-white/20 overflow-hidden">
            {/* HEADER: High-Security Contrast */}
            <div className="bg-gray-900 p-8 text-white relative overflow-hidden shrink-0">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-1/2 -translate-y-1/2 border border-white/10" />
              <div className="relative z-10 flex items-center gap-4">
                <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/20">
                  <RiShieldUserFill size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight leading-none">
                    Privilege <span className="text-red-500">Control</span>
                  </h2>
                  <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2 opacity-80">
                    Identity & Access Management
                  </p>
                </div>
              </div>
            </div>

            {/* BODY: Structured Premium Inputs */}
            <div className="p-8 space-y-6">
              {/* Read-Only Identity Card */}
              <div className="p-5 bg-gray-50 rounded-3xl border border-gray-100 space-y-4 shadow-inner">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center font-black text-gray-400 text-xs">
                    {(
                      selectedUser?.user?.userName ||
                      selectedUser?.shopName ||
                      "U"
                    )
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">
                      Account Identity
                    </p>
                    <p className="text-sm font-black text-gray-900 truncate mt-1 uppercase tracking-tight">
                      {selectedUser?.user?.userName || selectedUser?.shopName}
                    </p>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-200/60">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">
                    Verified Channel
                  </p>
                  <p className="text-xs font-bold text-gray-600 truncate mt-1 italic group-hover:text-red-500 transition-colors">
                    {selectedUser?.user?.email || selectedUser?.email}
                  </p>
                </div>
              </div>

              {/* Role Selection Logic */}
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">
                    Assign Role
                  </label>
                  <div className="relative group">
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50 font-black text-sm text-gray-800 outline-none focus:bg-white focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all appearance-none cursor-pointer"
                    >
                      <option value="USER">User</option>
                      <option value="SELLER">Seller</option>
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-focus-within:text-red-500 transition-colors">
                      <RiArrowDownSLine size={20} />
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex items-start gap-3">
                  <RiInformationFill className="text-amber-500 mt-0.5 shrink-0" />
                  <p className="text-[10px] font-bold text-amber-700 leading-relaxed uppercase tracking-tight">
                    Changes to role take effect immediately. Ensure the user has
                    been verified before assigning a role.
                  </p>
                </div>
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
                  onClick={handleUpdateRole}
                  className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-red-200 hover:bg-red-600 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <RiSave3Fill size={18} />
                  Commit Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SellerRequests;
