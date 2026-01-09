import { RiBox3Line, RiShoppingBag3Line, RiUser3Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import { getAllProductsAdmin } from "../../features/product/productSlice";
import { fetchSellerRequests } from "../../features/sellerRequest/sellerRequestSlice";

const AdminDashboard = () => {
  const dispatch = useDispatch();

  const { products } = useSelector((state) => state.product);
  const { requests } = useSelector((state) => state.sellerRequest);

  useEffect(() => {
    dispatch(getAllProductsAdmin());
    dispatch(fetchSellerRequests());
  }, [dispatch]);

  const approvedSellers =
    requests?.filter((r) => r.status === "APPROVED") || [];

  const stats = [
    {
      label: "Total Products",
      value: products?.length || 0,
      icon: RiBox3Line,
    },
    {
      label: "Total Sellers",
      value: approvedSellers.length,
      icon: RiUser3Line,
    },
    {
      label: "Total Orders",
      value: 3120,
      icon: RiShoppingBag3Line,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map(({ label, value, icon: Icon }) => (
        <div
          key={label}
          className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <Icon className="text-xl text-red-500" />
          </div>

          <h2 className="mt-3 text-3xl font-bold text-gray-800">{value}</h2>
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;
