import { Bar } from "react-chartjs-2";
import "../utils/chartConfig";

const RevenueByMonthChart = ({ orders }) => {
  const revenueMap = {};

  orders.forEach((o) => {
    const month = new Date(o.createdAt).toLocaleString("en-IN", {
      month: "short",
    });
    revenueMap[month] = (revenueMap[month] || 0) + o.totalAmount;
  });

  const data = {
    labels: Object.keys(revenueMap),
    datasets: [
      {
        data: Object.values(revenueMap),
        backgroundColor: "#22c55e",
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">
        Revenue by Month (₹)
      </h3>

      <div className="relative h-[260px]">
        <Bar
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
          }}
        />
      </div>
    </div>
  );
};

export default RevenueByMonthChart;
