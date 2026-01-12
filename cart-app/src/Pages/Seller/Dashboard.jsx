import {
  RiBox3Line,
  RiShoppingBag3Line,
  RiMoneyRupeeCircleLine,
} from "react-icons/ri";

import Loader from "../../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getSellerMyProducts } from "../../features/product/productSlice";

const SellerDashboard = () => {
  const dispatch = useDispatch();

  const { myProducts, isLoading } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getSellerMyProducts());
  }, [dispatch]);

  const stats = [
    {
      label: "My Products",
      value: myProducts?.length || 0,
      icon: RiBox3Line,
    },
    {
      label: "Orders",
      value: 32,
      icon: RiShoppingBag3Line,
    },
    {
      label: "Earnings",
      value: "₹18,200",
      icon: RiMoneyRupeeCircleLine,
      highlight: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {isLoading && <Loader />}
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

export default SellerDashboard;
