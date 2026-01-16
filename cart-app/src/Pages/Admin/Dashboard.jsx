import { RiBox3Line, RiShoppingBag3Line, RiUser3Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useMemo } from "react";

import { getAllProductsAdmin } from "../../features/product/productSlice";
import { fetchSellerRequests } from "../../features/sellerRequest/sellerRequestSlice";
import { getAllOrders } from "../../features/order/orderSlice";

import DateRangeSwitch from "../../components/DateRangeSwitch";
import RevenueChart from "../../components/RevenueChart";
import OrdersStatusChart from "../../components/OrdersStatusChart";
import MonthlyOrdersChart from "../../components/MonthlyOrdersChart";
import SellerRequestStatusChart from "../../components/SellerRequestStatusChart";
import ProductsOrdersChart from "../../components/ProductsOrdersChart";
import OrdersTrendChart from "../../components/OrdersTrendChart";
import RevenueByMonthChart from "../../components/RevenueByMonthChart";
import OrderStatusBreakdown from "../../components/OrderStatusBreakdown";
import TopProductsChart from "../../components/TopProductsChart";
import TopSellersChart from "../../components/TopSellersChart";

const AdminDashboard = () => {
  const dispatch = useDispatch();

  const { products } = useSelector((state) => state.product);
  const { requests } = useSelector((state) => state.sellerRequest);
  const { orders } = useSelector((state) => state.order);

  const [range, setRange] = useState(30);

  useEffect(() => {
    dispatch(getAllProductsAdmin());
    dispatch(fetchSellerRequests());
    dispatch(getAllOrders());
  }, [dispatch]);

  const approvedSellers =
    requests?.filter((r) => r.status === "APPROVED") || [];

  const filteredOrders = useMemo(() => {
    if (!orders || orders.length === 0) return [];

    const now = new Date();

    return orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      const diffDays =
        (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24);

      return diffDays <= range;
    });
  }, [orders, range]);

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
      value: filteredOrders.length,
      icon: RiShoppingBag3Line,
    },
  ];

  return (
    <>
      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">{label}</p>
              <Icon className="text-xl text-red-500" />
            </div>

            <h2 className="mt-3 text-3xl font-bold text-gray-800">{value}</h2>
          </div>
        ))}
      </div>

      {/* RANGE SWITCH */}
      <div className="mt-10 mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Analytics Overview
          </h2>
          <p className="text-sm text-gray-500">
            Overview of key metrics and statistics
          </p>
        </div>

        <DateRangeSwitch value={range} onChange={setRange} />
      </div>

      {/* ANALYTICS */}
      {filteredOrders.length > 0 && (
        <>
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RevenueChart orders={filteredOrders} />
            </div>
            <OrdersTrendChart orders={filteredOrders} />
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <OrdersStatusChart orders={filteredOrders} />
            <OrderStatusBreakdown orders={filteredOrders} />
            <MonthlyOrdersChart orders={filteredOrders} />
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <RevenueByMonthChart orders={filteredOrders} />
            <ProductsOrdersChart
              productsCount={products?.length || 0}
              ordersCount={filteredOrders.length}
            />
            <SellerRequestStatusChart requests={requests} />
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TopProductsChart products={products} orders={filteredOrders} />
            <TopSellersChart
              sellers={approvedSellers}
              orders={filteredOrders}
            />
          </div>
        </>
      )}
    </>
  );
};

export default AdminDashboard;
