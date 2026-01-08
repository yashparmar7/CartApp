import { RiBox3Line, RiShoppingBag3Line, RiTimeLine } from "react-icons/ri";

const AdminDashboard = () => {
  const stats = [
    {
      label: "Products",
      value: 48,
      icon: RiBox3Line,
    },
    {
      label: "Orders",
      value: 120,
      icon: RiShoppingBag3Line,
    },
    {
      label: "Pending Orders",
      value: 9,
      icon: RiTimeLine,
      highlight: true,
    },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
              highlight ? "text-red-600" : "text-gray-800"
            }`}
          >
            {value}
          </h2>
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;
