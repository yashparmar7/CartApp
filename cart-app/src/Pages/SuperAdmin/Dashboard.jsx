import {
  RiUser3Line,
  RiStore2Line,
  RiShoppingBag3Line,
  RiMoneyRupeeCircleLine,
} from "react-icons/ri";

import Loader from "../../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllUsers } from "../../features/role/roleSlice";

const SuperAdminDashboard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const { users, loading, error } = useSelector((state) => state.role);

  const stats = [
    {
      label: "Total Users",
      value: users?.length || 0,
      icon: RiUser3Line,
    },
    {
      label: "Total Sellers",
      value: 56,
      icon: RiStore2Line,
    },
    {
      label: "Total Orders",
      value: 3120,
      icon: RiShoppingBag3Line,
    },
    {
      label: "Total Revenue",
      value: "₹8.4L",
      icon: RiMoneyRupeeCircleLine,
      highlight: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {loading ? <Loader /> : null}
      {error ? <h2 className="text-red-500">{error}</h2> : null}
      {stats.map(({ label, value, icon: Icon, highlight }) => (
        <div
          key={label}
          className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm
                     hover:shadow-md transition"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <Icon className="text-xl text-red-500" />
          </div>

          <h2
            className={`mt-3 text-3xl font-bold ${
              highlight ? "text-green-600" : "text-gray-800"
            }`}
          >
            {value}
          </h2>
        </div>
      ))}
    </div>
  );
};

export default SuperAdminDashboard;
