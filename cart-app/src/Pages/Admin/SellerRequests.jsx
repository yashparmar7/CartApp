import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getSellerRequests,
  updateSellerRequest,
} from "../../features/sellerRequest/sellerRequestSlice";
import toast from "react-hot-toast";

const SellerRequests = () => {
  const dispatch = useDispatch();
  const { requests, loading } = useSelector((state) => state.sellerRequest);

  useEffect(() => {
    dispatch(getSellerRequests());
  }, [dispatch]);

  const handleApprove = async (id) => {
    try {
      await dispatch(updateSellerRequest(id)).unwrap();
      toast.success("Seller approved successfully ✅");
    } catch {
      toast.error("Approval failed");
    }
  };

  //   const handleReject = async (id) => {
  //     try {
  //       await dispatch(rejectSellerRequest(id)).unwrap();
  //       toast.success("Seller request rejected ❌");
  //     } catch {
  //       toast.error("Rejection failed");
  //     }
  //   };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Seller Requests</h1>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">Shop</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">PAN</th>
              <th className="px-4 py-3 text-left">Aadhaar</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {!loading && requests?.length === 0 && (
              <tr>
                <td colSpan="8" className="px-4 py-6 text-center text-gray-500">
                  No seller requests found
                </td>
              </tr>
            )}

            {requests?.map((req) => (
              <tr key={req._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">{req.shopName}</td>
                <td className="px-4 py-3">{req.email}</td>
                <td className="px-4 py-3">{req.phone}</td>
                <td className="px-4 py-3">{req.category}</td>
                <td className="px-4 py-3">{req.panNumber}</td>
                <td className="px-4 py-3">{req.aadhaarNumber}</td>

                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold
                    ${
                      req.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-700"
                        : req.status === "APPROVED"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {req.status}
                  </span>
                </td>

                <td className="px-4 py-3 text-center">
                  {req.status === "PENDING" ? (
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleApprove(req._id)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Approve
                      </button>
                      {/* <button
                        onClick={() => handleReject(req._id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Reject
                      </button> */}
                    </div>
                  ) : (
                    <span className="text-gray-400">No action</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {loading && (
          <div className="p-6 text-center text-gray-500">
            Loading seller requests...
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerRequests;
