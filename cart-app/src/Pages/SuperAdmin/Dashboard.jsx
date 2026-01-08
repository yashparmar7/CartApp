import {
  RiUser3Line,
  RiStore2Line,
  RiShoppingBag3Line,
  RiMoneyRupeeCircleLine,
} from "react-icons/ri";

const SuperAdminDashboard = () => {
  const stats = [
    {
      label: "Total Users",
      value: 1240,
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
